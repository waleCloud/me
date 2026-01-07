import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import { ReactCusdis } from "react-cusdis"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

// Helper to normalize category strings the same way as `gatsby-node.js`
function normalizeCategory(s) {
  return encodeURIComponent(
    String(s || "blog")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  )
}

const BlogPostTemplate = ({ data, location, pageContext }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  // Prefer normalized category passed via page context; fallback to normalizing frontmatter
  const normalizedCategory =
    pageContext?.categoryNormalized ||
    normalizeCategory(post.frontmatter.category && post.frontmatter.category[0])

  const prevSlug =
    previous?.frontmatter.category &&
    `${normalizeCategory(previous.frontmatter.category[0])}${
      previous.fields.slug
    }`
  const nextSlug =
    next?.frontmatter.category &&
    `${normalizeCategory(next.frontmatter.category[0])}${next.fields.slug}`

  let featuredImgFluid = post.frontmatter.featuredImage.childImageSharp.fluid

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        image={post.frontmatter.featuredImage.publicURL}
        url={`https://walecloud.me/${normalizedCategory}${post.fields.slug}`}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <Img fluid={featuredImgFluid} />
          <p>{post.frontmatter.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <div id="cusdis-wrapper">
        <ReactCusdis
          attrs={{
            host: "https://cusdis.com",
            appId: "0e70457c-0642-4497-9409-0b96a6509644",
            pageId: post.id,
            pageTitle: post.frontmatter.title,
            pageUrl: `https://walecloud.me/${normalizedCategory}${post.fields.slug}`,
          }}
        />
      </div>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`/${prevSlug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/${nextSlug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
          publicURL
        }
        description
        category
        tags
      }
      fields {
        slug
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        category
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
        category
      }
    }
  }
`
