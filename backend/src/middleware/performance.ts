import type { RequestHandler } from 'express';
import { performanceMetrics } from '../utils/performance.js';
import { logger } from '../config/logger.js';

/**
 * Performance monitoring middleware.
 * Mencatat durasi request dan status code untuk semua endpoint.
 */
export const performanceMonitor: RequestHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    const routePath = req.route?.path ?? req.path;

    performanceMetrics.recordRequest(
      req.method,
      routePath,
      duration,
      res.statusCode
    );

    // Log slow requests
    if (duration > 1000) {
      logger.warn('SLOW REQUEST', {
        method: req.method,
        path: req.path,
        route: routePath,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};
