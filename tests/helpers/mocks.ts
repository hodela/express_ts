// Mock factory for centralized mocking
export const createMockPrisma = () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  $transaction: jest.fn(),
});

export const createMockLogger = () => {
  const mockLogger: any = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn(),
  };

  // Make child return the same logger
  mockLogger.child = jest.fn(() => mockLogger);

  return mockLogger;
};

export const mockUser = {
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
  lastLoginAt: new Date('2024-01-01T00:00:00.000Z'),
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

export const mockRequest = (overrides: any = {}) => ({
  headers: {},
  ip: undefined,
  connection: undefined,
  socket: undefined,
  ...overrides,
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn();
