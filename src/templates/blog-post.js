import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { createBlogPostingSchema } from "../utils/structured-data"
import { createAbsoluteUrl, createPostPath } from "../utils/urls"

const LINKEDIN_URL = "https://www.linkedin.com/in/wale-ayandiran-31717891"

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteUrl = data.site.siteMetadata.siteUrl
  const { previous, next } = data
  const postPath = createPostPath(
    post.frontmatter.category?.[0],
    post.fields.slug
  )
  const postUrl = createAbsoluteUrl(siteUrl, postPath)
  const prevSlug =
    previous &&
    createPostPath(previous.frontmatter.category?.[0], previous.fields.slug)
  const nextSlug =
    next && createPostPath(next.frontmatter.category?.[0], next.fields.slug)
  const featuredImage = post.frontmatter.featuredImage
  const featuredImgFluid = featuredImage?.childImageSharp?.fluid
  const description = post.frontmatter.description || post.excerpt
  const articleSchema = createBlogPostingSchema({
    siteUrl,
    path: postPath,
    title: post.frontmatter.title,
    description,
    image: featuredImage?.publicURL,
    datePublished: post.frontmatter.publishedDate,
    dateModified: post.frontmatter.updatedDate,
    tags: post.frontmatter.tags,
    category: post.frontmatter.category?.[0],
  })

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={description}
        image={featuredImage?.publicURL}
        url={postUrl}
        type="article"
        schema={articleSchema}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          {featuredImgFluid && <Img fluid={featuredImgFluid} />}
          <p>{post.frontmatter.displayDate}</p>
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
      <aside className="post-cta" aria-labelledby="post-cta-heading">
        <h2 id="post-cta-heading">Continue the conversation</h2>
        <p>
          Have thoughts or a different perspective?{" "}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Connect with me on LinkedIn
          </a>
          .
        </p>
      </aside>
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
              <Link to={prevSlug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={nextSlug} rel="next">
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
        siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        publishedDate: date
        updatedDate: updated
        displayDate: date(formatString: "MMMM DD, YYYY")
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
