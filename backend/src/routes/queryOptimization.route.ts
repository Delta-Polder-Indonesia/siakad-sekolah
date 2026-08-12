import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { QueryOptimizationService } from '../services/queryOptimization.service.js';
import { logger } from '../config/logger.js';

export const queryOptimizationRouter = Router();

/**
 * Get query performance analysis (Admin only)
 */
queryOptimizationRouter.get('/analyze', requireAuth, requireAdmin, async (_req, res) => {
  try {
    logger.info('Query performance analysis requested by admin');
    const analysis = await QueryOptimizationService.analyzeQueryPerformance();
    
    res.json({
      ok: true,
      analysis,
    });
  } catch (error) {
    logger.error('Query performance analysis failed', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Query performance analysis failed',
      error: (error as Error).message,
    });
  }
});

/**
 * Enable query statistics tracking (Admin only)
 */
queryOptimizationRouter.post('/enable-statistics', requireAuth, requireAdmin, async (_req, res) => {
  try {
    logger.info('Enabling query statistics tracking');
    const result = await QueryOptimizationService.enableQueryStatistics();
    
    res.json({
      ok: true,
      message: result ? 'Query statistics enabled successfully' : 'Query statistics already enabled',
      enabled: result,
    });
  } catch (error) {
    logger.error('Failed to enable query statistics', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to enable query statistics',
      error: (error as Error).message,
    });
  }
});

/**
 * Get execution plan for specific query (Admin only)
 */
queryOptimizationRouter.post('/explain', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        ok: false,
        message: 'Query is required',
      });
    }
    
    logger.info('Query execution plan requested');
    const analysis = await QueryOptimizationService.optimizeQuery(query);
    
    res.json({
      ok: true,
      analysis,
    });
  } catch (error) {
    logger.error('Query execution plan failed', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Query execution plan failed',
      error: (error as Error).message,
    });
  }
});

/**
 * Get slow queries (Admin only)
 */
queryOptimizationRouter.get('/slow-queries', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const slowQueries = await QueryOptimizationService.identifySlowQueries();
    
    res.json({
      ok: true,
      slowQueries,
      count: slowQueries.length,
    });
  } catch (error) {
    logger.error('Failed to get slow queries', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to get slow queries',
      error: (error as Error).message,
    });
  }
});

/**
 * Get missing indexes recommendations (Admin only)
 */
queryOptimizationRouter.get('/missing-indexes', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const missingIndexes = await QueryOptimizationService.identifyMissingIndexes();
    
    res.json({
      ok: true,
      missingIndexes,
      count: missingIndexes.length,
    });
  } catch (error) {
    logger.error('Failed to get missing indexes', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to get missing indexes',
      error: (error as Error).message,
    });
  }
});

/**
 * Get unused indexes (Admin only)
 */
queryOptimizationRouter.get('/unused-indexes', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const unusedIndexes = await QueryOptimizationService.identifyUnusedIndexes();
    
    res.json({
      ok: true,
      unusedIndexes,
      count: unusedIndexes.length,
    });
  } catch (error) {
    logger.error('Failed to get unused indexes', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to get unused indexes',
      error: (error as Error).message,
    });
  }
});

/**
 * Get table sizes (Admin only)
 */
queryOptimizationRouter.get('/table-sizes', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const tableSizes = await QueryOptimizationService.analyzeTableSizes();
    
    res.json({
      ok: true,
      tableSizes,
    });
  } catch (error) {
    logger.error('Failed to get table sizes', { error: (error as Error).message });
    res.status(500).json({
      ok: false,
      message: 'Failed to get table sizes',
      error: (error as Error).message,
    });
  }
});