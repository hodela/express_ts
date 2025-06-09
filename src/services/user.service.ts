import { prisma } from '../config/database';
import { CustomError } from '../middlewares/error.middleware';
import { logSuccess, logError } from '../config/logger';
import bcrypt from 'bcryptjs';

interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string | null;
  theme?: string;
  language?: string;
}

export class UserService {
  static async findById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          theme: true,
          language: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      });

      if (!user) {
        const error: CustomError = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      logSuccess('User found successfully', { userId: id });
      return user;
    } catch (error) {
      logError(error as Error, 'User Service - Find By ID');
      throw error;
    }
  }

  static async findAll(options: FindAllOptions) {
    try {
      const { page, limit, search } = options;
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            theme: true,
            language: true,
            role: true,
            isVerified: true,
            createdAt: true,
            lastLoginAt: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      logSuccess('Users retrieved successfully', {
        page,
        limit,
        total,
        search: search || 'none',
      });

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logError(error as Error, 'User Service - Find All');
      throw error;
    }
  }

  static async updateById(id: string, data: UpdateUserData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          theme: true,
          language: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logSuccess('User updated successfully', {
        userId: id,
        updatedFields: Object.keys(data),
      });
      return user;
    } catch (error) {
      logError(error as Error, 'User Service - Update By ID');
      throw error;
    }
  }

  static async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        const error: CustomError = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify old password
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        const error: CustomError = new Error('Old password is incorrect');
        error.statusCode = 400;
        throw error;
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

      logSuccess('Password changed successfully', { userId: id });
      return { message: 'Password changed successfully' };
    } catch (error) {
      logError(error as Error, 'User Service - Change Password');
      throw error;
    }
  }

  static async deleteById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        const error: CustomError = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      await prisma.user.delete({
        where: { id },
      });

      logSuccess('User deleted successfully', { userId: id });
      return { message: 'User deleted successfully' };
    } catch (error) {
      logError(error as Error, 'User Service - Delete By ID');
      throw error;
    }
  }

  static async verifyPassword(id: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          password: true,
        },
      });

      if (!user) {
        const error: CustomError = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        const error: CustomError = new Error('Password is incorrect');
        error.statusCode = 400;
        throw error;
      }

      logSuccess('Password verified successfully', { userId: id });
      return true;
    } catch (error) {
      logError(error as Error, 'User Service - Verify Password');
      throw error;
    }
  }
}
