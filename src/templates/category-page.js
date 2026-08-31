import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PostCard from "../components/PostCard"
import Bio from "../components/bio"
import { createCollectionPageSchema } from "../utils/structured-data"
import { createCategoryPath } from "../utils/urls"

const CategoryTemplate = ({ data, pageContext, location }) => {
  const { category, posts } = pageContext
  const path = createCategoryPath(category)
  const description = `Articles by Wale Ayandiran about ${category}.`

  return (
    <Layout location={location} title={data.site.siteMetadata.title}>
      <Seo
        title={`Posts in ${category}`}
        description={description}
        pathname={path}
        schema={createCollectionPageSchema({
          siteUrl: data.site.siteMetadata.siteUrl,
          path,
          title: `Posts in ${category}`,
          description,
          items: posts,
        })}
      />
      <Bio />
      <h1>Posts in {category}</h1>
      <ul style={{ listStyle: `none` }}>
        {posts.map(post => (
          <PostCard
            key={post.title}
            title={post.title}
            date={post.date}
            excerpt={post.description || post.excerpt}
            slug={post.slug}
            type={post.type}
          />
        ))}
      </ul>
    </Layout>
  )
}

export default CategoryTemplate

export const pageQuery = graphql`
  query CategoryPage {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`
