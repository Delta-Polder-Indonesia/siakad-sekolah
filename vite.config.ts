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
    headers: {
      // Security Headers untuk development
      'Content-Security-Policy': "frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  // Development -> /
  // Build (GitHub Pages) -> /siakad-sekolah/
  // Build (Vercel) -> / (Vercel sets VERCEL env)
  base: command === 'build'
    ? (process.env.VERCEL ? '/' : '/siakad-sekolah/')
    : '/',

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      command === 'build' ? 'production' : 'development'
    ),
  },

  build: {
    minify: true,
    cssMinify: true,

    // JANGAN preload semua chunk di index.html. Sebelumnya `pdf-vendor` (jspdf
    // ±377KB) ikut di-modulepreload padahal hanya dipakai saat ekspor PDF —
    // browser mengunduhnya di first load. Dengan dynamic import jspdf di
    // utils/export/helpers.ts dkk + opsi ini, jspdf hanya diunduh saat
    // pengguna benar-benar mencetak.
    modulePreload: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // PDF library
          if (id.includes('jspdf')) {
            return 'pdf-vendor';
          }
          // Icons
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          // Google OAuth
          if (id.includes('@react-oauth/google')) {
            return 'google-vendor';
          }
          // Maps
          if (id.includes('@react-google-maps/api')) {
            return 'maps-vendor';
          }
          // QR code
          if (id.includes('qrcode')) {
            return 'qrcode-vendor';
          }
          // Return undefined untuk node_modules lain agar default Rollup handling
          return undefined;
        },
        // Cache headers untuk aset statis
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          if (/\.(css|woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/[name]-[hash][extname]`;
          }
          if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(assetInfo.name || '')) {
            return `assets/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    chunkSizeWarningLimit: 1500,
  },
}));
