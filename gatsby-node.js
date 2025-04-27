const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const categoryTemplate = path.resolve("./src/templates/category-page.js") // Single template for all categories

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              title
              category
              description
              date(formatString: "MMMM DD, YYYY")
            }
          }
          group(field: frontmatter___category) {
            fieldValue
            totalCount
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes  
  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id
      const category = post.frontmatter.category || ["blog" ]// Default to "blog" if no category is specified
      const slug = `/${category[0]}${post.fields.slug}` // Append category to the slug

      
      createPage({
        path: slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })

    // Collect all unique categories
    const allCategories = new Set()
    posts.forEach(post => {
      const categories = post.frontmatter.category || ["blog"]
      categories.forEach(category => allCategories.add(category))
    })

    // Create a page for each category
    allCategories.forEach(category => {
      const categoryPosts = posts      
        .filter(post => post.frontmatter.category && post.frontmatter.category.includes(category))
        .map(post => ({
          slug: `/${category}${post.fields.slug}`,
          title: post.frontmatter.title,
          date: post.frontmatter.date,
          description: post.frontmatter.description,
        }))

      createPage({
        path: `/${category.toLowerCase()}/`, // Use the category name as the path
        component: categoryTemplate,
        context: {
          category: category, // Pass the category name to the template
          posts: categoryPosts, // Pass the filtered posts to the template
        },
      })
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      category: [String]
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
