import { Router } from 'express';
import { healthRouter }     from './health.route.js';
import { likesRouter }      from './likes.route.js';
import { authRouter }       from '../modules/auth/auth.route.js';
import { schoolConfigRouter } from '../modules/school-config/school-config.route.js';
import { backupRouter }     from '../modules/backup/backup.route.js';
import { metricsRouter }    from './metrics.route.js';
import { systemRouter }     from './system.route.js';
import { dataRetentionRouter } from './dataRetention.route.js';
import { queryOptimizationRouter } from './queryOptimization.route.js';

export const apiRouter = Router();

apiRouter.use('/health',        healthRouter);
apiRouter.use('/likes',         likesRouter);
apiRouter.use('/auth',          authRouter);
apiRouter.use('/school-config', schoolConfigRouter);
apiRouter.use('/backup',        backupRouter);
apiRouter.use('/metrics',       metricsRouter);
apiRouter.use('/system',        systemRouter);
apiRouter.use('/data-retention', dataRetentionRouter);
apiRouter.use('/query-optimization', queryOptimizationRouter);