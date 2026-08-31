---
title: "Engineering Judgement at Scale: Building a Multi-Tenant Integration Platform for Enterprise APIs"
date: "2026-08-31T18:00:00.000Z"
description: "How we turned repeated partner integrations into a shared multi-tenant platform, prevented token refresh storms, and created a safer operating model for enterprise API consumption."
category: ["tech", "engineering-leadership"]
tags: ["APIs", "Engineering Leadership", "Platform Engineering", "Tokens"]
---

Large enterprises depend on third-party APIs. Every integration needs authentication, credential management, monitoring, and operational support.

The obvious approach is to let each team integrate with the partner directly. That often looks faster at the start. Over time, it creates a familiar set of problems:

- Several teams solve the same problem.
- Security controls differ between implementations.
- Each integration has its own failure modes.
- Support and onboarding costs rise with every new consumer.
- A partner change creates several migrations instead of one.

At that point, the question is no longer, “How should this team connect to the partner?”

The better question is, “What operating model should the organisation use for partner access?”

That change in framing led us to build a shared, multi-tenant integration platform.

## From point solution to platform capability

Instead of asking each team to build and operate its own integration, we created one service that could support many consumers.

The design had a small set of principles:

- One integration layer
- Many consuming teams
- Strong tenant isolation
- Separate credentials for each tenant
- Shared monitoring and operational tooling
- Consistent API contracts

A new team could now onboard to an existing capability. It did not need to create another integration stack.

The platform currently serves four teams across three business domains. We also designed the tenancy model so it could support external partner organisations in the future.

That future requirement mattered. If all tenants were internal teams, tenant identity could be treated as a reporting label. Once an external organisation can become a tenant, identity becomes part of the security boundary.

Credentials, tokens, logs, failures, and usage data must remain isolated. A problem affecting one tenant must not affect another.

Designing that boundary at the start added little cost. Adding it after the platform had grown would have required a major rewrite.

## The hidden risk in token management

The most difficult part of “one integration, many tenants” was authentication.

Partner APIs usually issue access tokens with a fixed lifetime. The service caches a token and requests a new one when the old token expires.

That sounds like a simple caching problem. Under load, it becomes a concurrency problem.

Imagine that a token expires while hundreds of requests are being processed. Without coordination, every request can notice the expiry at the same time. Each request then attempts to refresh the token.

The result is a token refresh storm:

- Many refresh calls hit the authentication endpoint at once.
- Partner rate limits may be triggered.
- Latency rises across the integration.
- Valid user requests fail with authentication errors.
- Teams investigate credentials even though concurrency caused the failure.

This issue is hard to see in low-volume testing. It appears at the expiry boundary, under real traffic, and then returns each time the token expires.

Multi-tenancy increases the risk. Each tenant has its own credentials and token lifetime. The platform is not managing one expiry cycle. It is managing several independent cycles.

## The options we considered

We considered five approaches before choosing a design.

### Refresh on every request

This is easy to implement, but it doubles partner traffic and adds authentication latency to every call. It also puts the most pressure on the endpoint most likely to have strict rate limits.

The cost grows directly with traffic. Success makes the design more expensive.

### Cache until the token expires

This performs well during normal operation. However, concurrent requests can all observe the same expired token and start separate refreshes.

It works most of the time, but fails at the exact moment coordination matters.

### Refresh on a schedule

A background task can refresh tokens before they expire. This removes refresh latency from the request path.

It also refreshes tokens for idle tenants. In a scaled service, every running instance may refresh every tenant whether there is demand or not. Timers also add lifecycle concerns such as drift, shutdown handling, and cold starts.

### Use a distributed cache

A shared cache such as Redis can hold one token per tenant for the entire service fleet.

This is a reasonable enterprise pattern, but it has a cost. It adds a network call to the authentication path and creates another availability dependency. If the cache is unavailable, authentication may also become unavailable.

It also places bearer tokens from several tenants in shared storage. Concurrent service instances can still race during refresh, so a distributed lock is usually required as well.

A distributed design is justified when token lifetimes are very short, token issuance is metered, or a new token invalidates the old one. None of those conditions applied here.

The cost of coordination was greater than the value of the work being coordinated.

### Refresh after an authentication failure

The service could wait for a `401`, refresh the token, and retry the request.

This makes failure part of normal operation. At least one request fails at every rollover, and concurrent retries can create another storm.

We did not want to spend error budget on an event we could predict.

## The chosen design: single-flight refresh with expiry skew

We combined an in-memory token cache with two controls:

1. **Single-flight refresh:** only one refresh operation can run for a tenant at a time.
2. **Expiry skew:** the service treats a token as expired shortly before its actual expiry time.

When several requests find a token near expiry, the first request starts the refresh. It publishes the in-progress operation so later requests can wait for the same result.

Exactly one refresh call is sent to the partner. Every waiting request receives the new token when that call completes.

The in-progress reference is cleared whether the refresh succeeds or fails. A temporary partner error therefore does not leave the tenant stuck in a failed state. The next request can try again.

This approach protects the refresh path without adding a lock to the normal path. A valid cached token requires only a map lookup and a timestamp comparison. There is no network call and no new infrastructure dependency.

## Why the expiry clock is deliberately early

A token can be valid when the service checks it and expire before it reaches the partner.

Between those two moments, the request may pass through serialisation, network transit, proxies, queues, and retries.

We therefore apply a two-minute safety window to a thirty-minute token. A token inside that window is treated as expired even though the partner may still accept it for a short time.

This uses about 93% of the token lifetime while removing the risk of sending a token that is about to expire.

The two controls solve different parts of the problem:

- Expiry skew refreshes the token before it becomes urgent.
- Single-flight coordination prevents concurrent requests from creating a storm.

Skew without coordination would still allow many refresh calls. Coordination without skew could still send tokens that expire in transit.

## Tenant isolation is an availability feature

The token cache is keyed by tenant. Each tenant has its own credentials, cached token, expiry time, and refresh operation.

This gives us several important properties.

**Independent credentials.** Each team authenticates with its own credential set. Usage and cost can be attributed to the team that created them.

**Contained failure.** Expired or incorrect credentials for one tenant affect only that tenant. They cannot invalidate or block another tenant's token.

**Clear observability.** Tenant identity is validated at the edge and added to the request logger. Every downstream event can be traced without each handler rebuilding that context.

**A path to external tenancy.** An external organisation can only use the platform safely if its configuration and failures cannot affect other consumers.

The tenant key is validated before credential resolution or token access. It is never inferred from an untrusted request payload.

## Making credential fallback visible

Not every team could complete partner credential setup on the same timeline. The platform therefore supported a temporary fallback to shared credentials.

The fallback allowed delivery to continue without waiting for the slowest external dependency. However, an invisible fallback would quickly become permanent debt.

Every fallback request emits a structured audit event. The event records the tenant, request ID, environment, operation, outcome, status, and an explicit fallback marker. It never records the secret or token.

This turns migration progress into measurable data. We can answer which tenants still use shared credentials and how much traffic they generate.

It also detects configuration drift. If fallback use rises for a tenant that had already migrated, we know its dedicated credentials may have disappeared during a deployment.

## Retiring the legacy integration safely

The platform also replaced an older SOAP integration that used hardcoded shared credentials and provided no tenant attribution.

We retired it through a gradual and reversible process.

First, legacy responses included standard deprecation information: a deprecation flag, a sunset date, and a link to the migration guide. Consumers could detect the change through the protocol instead of relying on an email.

Later, a configuration switch could return a clear “gone” response with the migration guide attached.

Both stages were environment-specific and reversible without a deployment. If a consumer experienced an unexpected problem, the change could be undone in seconds.

That reversibility made the migration safer. A risky change should be recoverable faster than it can be escalated.

## What the platform delivered

The value went beyond token management.

**Lower partner load.** Authentication calls now scale with active tenants rather than request volume.

**Improved reliability.** Token rollover is no longer a user-visible event. A class of concurrency failure was removed by design.

**Better performance.** The normal cache-hit path adds no network latency.

**Smaller failure scope.** Authentication problems remain isolated to the affected tenant and can recover on the next request.

**Lower operational cost.** We avoided another infrastructure service, runbook, and on-call dependency.

**Governed access.** Usage, entitlement, and cost can be attributed per tenant.

**Faster onboarding.** New consumers join through configuration and agreed contracts instead of building another integration project.

The fourth team did not need a fourth authentication implementation, monitoring stack, or independent discovery of the token-storm problem. It onboarded to an existing platform capability.

## The trade-offs we accepted

The design is intentionally process-local. Each service instance can hold one token per active tenant.

We accepted that because token lifetimes are moderate, token issuance is not metered, and the partner allows more than one active token.

We would revisit the decision if:

- The partner began charging for token issuance.
- A newly issued token invalidated the prior token.
- Token lifetime dropped to roughly a minute.
- Instance churn increased enough to create material authentication traffic.
- Refresh state needed to survive a process restart.

Under those conditions, a shared cache and distributed lock could justify their added latency and operational cost.

Naming the conditions that would change a decision prevents architecture from becoming folklore. It gives future teams evidence for when to keep the design and when to replace it.

## Engineering judgement at scale

The token cache looked like a caching problem. The failure mode showed that it was a concurrency problem.

Once the problem was named correctly, the solution became small: one in-flight refresh per tenant, an early expiry window, and clean recovery after failure.

The wider platform followed the same principle. We did not solve four team-level integration problems. We created one operating model with shared governance, strong isolation, and lower marginal cost for each new consumer.

That is the difference between shipping an integration and building organisational leverage.

Good engineering judgement is not measured by how much infrastructure a design introduces. It is measured by whether the design solves the real problem, contains risk, and remains easy to change when its assumptions no longer hold.

For the implementation invariants, annotated JavaScript, concurrency tests, expiry-boundary tests, and guidance for other runtimes, read [Single-Flight Token Refresh: A Technical Deep Dive](/tech/in-flight-token-refresh-deep-dive/).
