import { EmailService } from '../../src/services/email.service';

// Logger is already mocked in setup.ts, import after mocking
const { logger } = require('../../src/config/logger');

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default environment variables
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  describe('sendPasswordResetEmail', () => {
    it('should log password reset email details', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      await EmailService.sendPasswordResetEmail(email, resetToken);

      expect(logger.info).toHaveBeenCalledWith(
        'Password reset email would be sent:',
        {
          to: email,
          resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`,
          resetToken,
        }
      );
    });

    it('should use default frontend URL when FRONTEND_URL is not set', async () => {
      delete process.env.FRONTEND_URL;

      const email = 'test@example.com';
      const resetToken = 'reset-token-123';

      await EmailService.sendPasswordResetEmail(email, resetToken);

      expect(logger.info).toHaveBeenCalledWith(
        'Password reset email would be sent:',
        {
          to: email,
          resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`,
          resetToken,
        }
      );

      // Restore for other tests
      process.env.FRONTEND_URL = 'http://localhost:3000';
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should log welcome email details', async () => {
      const email = 'test@example.com';
      const firstName = 'John';

      await EmailService.sendWelcomeEmail(email, firstName);

      expect(logger.info).toHaveBeenCalledWith('Welcome email would be sent:', {
        to: email,
        firstName,
      });
    });
  });

  describe('sendVerificationEmail', () => {
    it('should log verification email details', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      await EmailService.sendVerificationEmail(email, verificationToken);

      expect(logger.info).toHaveBeenCalledWith(
        'Verification email would be sent:',
        {
          to: email,
          verificationUrl: `http://localhost:3000/verify-email?token=${verificationToken}`,
        }
      );
    });

    it('should use default frontend URL when FRONTEND_URL is not set', async () => {
      delete process.env.FRONTEND_URL;

      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';

      await EmailService.sendVerificationEmail(email, verificationToken);

      expect(logger.info).toHaveBeenCalledWith(
        'Verification email would be sent:',
        {
          to: email,
          verificationUrl: `http://localhost:3000/verify-email?token=${verificationToken}`,
        }
      );

      // Restore for other tests
      process.env.FRONTEND_URL = 'http://localhost:3000';
    });
  });
});
