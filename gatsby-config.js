const { createAbsoluteUrl, createPostPath } = require(`./src/utils/urls`)

module.exports = {
  siteMetadata: {
    title: `Walecloud.me`,
    author: {
      name: `Wale Ayandiran`,
    },
    description: `Personal blog documenting my work and parts of my life journey.`,
    siteUrl: `https://walecloud.me`,
    social: {
      twitter: `walecloud`,
      devto: `walecloud`,
      medium: `walecloud`,
      stackoverflow: `walecloud`,
      github: `walecloud`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: `${__dirname}/src/images`,
        },
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 730,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                const postPath = createPostPath(
                  node.frontmatter.category?.[0],
                  node.fields.slug
                )
                const postUrl = createAbsoluteUrl(
                  site.siteMetadata.siteUrl,
                  postPath
                )

                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: postUrl,
                  // Keep the historical GUID stable so feed readers do not
                  // treat every corrected URL as a newly published article.
                  guid: createAbsoluteUrl(
                    site.siteMetadata.siteUrl,
                    node.fields.slug
                  ),
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                      category
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [`/404`, `/404.html`, `/using-typescript/`],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Walecloud.me`,
        short_name: `Walecloud`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#005b99`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://walecloud.me",
        sitemap: "https://walecloud.me/sitemap/sitemap-index.xml",
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }],
          },
          production: {
            // Search/indexing, user-requested retrieval, and model-training
            // crawlers are separate controls. This site intentionally allows
            // all of them so its public writing can be discovered and cited.
            policy: [
              { userAgent: "OAI-SearchBot", allow: "/" },
              { userAgent: "ChatGPT-User", allow: "/" },
              { userAgent: "GPTBot", allow: "/" },
              { userAgent: "PerplexityBot", allow: "/" },
              { userAgent: "Perplexity-User", allow: "/" },
              { userAgent: "Claude-SearchBot", allow: "/" },
              { userAgent: "Claude-User", allow: "/" },
              { userAgent: "ClaudeBot", allow: "/" },
              { userAgent: "Googlebot", allow: "/" },
              { userAgent: "Google-Extended", allow: "/" },
              { userAgent: "*", allow: "/" },
            ],
          },
        },
      },
    },
  ],
}
