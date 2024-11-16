import type { AppProps } from 'next/app';
import React from 'react'; // Corrigido aqui
import "../styles/global.css";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
