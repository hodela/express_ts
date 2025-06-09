import { EmailService } from '../../src/services/email.service';
import { render } from '@react-email/render';
import { resend, emailConfig } from '../../src/config/resend';
import { logSuccess, logError } from '../../src/config/logger';
import { getEmailMessages } from '../../src/locales';

// Mock dependencies
jest.mock('@react-email/render');
jest.mock('../../src/config/resend', () => ({
  resend: {
    emails: {
      send: jest.fn(),
    },
  },
  emailConfig: {
    from: 'noreply@test.com',
    companyName: 'Test Company',
    companyLogo: 'https://test.com/logo.png',
    frontendUrl: 'http://localhost:3000',
  },
}));
jest.mock('../../src/config/logger');
jest.mock('../../src/locales');

const mockRender = render as jest.MockedFunction<typeof render>;
const mockResendSend = resend.emails.send as jest.MockedFunction<
  typeof resend.emails.send
>;
const mockLogSuccess = logSuccess as jest.MockedFunction<typeof logSuccess>;
const mockLogError = logError as jest.MockedFunction<typeof logError>;
const mockGetEmailMessages = getEmailMessages as jest.MockedFunction<
  typeof getEmailMessages
>;

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockRender.mockResolvedValue('<html>Mock HTML</html>');
    mockGetEmailMessages.mockReturnValue({
      passwordReset: { subject: 'Reset your password' },
      welcome: { subject: 'Welcome!' },
      emailVerification: { subject: 'Verify your email' },
    } as any);

    // Setup environment variables
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';
      const language = 'en';

      mockResendSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      } as any);

      await EmailService.sendPasswordResetEmail(email, resetToken, language);

      // Verify email rendering
      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(Function),
          props: expect.objectContaining({
            resetUrl: `http://localhost:3000/auth/reset-password?token=${resetToken}`,
            language,
          }),
        })
      );

      // Verify email sending
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: [email],
        subject: 'Reset your password',
        html: '<html>Mock HTML</html>',
      });

      // Verify success logging
      expect(mockLogSuccess).toHaveBeenCalledWith(
        'Password reset email sent successfully',
        {
          to: email,
          resetUrl: `http://localhost:3000/auth/reset-password?token=${resetToken}`,
          emailId: 'email-id-123',
          language,
        }
      );
    });

    it('should use default language when not provided', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      mockResendSend.mockResolvedValue({
        data: { id: 'email-id-123' },
        error: null,
      } as any);

      await EmailService.sendPasswordResetEmail(email, resetToken);

      expect(mockGetEmailMessages).toHaveBeenCalledWith('en');
    });

    it('should handle Resend error', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      mockResendSend.mockResolvedValue({
        data: null,
        error: { message: 'API error' },
      } as any);

      await expect(
        EmailService.sendPasswordResetEmail(email, resetToken)
      ).rejects.toThrow('Resend error: API error');

      expect(mockLogError).toHaveBeenCalledWith(
        expect.any(Error),
        'Email Service - Password Reset'
      );
    });

    it('should handle render error', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      mockRender.mockRejectedValue(new Error('Render failed'));

      await expect(
        EmailService.sendPasswordResetEmail(email, resetToken)
      ).rejects.toThrow('Render failed');

      expect(mockLogError).toHaveBeenCalledWith(
        expect.any(Error),
        'Email Service - Password Reset'
      );
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const email = 'test@example.com';
      const firstName = 'John';
      const language = 'vi';
      const dashboardUrl = 'http://localhost:3000/auth/dashboard';

      mockResendSend.mockResolvedValue({
        data: { id: 'email-id-456' },
        error: null,
      } as any);

      await EmailService.sendWelcomeEmail(
        email,
        firstName,
        language,
        dashboardUrl
      );

      // Verify email rendering
      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(Function),
          props: expect.objectContaining({
            firstName,
            dashboardUrl,
            language,
          }),
        })
      );

      // Verify email sending
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: [email],
        subject: 'Welcome!',
        html: '<html>Mock HTML</html>',
      });

      // Verify success logging
      expect(mockLogSuccess).toHaveBeenCalledWith(
        'Welcome email sent successfully',
        {
          to: email,
          firstName,
          emailId: 'email-id-456',
          language,
        }
      );
    });

    it('should send welcome email without dashboard URL', async () => {
      const email = 'test@example.com';
      const firstName = 'John';

      mockResendSend.mockResolvedValue({
        data: { id: 'email-id-456' },
        error: null,
      } as any);

      await EmailService.sendWelcomeEmail(email, firstName);

      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({
            firstName,
            dashboardUrl: undefined,
            language: 'en',
          }),
        })
      );
    });

    it('should handle Resend error', async () => {
      const email = 'test@example.com';
      const firstName = 'John';

      mockResendSend.mockResolvedValue({
        data: null,
        error: { message: 'Rate limit exceeded' },
      } as any);

      await expect(
        EmailService.sendWelcomeEmail(email, firstName)
      ).rejects.toThrow('Resend error: Rate limit exceeded');

      expect(mockLogError).toHaveBeenCalledWith(
        expect.any(Error),
        'Email Service - Welcome'
      );
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';
      const language = 'vi';

      mockResendSend.mockResolvedValue({
        data: { id: 'email-id-789' },
        error: null,
      } as any);

      await EmailService.sendVerificationEmail(
        email,
        verificationToken,
        language
      );

      // Verify email rendering
      expect(mockRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.any(Function),
          props: expect.objectContaining({
            verificationUrl: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
            language,
          }),
        })
      );

      // Verify email sending
      expect(mockResendSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: [email],
        subject: 'Verify your email',
        html: '<html>Mock HTML</html>',
      });

      // Verify success logging
      expect(mockLogSuccess).toHaveBeenCalledWith(
        'Email verification sent successfully',
        {
          to: email,
          verificationUrl: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
          emailId: 'email-id-789',
          language,
        }
      );
    });

    it('should use default language when not provided', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      mockResendSend.mockResolvedValue({
        data: { id: 'email-id-789' },
        error: null,
      } as any);

      await EmailService.sendVerificationEmail(email, verificationToken);

      expect(mockGetEmailMessages).toHaveBeenCalledWith('en');
    });

    it('should handle network error', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      mockResendSend.mockRejectedValue(new Error('Network error'));

      await expect(
        EmailService.sendVerificationEmail(email, verificationToken)
      ).rejects.toThrow('Network error');

      expect(mockLogError).toHaveBeenCalledWith(
        expect.any(Error),
        'Email Service - Verification'
      );
    });
  });
});
