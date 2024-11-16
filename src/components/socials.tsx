import styles from "../styles/components.module.css";
import Link from "next/link";
import React from "react";

const SocialObjects = [
  {
    name: "mastodon ",
    link: "https://ursal.zone/@renribsilva",
  },
  {
    name: "source",
    link: "https://github.com/renribsilva/conjugador",
  },
];

export default function Socials() {
  return (
    <ul className={styles.socials}>
      {SocialObjects.map(({ name, link }) => {
        return (
          <li key={name}>
            <Link target="_blank" href={link} rel="noopener noreferrer">
              <span>{name}</span>
              <span className="material-symbols-outlined">arrow_outward</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
