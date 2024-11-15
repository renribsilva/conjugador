import Link from "next/link";
import styles from "../styles/components.module.css";
import React from "react";
import Socials from "./socials";

const currentYear = new Date().getFullYear();

const linkfooter = [
  { label: "nextjs", href: "https://nextjs.org/" },
  { label: "notion", href: "https://www.notion.so/" },
];

const linkProps = {
  target: "_blank",
  rel: "noopener noreferrer"
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>© {currentYear} MIT</div>
      <div>
        criado com:{" "}
        {linkfooter.slice(0, 2).map(({ label, href }, index) => (
          <React.Fragment key={href}>
            <Link href={href} {...linkProps} rel="noopener noreferrer">
              {label}
            </Link>
            {index < 1 && " e "} {/* Adiciona " e " entre os links */}
          </React.Fragment>
        ))}
      </div>
    </footer>
  );
}
