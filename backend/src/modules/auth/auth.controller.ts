import type { RequestHandler } from 'express';
import {
  loginTeacher,
  loginStudent,
  loginGuest,
  loginAdmin,
  loginGoogle,
  refreshAccessToken,
} from './auth.service.js';

// POST /api/auth/login
export const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { role, id, password } = req.body as {
      role:     string;
      id:       string;
      password: string;
    };

    // Tamu (TAMU) cukup memakai access code (password); id tidak wajib.
    const idRequired = role !== 'TAMU';

    if (!role || !password || (idRequired && !id)) {
      res.status(400).json({
        ok: false,
        message: 'Role, id, dan password wajib diisi.',
      });
      return;
    }

    let result = null;

    if (role === 'GURU') {
      result = await loginTeacher(id, password);
    } else if (role === 'MURID') {
      result = await loginStudent(id, password);
    } else if (role === 'TAMU') {
      result = await loginGuest(password);
    } else {
      res.status(400).json({
        ok: false,
        message: 'Role tidak valid.',
      });
      return;
    }

    if (!result) {
      // Jangan beritahu mana yang salah (id atau password)
      // Ini mencegah user enumeration attack
      res.status(401).json({
        ok: false,
        message: 'ID atau password salah.',
      });
      return;
    }

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/google
export const handleGoogleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { idToken, role } = req.body as { idToken: string; role: string };

    if (!idToken || !role) {
      res.status(400).json({
        ok: false,
        message: 'idToken dan role wajib diisi.',
      });
      return;
    }

    const result = await loginGoogle(idToken, role);

    if (result.status === 'unavailable') {
      res.status(503).json({
        ok: false,
        message: 'Google Login tidak dikonfigurasi di server.',
      });
      return;
    }

    if (result.status === 'invalid') {
      res.status(401).json({
        ok: false,
        message: 'Kredensial Google tidak valid atau user tidak ditemukan.',
      });
      return;
    }

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/admin/login
export const handleAdminLogin: RequestHandler = async (req, res, next) => {
  try {
    const { username, pin } = req.body as { username: string; pin: string };

    if (!username || !pin) {
      res.status(400).json({
        ok: false,
        message: 'Username dan pin wajib diisi.',
      });
      return;
    }

    const result = await loginAdmin(username, pin);

    if (!result) {
      res.status(401).json({ ok: false, message: 'Username atau pin salah.' });
      return;
    }

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh  &  POST /api/auth/admin/refresh
export const handleRefresh: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };

    if (!refreshToken) {
      res.status(400).json({
        ok: false,
        message: 'Refresh token tidak ditemukan.',
      });
      return;
    }

    const result = await refreshAccessToken(refreshToken);

    if (!result) {
      res.status(401).json({
        ok: false,
        message: 'Refresh token tidak valid atau sudah kedaluwarsa.',
      });
      return;
    }

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};