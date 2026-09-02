const assert = require(`assert`)
const fs = require(`fs`)
const path = require(`path`)
const { legacyPathsBySlug } = require(`../src/utils/legacy-redirects`)
const { topicHubs } = require(`../src/data/topic-hubs`)
const { createPostPath } = require(`../src/utils/urls`)

const publicDirectory = path.resolve(__dirname, `../public`)
const articlePath = createPostPath(
  `machine-Learning`,
  `/tweepy-fetch-historical-tweet-stream/`
)
const articleUrl = `https://walecloud.me${articlePath}`
const historicalArticleGuid = `https://walecloud.me/tweepy-fetch-historical-tweet-stream/`
const linkedinUrl = `https://www.linkedin.com/in/wale-ayandiran-31717891`
const beehiivFormId = `a50b3125-1371-463d-891a-46523552421c`
const beehiivFormUrl = `https://subscribe-forms.beehiiv.com/v3/forms/${beehiivFormId}?layout=slim`
const articleOutput = path.join(publicDirectory, articlePath, `index.html`)

const readOutput = relativePath =>
  fs.readFileSync(path.join(publicDirectory, relativePath), `utf8`)
const extractSchemas = html =>
  [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ].map(match => JSON.parse(match[1]))
const hasSchemaType = (html, type) =>
  extractSchemas(html).some(schema => schema[`@type`] === type)

const homepage = readOutput(`index.html`)
assert(
  homepage.includes(`/machine-learning/tweepy-fetch-historical-tweet-stream`),
  `Homepage must link to the normalized article URL`
)
assert(
  !homepage.includes(`/machine-Learning/tweepy-fetch-historical-tweet-stream`),
  `Homepage must not contain the old mixed-case article URL`
)
assert(hasSchemaType(homepage, `WebSite`), `Homepage must describe the website`)
assert(hasSchemaType(homepage, `Person`), `Homepage must identify the author`)
assert(
  homepage.includes(`data-newsletter-form="${beehiivFormId}"`),
  `Homepage must feature the Beehiiv subscription form`
)
assert(
  homepage.includes(beehiivFormUrl.replace(/&/g, `&amp;`)),
  `Homepage must render the direct Beehiiv form iframe`
)
for (const expectedPath of [`/about/`, ...topicHubs.map(hub => hub.path)]) {
  assert(
    homepage.includes(expectedPath),
    `Homepage navigation is missing ${expectedPath}`
  )
}

const article = fs.readFileSync(articleOutput, `utf8`)
assert.strictEqual(
  (article.match(/rel="canonical"/g) || []).length,
  1,
  `Article must include exactly one canonical link`
)
assert(
  article.includes(articleUrl),
  `Article canonical URL must match its route`
)

const rss = readOutput(`rss.xml`)
const decodeXml = value =>
  value
    .replace(/&apos;|&#x27;|&#39;/g, `'`)
    .replace(/&quot;/g, `"`)
    .replace(/&amp;/g, `&`)
const rssItems = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
  match => match[1]
)
const itemLinks = rssItems.map(item =>
  decodeXml(item.match(/<link>([^<]+)<\/link>/)[1])
)
const itemGuids = rssItems.map(item =>
  decodeXml(item.match(/<guid isPermaLink="false">([^<]+)<\/guid>/)[1])
)

assert(itemLinks.includes(articleUrl), `RSS must use category-prefixed URLs`)
assert(
  !itemLinks.includes(historicalArticleGuid),
  `RSS links must not use historical category-less URLs`
)
assert(
  itemGuids.includes(historicalArticleGuid),
  `RSS GUIDs must remain stable for existing feed subscribers`
)
assert.strictEqual(
  new Set(itemLinks).size,
  itemLinks.length,
  `RSS article URLs must be unique`
)

for (const itemUrl of itemLinks) {
  const itemPath = new URL(itemUrl).pathname
  const outputPath = path.join(publicDirectory, itemPath, `index.html`)
  assert(fs.existsSync(outputPath), `RSS URL has no generated page: ${itemUrl}`)
  const html = fs.readFileSync(outputPath, `utf8`)
  assert(
    html.includes(linkedinUrl),
    `Post is missing its LinkedIn CTA: ${itemUrl}`
  )
  assert(
    !/cusdis/i.test(html),
    `Post must not load the retired comments: ${itemUrl}`
  )
  assert(
    html.includes(`data-newsletter-form="${beehiivFormId}"`),
    `Post is missing the Beehiiv subscription form: ${itemUrl}`
  )
  assert(
    html.includes(beehiivFormUrl.replace(/&/g, `&amp;`)),
    `Post is missing the direct Beehiiv form iframe: ${itemUrl}`
  )
  const articleSchemas = extractSchemas(html).filter(
    schema => schema[`@type`] === `BlogPosting`
  )
  assert.strictEqual(
    articleSchemas.length,
    1,
    `Post must include one BlogPosting schema: ${itemUrl}`
  )
  assert.strictEqual(articleSchemas[0].url, itemUrl)
  assert.strictEqual(
    articleSchemas[0].author[`@id`],
    `https://walecloud.me/about/#person`
  )
}

const sitemapDirectory = path.join(publicDirectory, `sitemap`)
const sitemapFiles = fs
  .readdirSync(sitemapDirectory)
  .filter(file => /^sitemap.*\.xml$/.test(file))
assert(sitemapFiles.length > 0, `Build must generate sitemap XML files`)

const sitemap = sitemapFiles
  .map(file => fs.readFileSync(path.join(sitemapDirectory, file), `utf8`))
  .join(`\n`)
for (const itemUrl of itemLinks) {
  assert(
    sitemap.includes(itemUrl),
    `Sitemap is missing article URL: ${itemUrl}`
  )
}
assert(!sitemap.includes(`/404`), `Sitemap must exclude 404 pages`)
assert(
  !sitemap.includes(`/using-typescript/`),
  `Sitemap must exclude the starter TypeScript page`
)

const sitemapPageUrls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>/g)].map(
  match => decodeXml(match[1])
)

for (const pageUrl of sitemapPageUrls) {
  const pagePath = new URL(pageUrl).pathname
  const outputPath =
    pagePath === `/`
      ? path.join(publicDirectory, `index.html`)
      : path.join(publicDirectory, pagePath, `index.html`)
  const html = fs.readFileSync(outputPath, `utf8`)
  const canonicalTags = html.match(/<link[^>]+rel="canonical"[^>]*>/g) || []

  assert.strictEqual(
    canonicalTags.length,
    1,
    `Indexable page must include exactly one canonical link: ${pageUrl}`
  )
  const canonicalUrl = decodeXml(canonicalTags[0].match(/href="([^"]+)"/)[1])
  assert.strictEqual(
    canonicalUrl,
    pageUrl,
    `Canonical URL must match the generated route: ${pageUrl}`
  )
  assert(
    extractSchemas(html).length > 0,
    `Indexable page must include structured data: ${pageUrl}`
  )
}

const about = readOutput(`about/index.html`)
assert(
  hasSchemaType(about, `ProfilePage`),
  `About page needs ProfilePage schema`
)
assert(hasSchemaType(about, `Person`), `About page needs Person schema`)

for (const hub of topicHubs) {
  const html = readOutput(`${hub.path.slice(1)}index.html`)
  assert(
    hasSchemaType(html, `CollectionPage`),
    `${hub.title} needs CollectionPage schema`
  )
  for (const sourceSlug of hub.postSlugs) {
    assert(
      html.includes(sourceSlug),
      `${hub.title} is missing selected post ${sourceSlug}`
    )
  }
  assert(
    sitemap.includes(`https://walecloud.me${hub.path}`),
    `Sitemap is missing topic hub ${hub.path}`
  )
}
assert(
  sitemap.includes(`https://walecloud.me/about/`),
  `Sitemap is missing the About page`
)

for (const excludedPage of [`404.html`, `using-typescript/index.html`]) {
  const html = readOutput(excludedPage)
  assert(
    !html.includes(`rel="canonical"`),
    `${excludedPage} must not declare a canonical URL`
  )
  assert(html.includes(`noindex, nofollow`), `${excludedPage} must be noindex`)
}

const robots = readOutput(`robots.txt`)
assert(
  robots.includes(`https://walecloud.me/sitemap/sitemap-index.xml`),
  `robots.txt must advertise the sitemap index`
)
const expectedCrawlerAgents = [
  `OAI-SearchBot`,
  `ChatGPT-User`,
  `GPTBot`,
  `PerplexityBot`,
  `Perplexity-User`,
  `Claude-SearchBot`,
  `Claude-User`,
  `ClaudeBot`,
  `Googlebot`,
  `Google-Extended`,
]
for (const userAgent of expectedCrawlerAgents) {
  assert(
    robots.includes(`User-agent: ${userAgent}`),
    `robots.txt must explicitly allow ${userAgent}`
  )
}

const cacheRedirects = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `../.cache/redirects.json`), `utf8`)
)
const deploymentRedirects = JSON.parse(readOutput(`_redirects.json`)).redirects
const redirectOutputs = [
  [`Gatsby cache`, cacheRedirects],
  [`deployment manifest`, deploymentRedirects],
]
const expectedRedirectSources = Object.values(legacyPathsBySlug).flat()

const assertRedirect = (redirects, outputName, fromPath, toPath) => {
  const redirect = redirects.find(entry => entry.fromPath === fromPath)
  assert(redirect, `${outputName} is missing legacy redirect: ${fromPath}`)
  assert.strictEqual(redirect.toPath, toPath)
  assert.strictEqual(redirect.isPermanent, true)
  assert.strictEqual(redirect.redirectInBrowser, true)
  assert.strictEqual(redirect.ignoreCase, false)
}

for (const [slug, fromPaths] of Object.entries(legacyPathsBySlug)) {
  const targetUrl = itemLinks.find(itemUrl =>
    new URL(itemUrl).pathname.endsWith(slug)
  )
  assert(targetUrl, `Legacy redirect target has no RSS article: ${slug}`)
  const targetPath = new URL(targetUrl).pathname

  for (const fromPath of fromPaths) {
    for (const [outputName, redirects] of redirectOutputs) {
      assertRedirect(redirects, outputName, fromPath, targetPath)
    }
  }
}

for (const [index, historicalGuid] of itemGuids.entries()) {
  const fromPath = new URL(historicalGuid).pathname
  const targetPath = new URL(itemLinks[index]).pathname

  for (const [outputName, redirects] of redirectOutputs) {
    assertRedirect(redirects, outputName, fromPath, targetPath)
  }
}

console.log(
  `Validated ${sitemapPageUrls.length} canonical pages with structured data, ${itemLinks.length} RSS links with stable GUIDs, ${topicHubs.length} topic hubs, crawler policies, and ${expectedRedirectSources.length} legacy redirects.`
)
