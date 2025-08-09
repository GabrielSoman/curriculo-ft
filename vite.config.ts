import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['express', 'cors', 'jsdom', 'puppeteer']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: './index.html'
    }
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/src/server/**']
    }
  },
  preview: {
    port: 4173,
    host: true
  }
});