import request from 'supertest';
import app from '../../src/app';
import {
  setupTestDatabase,
  clearDatabase,
  closeDatabase,
} from '../helpers/database';

describe('User Endpoints', () => {
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    await setupTestDatabase();

    // Setup test user and get tokens
    const userData = {
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await request(app).post('/api/auth/register').send(userData);

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    accessToken = loginResponse.body.accessToken;
    refreshToken = loginResponse.body.refreshToken;
    userId = loginResponse.body.user.id;
  });

  beforeEach(async () => {
    // Don't clear database in beforeEach since we need the test user
    // Only clear if setting up new data for specific tests
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /api/users/me', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'test.user@example.com');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('theme', 'light');
      expect(response.body).toHaveProperty('language', 'en');
    });

    it('should return error without token', async () => {
      const response = await request(app).get('/api/users/me').expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
      expect(response.body).toHaveProperty('code', 'UNAUTHORIZED');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        avatar: 'https://example.com/avatar.jpg',
        theme: 'dark',
        language: 'vi',
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty(
        'message',
        'Cập nhật profile thành công'
      );
      expect(response.body.user.name).toBe(updateData.name);
      expect(response.body.user.theme).toBe(updateData.theme);
      expect(response.body.user.language).toBe(updateData.language);
    });

    it('should return validation error for invalid theme', async () => {
      const invalidData = {
        theme: 'invalid-theme',
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData)
        .expect(422);

      expect(response.body).toHaveProperty('message', 'Dữ liệu không hợp lệ');
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('PUT /api/users/change-password', () => {
    it('should change password with valid data', async () => {
      const passwordData = {
        oldPassword: 'password123',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Thay đổi mật khẩu thành công'
      );
    });

    it('should return error for wrong old password', async () => {
      const passwordData = {
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      };

      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Thay đổi mật khẩu thất bại'
      );
      expect(response.body).toHaveProperty('code', 'CHANGE_PASSWORD_FAILED');
      expect(response.body.details.oldPassword).toContain(
        'Mật khẩu cũ không đúng'
      );
    });

    it('should return error for mismatched passwords', async () => {
      const passwordData = {
        oldPassword: 'password123',
        newPassword: 'anotherpassword123',
        confirmPassword: 'differentpassword123',
      };

      const response = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Thay đổi mật khẩu thất bại'
      );
      expect(response.body).toHaveProperty('code', 'CHANGE_PASSWORD_FAILED');
      expect(response.body.details.confirmPassword).toContain(
        'Mật khẩu xác nhận không khớp'
      );
    });
  });

  describe('POST /api/users/upload-avatar', () => {
    it('should upload avatar', async () => {
      const response = await request(app)
        .post('/api/users/upload-avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('avatarUrl');
      expect(response.body.avatarUrl).toMatch(
        /^https:\/\/example\.com\/avatars\//
      );
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .post('/api/users/upload-avatar')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'No token provided');
      expect(response.body).toHaveProperty('code', 'UNAUTHORIZED');
    });
  });

  describe('DELETE /api/users/avatar', () => {
    it('should delete avatar', async () => {
      const response = await request(app)
        .delete('/api/users/avatar')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Xóa avatar thành công');
    });
  });

  describe('PATCH /api/users/theme', () => {
    it('should update theme', async () => {
      const themeData = { theme: 'dark' };

      const response = await request(app)
        .patch('/api/users/theme')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(themeData)
        .expect(200);

      expect(response.body).toHaveProperty('theme', 'dark');
    });

    it('should return error for invalid theme', async () => {
      const invalidTheme = { theme: 'invalid' };

      const response = await request(app)
        .patch('/api/users/theme')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidTheme)
        .expect(422);

      expect(response.body).toHaveProperty('message', 'Dữ liệu không hợp lệ');
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('PATCH /api/users/language', () => {
    it('should update language', async () => {
      const languageData = { language: 'vi' };

      const response = await request(app)
        .patch('/api/users/language')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(languageData)
        .expect(200);

      expect(response.body).toHaveProperty('language', 'vi');
    });

    it('should return error for invalid language', async () => {
      const invalidLanguage = { language: 'fr' };

      const response = await request(app)
        .patch('/api/users/language')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidLanguage)
        .expect(422);

      expect(response.body).toHaveProperty('message', 'Dữ liệu không hợp lệ');
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
