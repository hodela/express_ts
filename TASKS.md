
### 🔐 Authentication APIs

#### 1. Login

```http
POST /auth/login
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (200):**

```json
{
    "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg",
        "theme": "light",
        "language": "en",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 14400,
    "tokenType": "Bearer"
}
```

**Error Responses:**

```json
// 401 - Invalid credentials
{
  "message": "Đăng nhập thất bại",
  "code": "LOGIN_FAILED",
  "details": {
    "email": ["Email hoặc mật khẩu không đúng"]
  }
}

// 422 - Validation error
{
  "message": "Dữ liệu không hợp lệ",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Email không hợp lệ"],
    "password": ["Mật khẩu không được để trống"]
  }
}
```

#### 2. Get Current User

```http
GET /auth/me
Headers: Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "light",
    "language": "en",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (401):**

```json
{
    "message": "Không thể lấy thông tin user",
    "code": "GET_USER_FAILED"
}
```

#### 3. Refresh Token

```http
POST /auth/refresh
```

**Request Body:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**

```json
{
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 14400,
    "tokenType": "Bearer"
}
```

**Error Response (401):**

```json
{
    "message": "Không thể làm mới token",
    "code": "REFRESH_TOKEN_FAILED",
    "details": {
        "refreshToken": ["Refresh token không hợp lệ hoặc đã hết hạn"]
    }
}
```

#### 4. Logout

```http
POST /auth/logout
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response (200):**

```json
{
    "message": "Đăng xuất thành công"
}
```

#### 5. Register

```http
POST /auth/register
```

**Request Body:**

```json
{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User",
    "confirmPassword": "password123"
}
```

**Response (201):**

```json
{
    "user": {
        "id": "uuid-string",
        "email": "newuser@example.com",
        "name": "New User",
        "avatar": null,
        "theme": "light",
        "language": "en",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "message": "Đăng ký thành công",
    "requiresVerification": true
}
```

**Error Response (400):**

```json
{
    "message": "Đăng ký thất bại",
    "code": "REGISTER_FAILED",
    "details": {
        "email": ["Email đã tồn tại"],
        "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
}
```

#### 6. Forgot Password

```http
POST /auth/forgot-password
```

**Request Body:**

```json
{
    "email": "user@example.com"
}
```

**Response (200):**

```json
{
    "message": "Email khôi phục mật khẩu đã được gửi"
}
```

**Error Response (400):**

```json
{
    "message": "Gửi email khôi phục thất bại",
    "code": "FORGOT_PASSWORD_FAILED",
    "details": {
        "email": ["Email không tồn tại trong hệ thống"]
    }
}
```

#### 7. Reset Password

```http
POST /auth/reset-password
```

**Request Body:**

```json
{
    "token": "reset-token-from-email",
    "password": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

**Response (200):**

```json
{
    "message": "Đặt lại mật khẩu thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Đặt lại mật khẩu thất bại",
    "code": "RESET_PASSWORD_FAILED",
    "details": {
        "token": ["Token không hợp lệ hoặc đã hết hạn"],
        "password": ["Mật khẩu phải có ít nhất 8 ký tự"]
    }
}
```

#### 8. Verify Email

```http
POST /auth/verify-email
```

**Request Body:**

```json
{
    "token": "verify-token-from-email"
}
```

**Response (200):**

```json
{
    "message": "Xác thực email thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Xác thực email thất bại",
    "code": "VERIFY_EMAIL_FAILED",
    "details": {
        "token": ["Token không hợp lệ hoặc đã hết hạn"]
    }
}
```

### 👥 User APIs

#### 1. Get Profile

```http
GET /users/profile
Headers: Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "light",
    "language": "en",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (401):**

```json
{
    "message": "Không thể lấy thông tin profile",
    "code": "GET_PROFILE_FAILED"
}
```

#### 2. Update Profile

```http
PUT /users/profile
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "name": "Updated Name",
    "avatar": "https://example.com/new-avatar.jpg",
    "theme": "light",
    "language": "en"
}
```

**Response (200):**

```json
{
    "user": {
        "id": "uuid-string",
        "email": "user@example.com",
        "name": "Updated Name",
        "avatar": "https://example.com/new-avatar.jpg",
        "theme": "light",
        "language": "en",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "message": "Cập nhật profile thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Cập nhật profile thất bại",
    "code": "UPDATE_PROFILE_FAILED",
    "details": {
        "name": ["Tên không được để trống"],
        "avatar": ["Avatar không hợp lệ"]
    }
}
```

#### 3. Change Password

```http
PUT /users/change-password
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

**Response (200):**

```json
{
    "message": "Thay đổi mật khẩu thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Thay đổi mật khẩu thất bại",
    "code": "CHANGE_PASSWORD_FAILED",
    "details": {
        "oldPassword": ["Mật khẩu cũ không đúng"],
        "newPassword": ["Mật khẩu mới phải có ít nhất 8 ký tự"]
    }
}
```

#### 4. Upload Avatar

```http
POST /users/upload-avatar
Headers: Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**

```json
{
    "avatar": "file-object"
}
```

**Response (200):**

```json
{
    "avatarUrl": "https://example.com/avatars/new-avatar.jpg"
}
```

**Error Response (400):**

```json
{
    "message": "Upload avatar thất bại",
    "code": "UPLOAD_AVATAR_FAILED",
    "details": {
        "avatar": ["File không hợp lệ", "Kích thước file quá lớn"]
    }
}
```

#### 5. Delete Avatar

```http
DELETE /users/avatar
Headers: Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
    "message": "Xóa avatar thành công"
}
```

**Error Response (400):**

```json
{
    "message": "Xóa avatar thất bại",
    "code": "DELETE_AVATAR_FAILED"
}
```

#### 6. Update Theme

```http
PATCH /users/theme
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "theme": "dark"
}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "dark",
    "language": "en",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (400):**

```json
{
    "message": "Cập nhật theme thất bại",
    "code": "UPDATE_THEME_FAILED",
    "details": {
        "theme": ["Theme phải là 'light', 'dark' hoặc 'system'"]
    }
}
```

#### 7. Update Language

```http
PATCH /users/language
Headers: Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
    "language": "vi"
}
```

**Response (200):**

```json
{
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "theme": "light",
    "language": "vi",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Response (400):**

```json
{
    "message": "Cập nhật ngôn ngữ thất bại",
    "code": "UPDATE_LANGUAGE_FAILED",
    "details": {
        "language": ["Ngôn ngữ phải là 'vi' hoặc 'en'"]
    }
}
```

### ⚠️ Error Handling

Tất cả API sẽ trả về HTTP status codes phù hợp:

- **200**: Success
- **201**: Created
- **400**: Bad Request - Dữ liệu request không hợp lệ
- **401**: Unauthorized - Chưa đăng nhập hoặc token không hợp lệ
- **403**: Forbidden - Không có quyền truy cập
- **404**: Not Found - Không tìm thấy resource
- **422**: Unprocessable Entity - Validation errors
- **500**: Internal Server Error - Lỗi server

**Error Response Format:**

```json
{
    "message": "Mô tả lỗi bằng tiếng Việt",
    "code": "ERROR_CODE",
    "details": {
        // Optional - chi tiết lỗi validation
    }
}
```

### 🔧 Backend Implementation Notes

#### Database Schema Example (User table):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  theme VARCHAR(255) DEFAULT 'light',
  language VARCHAR(255) DEFAULT 'en',
  role VARCHAR(255) DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  verification_token_expires_at TIMESTAMP,
  reset_password_token TEXT,
  reset_password_token_expires_at TIMESTAMP,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### JWT Token Configuration:

- **Access Token**: 4 giờ (14400 seconds)
- **Refresh Token**: 30 ngày (2592000 seconds)
- **Algorithm**: HS256