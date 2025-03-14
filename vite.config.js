import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',  // Certifique-se de que o diretório public seja a raiz
  build: {
    outDir: 'dist', // A pasta onde os arquivos de build serão gerados
  },
});
