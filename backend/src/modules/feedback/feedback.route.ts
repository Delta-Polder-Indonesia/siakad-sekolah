import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import {
  handleListFeedback,
  handleFeedbackStats,
  handleCreateFeedback,
  handleUpdateFeedbackStatus,
  handleToggleLike,
  handleDeleteFeedback,
} from './feedback.controller.js';

export const feedbackRouter = Router();

// Batasi pengiriman feedback & like agar tidak mudah di-spam (endpoint publik).
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak feedback dikirim. Coba lagi dalam 1 jam.' },
});

const likeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: 'Terlalu banyak aksi like. Coba lagi dalam 1 jam.' },
});

// Publik — siapapun boleh membaca & mengirim feedback
feedbackRouter.get('/', handleListFeedback);
feedbackRouter.get('/stats', handleFeedbackStats);
feedbackRouter.post('/', createLimiter, handleCreateFeedback);

// Like/unlike (publik — userId dikirim dari body)
feedbackRouter.post('/:id/like', likeLimiter, handleToggleLike);

// Hanya admin yang boleh ubah status / hapus
feedbackRouter.patch('/:id', requireAuth, requireAdmin, handleUpdateFeedbackStatus);
feedbackRouter.delete('/:id', requireAuth, requireAdmin, handleDeleteFeedback);
