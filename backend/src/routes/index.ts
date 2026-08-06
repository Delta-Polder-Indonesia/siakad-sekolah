import { Router } from 'express';
import { healthRoute }       from './health.route.js';
import likesRoute            from './likes.route.js';
import { authRouter }        from '../modules/auth/auth.route.js';
import { schoolConfigRouter } from '../modules/school-config/school-config.route.js';

export const apiRouter = Router();

apiRouter.use('/health',        healthRoute);
apiRouter.use('/likes',         likesRoute);
apiRouter.use('/auth',          authRouter);
apiRouter.use('/school-config', schoolConfigRouter);