# Testing Guide

Dự án này sử dụng comprehensive testing strategy với Jest, bao gồm unit tests và integration tests.

## 📋 Prerequisites

### Database Setup for Integration Tests

1. **PostgreSQL Server**: Đảm bảo PostgreSQL đang chạy trên localhost:5432
2. **Test User**: Tạo user test với quyền cần thiết:

```bash
psql postgres -c "CREATE USER test WITH PASSWORD 'test'; ALTER USER test CREATEDB; ALTER USER test WITH SUPERUSER;"
```

## 🏗️ Test Architecture

### Unit Tests

- **Location**: `tests/unit/`
- **Purpose**: Test business logic của services và utilities
- **Database**: Mock Prisma client
- **Coverage**: 100% cho core services (AuthService, UserService)

### Integration Tests

- **Location**: `tests/integration/`
- **Purpose**: Test API endpoints với database thật
- **Database**: PostgreSQL test database (`express_ts_test`)
- **Coverage**: Full HTTP request/response cycle

## 🚀 Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm run test:unit
# hoặc
npm test -- --selectProjects=unit
```

### Integration Tests Only

```bash
npm run test:integration
# hoặc
npm test -- --selectProjects=integration
```

### With Coverage

```bash
npm run test:coverage
```

### Watch Mode

```bash
npm run test:watch
```

## 📊 Test Results Summary

- **Total Tests**: 75 ✅
- **Unit Tests**: 52 ✅
- **Integration Tests**: 23 ✅
- **Overall Coverage**: 70.5%

### Coverage Breakdown:

- **Services**: 92.2% (AuthService: 100%, UserService: 100%)
- **Controllers**: 55.88% (covered by integration tests)
- **Middlewares**: 57.5%
- **Routes**: 97.77%

## 🔧 Test Configuration

### Jest Configuration

- **Projects**: Separate configs for unit vs integration
- **Unit Tests**: Mock Prisma, bcrypt, và Winston
- **Integration Tests**: Real PostgreSQL database
- **Timeout**: 30 seconds for integration tests

### Environment Variables

```bash
# Integration Tests
NODE_ENV=test
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/express_ts_test
JWT_SECRET=test-jwt-secret-key-for-integration-testing
BCRYPT_ROUNDS=4  # Lower for faster tests
```

## 📁 Test File Structure

```
tests/
├── unit/                          # Unit tests
│   ├── auth.service.test.ts       # AuthService tests
│   ├── user.service.test.ts       # UserService tests
│   ├── email.service.test.ts      # EmailService tests
│   └── helpers.test.ts            # Utility function tests
├── integration/                   # Integration tests
│   ├── auth.test.ts               # Auth API endpoints
│   └── user.test.ts               # User API endpoints
├── helpers/                       # Test utilities
│   ├── mocks.ts                   # Mock factories
│   └── database.ts                # Database test helpers
├── setup.ts                       # Unit test setup
└── setup-integration.ts           # Integration test setup
```

## 🧪 Writing Tests

### Unit Test Example

```typescript
import { AuthService } from '../../src/services/auth.service';

describe('AuthService', () => {
  it('should generate tokens', async () => {
    const tokens = await AuthService.generateTokens(
      'user-id',
      'test@example.com'
    );

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(tokens.expiresIn).toBe(14400);
  });
});
```

### Integration Test Example

```typescript
import request from 'supertest';
import app from '../../src/app';

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userData.email);
  });
});
```

## 🔍 Debugging Tests

### Run Single Test File

```bash
npm test -- tests/unit/auth.service.test.ts
```

### Debug Mode

```bash
npm test -- --verbose --no-coverage
```

### Database Issues

```bash
# Reset test database
npm run test:db:setup

# Check database connection
psql -U test -h localhost -d express_ts_test -c "SELECT 1;"
```

## 🛠️ Test Database Management

### Auto Setup

Test database được tự động setup khi chạy integration tests qua script `setup-test-db.ts`.

### Manual Setup

```bash
npm run test:db:setup
```

### Reset Database

```bash
# Database sẽ được reset tự động trước mỗi test suite
# Hoặc chạy manual:
npm run test:db:setup
```

## 📝 Best Practices

1. **Unit Tests**: Test business logic, không test implementation details
2. **Integration Tests**: Test user workflows và API contracts
3. **Mocking**: Mock external dependencies, không mock code under test
4. **Test Data**: Sử dụng realistic test data
5. **Cleanup**: Tests phải độc lập và clean up sau mình
6. **Naming**: Tên test mô tả behavior, không implementation

## 🚨 Troubleshooting

### Common Issues

**Error: User `test` was denied access**

```bash
# Tạo lại test user với đủ quyền
psql postgres -c "DROP USER IF EXISTS test; CREATE USER test WITH PASSWORD 'test' SUPERUSER CREATEDB;"
```

**Tests timeout**

```bash
# Tăng timeout trong jest.config.js
testTimeout: 60000
```

**Database connection issues**

```bash
# Kiểm tra PostgreSQL service
brew services list | grep postgresql
brew services start postgresql@14
```
