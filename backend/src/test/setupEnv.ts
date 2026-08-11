/**
 * Test environment setup — di-load via `setupFiles` di vitest.config.ts.
 *
 * Modul `src/config/env.ts` mewajibkan beberapa env var (DATABASE_URL, JWT_SECRET,
 * dll). Tanpa nilai default di sini, setiap test yang meng-import chain
 * logger/app akan throw saat module load (sebelumnya: `process.exit(1)` yang
 * mematikan seluruh test runner).
 *
 * Semua nilai di sini DUMMY — tidak terhubung ke database/perangkat nyata,
 * karena seluruh test backend mem-mock `lib/prisma`.
 */
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test_db';
process.env.JWT_SECRET ??= 'test-only-jwt-secret-abcdefghijklmnopqrstuvwxyz-0123456789';
process.env.JWT_REFRESH_SECRET ??= 'test-only-refresh-secret-abcdefghijklmnopqrstuvwxyz-0123456789';
process.env.ADMIN_USERNAME ??= 'testadmin';
process.env.ADMIN_PASSWORD ??= 'test-admin-password-123';
process.env.CLIENT_ORIGIN ??= 'http://localhost:5173';
