import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT:         z.coerce.number().default(4000),
  NODE_ENV:     z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),

  // BARU: untuk JWT
  // Generate dengan: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  JWT_SECRET:             z.string().min(32),
  JWT_EXPIRES_IN:         z.string().default('8h'),
  JWT_REFRESH_SECRET:     z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Kredensial admin panel (PPDB).
  // SECURITY WARNING: Ganti dengan password yang kuat di production!
  // Jangan gunakan default values di production environment.
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(8),

  GOOGLE_CLIENT_ID: z.string().optional(),

  // Backup configuration
  BACKUP_DIR: z.string().default('./backups'),
  BACKUP_RETENTION_DAYS: z.coerce.number().default(7),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Konfigurasi environment tidak valid:',
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsed.data;

// Blokir kredensial lemah di production untuk mencegah kompromi akun admin.
const WEAK_PASSWORDS = ['admin', 'password', 'password123', 'admin123', '12345678'];
if (
  env.NODE_ENV === 'production' &&
  (WEAK_PASSWORDS.includes(env.ADMIN_PASSWORD.toLowerCase()) ||
    env.ADMIN_PASSWORD === env.ADMIN_USERNAME)
) {
  console.error('SECURITY: ADMIN_PASSWORD masih lemah. Ganti dengan password kuat di production!');
  process.exit(1);
}