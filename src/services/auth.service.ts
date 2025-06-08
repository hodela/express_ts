import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { logSuccess, logError } from '../config/logger';

export class AuthService {
  static async generateTokens(userId: string, email: string) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      // Verify user exists before creating tokens
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const payload = { id: userId, email };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '4h', // 14400 seconds
      });

      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      // Store refresh token in database
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId,
          expiresAt,
        },
      });

      logSuccess('Tokens generated successfully', { userId, email });

      return {
        accessToken,
        refreshToken,
        expiresIn: 14400, // 4 hours in seconds
        tokenType: 'Bearer',
      };
    } catch (error) {
      logError(error as Error, 'Auth Service - Generate Tokens');
      throw error;
    }
  }

  static verifyToken(token: string) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logSuccess('Token verified successfully');
      return decoded;
    } catch (error) {
      logError(error as Error, 'Auth Service - Verify Token');
      throw error;
    }
  }

  static async validateRefreshToken(token: string) {
    try {
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!refreshToken || refreshToken.expiresAt < new Date()) {
        logSuccess(
          'Refresh token validation failed - token not found or expired'
        );
        return null;
      }

      logSuccess('Refresh token validated successfully', {
        userId: refreshToken.userId,
      });
      return refreshToken;
    } catch (error) {
      logError(error as Error, 'Auth Service - Validate Refresh Token');
      throw error;
    }
  }

  static async revokeRefreshToken(token: string) {
    try {
      await prisma.refreshToken.delete({
        where: { token },
      });

      logSuccess('Refresh token revoked successfully');
    } catch (error) {
      logError(error as Error, 'Auth Service - Revoke Refresh Token');
      throw error;
    }
  }

  static generateResetToken(): string {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      logSuccess('Reset token generated successfully');
      return token;
    } catch (error) {
      logError(error as Error, 'Auth Service - Generate Reset Token');
      throw error;
    }
  }

  static generateVerificationToken(): string {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      logSuccess('Verification token generated successfully');
      return token;
    } catch (error) {
      logError(error as Error, 'Auth Service - Generate Verification Token');
      throw error;
    }
  }
}
