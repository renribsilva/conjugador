// Importa o pacote @next/mdx
import createMDX from '@next/mdx';
import remarkFootnotes from 'remark-footnotes';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Extensões de página que incluem arquivos JS, JSX, MD, MDX, TS, e TSX
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  webpack: (config) => {
    // Não altera a configuração devtool; usa a padrão do Next.js
    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkFootnotes, { inlineNotes: true }],
    ],
  },
});

export default withMDX({
  ...nextConfig,
});
