import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import PostCard from "../components/PostCard"
import Seo from "../components/seo"
import { createCollectionPageSchema } from "../utils/structured-data"

const TopicHubTemplate = ({ data, pageContext, location }) => {
  const { hub, posts } = pageContext
  const { siteUrl, title: siteTitle } = data.site.siteMetadata

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={hub.title}
        description={hub.description}
        pathname={hub.path}
        schema={createCollectionPageSchema({
          siteUrl,
          path: hub.path,
          title: hub.title,
          description: hub.description,
          items: posts,
        })}
      />
      <article>
        <h1>{hub.title}</h1>
        <p>{hub.intro}</p>

        <h2>Topics covered</h2>
        <ul className="topic-list">
          {hub.topics.map(topic => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>

        <h2>Selected articles</h2>
        <ol className="topic-hub-posts">
          {posts.map(post => (
            <li key={post.slug}>
              <PostCard
                title={post.title}
                date={post.date}
                excerpt={post.description}
                slug={post.slug}
              />
            </li>
          ))}
        </ol>
      </article>
    </Layout>
  )
}

export default TopicHubTemplate

export const pageQuery = graphql`
  query TopicHubPage {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`
