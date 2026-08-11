import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // 1. Tambahkan impor ini di baris atas

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'async-css',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(
            /<link rel="stylesheet"([^>]*?) href="([^"]+\.css)"([^>]*)>/g,
            (_match, pre: string, href: string, post: string) =>
              `<link rel="stylesheet"${pre} href="${href}"${post} media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}"></noscript>`
          );
        },
      },
    },
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
  preview: {
    host: true,
    allowedHosts: true,
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') {
          res.statusCode = 302;
          res.setHeader('Location', '/siakad-sekolah/');
          res.end();
          return;
        }
        next();
      });
    },
  },

  server: {
    host: true,
    allowedHosts: true,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    headers: {
      // Preview/dev harus bisa di-iframe (Arena). Frame-deny tetap di
      // public/_headers untuk deploy produksi.
      'X-Content-Type-Options': 'nosniff',
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
          // Hanya pecah node_modules. JANGAN masukkan jspdf ke named chunk —
          // named chunk bisa jadi shared dep entry (PSI: pdf-vendor di first load).
          // jspdf tetap async chunk lewat dynamic import + modulePreload: false.
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          if (id.includes('@react-oauth/google')) {
            return 'google-vendor';
          }
          if (id.includes('@react-google-maps/api')) {
            return 'maps-vendor';
          }
          if (id.includes('node_modules/qrcode')) {
            return 'qrcode-vendor';
          }
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
