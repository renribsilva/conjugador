import type { AppProps } from 'next/app';
import React from 'react'; // Corrigido aqui
import "../styles/global.css";
import { ThemeProvider } from "next-themes";
import Head from 'next/head';

const title = "Conjugador Gules"
const description = "Conjugador de verbos da Língua Porguesa Brasileira"
const url = "https://conjugador-gules.vercel.app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>

        <title>{title}</title>

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={image} /> */}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="link" />
        <meta property="og:site_name" content="Conjugador-Gules" />
        <meta property="og:author_name" content="renribsilva" />
        <meta property="og:provider_name" content="Gules" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
