import { Router } from 'express';
import { performanceMetrics } from '../utils/performance.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { logger } from '../config/logger.js';

export const metricsRouter = Router();

// GET /api/metrics — ringkasan performa (admin only)
metricsRouter.get('/', requireAuth, requireAdmin, (_req, res) => {
  const snapshot = performanceMetrics.getSnapshot();
  res.json({
    ok: true,
    data: snapshot,
  });
});

// GET /api/metrics/slow — daftar request lambat (admin only)
metricsRouter.get('/slow', requireAuth, requireAdmin, (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const slowRequests = performanceMetrics.getSlowRequests(Math.min(limit, 100));
  res.json({
    ok: true,
    data: slowRequests,
  });
});

// GET /api/metrics/health — status ringkas untuk monitoring tool (admin only)
metricsRouter.get('/health', requireAuth, requireAdmin, (_req, res) => {
  const snapshot = performanceMetrics.getSnapshot();
  const averageResponseTime = snapshot.averageResponseTime;
  const healthStatus = averageResponseTime < 1000
    ? 'healthy'
    : averageResponseTime < 3000
      ? 'degraded'
      : 'critical';

  res.json({
    ok: true,
    data: {
      status: healthStatus,
      totalRequests: snapshot.totalRequests,
      averageResponseTime: Number(averageResponseTime.toFixed(2)),
      slowRequestCount: snapshot.slowRequestCount,
      uptime: snapshot.uptime,
    },
  });
});

// POST /api/metrics/reset — reset semua metrik (admin only)
metricsRouter.post('/reset', requireAuth, requireAdmin, (_req, res) => {
  performanceMetrics.reset();
  logger.info('Performance metrics reset by admin');
  res.json({
    ok: true,
    message: 'Performance metrics berhasil di-reset.',
  });
});
