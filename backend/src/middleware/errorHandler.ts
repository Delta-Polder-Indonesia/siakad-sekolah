// Tangkap semua error yang tidak tertangani.
// Tanpa ini, error akan crash server atau
// mengembalikan HTML ke frontend.

import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';
import { logger, logError } from '../config/logger.js';
import { handleError, formatErrorResponse, isOperationalError } from '../utils/errors.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Convert error to AppError
  const appError = handleError(err);
  
  // Log error dengan structured logging
  logError(err, {
    url: _req.url,
    method: _req.method,
    ip: _req.ip,
    userAgent: _req.get('user-agent'),
    errorType: appError.type,
    isOperational: appError.isOperational,
  });

  // Format error response
  const response = formatErrorResponse(appError);
  
  // Set appropriate status code
  res.status(appError.statusCode).json(response);

  // If it's not operational, this might be a programming error
  // In production, we might want to trigger alerts or monitoring
  if (!appError.isOperational && env.NODE_ENV === 'production') {
    logger.error('Non-operational error detected - might be a bug', {
      error: err.message,
      stack: err.stack,
    });
  }
};