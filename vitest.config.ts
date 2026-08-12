import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Aktifkan mode API agar service yang bergantung pada backend
    // (authApi, feedbackService, attendanceService) menjalankan cabang fetch
    // saat diuji. Catatan: ppdbService terkunci mode lokal (usePpdbApi=false).
    env: {
      VITE_API_BASE_URL: 'http://localhost:4000/api',
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
});
