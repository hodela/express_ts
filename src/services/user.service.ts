import { prisma } from '../config/database';
import { CustomError } from '../middlewares/error.middleware';
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

    return user;
  }

  static async findAll(options: FindAllOptions) {
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
          createdAt: true,
          lastLoginAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async updateById(id: string, data: UpdateUserData) {
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
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ) {
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

    return { message: 'Password changed successfully' };
  }

  static async deleteById(id: string) {
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

    return { message: 'User deleted successfully' };
  }
}
