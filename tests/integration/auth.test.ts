import request from 'supertest';
import app from '../../src/app';
import {
  setupTestDatabase,
  clearDatabase,
  closeDatabase,
} from '../helpers/database';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('message', 'Đăng ký thành công');
      expect(response.body).toHaveProperty('requiresVerification', true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123',
        confirmPassword: '456',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(422);

      expect(response.body).toHaveProperty('message', 'Dữ liệu không hợp lệ');
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('details');
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      // Register first user
      await request(app).post('/api/auth/register').send(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Đăng ký thất bại');
      expect(response.body).toHaveProperty('code', 'REGISTER_FAILED');
      expect(response.body.details.email).toContain('Email đã tồn tại');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await request(app).post('/api/auth/register').send(userData);

      // Then login
      const loginData = {
        email: userData.email,
        password: userData.password,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn', 14400);
      expect(response.body).toHaveProperty('tokenType', 'Bearer');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return error for invalid credentials', async () => {
      const invalidLogin = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLogin)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Đăng nhập thất bại');
      expect(response.body).toHaveProperty('code', 'LOGIN_FAILED');
      expect(response.body.details.email).toContain(
        'Email hoặc mật khẩu không đúng'
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // Register and login to get tokens
      const userData = {
        name: 'Test User',
        email: 'test.logout@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await request(app).post('/api/auth/register').send(userData);

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: userData.password,
      });

      const { accessToken, refreshToken } = loginResponse.body;

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Đăng xuất thành công');
    });

    it('should return error without token', async () => {
      const response = await request(app).post('/api/auth/logout').expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
      expect(response.body).toHaveProperty('code', 'UNAUTHORIZED');
    });
  });
});
