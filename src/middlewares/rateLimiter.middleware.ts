import rateLimit from 'express-rate-limit';
import { logWarning } from '../config/logger';

// Skip rate limiting in test environment
const skipRateLimit = process.env.NODE_ENV === 'test';

// General rate limiter
export const generalLimiter = rateLimit({
  skip: () => skipRateLimit,
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logWarning(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  skip: () => skipRateLimit,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for auth endpoints
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logWarning(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many authentication attempts, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    });
  },
});
