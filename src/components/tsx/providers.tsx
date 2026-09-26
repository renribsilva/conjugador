"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { Serwist } from "@serwist/window";

export function Providers({ children }: { children: React.ReactNode }) {
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
      {children}
    </ThemeProvider>
  );
}
