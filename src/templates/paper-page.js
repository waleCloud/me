import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Bio from "../components/bio"

const PaperTemplate = ({ pageContext, location}) => {
  const { paper } = pageContext
  
  return (
    <Layout location={location}>
      <Seo title={paper.title} description={paper.description}/>
      <article className="blog-post"
        itemScope
        itemType="http://schema.org/Article">
          <header>
            <h1>{paper.title}</h1>
            <p><strong>Publication:</strong> {paper.Publication}</p>
            <p><strong>Year:</strong> {paper.Year}</p>
          </header>
        <section itemProp="articleBody">
          <p>{paper.description}</p>
          <a href={paper.file} download>
            Download PDF
          </a>
          <br />
          <a href={paper.file} target="_blank" rel="noopener noreferrer">
            Read Online
          </a>
          <iframe
            src={paper.file}
            width="100%"
            height="500px"
            style={{ border: "1px solid #ccc", marginTop: "10px" }}
            title={paper.title}
          />
        </section>
        <br />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
    </Layout>
  )
}

export default PaperTemplate