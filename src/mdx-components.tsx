import type { MDXComponents } from 'mdx/types';
import styles from "../src/styles/mdx-components.module.css";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    a: ({ children, ...props }) => (
      <a className={styles.customA} {...props}> 
        {children}
      </a> 
    ),

    p: ({ children, ...props }) => (
      <p className={styles.customP} {...props}> 
        {children}
      </p> 
    ),

    hr: (props) => <hr {...props} className={styles.customHR} />,

    ...components,
  };
}
