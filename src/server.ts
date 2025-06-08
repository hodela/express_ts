import app from './app';
import { connectDB } from './config/database';
import { logError, logSuccess } from './config/logger';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    logSuccess('Database connected successfully');

    // Connect to Redis
    await connectRedis();
    logSuccess('Redis connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      logSuccess(`Server running on port ${PORT}`);
      logSuccess(`API Documentation: http://localhost:${PORT}/api-docs`);
      logSuccess(`Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logSuccess(`${signal} received, shutting down gracefully...`);
      server.close(() => {
        logSuccess('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logError(error as Error, 'Server Startup');
    process.exit(1);
  }
};

startServer();
