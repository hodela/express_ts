import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { logSuccess, logError, logWarning } from '../config/logger';

interface JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logWarning('Authentication failed - No token provided', { ip: req.ip });
      return res.status(401).json({
        message: 'No token provided',
        code: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      logError(
        new Error('JWT_SECRET is not defined'),
        'Auth Middleware - Authenticate'
      );
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      logWarning('Authentication failed - User not found', {
        userId: decoded.id,
      });
      return res.status(401).json({
        message: 'User not found',
        code: 'UNAUTHORIZED',
      });
    }

    req.user = user;
    logSuccess('User authenticated successfully', {
      userId: user.id,
      email: user.email,
    });
    next();
  } catch (error) {
    logError(error as Error, 'Auth Middleware - Authenticate');
    return res.status(401).json({
      message: 'Invalid token',
      code: 'UNAUTHORIZED',
    });
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        logWarning('Authorization failed - Not authenticated');
        return res.status(401).json({
          message: 'Not authenticated',
          code: 'UNAUTHORIZED',
        });
      }

      // Get user with role
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true },
      });

      if (!user || !roles.includes(user.role)) {
        logWarning('Authorization failed - Insufficient permissions', {
          userId: req.user.id,
          userRole: user?.role,
          requiredRoles: roles,
        });
        return res.status(403).json({
          message: 'Not authorized',
          code: 'FORBIDDEN',
        });
      }

      logSuccess('User authorized successfully', {
        userId: req.user.id,
        userRole: user.role,
        requiredRoles: roles,
      });
      next();
    } catch (error) {
      logError(error as Error, 'Auth Middleware - Authorize');
      return res.status(401).json({
        message: 'Authorization failed',
        code: 'UNAUTHORIZED',
      });
    }
  };
};
