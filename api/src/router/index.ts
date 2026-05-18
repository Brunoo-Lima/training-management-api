import { Router, type IRouter } from 'express';
import { userRoutes } from './user';
import { bookRoutes } from './book';
import { authRoutes } from './auth';
import { readingLogRoutes } from './reading-log';
import { goalRoutes } from './goal';

const routes: IRouter = Router();

routes.use('/api/users', userRoutes);
routes.use('/api/books', bookRoutes);
routes.use('/api/auth', authRoutes);
routes.use('/api/reading-logs', readingLogRoutes);
routes.use('/api/goals', goalRoutes);

export { routes };
