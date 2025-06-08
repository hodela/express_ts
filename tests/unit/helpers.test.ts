import {
  generateRandomString,
  generateRandomNumber,
  isValidEmail,
  isValidPassword,
  sanitizeUser,
  formatResponse,
  calculatePagination,
  sleep,
  getClientIp,
  maskEmail,
} from '../../src/utils/helpers';

describe('Helpers', () => {
  describe('generateRandomString', () => {
    it('should generate random string with default length 32', () => {
      const result = generateRandomString();
      expect(typeof result).toBe('string');
      expect(result.length).toBe(64); // hex string is 2x the byte length
    });

    it('should generate random string with custom length', () => {
      const result = generateRandomString(16);
      expect(typeof result).toBe('string');
      expect(result.length).toBe(32); // hex string is 2x the byte length
    });

    it('should generate different strings on multiple calls', () => {
      const result1 = generateRandomString();
      const result2 = generateRandomString();
      expect(result1).not.toBe(result2);
    });
  });

  describe('generateRandomNumber', () => {
    it('should generate number within default range', () => {
      const result = generateRandomNumber();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(100000);
      expect(result).toBeLessThanOrEqual(999999);
    });

    it('should generate number within custom range', () => {
      const result = generateRandomNumber(1, 10);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('should generate different numbers on multiple calls', () => {
      const results = Array.from({ length: 10 }, () =>
        generateRandomNumber(1, 1000)
      );
      const unique = [...new Set(results)];
      expect(unique.length).toBeGreaterThan(5); // Expect some variation
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test123@test-domain.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('test.domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('Test123')).toBe(true);
      expect(isValidPassword('myP@ssw0rd')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(isValidPassword('short')).toBe(false); // Too short
      expect(isValidPassword('password')).toBe(false); // No numbers
      expect(isValidPassword('123456')).toBe(false); // No letters
      expect(isValidPassword('')).toBe(false); // Empty
    });
  });

  describe('sanitizeUser', () => {
    it('should remove sensitive fields from user object', () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        resetToken: 'reset123',
        resetTokenExpiry: new Date(),
        role: 'USER',
      };

      const result = sanitizeUser(user);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      });
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('resetToken');
      expect(result).not.toHaveProperty('resetTokenExpiry');
    });

    it('should handle user object without sensitive fields', () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = sanitizeUser(user);
      expect(result).toEqual(user);
    });
  });

  describe('formatResponse', () => {
    it('should format successful response with data', () => {
      const result = formatResponse(true, { id: '123' }, 'Success');
      expect(result).toEqual({
        success: true,
        data: { id: '123' },
        message: 'Success',
      });
    });

    it('should format error response', () => {
      const result = formatResponse(
        false,
        undefined,
        undefined,
        'Error message'
      );
      expect(result).toEqual({
        success: false,
        error: 'Error message',
      });
    });

    it('should format minimal response', () => {
      const result = formatResponse(true);
      expect(result).toEqual({
        success: true,
      });
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination for first page', () => {
      const result = calculatePagination(1, 10, 100);
      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: false,
        nextPage: 2,
        prevPage: null,
      });
    });

    it('should calculate pagination for middle page', () => {
      const result = calculatePagination(5, 10, 100);
      expect(result).toEqual({
        page: 5,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: true,
        nextPage: 6,
        prevPage: 4,
      });
    });

    it('should calculate pagination for last page', () => {
      const result = calculatePagination(10, 10, 100);
      expect(result).toEqual({
        page: 10,
        limit: 10,
        total: 100,
        totalPages: 10,
        hasNextPage: false,
        hasPrevPage: true,
        nextPage: null,
        prevPage: 9,
      });
    });
  });

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      jest.useRealTimers(); // Use real timers for this test
      const start = Date.now();
      await sleep(50); // Reduce time for faster test
      const end = Date.now();
      const elapsed = end - start;
      expect(elapsed).toBeGreaterThanOrEqual(40); // Allow some tolerance
      jest.useFakeTimers(); // Restore fake timers
    });
  });

  describe('getClientIp', () => {
    it('should return ip from req.ip', () => {
      const req = { ip: '192.168.1.1' };
      expect(getClientIp(req)).toBe('192.168.1.1');
    });

    it('should return ip from connection.remoteAddress', () => {
      const req = { connection: { remoteAddress: '192.168.1.2' } };
      expect(getClientIp(req)).toBe('192.168.1.2');
    });

    it('should return ip from x-forwarded-for header', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.3, 10.0.0.1',
        },
      };
      expect(getClientIp(req)).toBe('192.168.1.3');
    });

    it('should return "unknown" as fallback', () => {
      const req = { headers: {} };
      expect(getClientIp(req)).toBe('unknown');
    });
  });

  describe('maskEmail', () => {
    it('should mask email with username longer than 2 characters', () => {
      expect(maskEmail('john@example.com')).toBe('jo**@example.com');
      expect(maskEmail('testuser@domain.com')).toBe('te******@domain.com');
    });

    it('should not mask email with username 2 characters or less', () => {
      expect(maskEmail('ab@example.com')).toBe('ab@example.com');
      expect(maskEmail('a@example.com')).toBe('a@example.com');
    });
  });
});
