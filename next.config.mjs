import createMDX from '@next/mdx';
import remarkFootnotes from 'remark-footnotes';
import withPWAInit from 'next-pwa';

// Configuração base do Next.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack: (config) => {
    return config;
  },
};

// Configuração do MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkFootnotes, { inlineNotes: true }]],
  },
});

// Configuração do PWA
const withPWA = withPWAInit({
  dest: 'public',
});

// Exporta combinando MDX + PWA
export default withPWA(
  withMDX({
    ...nextConfig,
  })
);
