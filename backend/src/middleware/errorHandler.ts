// Tangkap semua error yang tidak tertangani.
// Tanpa ini, error akan crash server atau
// mengembalikan HTML ke frontend.

import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('[ERROR]', err);

  // Jangan bocorkan detail error ke client di production
  const message =
    env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan pada server.'
      : (err instanceof Error ? err.message : String(err));

  res.status(err.status ?? 500).json({
    ok: false,
    message,
  });
};