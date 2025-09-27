import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';
import "../styles/global.css";
import { ThemeProvider } from "next-themes";
import Head from 'next/head';
import { useMDXComponents } from '../mdx-components';
import { MDXProvider } from "@mdx-js/react";
import Layout from '../layout/layout';

const title = "Conjugador pt-BR"
const description = "Conjugador de verbos da Língua Portuguesa Brasileira"
const url = "https://conjugador-gules.vercel.app"

const mdxModules = [
  () => import("../mdx/Home.mdx"),
  () => import("../mdx/About.mdx"),
  () => import("../mdx/Gracias.mdx"),
  () => import("../mdx/Statistic.mdx"),
  () => import("../mdx/Warning.mdx"),
  () => import("../mdx/Emphasis.mdx"),
  () => import("../mdx/Reflexive.mdx"),
  () => import("../mdx/SobreErros.mdx"),
];

export default function App({ Component, pageProps }: AppProps) {
  
  const components = useMDXComponents({});
  const [mdxReady, setMdxReady] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Service Worker registered');
      });
    }
  }, []);

  useEffect(() => {
    Promise.all(mdxModules.map(fn => fn()))
      .then(() => {
        setMdxReady(true);
      });
  }, []);

  if (!mdxReady) return null;

  return (
    <ThemeProvider
      attribute="class"  
      defaultTheme="system"
      enableSystem={true}
    >
      <Head>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>{title}</title>

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={image} /> */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="link" />
        <meta property="og:site_name" content="by renribsilva" />
        <meta property="og:author_name" content="renribsilva" />
        <meta property="og:provider_name" content="Conjugador Gules" />

        {/*To avoid unwanted scroll behavior on iOS Safari*/}
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover, width=device-width"></meta>
        
      </Head>
      <Layout>
        <MDXProvider components={components}>
          <Component {...pageProps} />
        </MDXProvider>
      </Layout>
    </ThemeProvider>
  )
}
