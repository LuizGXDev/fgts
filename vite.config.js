import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',  // Defina o diretório 'public' como a raiz do Vite
  build: {
    outDir: '../dist', // Gera a pasta 'dist' fora de 'public'
    emptyOutDir: true,  // Limpa a pasta de saída antes de gerar novos arquivos
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // Geração de classes com camelCase
    }
  }
});
