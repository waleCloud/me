import React from 'react';

import  Twitter from "../images/twitter-icon.svg";
import  DevTo from "../images/devto-icon.svg";
import  Github from "../images/github-icon.svg";
import  Medium from "../images/medium-icon.svg";
import  Stackoverflow from "../images/stackoverflow-icon.svg";
import  Linkedln from "../images/linkedln-icon.svg";

export const Socials = ({ social }) => {

  return (
    <p>
      <br />
        <a href={`https://twitter.com/${social?.twitter || ``}`}>
          <Twitter
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Twitter"
          />
        </a>
        {' '}{' '}
        <a href={`https://dev.to/${social?.twitter || ``}`}>
          <DevTo
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Dev.to"
          />
        </a>
        {' '}
        <a href={`https://github.com/${social?.twitter || ``}`}>
          <Github
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Github"
          />
        </a>
        {' '}
        <a href={`https://medium.com/@${social?.twitter || ``}`}>
          <Medium
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Medium"
          />
        </a>
        {' '}
        <a href={`https://stackoverflow.com/${social?.twitter || ``}`}>
          <Stackoverflow
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Stackoverflow"
          />
        </a>
        {' '}
        <a href='https://www.linkedin.com/in/wale-ayandiran-31717891'>
          <Linkedln
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Linkedln"
          />
        </a>
    </p>
  )
}
