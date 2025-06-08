// Test setup file
// This file runs before all tests to setup the test environment

import { createMockPrisma, createMockLogger } from './helpers/mocks';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '4h';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.BCRYPT_ROUNDS = '10';

// Mock Prisma client globally
jest.mock('../src/config/database', () => ({
  prisma: createMockPrisma(),
}));

// Mock Winston logger with proper format functions
jest.mock('winston', () => ({
  createLogger: jest.fn(() => createMockLogger()),
  format: {
    combine: jest.fn(() => jest.fn()),
    timestamp: jest.fn(() => jest.fn()),
    printf: jest.fn(() => jest.fn()),
    colorize: jest.fn(() => jest.fn()),
    simple: jest.fn(() => jest.fn()),
    json: jest.fn(() => jest.fn()),
    errors: jest.fn(() => jest.fn()), // Fix for winston errors format
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

// Removed jsonwebtoken mock - let tests use real JWT for AuthService

// Suppress console logs during testing
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Custom Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && ceiling >= received;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Setup fake timers
beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

// Cleanup between tests
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

// Export for module detection
export {};
