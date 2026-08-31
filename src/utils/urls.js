const DEFAULT_CATEGORY = "blog"

function normalizeCategory(category) {
  const normalized = String(category || DEFAULT_CATEGORY)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

  return encodeURIComponent(normalized || DEFAULT_CATEGORY)
}

function normalizePostSlug(slug) {
  const normalized = String(slug || "")
    .trim()
    .replace(/^\/+|\/+$/g, "")

  return normalized ? `/${normalized}/` : `/`
}

function createCategoryPath(category) {
  return `/${normalizeCategory(category)}/`
}

function createPostPath(category, slug) {
  return `/${normalizeCategory(category)}${normalizePostSlug(slug)}`
}

function createAbsoluteUrl(siteUrl, pathname = `/`) {
  const origin = String(siteUrl || "").replace(/\/+$/g, "")
  const path = `/${String(pathname || "").replace(/^\/+/, "")}`

  return `${origin}${path}`
}

module.exports = {
  createAbsoluteUrl,
  createCategoryPath,
  createPostPath,
  normalizeCategory,
}
