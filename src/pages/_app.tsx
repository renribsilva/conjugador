import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../styles/global.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { useMDXComponents } from "../mdx-components";
import { MDXProvider } from "@mdx-js/react";
import Layout from "../layout/layout";
import { Serwist } from "@serwist/window";

const title = "Conjugador Gules";
const description = "Conjugador de verbos da Língua Portuguesa Brasileira";
const url = "https://conjugador-gules.vercel.app";
const image = "https://conjugador-gules.vercel.app/gules512-v1.png";

export default function App({ Component, pageProps }: AppProps) {
  const components = useMDXComponents({});

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const sw = new Serwist("/sw.js", {
        type: "module",
      });
      sw.register();
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          name="description"
          content="Conjugador de verbos da Língua Portuguesa Brasileira construído a partir da base de palavras do projeto VERO do LibreOffice."
        />

        <title>{title}</title>

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="by renribsilva" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {/* <meta name="twitter:creator" content="@seu_usuario" /> */}

        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/gules192-v1.png" />
        {/*Icon for iOS devices*/}
        <link rel="apple-touch-icon" sizes="192x192" href="gules192-v1.png" />
        {/*Splash screen for iOS devices*/}
        <link
          rel="apple-touch-startup-image"
          href="/gules512-v1.png"
          sizes="512X512"
        />
      </Head>
      <Layout>
        <MDXProvider components={components}>
          <Component {...pageProps} />
        </MDXProvider>
      </Layout>
    </ThemeProvider>
  );
}
