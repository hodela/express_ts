import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { CustomError } from '../middlewares/error.middleware';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { logSuccess, logError, logWarning } from '../config/logger';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      logError(
        new Error('Password confirmation mismatch'),
        'Auth Controller - Register'
      );
      return res.status(400).json({
        message: 'Đăng ký thất bại',
        code: 'REGISTER_FAILED',
        details: {
          confirmPassword: ['Mật khẩu xác nhận không khớp'],
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logWarning('Registration failed - Email already exists', { email });
      return res.status(400).json({
        message: 'Đăng ký thất bại',
        code: 'REGISTER_FAILED',
        details: {
          email: ['Email đã tồn tại'],
        },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = AuthService.generateVerificationToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        theme: true,
        language: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Send verification email (if email service is configured)
    try {
      await EmailService.sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      logError(
        emailError as Error,
        'Auth Controller - Register - Email Service'
      );
    }

    logSuccess('User registered successfully', {
      userId: user.id,
      email: user.email,
    });
    res.status(201).json({
      user,
      message: 'Đăng ký thành công',
      requiresVerification: true,
    });
  } catch (error) {
    logError(error as Error, 'Auth Controller - Register');
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logWarning('Login failed - User not found', { email });
      return res.status(401).json({
        message: 'Đăng nhập thất bại',
        code: 'LOGIN_FAILED',
        details: {
          email: ['Email hoặc mật khẩu không đúng'],
        },
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logWarning('Login failed - Invalid password', { email, userId: user.id });
      return res.status(401).json({
        message: 'Đăng nhập thất bại',
        code: 'LOGIN_FAILED',
        details: {
          email: ['Email hoặc mật khẩu không đúng'],
        },
      });
    }

    // Generate tokens
    const tokens = await AuthService.generateTokens(user.id, user.email);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logSuccess('User logged in successfully', {
      userId: user.id,
      email: user.email,
    });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        theme: user.theme,
        language: user.language,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ...tokens,
    });
  } catch (error) {
    logError(error as Error, 'Auth Controller - Login');
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      logError(
        new Error('Refresh token not provided'),
        'Auth Controller - Refresh Token'
      );
      return res.status(401).json({
        message: 'Không thể làm mới token',
        code: 'REFRESH_TOKEN_FAILED',
        details: {
          refreshToken: ['Refresh token không được để trống'],
        },
      });
    }

    // Validate refresh token
    const refreshTokenData = await AuthService.validateRefreshToken(token);
    if (!refreshTokenData) {
      logWarning('Refresh token validation failed', {
        token: token.substring(0, 10) + '...',
      });
      return res.status(401).json({
        message: 'Không thể làm mới token',
        code: 'REFRESH_TOKEN_FAILED',
        details: {
          refreshToken: ['Refresh token không hợp lệ hoặc đã hết hạn'],
        },
      });
    }

    // Revoke old refresh token
    await AuthService.revokeRefreshToken(token);

    // Generate new tokens
    const tokens = await AuthService.generateTokens(
      refreshTokenData.user.id,
      refreshTokenData.user.email
    );

    logSuccess('Token refreshed successfully', {
      userId: refreshTokenData.user.id,
    });
    res.json(tokens);
  } catch (error) {
    logError(error as Error, 'Auth Controller - Refresh Token');
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      try {
        await AuthService.revokeRefreshToken(token);
        logSuccess('Refresh token revoked during logout');
      } catch (error) {
        // Token might not exist, which is fine
        logWarning(
          'Failed to revoke refresh token during logout - token might not exist'
        );
      }
    }

    logSuccess('User logged out successfully', { userId: req.user?.id });
    res.json({
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    logError(error as Error, 'Auth Controller - Logout');
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logWarning('Forgot password failed - Email not found', { email });
      return res.status(400).json({
        message: 'Gửi email khôi phục thất bại',
        code: 'FORGOT_PASSWORD_FAILED',
        details: {
          email: ['Email không tồn tại trong hệ thống'],
        },
      });
    }

    // Generate reset token
    const resetToken = AuthService.generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiresAt: resetTokenExpiry,
      },
    });

    // Send email (if email service is configured)
    try {
      await EmailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      logError(
        emailError as Error,
        'Auth Controller - Forgot Password - Email Service'
      );
    }

    logSuccess('Password reset email sent successfully', {
      userId: user.id,
      email,
    });
    res.json({
      message: 'Email khôi phục mật khẩu đã được gửi',
    });
  } catch (error) {
    logError(error as Error, 'Auth Controller - Forgot Password');
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      logError(
        new Error('Password confirmation mismatch'),
        'Auth Controller - Reset Password'
      );
      return res.status(400).json({
        message: 'Đặt lại mật khẩu thất bại',
        code: 'RESET_PASSWORD_FAILED',
        details: {
          confirmPassword: ['Mật khẩu xác nhận không khớp'],
        },
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      logWarning('Reset password failed - Invalid or expired token', {
        token: token.substring(0, 10) + '...',
      });
      return res.status(400).json({
        message: 'Đặt lại mật khẩu thất bại',
        code: 'RESET_PASSWORD_FAILED',
        details: {
          token: ['Token không hợp lệ hoặc đã hết hạn'],
        },
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      },
    });

    logSuccess('Password reset successfully', { userId: user.id });
    res.json({
      message: 'Đặt lại mật khẩu thành công',
    });
  } catch (error) {
    logError(error as Error, 'Auth Controller - Reset Password');
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      logWarning('Email verification failed - Invalid or expired token', {
        token: token.substring(0, 10) + '...',
      });
      return res.status(400).json({
        message: 'Xác thực email thất bại',
        code: 'VERIFY_EMAIL_FAILED',
        details: {
          token: ['Token không hợp lệ hoặc đã hết hạn'],
        },
      });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    logSuccess('Email verified successfully', {
      userId: user.id,
      email: user.email,
    });
    res.json({
      message: 'Xác thực email thành công',
    });
  } catch (error) {
    logError(error as Error, 'Auth Controller - Verify Email');
    next(error);
  }
};
