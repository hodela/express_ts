# Swagger API Documentation

## Tổng quan

Dự án này đã được cấu hình để tự động tạo documentation API bằng Swagger/OpenAPI 3.0. Tất cả các API endpoints đã được document chi tiết với JSDoc comments.

## Truy cập Swagger UI

Sau khi khởi động server, bạn có thể truy cập Swagger UI tại:

```
http://localhost:3000/api-docs
```

## Cấu trúc API

### Authentication APIs (`/api/auth`)

- **POST /api/auth/register** - Đăng ký tài khoản mới
- **POST /api/auth/login** - Đăng nhập
- **POST /api/auth/refresh** - Làm mới access token
- **POST /api/auth/logout** - Đăng xuất
- **POST /api/auth/forgot-password** - Quên mật khẩu
- **POST /api/auth/reset-password** - Đặt lại mật khẩu
- **POST /api/auth/verify-email** - Xác thực email

### User APIs (`/api/users`)

- **GET /api/users/me** - Lấy thông tin người dùng hiện tại
- **PUT /api/users/me** - Cập nhật thông tin người dùng hiện tại
- **PUT /api/users/change-password** - Đổi mật khẩu
- **POST /api/users/upload-avatar** - Upload avatar
- **DELETE /api/users/avatar** - Xóa avatar
- **PATCH /api/users/theme** - Cập nhật chủ đề giao diện
- **PATCH /api/users/language** - Cập nhật ngôn ngữ

### General APIs (`/api`)

- **GET /api** - Thông tin API
- **GET /health** - Health check

## Authentication

Hầu hết các API đều yêu cầu authentication. Sử dụng Bearer token trong header:

```
Authorization: Bearer <your-jwt-token>
```

## Schemas

### User Schema

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string (nullable)",
  "theme": "light | dark",
  "language": "vi | en",
  "role": "user | admin",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### AuthResponse Schema

```json
{
  "user": "User object",
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": "number"
}
```

### Error Schema

```json
{
  "message": "string",
  "code": "string",
  "details": "object"
}
```

## Cách sử dụng Swagger UI

1. **Khởi động server**: `npm run dev`
2. **Truy cập**: http://localhost:3000/api-docs
3. **Authorize**: Click nút "Authorize" và nhập Bearer token
4. **Test API**: Click "Try it out" trên bất kỳ endpoint nào để test

## Lưu ý

- Tất cả các API responses đều được document với status codes và examples
- Validation rules được hiển thị rõ ràng cho mỗi request parameter
- Security requirements được chỉ định rõ ràng cho từng endpoint
- API được nhóm theo tags để dễ dàng tìm kiếm và sử dụng

## Cập nhật Documentation

Khi thêm API mới, hãy thêm JSDoc comments theo format:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Mô tả ngắn gọn
 *     tags: [Tag Name]
 *     security:
 *       - bearerAuth: []  # Nếu cần authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field1:
 *                 type: string
 *                 description: Mô tả field
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

Swagger sẽ tự động cập nhật documentation khi bạn restart server.
