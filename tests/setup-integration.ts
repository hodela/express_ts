// Integration test setup file
// This file runs before integration tests and does NOT mock Prisma or bcrypt

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-integration-testing';
process.env.JWT_EXPIRES_IN = '4h';
process.env.TEST_DATABASE_URL =
  'postgresql://test:test@localhost:5432/express_ts_test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL; // Use test database
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.BCRYPT_ROUNDS = '4'; // Lower for faster tests

// Mock database config to use test database
jest.mock('../src/config/database', () => {
  const { PrismaClient } = require('@prisma/client');
  const testDatabaseUrl =
    process.env.TEST_DATABASE_URL ||
    'postgresql://test:test@localhost:5432/express_ts_test';

  const testPrisma = new PrismaClient({
    datasourceUrl: testDatabaseUrl,
  });

  return {
    prisma: testPrisma,
    connectDB: jest.fn(),
    disconnectDB: jest.fn(),
  };
});

// Only mock Winston logger (not database or bcrypt for integration tests)
jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
  format: {
    combine: jest.fn(() => jest.fn()),
    timestamp: jest.fn(() => jest.fn()),
    printf: jest.fn(() => jest.fn()),
    colorize: jest.fn(() => jest.fn()),
    simple: jest.fn(() => jest.fn()),
    json: jest.fn(() => jest.fn()),
    errors: jest.fn(() => jest.fn()),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));

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

// Use real timers for integration tests
beforeAll(() => {
  jest.useRealTimers();
});

// Cleanup between tests
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

export {};
