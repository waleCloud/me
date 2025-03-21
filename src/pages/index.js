import * as React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import PostCard from "../components/PostCard"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
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
      <Seo title="Wale Ayandiran"
      meta="Wale Ayandiran, Founder, Tech founder, software engineer, Senior Frontend Engineer, AI Python, NodeJS, ReactJS, React, Tech Lead, Engineering Leadership" />
      <Bio />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const category = post?.frontmatter?.category

          const slug = `${category ? category[0] : "blog"}${post.fields.slug}`
          
          return (
            <>
        <PostCard
          key={post.title}
          title={title}
          date={post.date}
          excerpt={post.description || post.excerpt}
          slug={slug}
          type={post.type}
        />
            
            </>
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
