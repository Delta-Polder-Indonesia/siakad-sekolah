import type { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { logger, logSecurityEvent } from '../config/logger.js';
import { sanitizeObject } from '../utils/sanitize.js';

/**
 * Middleware untuk meng-enforce HTTPS di production.
 * Jika request datang via HTTP di production, redirect ke HTTPS.
 */
export const enforceHttps: RequestHandler = (req, res, next) => {
  if (env.NODE_ENV === 'production') {
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
    if (!isHttps) {
      const host = req.headers.host;
      const url = `https://${host}${req.originalUrl}`;
      logSecurityEvent('http_redirect_to_https', {
        ip: req.ip,
        url: req.originalUrl,
      });
      res.redirect(301, url);
      return;
    }
  }
  next();
};

/**
 * CSRF protection untuk state-changing requests (POST/PUT/PATCH/DELETE).
 * Karena API ini memakai Bearer token (bukan cookie), risiko CSRF rendah,
 * tapi tetap divalidasi origin/referer untuk defense-in-depth.
 */
export const csrfProtection: RequestHandler = (req, res, next) => {
  const method = req.method;
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(method)) {
    next();
    return;
  }

  const allowedOrigins = env.CLIENT_ORIGIN
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''));

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const isAllowed = (value: string | undefined) => {
    if (!value) return true; // non-browser clients (Postman, mobile) tidak kirim origin
    const base = value.replace(/\/$/, '');
    if (allowedOrigins.some((o) => base === o || base.startsWith(o + '/'))) return true;
    try {
      const host = new URL(base).hostname;
      if (env.NODE_ENV !== 'production' && host.endsWith('.e2b.app')) return true;
    } catch {
      return false;
    }
    return false;
  };

  if (!isAllowed(origin) || !isAllowed(referer)) {
    logSecurityEvent('csrf_origin_rejected', {
      ip: req.ip,
      method,
      url: req.originalUrl,
      origin,
      referer,
    });
    res.status(403).json({ ok: false, message: 'Origin tidak diizinkan.' });
    return;
  }

  next();
};

/**
 * Sanitize request body (strip HTML/script) sebelum diproses.
 */
export const sanitizeRequestBody: RequestHandler = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Security middleware bundle: HTTPS + CSRF + sanitization.
 */
export const securityMiddleware: RequestHandler[] = [
  enforceHttps,
  csrfProtection,
  sanitizeRequestBody,
];
