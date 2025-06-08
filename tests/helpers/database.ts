import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Create a separate Prisma client for testing with test database
const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://test:test@localhost:5432/express_ts_test';

const testPrisma = new PrismaClient({
  datasourceUrl: testDatabaseUrl,
});

export const setupTestDatabase = async () => {
  try {
    console.log('Setting up test database...');

    // Connect to test database
    await testPrisma.$connect();

    // Run migrations on test database
    execSync('npx prisma db push --force-reset', {
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
      stdio: 'pipe',
    });

    console.log('Test database setup completed');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    // Use the test prisma client to clear data
    await testPrisma.$transaction(async (tx) => {
      // Delete in order to respect foreign key constraints
      await tx.refreshToken.deleteMany();
      await tx.user.deleteMany();
    });
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    await testPrisma.$disconnect();
  } catch (error) {
    console.error('Failed to close database:', error);
  }
};

// Export test prisma instance for use in tests
export { testPrisma as prisma };
