import { Router } from 'express';
import os from 'node:os';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { performanceMetrics } from '../utils/performance.js';

export const systemRouter = Router();

// GET /api/system/info — informasi runtime & server (admin only)
systemRouter.get('/info', requireAuth, requireAdmin, (_req, res) => {
  const cpus = os.cpus();
  const cpuLoad = process.cpuUsage();

  res.json({
    ok: true,
    data: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      hostname: os.hostname(),
      cpuCount: cpus.length,
      cpuModel: cpus[0]?.model ?? 'unknown',
      cpuLoadPercent: cpuLoad.user + cpuLoad.system,
      uptimeSeconds: Math.round(process.uptime()),
      pid: process.pid,
    },
  });
});

// GET /api/system/status — ringkasan kesehatan layanan (admin only)
systemRouter.get('/status', requireAuth, requireAdmin, (_req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memoryUsage = process.memoryUsage();

  res.json({
    ok: true,
    data: {
      memory: {
        totalMB: Math.round(totalMem / 1024 / 1024),
        freeMB: Math.round(freeMem / 1024 / 1024),
        usedMB: Math.round(usedMem / 1024 / 1024),
        usagePercent: Number(((usedMem / totalMem) * 100).toFixed(2)),
      },
      processMemoryMB: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      loadAverage: os.loadavg(),
    },
  });
});

// GET /api/system/stats — statistik performa aplikasi (admin only)
systemRouter.get('/stats', requireAuth, requireAdmin, (_req, res) => {
  const snapshot = performanceMetrics.getSnapshot();

  res.json({
    ok: true,
    data: {
      uptimeSeconds: snapshot.uptime,
      totalRequests: snapshot.totalRequests,
      totalErrors: snapshot.totalErrors,
      slowRequestCount: snapshot.slowRequestCount,
      averageResponseTimeMs: Number(snapshot.averageResponseTime.toFixed(2)),
      slowThresholdMs: snapshot.slowThresholdMs,
    },
  });
});
