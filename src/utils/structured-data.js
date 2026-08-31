const { createAbsoluteUrl } = require(`./urls`)

const AUTHOR_NAME = `Wale Ayandiran`
const AUTHOR_PATH = `/about/`
const AUTHOR_ID_PATH = `/about/#person`
const AUTHOR_SAME_AS = [
  `https://www.linkedin.com/in/wale-ayandiran-31717891`,
  `https://github.com/walecloud`,
  `https://medium.com/@walecloud`,
  `https://dev.to/walecloud`,
  `https://twitter.com/walecloud`,
]
const AUTHOR_TOPICS = [
  `Engineering Leadership`,
  `Software Engineering`,
  `Artificial Intelligence`,
  `Autonomous AI Systems`,
  `Frontend Engineering`,
  `Technical Mentoring`,
]

const createPersonSchema = siteUrl => ({
  "@context": `https://schema.org`,
  "@type": `Person`,
  "@id": createAbsoluteUrl(siteUrl, AUTHOR_ID_PATH),
  name: AUTHOR_NAME,
  url: createAbsoluteUrl(siteUrl, AUTHOR_PATH),
  sameAs: AUTHOR_SAME_AS,
  knowsAbout: AUTHOR_TOPICS,
})

const createWebsiteSchema = ({ siteUrl, title, description }) => ({
  "@context": `https://schema.org`,
  "@type": `WebSite`,
  "@id": createAbsoluteUrl(siteUrl, `/#website`),
  url: createAbsoluteUrl(siteUrl, `/`),
  name: title,
  description,
  publisher: {
    "@id": createAbsoluteUrl(siteUrl, AUTHOR_ID_PATH),
  },
})

const createProfilePageSchema = ({ siteUrl, description }) => ({
  "@context": `https://schema.org`,
  "@type": `ProfilePage`,
  "@id": createAbsoluteUrl(siteUrl, `/about/#profile-page`),
  url: createAbsoluteUrl(siteUrl, AUTHOR_PATH),
  name: `About ${AUTHOR_NAME}`,
  description,
  mainEntity: {
    "@id": createAbsoluteUrl(siteUrl, AUTHOR_ID_PATH),
  },
})

const createBlogPostingSchema = ({
  siteUrl,
  path,
  title,
  description,
  image,
  datePublished,
  dateModified,
  tags = [],
  category,
}) => {
  const url = createAbsoluteUrl(siteUrl, path)
  const schema = {
    "@context": `https://schema.org`,
    "@type": `BlogPosting`,
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@id": createAbsoluteUrl(siteUrl, AUTHOR_ID_PATH),
      "@type": `Person`,
      name: AUTHOR_NAME,
      url: createAbsoluteUrl(siteUrl, AUTHOR_PATH),
    },
    publisher: {
      "@id": createAbsoluteUrl(siteUrl, AUTHOR_ID_PATH),
    },
  }

  if (image) schema.image = createAbsoluteUrl(siteUrl, image)
  if (Array.isArray(tags) && tags.length > 0) schema.keywords = tags
  if (category) schema.articleSection = category

  return schema
}

const createCollectionPageSchema = ({
  siteUrl,
  path,
  title,
  description,
  items = [],
}) => {
  const url = createAbsoluteUrl(siteUrl, path)

  return {
    "@context": `https://schema.org`,
    "@type": `CollectionPage`,
    "@id": `${url}#collection`,
    url,
    name: title,
    description,
    author: {
      "@id": createAbsoluteUrl(siteUrl, AUTHOR_ID_PATH),
    },
    mainEntity: {
      "@type": `ItemList`,
      itemListElement: items.map((item, index) => ({
        "@type": `ListItem`,
        position: index + 1,
        name: item.title,
        url: createAbsoluteUrl(siteUrl, item.slug),
      })),
    },
  }
}

module.exports = {
  AUTHOR_ID_PATH,
  AUTHOR_NAME,
  AUTHOR_SAME_AS,
  AUTHOR_TOPICS,
  createBlogPostingSchema,
  createCollectionPageSchema,
  createPersonSchema,
  createProfilePageSchema,
  createWebsiteSchema,
}
