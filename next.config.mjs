import createMDX from "@next/mdx";
import remarkFootnotes from "remark-footnotes";
import withSerwistInit from "@serwist/next";
import NextBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** Configuração base do Next.js */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack(config) {
    return config;
  },
};

/** Configuração do MDX */
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkFootnotes, { inlineNotes: true }]],
  },
});

/** Configuração do Serwist */
const withSerwist = withSerwistInit({
  swSrc: "src/lib/pwa/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true, 
});

/** Aplica MDX primeiro, depois Serwist */
const composedConfig = withAnalyzer(withSerwist(withMDX(nextConfig)));
export default composedConfig;
