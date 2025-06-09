# Express TypeScript API Boilerplate

Một boilerplate Express.js API hoàn chỉnh sử dụng TypeScript, PostgreSQL, Prisma ORM, JWT authentication, và Swagger documentation.

## 🚀 Tính năng

- **TypeScript** - Type safety và developer experience tốt hơn
- **Express.js** - Web framework nhanh và linh hoạt
- **PostgreSQL + Prisma** - Database và ORM hiện đại
- **JWT Authentication** - Secure authentication với access/refresh tokens
- **Redis** - Caching và session storage
- **Swagger/OpenAPI** - API documentation tự động
- **Rate Limiting** - Bảo vệ API khỏi abuse
- **Input Validation** - Validation với express-validator
- **Error Handling** - Centralized error handling
- **Logging** - Structured logging với Pino
- **Testing** - Unit và integration tests với Jest
- **Docker** - Containerization cho development và production
- **Security** - Helmet, CORS, và các security best practices
- **Email Service** - Email integration với Resend

## 📋 Yêu cầu

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Docker & Docker Compose (optional)

## 🛠️ Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd express-ts-api
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:

```env
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/express_ts
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/express_ts_test

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=your-email@gmail.com
RESEND_FROM_NAME=your-name

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# File Upload
UPLOAD_ENGINE=local
UPLOAD_MAX_FILE_SIZE=5242880
UPLOAD_ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
UPLOAD_PATH=src/assets/upload
UPLOAD_URL_PREFIX=/uploads
```

### 4. Setup database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed
```

### 5. Chạy ứng dụng

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🐳 Docker

### Development với Docker Compose

```bash
# Chạy tất cả services
docker-compose up -d

# Chỉ chạy database và Redis
docker-compose up -d postgres redis

# Xem logs
docker-compose logs -f app

# Truy cập Adminer (database management)
# http://localhost:8080
```

Services được include:

- **app**: Express API server
- **postgres**: PostgreSQL database
- **redis**: Redis cache
- **adminer**: Database management UI (port 8080)

### Production với Docker

```bash
# Build image
docker build -t express-ts-api .

# Run container
docker run -p 3000:3000 --env-file .env express-ts-api
```

## 📚 API Documentation

Sau khi chạy server, truy cập:

- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **API Base URL**: http://localhost:3000/api

## 🔐 Authentication & APIs

### Authentication Endpoints

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/refresh` - Làm mới access token
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu
- `POST /api/auth/verify-email` - Xác thực email
- `POST /api/auth/resend-verification` - Gửi lại email xác thực

### User Management Endpoints

- `GET /api/users/me` - Lấy thông tin người dùng hiện tại
- `PUT /api/users/me` - Cập nhật thông tin người dùng hiện tại
- `PUT /api/users/change-password` - Đổi mật khẩu
- `POST /api/users/upload-avatar` - Upload avatar
- `DELETE /api/users/avatar` - Xóa avatar
- `PATCH /api/users/theme` - Cập nhật chủ đề giao diện
- `PATCH /api/users/language` - Cập nhật ngôn ngữ
- `DELETE /api/users/delete-account` - Xóa tài khoản

### Example Usage

#### Register

```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login

```bash
POST /api/auth/login
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Protected Routes

Thêm header Authorization:

```bash
Authorization: Bearer <access_token>
```

## 🧪 Testing

```bash
# Setup test database
npm run test:db:setup

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## 📁 Cấu trúc Project

```
express_ts/
├── .env.example               # Environment variables template
├── .env                       # Environment variables (local)
├── .gitignore                 # Git ignore rules
├── .dockerignore              # Docker ignore rules
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── .cursorrules               # Cursor IDE rules
├── .cursorignore              # Cursor ignore rules
├── package.json               # Dependencies and scripts
├── package-lock.json          # Lock file for dependencies
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest testing configuration
├── Dockerfile                 # Docker container configuration
├── docker-compose.yml         # Docker services configuration
├── README.md                  # Project documentation
├── SWAGGER.md                 # API documentation guide
├── TESTING.md                 # Testing guide
├── TASKS.md                   # Development tasks and features
├── coverage/                  # Test coverage reports
├── dist/                      # Compiled JavaScript files
├── logs/                      # Application logs
├── node_modules/              # Node.js dependencies
├── src/                       # Source code
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   ├── config/                # Configuration files
│   │   ├── database.ts        # Prisma configuration
│   │   ├── redis.ts           # Redis configuration
│   │   ├── resend.ts          # Resend configuration
│   │   ├── logger.ts          # Pino logger setup
│   │   ├── upload.config.ts   # File upload configuration
│   │   └── swagger.ts         # Swagger configuration
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts # Authentication controller
│   │   └── user.controller.ts # User management controller
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middleware.ts        # JWT authentication
│   │   ├── error.middleware.ts       # Global error handler
│   │   ├── logging.middleware.ts     # Request logging
│   │   ├── notFound.middleware.ts    # 404 handler
│   │   ├── rateLimiter.middleware.ts # Rate limiting
│   │   ├── upload.middleware.ts      # File upload middleware
│   │   └── validation.middleware.ts  # Input validation
│   ├── routes/                # Route definitions
│   │   ├── index.ts           # Main routes file
│   │   ├── auth.routes.ts     # Authentication routes
│   │   └── user.routes.ts     # User management routes
│   ├── services/              # Business logic layer
│   │   ├── auth.service.ts    # Authentication service
│   │   ├── user.service.ts    # User management service
│   │   └── email.service.ts   # Email service (Resend)
│   ├── services/upload/       # File upload services
│   │   ├── local-upload.service.ts # Local file upload service
│   │   └── upload.service.ts    # Upload service interface
│   ├── utils/                 # Utility functions
│   │   ├── constants.ts       # Application constants
│   │   ├── helpers.ts         # Helper functions
│   │   └── validators.ts      # Custom validators
│   ├── assets/                # Static assets
│   │   └── upload/            # Upload directory
│   ├── templates/             # Email templates
│   │   ├── emails/            # Email templates
│   │   │   ├── BaseEmailTemplate.tsx # Base email template
│   │   │   ├── WelcomeEmail.tsx # Welcome email template
│   │   │   ├── EmailVerificationEmail.tsx # Email verification email template
│   │   │   └── PasswordResetEmail.tsx # Password reset email template
│   ├── locales/               # Language files
│   │   ├── en.json            # English language file
│   │   └── vi.json            # Vietnamese language file
│   └── types/                 # TypeScript type definitions
│       ├── express.d.ts       # Express type extensions
│       ├── upload.d.ts        # Upload type extensions
│       └── index.ts           # Global type definitions
├── tests/                     # Test files
│   ├── setup.ts               # Test setup configuration
│   ├── setup-integration.ts   # Integration test setup
│   ├── jest-global.d.ts       # Jest global types
│   ├── helpers/               # Test helper functions
│   │   ├── database.ts        # Database test helpers
│   │   └── mocks.ts           # Mock functions
│   ├── unit/                  # Unit tests
│   │   ├── auth.service.test.ts   # Auth service tests
│   │   ├── user.service.test.ts   # User service tests
│   │   ├── email.service.test.ts  # Email service tests
│   │   └── helpers.test.ts        # Helper functions tests
│   └── integration/           # Integration tests
│       ├── auth.test.ts       # Authentication API tests
│       └── user.test.ts       # User management API tests
├── scripts/                   # Build and utility scripts
│   ├── setup-test-db.ts       # Test database setup
│   ├── migrate.ts             # Database migration script
│   ├── seed.ts                # Database seeding script
│   └── init-db.sql            # Database initialization SQL
└── prisma/                    # Prisma ORM files
    ├── schema.prisma          # Database schema definition
    └── migrations/            # Database migrations
        ├── migration_lock.toml     # Migration lock file
        ├── 20250608033536_init/    # Initial migration
        └── 20250608034053_update_user_schema/  # User schema update
```

## 🔧 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:db:setup    # Setup test database
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run migrate          # Run database migrations
npm run seed             # Seed database
```

## 🚀 Deployment

### Environment Variables cho Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secure-secret-key
RESEND_API_KEY=your-production-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Your App Name
ALLOWED_ORIGINS=https://yourdomain.com
```

### Build và Deploy

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation với express-validator
- **JWT Authentication** - Secure token-based auth với refresh tokens
- **Password Hashing** - bcrypt password hashing
- **SQL Injection Protection** - Prisma ORM protection

## 📊 Monitoring & Logging

- **Health Check Endpoint** - `/health`
- **Structured Logging** - Pino logger với pretty printing
- **Error Tracking** - Centralized error handling
- **Request Logging** - Morgan HTTP logger
- **Performance Monitoring** - Request timing logs

## 🗄️ Database Schema

### User Model

```typescript
{
  id: string (CUID)
  name: string
  email: string (unique)
  password: string (hashed)
  avatar?: string
  theme: "light" | "dark" (default: "light")
  language: "vi" | "en" (default: "en")
  role: "user" | "admin" (default: "user")
  isVerified: boolean (default: false)
  verificationToken?: string
  verificationTokenExpiresAt?: DateTime
  resetPasswordToken?: string
  resetPasswordTokenExpiresAt?: DateTime
  lastLoginAt?: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### RefreshToken Model

```typescript
{
  id: string(CUID);
  token: string(unique);
  userId: string;
  expiresAt: DateTime;
  createdAt: DateTime;
}
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🆘 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub.

---

**Happy Coding! 🎉**
