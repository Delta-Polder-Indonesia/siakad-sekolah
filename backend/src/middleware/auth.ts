// Middleware ini dipasang di route yang butuh login.
// Cara pakai: router.get('/data', requireAuth, controller)

import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { isTokenBlacklisted, isTokenRegistered } from '../utils/tokenManager.js';
import { logger, logSecurityEvent } from '../config/logger.js';

export interface JwtPayload {
  userId: string;
  role:   'ADMIN' | 'GURU' | 'MURID' | 'WALIS' | 'TAMU';
  name:   string;
}

export const requireAuth: RequestHandler = async (req, res, next) => {
  // Token idealnya di httpOnly cookie (Set-Cookie), fallback ke Authorization header
  // untuk kompatibilitas (test, mobile, atau migrasi).
  let token: string | undefined;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    token = header.slice(7);
  } else if ((req as unknown as { cookies?: Record<string, string> }).cookies?.accessToken) {
    token = (req as unknown as { cookies: Record<string, string> }).cookies.accessToken;
  } else if ((req as unknown as { cookies?: Record<string, string> }).cookies?.access_token) {
    token = (req as unknown as { cookies: Record<string, string> }).cookies.access_token;
  }

  if (!token) {
    res.status(401).json({ ok: false, message: 'Token tidak ditemukan.' });
    return;
  }

  try {
    // Verifikasi tanda tangan JWT dulu (tanpa query DB) — token invalid/sampah
    // langsung ditolak tanpa membebani database.
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Check if token is blacklisted
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      logSecurityEvent('blacklisted_token_used', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      res.status(401).json({ ok: false, message: 'Token telah di-revoke. Silakan login kembali.' });
      return;
    }

    // Token harus terdaftar sebagai sesi aktif. "Logout dari semua perangkat"
    // menghapus registry sesi user, sehingga token lama otomatis ditolak di sini
    // walau tanda tangan JWT-nya masih valid.
    const registered = await isTokenRegistered(token);
    if (!registered) {
      logSecurityEvent('unregistered_token_used', {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      res.status(401).json({
        ok: false,
        message: 'Sesi telah berakhir. Silakan login kembali.',
      });
      return;
    }

    req.jwtUser = payload;
    next();
  } catch (error) {
    logger.warn('Token validation failed', { 
      error: (error as Error).message,
      ip: req.ip,
    });
    res.status(401).json({ ok: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

// Hanya ADMIN yang boleh akses
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.jwtUser?.role !== 'ADMIN') {
    logSecurityEvent('unauthorized_admin_access_attempt', {
      userId: req.jwtUser?.userId,
      role: req.jwtUser?.role,
      ip: req.ip,
    });
    res.status(403).json({ ok: false, message: 'Akses ditolak.' });
    return;
  }
  next();
};

// Hanya GURU yang boleh akses
export const requireTeacher: RequestHandler = (req, res, next) => {
  if (req.jwtUser?.role !== 'GURU') {
    logSecurityEvent('unauthorized_teacher_access_attempt', {
      userId: req.jwtUser?.userId,
      role: req.jwtUser?.role,
      ip: req.ip,
    });
    res.status(403).json({ ok: false, message: 'Akses ditolak. Role Guru diperlukan.' });
    return;
  }
  next();
};

// Hanya MURID yang boleh akses
export const requireStudent: RequestHandler = (req, res, next) => {
  if (req.jwtUser?.role !== 'MURID') {
    logSecurityEvent('unauthorized_student_access_attempt', {
      userId: req.jwtUser?.userId,
      role: req.jwtUser?.role,
      ip: req.ip,
    });
    res.status(403).json({ ok: false, message: 'Akses ditolak. Role Siswa diperlukan.' });
    return;
  }
  next();
};

// Multiple roles yang boleh akses
export const requireRoles = (...allowedRoles: ('ADMIN' | 'GURU' | 'MURID' | 'WALIS' | 'TAMU')[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.jwtUser || !allowedRoles.includes(req.jwtUser.role)) {
      logSecurityEvent('unauthorized_access_attempt', {
        userId: req.jwtUser?.userId,
        role: req.jwtUser?.role,
        allowedRoles,
        ip: req.ip,
      });
      res.status(403).json({ 
        ok: false, 
        message: 'Akses ditolak. Role tidak diizinkan.' 
      });
      return;
    }
    next();
  };
};