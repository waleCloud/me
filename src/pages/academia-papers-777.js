// import * as React from "react"
// import Layout from "../components/layout"
// import Seo from "../components/seo"
// import Bio from "../components/bio"
// import { papers } from "../constant"


// const AcademiaPapers = ({ data, location }) => {
//   return (
//     <Layout location={location} >
//       <Seo title="Academic Papers" meta="Wale Ayandiran, Academic Papers, Academic conferences Founder, Tech founder, Tech Lead, Engineering Leadership" />
//       <Bio />
//       <section className="academia-hero">
//         <h1>Academia Papers</h1>
//         <p>Explore research papers and academic contributions.</p>
//       </section>
//       <section className="papers-grid">
//       <main>
//        <ul style={{ listStyle: `none` }}>
//          {papers.map((paper, index) => (
//           <li key={index}>
//             <h2>{paper.title}</h2>
//             <p><strong>Publication:</strong> {paper.Publication}</p>
//             <p><strong>Year:</strong> {paper.Year}</p>
//             <p><strong>Excerpt: </strong>{paper.description}</p>
//             <a href={paper.file} download>
//               Download PDF
//             </a>
//             <br />
//             <a href={paper.file} target="_blank" rel="noopener noreferrer">
//               Read Online
//             </a>
//             <iframe
//               src={paper.file}
//               width="100%"
//               height="500px"
//               style={{ border: "1px solid #ccc", marginTop: "10px" }}
//               title={paper.title}
//             ></iframe>
//           </li>
//         ))}
//       </ul>
//     </main>
//       </section>
//     </Layout>
//   )
// }

// export default AcademiaPapers
