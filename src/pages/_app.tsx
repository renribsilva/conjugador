import type { AppProps } from 'next/app';
import React from 'react'; // Corrigido aqui
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
