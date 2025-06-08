import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';

export class AuthService {
  static async generateTokens(userId: string, email: string) {
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

    return {
      accessToken,
      refreshToken,
      expiresIn: 14400, // 4 hours in seconds
      tokenType: 'Bearer',
    };
  }

  static verifyToken(token: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static async validateRefreshToken(token: string) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken;
  }

  static async revokeRefreshToken(token: string) {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
