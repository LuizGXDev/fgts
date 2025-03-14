import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Gera a pasta 'dist' na raiz do projeto
    emptyOutDir: true,  // Limpa a pasta de saída antes de gerar novos arquivos
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // Geração de classes com camelCase
    },
  },
});
