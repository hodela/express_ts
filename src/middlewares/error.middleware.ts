import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  // Log error
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Prisma errors
  if (error.message.includes('Unique constraint failed')) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dữ liệu không hợp lệ';
  }

  // Default error response format
  const response: any = {
    message,
    code: 'INTERNAL_SERVER_ERROR',
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
