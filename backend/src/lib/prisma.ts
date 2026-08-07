// Satu koneksi database untuk seluruh aplikasi.
// Jangan buat PrismaClient baru di setiap file.

import { Prisma, PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';
import { logger, logDatabaseOperation } from '../config/logger.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Connection pool configuration
    // Note: Prisma handles connection pooling internally, but we can configure it
    // through the DATABASE_URL connection string parameters
    // Example: postgresql://user:pass@host:port/db?connection_limit=10&pool_timeout=10
  });

// DB Query Monitoring: catat query lambat untuk analisis performa.
const SLOW_QUERY_THRESHOLD_MS = 500;
(prisma.$on as unknown as (event: 'query', cb: (e: Prisma.QueryEvent) => void) => void)(
  'query',
  (event) => {
    if (event.duration > SLOW_QUERY_THRESHOLD_MS) {
      logger.warn('Slow DB Query', {
        query: event.query,
        params: event.params,
        durationMs: event.duration,
      });
    }
    logDatabaseOperation('query', {
      query: event.query,
      durationMs: event.duration,
    });
  }
);

(prisma.$on as unknown as (event: 'error', cb: (e: Prisma.LogEvent) => void) => void)(
  'error',
  (event) => {
    logger.error('DB Error', {
      message: event.message,
      target: event.target,
    });
  }
);

// Enhanced error handling untuk database connection
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error) => {
    logger.error('Failed to connect to database', { error: error.message });
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
});

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}