import winston from 'winston';

const { combine, timestamp, errors, json, simple, colorize } = winston.format;

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    isDevelopment ? simple() : json()
  ),
  transports: [
    new winston.transports.Console({
      format: isDevelopment ? combine(colorize(), simple()) : json(),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: json(),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: json(),
    }),
  ],
});

// Create logs directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export { logger }; 