import * as React from "react"
import { Link } from "gatsby"
import { topicHubs } from "../data/topic-hubs"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }
  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        {header}
        <nav className="site-nav" aria-label="Primary navigation">
          <Link to="/about/" activeClassName="site-nav-active">
            About
          </Link>
          {topicHubs.map(hub => (
            <Link
              to={hub.path}
              activeClassName="site-nav-active"
              key={hub.path}
            >
              {hub.title}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
