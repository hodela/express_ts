import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

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
      return res.status(401).json({
        message: 'No token provided',
        code: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
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
      return res.status(401).json({
        message: 'User not found',
        code: 'UNAUTHORIZED',
      });
    }

    req.user = user;
    next();
  } catch (error) {
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
        return res.status(403).json({
          message: 'Not authorized',
          code: 'FORBIDDEN',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Authorization failed',
        code: 'UNAUTHORIZED',
      });
    }
  };
};
