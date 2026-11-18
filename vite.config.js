import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    proxy: { '/api': 'http://127.0.0.1:3000' }
  },
  build: {
    rollupOptions: {
      input: {
        home: `${projectRoot}index.html`,
        guides: `${projectRoot}guides.html`,
        privacy: `${projectRoot}privacy.html`,
        terms: `${projectRoot}terms.html`,
        contact: `${projectRoot}contact.html`
      }
    }
  }
});
