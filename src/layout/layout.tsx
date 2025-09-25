import React from "react";
import { Roboto } from "next/font/google"

const ubuntu = Roboto({
  subsets: ["latin"],
  weight: ["300", "400"]
});

export default function Layout({ children }) {

  return (
    <>
      <main className={ubuntu.className}>{children}</main>
    </>
  );
}