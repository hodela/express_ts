import { AuthService } from '../../src/services/auth.service';

// Mock Prisma client
jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Import after mocking
const { prisma } = require('../../src/config/database');

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key-for-testing-auth-service';

describe('AuthService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Ensure JWT_SECRET is set
    process.env.JWT_SECRET = 'test-secret-key-for-testing-auth-service';

    // Default mock for refreshToken.create
    (prisma.refreshToken.create as jest.Mock).mockResolvedValue({
      id: 'test-refresh-token-id',
      token: 'test-refresh-token',
      userId: 'test-user-id',
      expiresAt: new Date(),
      createdAt: new Date(),
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const userId = 'test-user-id';
      const email = 'test@example.com';

      // Mock user exists - khớp với schema Prisma
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email: email,
        name: 'Test User',
        password: 'hashedPassword',
        avatar: null,
        theme: 'light',
        language: 'en',
        role: 'user',
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const tokens = await AuthService.generateTokens(userId, email);

      expect(tokens).toBeDefined();
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens).toHaveProperty('expiresIn', 14400);
      expect(tokens).toHaveProperty('tokenType', 'Bearer');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it('should throw error if user not found', async () => {
      // Mock user not found
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.generateTokens('non-existent-user-id', 'test@example.com')
      ).rejects.toThrow('User not found');
    });

    it('should throw error if JWT_SECRET is not defined', async () => {
      delete process.env.JWT_SECRET;

      await expect(
        AuthService.generateTokens('user-id', 'test@example.com')
      ).rejects.toThrow('JWT_SECRET is not defined');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const userId = 'test-user-id';
      const email = 'test@example.com';

      // Mock user exists for token generation - khớp với schema Prisma
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email: email,
        name: 'Test User',
        password: 'hashedPassword',
        avatar: null,
        theme: 'light',
        language: 'en',
        role: 'user',
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { accessToken } = await AuthService.generateTokens(userId, email);
      const decoded = AuthService.verifyToken(accessToken) as any;

      expect(decoded).toBeDefined();
      expect(decoded).toHaveProperty('id', userId);
      expect(decoded).toHaveProperty('email', email);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        AuthService.verifyToken('invalid-token');
      }).toThrow();
    });

    it('should throw error if JWT_SECRET is not defined', () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        AuthService.verifyToken('some-token');
      }).toThrow('JWT_SECRET is not defined');
    });
  });

  describe('generateResetToken', () => {
    it('should generate a reset token', () => {
      const token = AuthService.generateResetToken();

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('generateVerificationToken', () => {
    it('should generate a verification token', () => {
      const token = AuthService.generateVerificationToken();

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return refresh token data for valid token', async () => {
      const mockRefreshToken = {
        id: 'test-refresh-token-id',
        token: 'valid-refresh-token',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        createdAt: new Date(),
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedPassword',
          avatar: null,
          theme: 'light',
          language: 'en',
          role: 'user',
          isVerified: true,
          verificationToken: null,
          verificationTokenExpiresAt: null,
          resetPasswordToken: null,
          resetPasswordTokenExpiresAt: null,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockRefreshToken
      );

      const result = await AuthService.validateRefreshToken(
        'valid-refresh-token'
      );

      expect(result).toEqual(mockRefreshToken);
    });

    it('should return null for expired token', async () => {
      const mockExpiredToken = {
        id: 'test-refresh-token-id',
        token: 'expired-refresh-token',
        userId: 'test-user-id',
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(),
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(
        mockExpiredToken
      );

      const result = await AuthService.validateRefreshToken(
        'expired-refresh-token'
      );

      expect(result).toBeNull();
    });

    it('should return null for non-existent token', async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

      const result =
        await AuthService.validateRefreshToken('non-existent-token');

      expect(result).toBeNull();
    });
  });

  describe('revokeRefreshToken', () => {
    it('should delete refresh token from database', async () => {
      (prisma.refreshToken.delete as jest.Mock).mockResolvedValue({});

      await AuthService.revokeRefreshToken('token-to-revoke');

      expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { token: 'token-to-revoke' },
      });
    });
  });
});
