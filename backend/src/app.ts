import cors    from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import express from 'express';
import helmet  from 'helmet';
import { env }          from './config/env.js';
import { apiRouter }    from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger, logRequest } from './config/logger.js';
import { performanceMonitor } from './middleware/performance.js';
import { securityMiddleware } from './middleware/security.js';
import { correlationId } from './middleware/correlationId.js';

const app = express();

const allowedOrigins = env.CLIENT_ORIGIN
  .split(',')
  .map((o) => o.trim());

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Preview Arena / e2b (dev saja)
  if (env.NODE_ENV !== 'production' && /\.e2b\.app$/.test(new URL(origin).hostname)) {
    return true;
  }
  return false;
}

// Kompresi gzip untuk respons JSON — kurangi bandwidth & latensi API.
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) cb(null, true);
    else cb(new Error('Origin tidak diizinkan'));
  },
  credentials:    true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
}));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

// Security middleware (HTTPS + CSRF + sanitization)
app.use(securityMiddleware);

// Correlation ID — set sebelum request logging agar requestId tersedia
app.use(correlationId);

// Request logging middleware
app.use(logRequest);

// Performance monitoring middleware
app.use(performanceMonitor);

app.get('/', (_req, res) => {
  logger.info('Root endpoint accessed');
  res.json({ name: 'Absensi Sekolah API', version: '0.1.0' });
});

app.use('/api', apiRouter);

// 404 handler
app.use((_req, res) => {
  logger.warn('404 Not Found', { url: _req.url, method: _req.method });
  res.status(404).json({ ok: false, message: 'Endpoint tidak ditemukan.' });
});

// Error handler — HARUS paling bawah
app.use(errorHandler);

export { app };
