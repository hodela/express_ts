#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const TEST_DATABASE_URL =
  'postgresql://test:test@localhost:5432/express_ts_test';

async function setupTestDatabase() {
  console.log('🔧 Setting up test database...');

  try {
    // Create database if it doesn't exist (ignore if exists)
    try {
      execSync(
        `psql -U test -h localhost -c "CREATE DATABASE express_ts_test"`,
        {
          env: { ...process.env, PGPASSWORD: 'test' },
          stdio: 'ignore',
        }
      );
      console.log('✅ Test database created');
    } catch (error) {
      // Database might already exist, continue
      console.log('📋 Test database already exists or cannot create');
    }

    // Run migrations on test database
    console.log('🔄 Running migrations on test database...');
    execSync('npx prisma db push --force-reset', {
      env: {
        ...process.env,
        DATABASE_URL: TEST_DATABASE_URL,
      },
      stdio: 'inherit',
    });

    console.log('✅ Test database setup completed successfully!');

    // Test connection
    const prisma = new PrismaClient({
      datasourceUrl: TEST_DATABASE_URL,
    });

    await prisma.$connect();
    console.log('✅ Test database connection verified');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    console.log('\n📋 Prerequisites:');
    console.log('1. PostgreSQL server running on localhost:5432');
    console.log('2. User "test" with password "test" exists');
    console.log('3. User has permission to create databases');
    console.log('\nTo create the test user:');
    console.log('sudo -u postgres psql');
    console.log("CREATE USER test WITH PASSWORD 'test';");
    console.log('ALTER USER test CREATEDB;');
    console.log('ALTER USER test WITH SUPERUSER;');
    process.exit(1);
  }
}

if (require.main === module) {
  setupTestDatabase().catch(console.error);
}

export { setupTestDatabase };
