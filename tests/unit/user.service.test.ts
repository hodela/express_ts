import { UserService } from '../../src/services/user.service';
import bcrypt from 'bcryptjs';

// Mock Prisma client
jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcryptjs');

const { prisma } = require('../../src/config/database');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        avatar: null,
        theme: 'light',
        language: 'en',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await UserService.findById('test-user-id');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
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
    });

    it('should throw error when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(UserService.findById('non-existent-id')).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users without search', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          avatar: null,
          theme: 'light',
          language: 'en',
          role: 'USER',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(10);

      const result = await UserService.findAll({
        page: 1,
        limit: 5,
      });

      expect(result).toEqual({
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 5,
          total: 10,
          pages: 2,
        },
      });

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
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
        skip: 0,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return paginated users with search', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: null,
          theme: 'light',
          language: 'en',
          role: 'USER',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(1);

      const result = await UserService.findAll({
        page: 1,
        limit: 5,
        search: 'john',
      });

      expect(result.users).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'john', mode: 'insensitive' } },
            { email: { contains: 'john', mode: 'insensitive' } },
          ],
        },
        select: expect.any(Object),
        skip: 0,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateById', () => {
    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        id: 'test-user-id',
        name: 'Updated User',
        email: 'updated@example.com',
        avatar: null,
        theme: 'dark',
        language: 'vi',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.update.mockResolvedValue(mockUpdatedUser);

      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
        theme: 'dark',
        language: 'vi',
      };

      const result = await UserService.updateById('test-user-id', updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
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
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        password: 'hashed-old-password',
        email: 'test@example.com',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-password');
      prisma.user.update.mockResolvedValue({});

      const result = await UserService.changePassword(
        'test-user-id',
        'old-password',
        'new-password'
      );

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'old-password',
        'hashed-old-password'
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 12);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: {
          password: 'hashed-new-password',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw error when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        UserService.changePassword(
          'non-existent-id',
          'old-password',
          'new-password'
        )
      ).rejects.toThrow('User not found');
    });

    it('should throw error when old password is incorrect', async () => {
      const mockUser = {
        id: 'test-user-id',
        password: 'hashed-old-password',
        email: 'test@example.com',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        UserService.changePassword(
          'test-user-id',
          'wrong-password',
          'new-password'
        )
      ).rejects.toThrow('Old password is incorrect');
    });
  });

  describe('deleteById', () => {
    it('should delete user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.delete.mockResolvedValue({});

      const result = await UserService.deleteById('test-user-id');

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
      });
    });

    it('should throw error when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(UserService.deleteById('non-existent-id')).rejects.toThrow(
        'User not found'
      );
    });
  });
});
