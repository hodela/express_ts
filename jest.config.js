/** @type {import('jest').Config} */
const config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Set test environment to Node.js
  testEnvironment: 'node',

  // Global test timeout
  testTimeout: 30000,

  // Projects for different test types
  projects: [
    // Unit tests configuration
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests'],
      testMatch: ['**/unit/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1',
      },
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          {
            tsconfig: {
              target: 'ES2020',
              module: 'commonjs',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              strict: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
              resolveJsonModule: true,
              experimentalDecorators: true,
              emitDecoratorMetadata: true,
              typeRoots: ['./node_modules/@types', './src/types'],
            },
          },
        ],
      },
      clearMocks: true,
      restoreMocks: true,
    },
    // Integration tests configuration
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests', '<rootDir>/src'],
      testMatch: ['**/integration/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup-integration.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1',
      },
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          {
            tsconfig: {
              target: 'ES2020',
              module: 'commonjs',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              strict: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true,
              resolveJsonModule: true,
              experimentalDecorators: true,
              emitDecoratorMetadata: true,
              typeRoots: ['./node_modules/@types', './src/types'],
            },
          },
        ],
      },
      clearMocks: true,
      restoreMocks: true,
    },
  ],

  // Coverage configuration for all projects
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/config/**',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Detect open handles
  detectOpenHandles: true,

  // Force exit after tests complete
  forceExit: true,

  // Run tests in parallel
  maxWorkers: '50%',
};

module.exports = config;
