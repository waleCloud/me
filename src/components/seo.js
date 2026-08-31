/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { createAbsoluteUrl } from "../utils/urls"

const serializeSchema = schema =>
  JSON.stringify(schema).replace(/</g, `\\u003c`)

const Seo = ({
  description,
  lang,
  meta,
  title,
  image,
  pathname,
  url,
  type,
  schema,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const siteUrl = site.siteMetadata.siteUrl
  const canonicalUrl = url || (pathname && createAbsoluteUrl(siteUrl, pathname))
  const socialImage =
    image &&
    (/^https?:\/\//.test(image) ? image : createAbsoluteUrl(siteUrl, image))

  const metadata = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:image`,
      content: socialImage,
    },
    {
      property: `og:url`,
      content: canonicalUrl,
    },
    {
      property: `og:type`,
      content: type,
    },
    {
      name: `twitter:card`,
      content: socialImage ? `summary_large_image` : `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata?.social?.twitter || ``,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
    {
      name: `twitter:image`,
      content: socialImage,
    },
  ]
    .filter(item => item.content)
    .concat(meta)

  const schemas = (Array.isArray(schema) ? schema : [schema]).filter(Boolean)

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      link={canonicalUrl ? [{ rel: `canonical`, href: canonicalUrl }] : []}
      meta={metadata}
    >
      {schemas.map((item, index) => (
        <script type="application/ld+json" key={item[`@id`] || index}>
          {serializeSchema(item)}
        </script>
      ))}
    </Helmet>
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  type: `website`,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  pathname: PropTypes.string,
  schema: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  type: PropTypes.string,
  url: PropTypes.string,
}

export default Seo
