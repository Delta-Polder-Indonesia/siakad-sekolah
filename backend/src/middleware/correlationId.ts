import crypto from 'node:crypto';
import type { RequestHandler } from 'express';

/**
 * Correlation ID middleware.
 * Menambahkan ID unik per request untuk melacak request di seluruh log,
 * dan menyertakannya ke response header X-Request-Id.
 */
export const correlationId: RequestHandler = (req, res, next) => {
  const incoming = req.headers['x-request-id'];
  const requestId = Array.isArray(incoming)
    ? incoming[0]
    : (incoming ?? crypto.randomUUID());

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}
