# Copilot instructions — Walecloud.me

Purpose: make AI coding agents immediately productive in this Gatsby blog repository.

Quick start

- Node: use the version in `.nvmrc` (Node 22). Enable Corepack and install
  dependencies with `yarn install --frozen-lockfile`.
- Local dev: `yarn dev` (runs `gatsby develop`). Build: `yarn build`. Serve:
  `yarn serve`.
- Verification: `yarn verify` runs formatting, URL regression checks, a production
  build, and generated-output checks.

Big picture (what to know)

- This is a Gatsby v3 static blog. Markdown posts live under `content/blog/*` and are sourced by `gatsby-source-filesystem` (see [gatsby-config.js](gatsby-config.js)).
- Page generation: `gatsby-node.js` builds posts, category pages, and curated topic
  hubs from Markdown. The About page is a regular Gatsby page in
  `src/pages/about.js`.
- Data flow: Markdown -> `gatsby-transformer-remark` -> GraphQL -> templates -> HTML output in `public/`.

Project-specific conventions & patterns

- Post frontmatter: expect `title`, `date`, `description`, `category: ["Cat"]`, and `featuredImage: ./img/...` (relative to the post folder). Example: [content/blog/autonomous-worker-operators/index.md](content/blog/autonomous-worker-operators/index.md).
- Images: featured images are processed with `gatsby-plugin-sharp`/`gatsby-transformer-sharp` and consumed in templates as `post.frontmatter.featuredImage.childImageSharp.fluid` (see `src/templates/blog-post.js`). Ensure the referenced image file exists and is importable by Gatsby.
- Slugs & categories: use the helpers in `src/utils/urls.js` everywhere. Post URLs
  prepend the normalized first category while preserving the post-folder casing.
  Legacy paths are permanently redirected in `gatsby-node.js`.
- Topic hubs: edit `src/data/topic-hubs.js` to change hub copy, topics, or curated
  posts. Hub post references use the source folder slug; Gatsby resolves it to
  the canonical category-prefixed post URL.
- Structured data: use the factories in `src/utils/structured-data.js` and pass
  their result to the `schema` prop on `src/components/seo.js`. Indexable pages
  should emit JSON-LD with stable author and page identifiers.
- SVGs: `gatsby-plugin-react-svg` is configured to include `src/images` — put inline-SVGs there to import as React components.

Integration & external dependencies

- Article CTA: posts end with a LinkedIn conversation link in
  `src/templates/blog-post.js`. The former third-party comment widget was removed.
- RSS: `gatsby-plugin-feed` is enabled; feed output is `/rss.xml`.
- Crawlers: production `robots.txt` explicitly allows search, user-requested, and
  training crawlers from OpenAI, Perplexity, Anthropic, and Google, plus the
  wildcard policy. Preserve its sitemap declaration.
- Image processing requires the `sharp` native dependency — ensure it builds on developer machines.

Editing workflows & common tasks

- Add a new post: create `content/blog/<slug>/index.md`, add an `img/` folder with `featuredImage` referenced in frontmatter. Follow existing posts for frontmatter shape.
- Change layout/components: edit `src/components/layout.js`, `src/components/PostCard.js`, and `src/templates/*` (these control listing, single-post layout and category pages).
- Change author positioning: keep visible About-page copy and Person/ProfilePage
  structured data consistent. Only use verifiable profile URLs in `sameAs`.
- Fix a build error: run `yarn clean` then `yarn verify` to reproduce locally.
  Check GraphQL queries in templates for missing frontmatter fields if builds fail.

Gotchas & recommended fixes that agents should consider

- Featured images are optional in the blog-post template. Keep the existing guard
  when changing the image query or rendering logic.
- URL changes require updating `src/utils/urls.js`, its checks, and any legacy
  redirects together. Do not lowercase post-folder slugs; existing URLs preserve
  their casing.
- Gatsby v3 uses `gatsby-image` APIs (legacy) and React 17 — avoid migrating to newer APIs without testing the whole site.

Where to look first (key files)

- [package.json](package.json) — scripts & Node engine
- [gatsby-config.js](gatsby-config.js) — plugins and content sources
- [gatsby-node.js](gatsby-node.js) — slug & page creation logic
- [src/templates/blog-post.js](src/templates/blog-post.js) — single-post layout & GraphQL query
- [src/templates/category-page.js](src/templates/category-page.js) — category list page
- [src/templates/topic-hub-page.js](src/templates/topic-hub-page.js) — curated subject landing page
- [src/data/topic-hubs.js](src/data/topic-hubs.js) — topic-hub copy and article selection
- [src/utils/structured-data.js](src/utils/structured-data.js) — JSON-LD schema factories
- [src/pages/about.js](src/pages/about.js) — author entity page
- [content/blog/](content/blog/) — canonical examples of post structure

— End
