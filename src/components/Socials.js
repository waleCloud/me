import React from 'react';

import  Twitter from "../images/twitter-icon.svg";
import  DevTo from "../images/devto-icon.svg";
import  Github from "../images/github-icon.svg";
import  Medium from "../images/medium-icon.svg";
import  Stackoverflow from "../images/stackoverflow-icon.svg";
import  Linkedln from "../images/linkedln-icon.svg";
import  Academia from "../images/academia-icon.svg";
import AnchorLink from './AnchorLink';

export const Socials = ({ social }) => {

  return (
    <p>
      <br />
        <AnchorLink url={`https://twitter.com/${social?.twitter || ``}`}>
          <Twitter
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Twitter"
          />
        </AnchorLink>
        {' '}{' '}
        <AnchorLink url={`https://dev.to/${social?.twitter || ``}`}>
          <DevTo
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Dev.to"
          />
        </AnchorLink>
        {' '}
        <AnchorLink url={`https://github.com/${social?.twitter || ``}`}>
          <Github
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Github"
          />
        </AnchorLink>
        {' '}
        <AnchorLink url={`https://medium.com/@${social?.twitter || ``}`}>
          <Medium
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Medium"
          />
        </AnchorLink>
        {' '}
        <AnchorLink url={`https://stackoverflow.com/${social?.twitter || ``}`}>
          <Stackoverflow
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Stackoverflow"
          />
        </AnchorLink>
        {' '}
        <AnchorLink url='https://independent.academia.edu/waleayandirran/'>
          <Academia
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Academia.edu"
          />
        </AnchorLink>
        {' '}
        <AnchorLink url='https://www.linkedin.com/in/wale-ayandiran-31717891'>
          <Linkedln
            className="bio-avatar"
            layout="constrained"
            formats={["AUTO", "WEBP", "AVIF"]}
            width={30}
            height={30}
            quality={95}
            alt="Linkedln"
          />
        </AnchorLink>
    </p>
  )
}
