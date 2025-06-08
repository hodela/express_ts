import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../config/logger';

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Override res.end để log response
  const originalEnd = res.end.bind(res);

  res.end = function (
    chunk?: any,
    encoding?: BufferEncoding | (() => void),
    cb?: () => void
  ): Response {
    const responseTime = Date.now() - startTime;

    // Log request với thông tin đầy đủ
    logRequest(req.method, req.originalUrl, res.statusCode, responseTime);

    // Gọi originalEnd với proper arguments
    if (typeof encoding === 'function') {
      // encoding is actually the callback
      return originalEnd(chunk, encoding);
    } else if (encoding && cb) {
      // Both encoding and callback provided
      return originalEnd(chunk, encoding, cb);
    } else if (encoding) {
      // Only encoding provided
      return originalEnd(chunk, encoding);
    } else {
      // Only chunk provided
      return originalEnd(chunk);
    }
  };

  next();
};
