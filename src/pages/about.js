import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { topicHubs } from "../data/topic-hubs"
import {
  createPersonSchema,
  createProfilePageSchema,
} from "../utils/structured-data"

const description =
  "About Wale Ayandiran, a software engineer and tech entrepreneur writing about engineering leadership, software, and AI systems."

const AboutPage = ({ data, location }) => {
  const { siteUrl, title } = data.site.siteMetadata

  return (
    <Layout location={location} title={title}>
      <Seo
        title="About Wale Ayandiran"
        description={description}
        pathname="/about/"
        schema={[
          createProfilePageSchema({ siteUrl, description }),
          createPersonSchema(siteUrl),
        ]}
      />
      <article>
        <h1>About Wale Ayandiran</h1>
        <p>
          I’m Wale Ayandiran, a software engineer and tech entrepreneur. I write
          about engineering leadership, building software and AI systems, and
          lessons from creating products and supporting teams.
        </p>
        <p>
          This site is where I develop those ideas in public: practical
          engineering guidance, reflections from building technology, and
          questions about how intelligent systems should work in the real world.
        </p>

        <h2>What I write about</h2>
        <ul className="about-links">
          {topicHubs.map(hub => (
            <li key={hub.path}>
              <Link to={hub.path}>{hub.title}</Link> — {hub.description}
            </li>
          ))}
        </ul>

        <h2>Elsewhere</h2>
        <p>
          You can find more of my work and connect with me on{" "}
          <a
            href="https://www.linkedin.com/in/wale-ayandiran-31717891"
            rel="me noopener noreferrer"
          >
            LinkedIn
          </a>
          , <a href="https://github.com/walecloud">GitHub</a>,{" "}
          <a href="https://medium.com/@walecloud">Medium</a>, and{" "}
          <a href="https://dev.to/walecloud">Dev.to</a>.
        </p>
      </article>
    </Layout>
  )
}

export default AboutPage

export const pageQuery = graphql`
  query AboutPage {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`
