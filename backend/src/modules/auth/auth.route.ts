import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  handleLogin, 
  handleGoogleLogin, 
  handleAdminLogin, 
  handleRefresh,
  handleValidatePassword,
  handleChangeTeacherPassword,
  handleChangeStudentPassword,
  handleLogout,
  handleLogoutAllDevices,
  handleBlacklistStats
} from './auth.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak percobaan login. Coba lagi 15 menit.' },
});

const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak percobaan ganti password. Coba lagi dalam 1 jam.' },
});

const logoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak percobaan logout. Coba lagi dalam 1 jam.' },
});

authRouter.post('/login',                  loginLimiter, handleLogin);
authRouter.post('/google',                 handleGoogleLogin);
authRouter.post('/refresh',                handleRefresh);
authRouter.post('/admin/login',            loginLimiter, handleAdminLogin);
authRouter.post('/admin/refresh',          handleRefresh);
authRouter.post('/validate-password',      handleValidatePassword);
authRouter.post('/change-password/teacher', passwordChangeLimiter, handleChangeTeacherPassword);
authRouter.post('/change-password/student', passwordChangeLimiter, handleChangeStudentPassword);
authRouter.post('/logout',                 logoutLimiter, requireAuth, handleLogout);
authRouter.post('/logout-all',             logoutLimiter, requireAuth, handleLogoutAllDevices);
authRouter.get('/blacklist-stats',          requireAuth, requireAdmin, handleBlacklistStats);