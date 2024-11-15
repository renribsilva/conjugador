// Importa o pacote @next/mdx
import createMDX from '@next/mdx';

// Cria a configuração MDX
const withMDX = createMDX({
  // Adicione plugins de markdown aqui, se necessário
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Extensões de página que incluem arquivos JS, JSX, MD, MDX, TS, e TSX
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  webpack: (config) => {
    // Não altera a configuração devtool; usa a padrão do Next.js
    return config;
  },
};

// Exporta a configuração MDX junto com a configuração do Next.js
export default withMDX(nextConfig);
