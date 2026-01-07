# Copilot instructions — Walecloud.me

Purpose: make AI coding agents immediately productive in this Gatsby blog repository.

Quick start

- Node: use Node 18.x (see `package.json` engines). Install deps: `npm install`.
- Local dev: `npm run dev` (runs `gatsby develop`). Build: `npm run build`. Serve: `npm run serve`.
- Formatting: `npm run format` (Prettier). There are no automated tests (`npm test` is placeholder).

Big picture (what to know)

- This is a Gatsby v3 static blog. Markdown posts live under `content/blog/*` and are sourced by `gatsby-source-filesystem` (see [gatsby-config.js](gatsby-config.js)).
- Page generation: `gatsby-node.js` builds pages from Markdown via GraphQL and two templates: `src/templates/blog-post.js` and `src/templates/category-page.js`.
- Data flow: Markdown -> `gatsby-transformer-remark` -> GraphQL -> templates -> HTML output in `public/`.

Project-specific conventions & patterns

- Post frontmatter: expect `title`, `date`, `description`, `category: ["Cat"]`, and `featuredImage: ./img/...` (relative to the post folder). Example: [content/blog/autonomous-worker-operators/index.md](content/blog/autonomous-worker-operators/index.md).
- Images: featured images are processed with `gatsby-plugin-sharp`/`gatsby-transformer-sharp` and consumed in templates as `post.frontmatter.featuredImage.childImageSharp.fluid` (see `src/templates/blog-post.js`). Ensure the referenced image file exists and is importable by Gatsby.
- Slugs & categories: `createPages` in [gatsby-node.js](gatsby-node.js) creates post slugs by prepending the first category element: `/${category[0]}${post.fields.slug}`. Category pages are created at `/${category.toLowerCase()}/`. Note: this is an intentional inconsistency to be aware of when adding URLs or linking manually.
- SVGs: `gatsby-plugin-react-svg` is configured to include `src/images` — put inline-SVGs there to import as React components.

Integration & external dependencies

- Comments: uses `react-cusdis` in `src/templates/blog-post.js` with a public `appId` (Cusdis service). Changing comment system requires editing that template.
- RSS: `gatsby-plugin-feed` is enabled; feed output is `/rss.xml`.
- Image processing requires the `sharp` native dependency — ensure it builds on developer machines.

Editing workflows & common tasks

- Add a new post: create `content/blog/<slug>/index.md`, add an `img/` folder with `featuredImage` referenced in frontmatter. Follow existing posts for frontmatter shape.
- Change layout/components: edit `src/components/layout.js`, `src/components/PostCard.js`, and `src/templates/*` (these control listing, single-post layout and category pages).
- Fix a build error: run `npm run clean` then `npm run build` to reproduce locally. Check GraphQL queries in templates for missing frontmatter fields if builds fail.

Gotchas & recommended fixes that agents should consider

- The blog-post template assumes `frontmatter.featuredImage` exists and accesses `childImageSharp.fluid` directly; missing images will crash the build. Either ensure every post has a `featuredImage`, or add a guard in `src/templates/blog-post.js`.
- Inconsistent casing/slug rule: post slugs use the raw first category value while category index pages use `.toLowerCase()`. Be careful when generating links or programmatically adding categories.
- Gatsby v3 uses `gatsby-image` APIs (legacy) and React 17 — avoid migrating to newer APIs without testing the whole site.

Where to look first (key files)

- [package.json](package.json) — scripts & Node engine
- [gatsby-config.js](gatsby-config.js) — plugins and content sources
- [gatsby-node.js](gatsby-node.js) — slug & page creation logic
- [src/templates/blog-post.js](src/templates/blog-post.js) — single-post layout & GraphQL query
- [src/templates/category-page.js](src/templates/category-page.js) — category list page
- [content/blog/](content/blog/) — canonical examples of post structure

If unclear, ask: should horizontal URL casing be normalized (lowercase categories)? Should templates be hardened against missing `featuredImage`? Mention preference and I will update code accordingly.

— End
