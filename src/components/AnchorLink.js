import React from "react"

export default function AnchorLink(props) {
  const { url, newTab } = props
  return (
    <a href={url} rel="noopener noreferrer" target={newTab && "_blank"}>
      {props.children}
    </a>
  )
}
