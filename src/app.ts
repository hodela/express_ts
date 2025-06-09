import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { uploadConfig } from './config/upload.config';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { loggingMiddleware } from './middlewares/logging.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import routes from './routes';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Custom logging middleware (thay thế morgan)
app.use(loggingMiddleware);

// Static file serving cho uploaded files
app.use(
  uploadConfig.urlPrefix || '/uploads',
  express.static(path.resolve(uploadConfig.uploadPath || 'src/assets/upload'))
);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handling
app.use(errorHandler);

export default app;
