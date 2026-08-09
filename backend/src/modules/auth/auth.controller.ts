import type { RequestHandler } from 'express';
import {
  loginTeacher,
  loginStudent,
  loginParent,
  loginGuest,
  loginAdmin,
  loginGoogle,
  refreshAccessToken,
  validateUserPassword,
  changeTeacherPassword,
  changeStudentPassword,
  logout,
  logoutAllDevices,
  getTokenBlacklistStats,
} from './auth.service.js';
import { 
  validateRequest, 
  loginSchema, 
  googleLoginSchema, 
  adminLoginSchema, 
  refreshTokenSchema,
  passwordValidationSchema,
  changePasswordSchema 
} from '../../utils/validation.js';

// POST /api/auth/login
export const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    // Validate request body
    const validation = validateRequest(loginSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { role, id, password } = validation.data;

    // Tamu (TAMU) cukup memakai access code (password); id tidak wajib.
    const idRequired = role !== 'TAMU';

    if (idRequired && !id) {
      res.status(400).json({
        ok: false,
        message: 'ID wajib diisi untuk role ini.',
      });
      return;
    }

    let result = null;

    if (role === 'GURU') {
      result = await loginTeacher(id!, password);
    } else if (role === 'MURID') {
      result = await loginStudent(id!, password);
    } else if (role === 'WALIS') {
      result = await loginParent(id!, password);
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
    // Validate request body
    const validation = validateRequest(googleLoginSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { idToken, role } = validation.data;

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
    // Validate request body
    const validation = validateRequest(adminLoginSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { username, pin } = validation.data;

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
    // Validate request body
    const validation = validateRequest(refreshTokenSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { refreshToken } = validation.data;

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

// POST /api/auth/validate-password
export const handleValidatePassword: RequestHandler = async (req, res, next) => {
  try {
    // Validate request body
    const validation = validateRequest(passwordValidationSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { password } = validation.data;

    const result = validateUserPassword(password);

    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-password (untuk guru)
// Route diproteksi requireAuth — user hanya bisa mengubah password akunnya sendiri.
export const handleChangeTeacherPassword: RequestHandler = async (req, res, next) => {
  try {
    // Validate request body
    const validation = validateRequest(changePasswordSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { teacherId, oldPassword, newPassword } = validation.data;
    const jwtUser = req.jwtUser;

    if (!jwtUser) {
      res.status(401).json({ ok: false, message: 'Harus login terlebih dahulu.' });
      return;
    }

    // Ambil ID dari token (sumber kebenaran), bukan dari body — mencegah user
    // mengubah password guru lain asalkan tahu teacherId.
    const targetId = teacherId || jwtUser.userId;

    if (jwtUser.role !== 'GURU' || targetId !== jwtUser.userId) {
      res.status(403).json({
        ok: false,
        message: 'Akses ditolak. Anda hanya dapat mengubah password akun sendiri.',
      });
      return;
    }

    const result = await changeTeacherPassword(targetId, oldPassword, newPassword);

    res.json({ ok: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-password (untuk siswa)
// Route diproteksi requireAuth — user hanya bisa mengubah password akunnya sendiri.
export const handleChangeStudentPassword: RequestHandler = async (req, res, next) => {
  try {
    // Validate request body
    const validation = validateRequest(changePasswordSchema, req.body);
    if (!validation.success) {
      res.status(400).json({
        ok: false,
        message: 'Data tidak valid',
        errors: validation.errors,
      });
      return;
    }

    const { studentId, oldPassword, newPassword } = validation.data;
    const jwtUser = req.jwtUser;

    if (!jwtUser) {
      res.status(401).json({ ok: false, message: 'Harus login terlebih dahulu.' });
      return;
    }

    // Ambil ID dari token (sumber kebenaran), bukan dari body.
    const targetId = studentId || jwtUser.userId;

    if (jwtUser.role !== 'MURID' || targetId !== jwtUser.userId) {
      res.status(403).json({
        ok: false,
        message: 'Akses ditolak. Anda hanya dapat mengubah password akun sendiri.',
      });
      return;
    }

    const result = await changeStudentPassword(targetId, oldPassword, newPassword);

    res.json({ ok: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const handleLogout: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.jwtUser?.userId;
    const refreshToken = (req.body as { refreshToken?: string | null } | undefined)?.refreshToken;

    if (!token) {
      res.status(400).json({
        ok: false,
        message: 'Token tidak ditemukan.',
      });
      return;
    }

    const result = await logout(token, userId, refreshToken);

    res.json({ ok: result.success, message: result.message });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout-all
export const handleLogoutAllDevices: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.jwtUser?.userId;

    if (!userId) {
      res.status(401).json({
        ok: false,
        message: 'User tidak terautentikasi.',
      });
      return;
    }

    const result = await logoutAllDevices(userId);

    res.json({ ok: result.success, message: result.message, tokensRevoked: result.tokensRevoked });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/blacklist-stats (admin only)
export const handleBlacklistStats: RequestHandler = async (req, res, next) => {
  try {
    const stats = await getTokenBlacklistStats();

    res.json({ ok: true, ...stats });
  } catch (err) {
    next(err);
  }
};