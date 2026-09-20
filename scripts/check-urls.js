const assert = require(`assert`)
const fs = require(`fs`)
const path = require(`path`)
const {
  createAbsoluteUrl,
  createCategoryPath,
  createPostPath,
  normalizeCategory,
} = require(`../src/utils/urls`)
const { topicHubs } = require(`../src/data/topic-hubs`)
const {
  createBlogPostingSchema,
  createCollectionPageSchema,
  createPersonSchema,
  createProfilePageSchema,
  createWebsiteSchema,
} = require(`../src/utils/structured-data`)

const expectedPostPaths = [
  `/academia-papers/big-data-analytics--better-decision-making/`,
  `/academia-papers/contactless-payment-the-future-of-world-retail-finance/`,
  `/life/2021wrapped/`,
  `/life/new-beginnings-MSc-Artificial-intelligence/`,
  `/machine-learning/tweepy-fetch-historical-tweet-stream/`,
  `/startup-stories/yutars-synopsis/`,
  `/tech/OnBuddy-2025-reflection/`,
  `/tech/access-previous-state/`,
  `/tech/artificial-what-ifs/`,
  `/tech/autonomous-worker-operators/`,
  `/tech/be-less-impressed-by-what-you-build/`,
  `/tech/gcp-cloud-run-and-app-engine/`,
  `/tech/html5-semantics-building-the-right-way/`,
  `/tech/in-flight-token-refresh-deep-dive/`,
  `/tech/reboot-edinburgh-2025/`,
  `/tech/scaling-frontend-apps-code-guidelines/`,
  `/tech/shared-api-platform-token-storms/`,
  `/tech/the-engineering-meeting-paradox/`,
  `/tech/we're-not-close-to-AGI-just-yet/`,
]

assert.strictEqual(normalizeCategory(`machine-Learning`), `machine-learning`)
assert.strictEqual(
  normalizeCategory(`Artificial Intelligence`),
  `artificial-intelligence`
)
assert.strictEqual(normalizeCategory(), `blog`)
assert.strictEqual(createCategoryPath(`Machine Learning`), `/machine-learning/`)
assert.strictEqual(
  createPostPath(`machine-Learning`, `/example-post/`),
  `/machine-learning/example-post/`
)
assert.strictEqual(
  createAbsoluteUrl(`https://walecloud.me/`, `/tech/example-post/`),
  `https://walecloud.me/tech/example-post/`
)

const blogDirectory = path.resolve(__dirname, `../content/blog`)
const postPaths = new Set()

for (const entry of fs.readdirSync(blogDirectory, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue

  const markdownPath = path.join(blogDirectory, entry.name, `index.md`)
  if (!fs.existsSync(markdownPath)) continue

  const markdown = fs.readFileSync(markdownPath, `utf8`)
  const categoryMatch = markdown.match(/^category:\s*\[\s*["']([^"']+)["']/m)

  assert(categoryMatch, `${markdownPath} must define at least one category`)

  const postPath = createPostPath(categoryMatch[1], `/${entry.name}/`)
  assert(!postPaths.has(postPath), `Duplicate post URL: ${postPath}`)
  postPaths.add(postPath)
}

assert(postPaths.size > 0, `Expected at least one blog post to be checked`)
assert.deepStrictEqual(
  [...postPaths].sort(),
  expectedPostPaths,
  `Published article URLs must remain stable`
)

assert.strictEqual(
  topicHubs.length,
  3,
  `Expected three foundational topic hubs`
)
assert.strictEqual(
  new Set(topicHubs.map(hub => hub.path)).size,
  topicHubs.length,
  `Topic hub URLs must be unique`
)
for (const hub of topicHubs) {
  assert(hub.path.startsWith(`/`) && hub.path.endsWith(`/`))
  assert(hub.title && hub.description && hub.intro)
  assert(hub.topics.length > 0, `${hub.title} must define its covered topics`)
  assert(hub.postSlugs.length > 0, `${hub.title} must include selected posts`)

  for (const sourceSlug of hub.postSlugs) {
    assert(
      [...postPaths].some(postPath => postPath.endsWith(sourceSlug)),
      `${hub.title} references an unknown post: ${sourceSlug}`
    )
  }
}

const siteUrl = `https://walecloud.me`
const person = createPersonSchema(siteUrl)
const website = createWebsiteSchema({
  siteUrl,
  title: `Walecloud.me`,
  description: `Wale Ayandiran's blog`,
})
const profile = createProfilePageSchema({
  siteUrl,
  description: `About Wale Ayandiran`,
})
const article = createBlogPostingSchema({
  siteUrl,
  path: `/tech/example/`,
  title: `Example`,
  description: `Example article`,
  datePublished: `2026-01-01T00:00:00.000Z`,
  category: `tech`,
  tags: [`Engineering`],
})
const collection = createCollectionPageSchema({
  siteUrl,
  path: `/software-engineering/`,
  title: `Software Engineering`,
  description: `Selected articles`,
  items: [{ title: `Example`, slug: `/tech/example/` }],
})

assert.strictEqual(person[`@type`], `Person`)
assert.strictEqual(person[`@id`], `${siteUrl}/about/#person`)
assert.strictEqual(website[`@type`], `WebSite`)
assert.strictEqual(profile.mainEntity[`@id`], person[`@id`])
assert.strictEqual(article[`@type`], `BlogPosting`)
assert.strictEqual(article.author[`@id`], person[`@id`])
assert.strictEqual(article.dateModified, article.datePublished)
assert.strictEqual(collection.mainEntity.itemListElement[0].position, 1)
assert.strictEqual(
  collection.mainEntity.itemListElement[0].url,
  `${siteUrl}/tech/example/`
)

console.log(
  `Validated ${postPaths.size} unique article URLs, ${topicHubs.length} topic hubs, and structured-data helpers.`
)
