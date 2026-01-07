import { Link } from "gatsby"
import React from "react"

const Menu = ({ categories }) => {
  return (
    <section>
      <ul style={{ listStyle: `none` }}>
        {categories.map(category => (
          <li key={category}>
            <Link to={`/${category.toLowerCase()}/`}>{category}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Menu
