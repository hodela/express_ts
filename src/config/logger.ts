import pino from 'pino';
import fs from 'fs';

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat: '{msg}',
        },
      }
    : undefined,
});

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Helper functions để log với format đẹp
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  responseTime?: number
) => {
  const emoji = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';
  const timeInfo = responseTime ? ` (${responseTime}ms)` : '';
  logger.info(`${emoji} ${method} ${url} ${statusCode}${timeInfo}`);
};

export const logError = (error: Error, context?: string) => {
  const message = context ? `[${context}] ${error.message}` : error.message;
  logger.error({ err: error }, message);
};

export const logSuccess = (message: string, data?: any) => {
  if (data) {
    logger.info({ data }, `✅ ${message}`);
  } else {
    logger.info(`✅ ${message}`);
  }
};

export const logWarning = (message: string, data?: any) => {
  if (data) {
    logger.warn({ data }, `⚠️ ${message}`);
  } else {
    logger.warn(`⚠️ ${message}`);
  }
};

export const logDebug = (message: string, data?: any) => {
  if (data) {
    logger.debug({ data }, `🐛 ${message}`);
  } else {
    logger.debug(`🐛 ${message}`);
  }
};

export { logger };
