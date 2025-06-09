# Email Service Hướng Dẫn Sử Dụng

## Tổng Quan

Email service đã được triển khai với **Resend** và **React Email** để gửi email với hỗ trợ đa ngôn ngữ (tiếng Anh và tiếng Việt).

## Cấu Hình

### 1. Cài Đặt Dependencies

Các package đã được cài đặt:

- `resend`: Service gửi email
- `@react-email/components`: React components cho email
- `@react-email/render`: Render React thành HTML
- `react` và `react-dom`: React library

### 2. Biến Môi Trường

Thêm các biến sau vào file `.env`:

```env
# Email Configuration
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
COMPANY_NAME=Your Company
COMPANY_LOGO_URL=https://yourdomain.com/logo.png
FRONTEND_URL=http://localhost:3000
```

### 3. Lấy Resend API Key

1. Đăng ký tại [resend.com](https://resend.com)
2. Tạo API key mới
3. Thêm domain của bạn vào Resend
4. Copy API key vào file `.env`

## Cấu Trúc Email Service

### Ngôn Ngữ Hỗ Trợ

Email service hỗ trợ 2 ngôn ngữ:

- `en`: Tiếng Anh (mặc định)
- `vi`: Tiếng Việt

Tất cả text trong email được quản lý tập trung tại `src/locales/index.ts`.

### Email Templates

Có 3 loại email template:

1. **Password Reset Email** (`src/templates/emails/PasswordResetEmail.tsx`)
2. **Welcome Email** (`src/templates/emails/WelcomeEmail.tsx`)
3. **Email Verification** (`src/templates/emails/EmailVerificationEmail.tsx`)

Tất cả đều kế thừa từ `BaseEmailTemplate.tsx` để đảm bảo giao diện nhất quán.

## Cách Sử Dụng

### 1. Gửi Email Đặt Lại Mật Khẩu

```typescript
import { EmailService } from '../services/email.service';

// Tiếng Anh
await EmailService.sendPasswordResetEmail(
  'user@example.com',
  'reset-token-123',
  'en'
);

// Tiếng Việt
await EmailService.sendPasswordResetEmail(
  'user@example.com',
  'reset-token-123',
  'vi'
);
```

### 2. Gửi Email Chào Mừng

```typescript
// Tiếng Anh với dashboard link
await EmailService.sendWelcomeEmail(
  'newuser@example.com',
  'John Doe',
  'en',
  'https://yourdomain.com/dashboard'
);

// Tiếng Việt không có dashboard link
await EmailService.sendWelcomeEmail(
  'newuser@example.com',
  'Nguyễn Văn A',
  'vi'
);
```

### 3. Gửi Email Xác Minh

```typescript
// Tiếng Anh
await EmailService.sendVerificationEmail(
  'verify@example.com',
  'verification-token-789',
  'en'
);

// Tiếng Việt
await EmailService.sendVerificationEmail(
  'verify@example.com',
  'verification-token-789',
  'vi'
);
```

## Test trong Controller

```typescript
import { EmailService } from '../services/email.service';

// Trong auth controller
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const language = req.headers['accept-language']?.includes('vi')
      ? 'vi'
      : 'en';

    // Tạo reset token
    const resetToken = generateResetToken();

    // Gửi email
    await EmailService.sendPasswordResetEmail(email, resetToken, language);

    res.json({
      success: true,
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

## Tùy Chỉnh Email

### 1. Thêm Ngôn Ngữ Mới

Trong `src/locales/index.ts`:

```typescript
export const emailMessages: Record<string, IEmailMessages> = {
  en: {
    /* English messages */
  },
  vi: {
    /* Vietnamese messages */
  },
  ja: {
    /* Japanese messages */
  },
  // Thêm ngôn ngữ mới
};
```

### 2. Tùy Chỉnh Template

Chỉnh sửa file trong `src/templates/emails/` để thay đổi giao diện:

```typescript
// Thay đổi màu sắc, font, layout trong BaseEmailTemplate.tsx
const button = {
  backgroundColor: '#your-brand-color',
  // ...
};
```

### 3. Thêm Email Template Mới

1. Tạo component mới trong `src/templates/emails/`
2. Thêm messages vào `src/locales/index.ts`
3. Thêm method vào `EmailService`

## Lỗi Thường Gặp

### 1. RESEND_API_KEY không được thiết lập

```
Error: RESEND_API_KEY environment variable is required
```

**Giải pháp**: Thêm `RESEND_API_KEY` vào file `.env`

### 2. Domain chưa được verify

```
Error: The domain 'yourdomain.com' is not verified in Resend
```

**Giải pháp**: Verify domain trong Resend dashboard

### 3. JSX/TypeScript errors

```
Error: Cannot use JSX unless the '--jsx' flag is provided
```

**Giải pháp**: Đã được fix trong `tsconfig.json` với `"jsx": "react-jsx"`

## Tính Năng Nâng Cao

### 1. Email Analytics

Resend cung cấp analytics cho email:

- Open rates
- Click rates
- Bounce rates

### 2. Email Templates Preview

Có thể tạo preview route để xem email templates:

```typescript
// Trong routes
app.get('/preview/password-reset', (req, res) => {
  const html = render(
    React.createElement(PasswordResetEmail, {
      resetUrl: 'https://example.com/reset',
      language: 'vi',
    })
  );
  res.send(html);
});
```

### 3. Batch Email

Để gửi email hàng loạt:

```typescript
const emails = [
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' },
];

for (const user of emails) {
  await EmailService.sendWelcomeEmail(user.email, user.name, 'vi');
}
```

## Best Practices

1. **Luôn xử lý errors**: Wrap email calls trong try-catch
2. **Log email events**: Sử dụng pino logger để track
3. **Rate limiting**: Tránh gửi quá nhiều email cùng lúc
4. **Template testing**: Test templates trước khi deploy
5. **Language detection**: Tự động detect ngôn ngữ từ user preferences

## Troubleshooting

- Kiểm tra logs trong `logs/` folder
- Verify API key và domain trong Resend
- Test với email thật trước khi production
- Monitor email delivery rates
