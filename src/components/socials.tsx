import styles from "../styles/components.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Arrow from "./svgs/arrow";

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ul className={styles.socials}>
      {SocialObjects.map(({ name, link }) => {
        return (
          <li key={name}>
            <Link target="_blank" href={link} rel="noopener noreferrer">
              <span>{name}</span>
              <Arrow/>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
