import styles from "../styles/components.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMastodon, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import React from "react";

const SocialObjects = [
  {
    ícone: faMastodon, 
    alt: "ícone do mastodon",
    link: "https://ursal.zone/@renribsilva",
  },
  {
    ícone: faGithub, 
    alt: "ícone do github",
    link: "https://github.com/renribsilva/petricor",
  },
];

export default function Socials () {
  return (
    <ul className={styles.socials}>
      {SocialObjects.map(({ ícone, link, alt }) => {
        return (
          <li key={link}>
            <Link target="_blank" href={link} aria-label={alt} rel="noopener noreferrer">
              <FontAwesomeIcon icon={ícone}/>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}