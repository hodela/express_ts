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
- **Logging** - Structured logging với Winston
- **Testing** - Unit và integration tests với Jest
- **Docker** - Containerization cho development và production
- **Security** - Helmet, CORS, và các security best practices

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

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
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
```

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

## 🔐 Authentication

API sử dụng JWT tokens cho authentication:

### Register

```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /api/auth/login
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Protected Routes

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
src/
├── config/          # Configuration files
│   ├── database.ts  # Prisma configuration
│   ├── redis.ts     # Redis configuration
│   ├── logger.ts    # Winston logger setup
│   └── swagger.ts   # Swagger configuration
├── controllers/     # Route controllers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middlewares/     # Express middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimiter.middleware.ts
│   └── validation.middleware.ts
├── routes/          # Route definitions
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── index.ts
├── services/        # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── email.service.ts
├── utils/           # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
├── types/           # TypeScript type definitions
│   ├── express.d.ts
│   └── index.ts
├── app.ts           # Express app setup
└── server.ts        # Server entry point
tests/
├── helpers/         # Test helpers
├── integration/     # Integration tests
├── unit/            # Unit tests
└── setup.ts         # Test setup
scripts/
├── setup-test-db.ts # Test database setup
├── migrate.ts       # Database migrations
└── seed.ts          # Database seeding
prisma/
├── schema.prisma   # Prisma schema
├── migrations/      # Prisma migrations
```

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run migrate      # Run database migrations
npm run seed         # Seed database
```

## 🚀 Deployment

### Environment Variables cho Production

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secure-secret-key
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
- **Input Validation** - Request validation
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt password hashing
- **SQL Injection Protection** - Prisma ORM protection

## 📊 Monitoring

- **Health Check Endpoint** - `/health`
- **Structured Logging** - Winston logger
- **Error Tracking** - Centralized error handling
- **Request Logging** - Morgan HTTP logger

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
