import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PostCard from "../components/PostCard"
import Bio from "../components/bio"

const CategoryTemplate = ({ pageContext, location }) => {  
  const { category, posts } = pageContext

  return (
    <Layout location={location}>
      <Seo 
        title={`Posts in ${category}`}
        meta={`"Wale Ayandiran, Founder, Tech founder, ${category}"`}
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
