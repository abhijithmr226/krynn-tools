import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const port = Number(process.env.PORT || 5173);
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Core React and routing
            if (id.includes('react') || id.includes('react-dom') || id.includes('wouter') || id.includes('@tanstack')) {
              return 'vendor-core';
            }
            // Icons (large bundle)
            if (id.includes('@phosphor-icons')) {
              return 'vendor-icons';
            }
            // PDF libraries (heavy, lazy loaded)
            if (id.includes('pdf-lib') || id.includes('pdfjs-dist')) {
              return 'vendor-pdf';
            }
            // OCR library (heavy, lazy loaded)
            if (id.includes('tesseract.js')) {
              return 'vendor-ocr';
            }
            // Other utilities
            return 'vendor-others';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      '/api': {
        target: process.env.API_SERVER_URL ?? 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
