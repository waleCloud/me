import React from "react"
import { Link } from "gatsby"

const PostCard = ({ title, date, excerpt, slug }) => (
  <article
    className="post-list-item"
    itemScope
    itemType="http://schema.org/Article"
  >
    <header>
      <h2>
        <Link to={slug} itemProp="url">
          <span itemProp="headline">{title}</span>
        </Link>
      </h2>
      <small>{date}</small>
    </header>

    <section>
      <p
        dangerouslySetInnerHTML={{
          __html: excerpt,
        }}
        itemProp="description"
      />
    </section>
    <Link to={slug} className="read-more">
      Read More
    </Link>
  </article>
)

export default PostCard
