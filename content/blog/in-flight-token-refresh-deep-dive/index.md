---
title: "Single-Flight Token Refresh: A Technical Deep Dive"
date: "2026-08-31T18:05:00.000Z"
description: "How to implement, test, and operate a tenant-aware single-flight token cache with early expiry, clean failure recovery, and no lock on the hot path."
category: ["tech", "software-engineering"]
tags: ["APIs", "Concurrency", "JavaScript", "Platform Engineering", "Tokens"]
---

This is the implementation companion to [Engineering Judgement at Scale: Building a Multi-Tenant Integration Platform for Enterprise APIs](/tech/shared-api-platform-token-storms/). That article covers the platform decision and operating model. This article focuses on the code, invariants, tests, and trade-offs behind the token refresh design.

## The contract

The component answers one question under concurrency:

> Give me a token that will still be valid when it reaches the upstream service for tenant T.

Four invariants define correct behaviour:

1. A returned token must be valid when it reaches the upstream, not merely when the cache reads it.
2. At most one refresh may be in flight for a tenant.
3. A cache hit must perform no I/O and acquire no lock.
4. A failed refresh must leave clean state so the next caller can try again.

These invariants are more useful than comments about individual lines. They state what must remain true after the implementation changes.

## State is isolated by tenant

Each tenant owns one entry:

```js
{
  accessToken: null,
  expiresAt: null,
  refreshInFlight: null,
  credentialSource: null,
}
```

The entries live in a map keyed by a validated tenant ID:

```js
const tokenStore = new Map()

const getEntry = tenantId => {
  let entry = tokenStore.get(tenantId)

  if (!entry) {
    entry = {
      accessToken: null,
      expiresAt: null,
      refreshInFlight: null,
      credentialSource: null,
    }
    tokenStore.set(tenantId, entry)
  }

  return entry
}
```

`expiresAt` is an absolute timestamp. Compute it once from the lifetime returned by the authorisation server:

```js
entry.expiresAt = Date.now() + expiresIn * 1000
```

Do not hardcode the token lifetime. Providers can change it. A hardcoded thirty-minute lifetime paired with a fifteen-minute token creates a silent outage window.

`refreshInFlight` stores a promise rather than a boolean. A boolean only tells callers that work exists. A promise gives them the exact work to await.

## Expire the token early

A token can pass a local check and expire during serialisation, network transit, upstream queueing, or a retry. Test whether it will remain alive after a safety window:

```js
const DEFAULT_EXPIRY_SKEW_MS = 2 * 60 * 1000

const isTokenValid = (tenantId, expirySkewMs = DEFAULT_EXPIRY_SKEW_MS) => {
  const entry = tokenStore.get(tenantId)

  if (!entry?.accessToken || !entry.expiresAt) return false

  return Date.now() + expirySkewMs < entry.expiresAt
}
```

The skew should exceed the p99 upstream latency plus the retry budget. A two-minute skew on a thirty-minute token gives up about 6.7% of its life to remove the rollover race.

Make the skew a parameter. A long operation can request more headroom, and tests can move the boundary without mutating module state.

## The single-flight critical section

The refresh path is small:

```js
const getValidTokenDetails = async (
  tenantId,
  expirySkewMs = DEFAULT_EXPIRY_SKEW_MS
) => {
  if (isTokenValid(tenantId, expirySkewMs)) {
    const entry = tokenStore.get(tenantId)

    return {
      token: entry.accessToken,
      credentialSource: entry.credentialSource,
      tokenCacheHit: true,
    }
  }

  const entry = getEntry(tenantId)

  if (!entry.refreshInFlight) {
    entry.refreshInFlight = (async () => {
      try {
        await fetchAuthToken(tenantId)
        return entry.accessToken
      } finally {
        entry.refreshInFlight = null
      }
    })()
  }

  const token = await entry.refreshInFlight

  return {
    token,
    credentialSource: entry.credentialSource,
    tokenCacheHit: false,
  }
}
```

The fast path is a map lookup and timestamp comparison. It has no network call, promise allocation, or mutex.

The critical section is the check followed by the assignment:

```js
if (!entry.refreshInFlight) {
  entry.refreshInFlight = createRefreshPromise()
}
```

In a single-threaded event loop, nothing else runs between those statements because there is no `await`. The check and publication act as one uninterrupted operation.

Do not insert awaited work between them:

```js
if (!entry.refreshInFlight) {
  await recordMetric("token.refresh.start") // Breaks the guarantee
  entry.refreshInFlight = createRefreshPromise()
}
```

That one change lets concurrent callers pass the check before any caller publishes its promise. The token storm returns.

The promise is the coordination handle. The first caller creates it. Later callers await the same promise. Only callers on the refresh path touch it.

## Always release in `finally`

This line is essential:

```js
finally {
  entry.refreshInFlight = null
}
```

Without it, a failed refresh leaves a rejected promise in the entry. Every later caller awaits the same old rejection. One brief network error then lasts until the process restarts.

`finally` clears the handle on success and failure. The next request after a failure gets a clean attempt.

Do not add negative caching by default. A fixed failure window can lock out a tenant after a short partner blip. If failures cause harmful retry amplification, add explicit bounded backoff with metrics.

## Fetch without leaking secrets

The fetch function resolves credentials for one tenant and stores the token only after a successful response:

```js
const fetchAuthToken = async tenantId => {
  const credentialDetails = resolveCredentialDetails(tenantId)

  if (!credentialDetails?.credentials) {
    log.warn({ tenantId }, "No credentials resolved")
    return null
  }

  try {
    const response = await requestToken(credentialDetails.credentials)

    if (response.status !== 200) {
      log.warn({ tenantId, status: response.status }, "Token fetch failed")
      return null
    }

    const entry = getEntry(tenantId)
    entry.accessToken = response.data.access_token
    entry.expiresAt = Date.now() + response.data.expires_in * 1000
    entry.credentialSource = credentialDetails.credentialSource

    return entry.accessToken
  } catch (error) {
    log.error({ tenantId, error }, "Token fetch failed")
    return null
  }
}
```

Authentication failure is an expected operating condition. Returning `null` lets the caller produce a deliberate `401` instead of leaking an opaque `500`.

Never log credentials or tokens. Log the tenant, credential source label, cache-hit state, response status, and outcome.

## Bound the key space

An in-memory map grows for every new key. Tenant identity must be validated against an allowlist before it reaches the cache.

If the key comes from an unchecked header, user ID, or customer value, an attacker can fill memory by sending unique values. Validate against a known tenant set or use a bounded least-recently-used cache.

Per-tenant state also contains failure. Bad credentials for tenant A must not stall or invalidate the token for tenant B.

## Warm-up must not control readiness

Fetching a token when an instance starts can remove latency from its first request. It must remain optional:

```js
instance.addHook("onReady", async () => {
  try {
    await instance.tokenCache.fetchAuthToken()
  } catch (error) {
    instance.log.error(
      { error },
      "Token warm-up failed; first request will retry"
    )
  }
})
```

Never make service readiness depend on a third party. If partner authentication is down during deployment, instances should still start and serve work that does not need that partner.

## Test the concurrency guarantee

Use a delayed mock to keep the race window open:

```js
it("uses one refresh for concurrent callers", async () => {
  httpClient.mockImplementation(
    () =>
      new Promise(resolve => {
        setTimeout(() => resolve(okResponse), 100)
      })
  )

  const tokens = await Promise.all([
    tokenCache.getValidToken(TENANT),
    tokenCache.getValidToken(TENANT),
    tokenCache.getValidToken(TENANT),
  ])

  expect(tokens).toEqual([TOKEN, TOKEN, TOKEN])
  expect(httpClient).toHaveBeenCalledTimes(1)
})
```

The call-count assertion proves the invariant. Equal return values alone do not. Three separate refreshes can return the same mocked token.

An immediate mock may also hide a broken race through lucky scheduling. The delay makes the test meaningful.

## Test both sides of the expiry boundary

Pin the clock with fake timers:

```js
jest.useFakeTimers()
jest.setSystemTime(now)

await tokenCache.fetchAuthToken(TENANT) // 30-minute token

jest.setSystemTime(now + 10 * 60_000)
expect(tokenCache.isTokenValid(TENANT)).toBe(true)

jest.setSystemTime(now + 29 * 60_000)
expect(tokenCache.isTokenValid(TENANT)).toBe(false)
```

The last assertion is the purpose of the skew. The token is technically alive at minute twenty-nine, but it does not have enough life left for safe use.

Also test recovery after failure:

```js
httpClient.mockRejectedValueOnce(new Error("network"))
expect(await tokenCache.getValidToken(TENANT)).toBeNull()

httpClient.mockResolvedValueOnce(okResponse)
expect(await tokenCache.getValidToken(TENANT)).toBe(TOKEN)
```

Removing the `finally` cleanup should make this test fail.

## When process-local state is the wrong choice

This design keeps one token per active tenant per service instance. Use fleet-wide coordination instead when:

- The provider charges for each token.
- Issuing a token invalidates the prior token.
- Token life is so short that refresh is almost constant.
- A strict cap limits active tokens.
- Refresh state must survive process restarts.

In those cases, a shared cache and distributed lock may earn their cost. They also add a network hop, another outage source, secret storage risk, and an operational runbook.

The coordination cost should not exceed the value of the work being coordinated.

## Ship checklist

- No `await` exists between the in-flight check and assignment.
- The in-flight handle is released in `finally`.
- Expiry is absolute and derived from the provider response.
- The skew exceeds p99 latency plus the retry budget.
- Tenant keys are validated or the cache is bounded.
- Tokens and credentials never reach logs.
- Warm-up failure never blocks readiness.
- State and failures are isolated per tenant.
- A delayed concurrency test asserts one upstream call.
- Clock tests cover both sides of the skew boundary.
- A failed refresh can recover without a restart.

The implementation is small because it solves the correct problem. Token refresh looks like caching, but the dangerous edge is concurrency at expiry. Name that edge correctly, and the design becomes one shared promise, an early-expiry check, and careful cleanup.
