import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // 1. Tambahkan impor ini di baris atas

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // 2. Tambahkan blok resolve alias di sini
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // 1. KUNCI PACKAGES BESAR AGAR STARTUP DEV SANGAT CEPAT
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@react-google-maps/api', 
      'jspdf', 
      'qrcode', 
      'lucide-react'
    ],
  },

  // 2. OPTIMASI PEMINDAIAN FOLDER WINDOWS
  server: {
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },

  // Development -> /
  // Build (GitHub Pages) -> /projeck-portal-siswa/
  // Build (Vercel) -> / (Vercel sets VERCEL env)
  base: command === 'build'
    ? (process.env.VERCEL ? '/' : '/projeck-portal-siswa/')
    : '/',

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      command === 'build' ? 'production' : 'development'
    ),
  },

  build: {
    minify: true,
    cssMinify: true,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0];
          }
        },
      },
    },

    chunkSizeWarningLimit: 1500,
  },
}));
