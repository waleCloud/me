import { Link } from "gatsby"
import React from "react"
import { createCategoryPath } from "../utils/urls"

const Menu = ({ categories }) => {
  return (
    <section>
      <ul style={{ listStyle: `none` }}>
        {categories.map(category => (
          <li key={category}>
            <Link to={createCategoryPath(category)}>{category}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Menu
