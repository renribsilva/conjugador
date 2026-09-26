import { Roboto } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Layout from "../layout/layout";
import { Providers } from "../context/providers";

const ubuntu = Roboto({
  subsets: ["latin"],
  weight: ["300", "400"],
});

const title = "Conjugador Gules";
const description =
  "Conjugador de verbos da Língua Portuguesa Brasileira construído a partir da base de palavras do projeto VERO do LibreOffice.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://conjugador-gules.vercel.app"),
  title,
  description,
  manifest: "/manifest.json",
  openGraph: {
    title,
    description: "Conjugador de verbos da Língua Portuguesa Brasileira",
    url: "https://conjugador-gules.vercel.app",
    siteName: "by renribsilva",
    type: "website",
    images: [{ url: "/api/og" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Conjugador de verbos da Língua Portuguesa Brasileira",
    images: ["/api/og"],
  },
  icons: {
    apple: [
      { url: "/gules192-v1.png" },
      { url: "/gules192-v1.png", sizes: "192x192" },
    ],
  },
  appleWebApp: {
    startupImage: ["/gules512-v1.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
