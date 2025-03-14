import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Garante que os caminhos sejam relativos e funcionem na Vercel
  build: {
    outDir: 'dist', // Gera a pasta 'dist' na raiz do projeto
    emptyOutDir: true, // Limpa a pasta 'dist' antes de gerar novos arquivos
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // Geração de classes com camelCase
    },
  },
});
