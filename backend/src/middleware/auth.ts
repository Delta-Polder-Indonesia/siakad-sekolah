// Middleware ini dipasang di route yang butuh login.
// Cara pakai: router.get('/data', requireAuth, controller)

import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtPayload {
  userId: string;
  role:   'ADMIN' | 'GURU' | 'MURID' | 'TAMU';
  name:   string;
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, message: 'Token tidak ditemukan.' });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.jwtUser = payload;
    next();
  } catch {
    res.status(401).json({ ok: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

// Hanya ADMIN yang boleh akses
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.jwtUser?.role !== 'ADMIN') {
    res.status(403).json({ ok: false, message: 'Akses ditolak.' });
    return;
  }
  next();
};