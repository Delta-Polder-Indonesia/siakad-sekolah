import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    // Sediakan env var dummy (DATABASE_URL, JWT_SECRET, dll) sebelum test di-import.
    // Tanpa ini, modul yang meng-import `config/env.ts` throw saat module load.
    setupFiles: ['src/test/setupEnv.ts'],
  },
});