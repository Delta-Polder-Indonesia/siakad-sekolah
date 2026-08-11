import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { logger, checkLogAggregationHealth } from '../config/logger.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export const healthRouter = Router();

// Basic health check
healthRouter.get('/', async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    });
  } catch (error) {
    logger.error('Health check failed', { error: (error as Error).message });
    res.status(503).json({
      ok: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        error: (error as Error).message,
      },
    });
  }
});

// Detailed health check — dibatasi admin (membocorkan info sistem/DB).
healthRouter.get('/detailed', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const dbCheck = await checkDatabase();
    const memoryInfo = getMemoryInfo();
    const systemInfo = getSystemInfo();

    const healthStatus = {
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbCheck,
        memory: memoryInfo,
        system: systemInfo,
      },
    };

    // Determine overall health status
    const isHealthy = dbCheck.status === 'connected';
    healthStatus.status = isHealthy ? 'healthy' : 'degraded';
    healthStatus.ok = isHealthy;

    if (!isHealthy) {
      res.status(503);
    }

    res.json(healthStatus);
  } catch (error) {
    logger.error('Detailed health check failed', { error: (error as Error).message });
    res.status(503).json({
      ok: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
    });
  }
});

// Database health check — dibatasi admin (menampilkan statistik DB).
healthRouter.get('/database', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const dbCheck = await checkDatabase();
    res.json(dbCheck);
  } catch (error) {
    logger.error('Database health check failed', { error: (error as Error).message });
    res.status(503).json({
      status: 'disconnected',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Memory health check — dibatasi admin (info memori proses).
healthRouter.get('/memory', requireAuth, requireAdmin, (_req, res) => {
  try {
    const memoryInfo = getMemoryInfo();
    res.json(memoryInfo);
  } catch (error) {
    logger.error('Memory health check failed', { error: (error as Error).message });
    res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Log aggregation health check — dibatasi admin.
healthRouter.get('/log-aggregation', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const logAggHealth = await checkLogAggregationHealth();
    res.json(logAggHealth);
  } catch (error) {
    logger.error('Log aggregation health check failed', { error: (error as Error).message });
    res.status(500).json({
      status: 'error',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    });
  }
});

async function checkDatabase() {
  const startTime = Date.now();
  
  try {
    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    // Get database stats
    const [teacherCount, studentCount, classCount] = await Promise.all([
      prisma.teacher.count(),
      prisma.student.count(),
      prisma.classRoom.count(),
    ]);

    return {
      status: 'connected',
      responseTime: `${responseTime}ms`,
      stats: {
        teachers: teacherCount,
        students: studentCount,
        classes: classCount,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'disconnected',
      error: (error as Error).message,
      responseTime: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    };
  }
}

function getMemoryInfo() {
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  const freeMemory = totalMemory - usedMemory;
  const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

  return {
    heapUsed: `${(usedMemory / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(totalMemory / 1024 / 1024).toFixed(2)} MB`,
    heapFree: `${(freeMemory / 1024 / 1024).toFixed(2)} MB`,
    memoryUsagePercent: `${memoryUsagePercent}%`,
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    timestamp: new Date().toISOString(),
  };
}

function getSystemInfo() {
  return {
    uptime: `${process.uptime().toFixed(2)}s`,
    platform: process.platform,
    nodeVersion: process.version,
    architecture: process.arch,
    cpuUsage: process.cpuUsage(),
    timestamp: new Date().toISOString(),
  };
}


