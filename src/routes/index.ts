import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import { generalLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// API Info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Express TypeScript API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

export default router;
