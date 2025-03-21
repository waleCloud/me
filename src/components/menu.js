import { Link } from 'gatsby'
import React from 'react'

const Menu = () => {
  return (
    <section>
      <ul style={{ listStyle: `none` }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/academia-papers">Academia Papers</Link></li>
        <li><Link to="/startup-stories">Startup Adventures</Link></li>
      </ul>
  </section>
  )
}

export default Menu;
