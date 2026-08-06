import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { handleLogin, handleGoogleLogin, handleAdminLogin, handleRefresh } from './auth.controller.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak percobaan login. Coba lagi 15 menit.' },
});

authRouter.post('/login',         loginLimiter, handleLogin);
authRouter.post('/google',        handleGoogleLogin);
authRouter.post('/refresh',       handleRefresh);
authRouter.post('/admin/login',   loginLimiter, handleAdminLogin);
authRouter.post('/admin/refresh', handleRefresh);