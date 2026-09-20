import * as React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import PostCard from "../components/PostCard"
import Seo from "../components/seo"
import {
  createPersonSchema,
  createWebsiteSchema,
} from "../utils/structured-data"
import { createPostPath } from "../utils/urls"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteMetadata = data.site.siteMetadata
  const posts = data.allMarkdownRemark.nodes

  // Extract unique categories from posts
  const categories = Array.from(
    new Set(posts.flatMap(post => post.frontmatter.category || []))
  )

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" pathname="/" />
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title="Wale Ayandiran"
        description="Wale Ayandiran writes about building companies, software engineering, artificial intelligence, leadership, and life."
        pathname="/"
        schema={[
          createWebsiteSchema({
            siteUrl: siteMetadata.siteUrl,
            title: siteMetadata.title,
            description: siteMetadata.description,
          }),
          createPersonSchema(siteMetadata.siteUrl),
        ]}
      />
      <Bio categories={categories} />

      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const category = post?.frontmatter?.category

          const slug = createPostPath(category?.[0], post.fields.slug)

          return (
            <li key={post.fields.slug}>
              <PostCard
                key={title}
                title={title}
                date={post.frontmatter.date}
                excerpt={post.frontmatter.description || post.excerpt}
                slug={slug}
              />
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
          tags
        }
        excerpt
      }
    }
  }
`
