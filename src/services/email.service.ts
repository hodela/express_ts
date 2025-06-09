import * as React from 'react';
import { render } from '@react-email/render';
import { logSuccess, logError } from '../config/logger';
import { resend, emailConfig } from '../config/resend';
import { getEmailMessages } from '../locales';
import { PasswordResetEmail } from '../templates/emails/PasswordResetEmail';
import { WelcomeEmail } from '../templates/emails/WelcomeEmail';
import { EmailVerificationEmail } from '../templates/emails/EmailVerificationEmail';

export class EmailService {
  static async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    language: string = 'en'
  ): Promise<void> {
    try {
      const resetUrl = `${emailConfig.frontendUrl}/auth/reset-password?token=${resetToken}`;
      const messages = getEmailMessages(language);

      const emailHtml = await render(
        React.createElement(PasswordResetEmail, {
          resetUrl,
          language,
          companyName: emailConfig.companyName,
          companyLogo: emailConfig.companyLogo,
        })
      );

      const { data, error } = await resend.emails.send({
        from: emailConfig.from,
        to: [email],
        subject: messages.passwordReset.subject,
        html: emailHtml,
      });

      if (error) {
        throw new Error(`Resend error: ${error.message}`);
      }

      logSuccess('Password reset email sent successfully', {
        to: email,
        resetUrl,
        emailId: data?.id,
        language,
      });
    } catch (error) {
      logError(error as Error, 'Email Service - Password Reset');
      throw error;
    }
  }

  static async sendWelcomeEmail(
    email: string,
    firstName: string,
    language: string = 'en',
    dashboardUrl?: string
  ): Promise<void> {
    try {
      const messages = getEmailMessages(language);

      const emailHtml = await render(
        React.createElement(WelcomeEmail, {
          firstName,
          dashboardUrl,
          language,
          companyName: emailConfig.companyName,
          companyLogo: emailConfig.companyLogo,
        })
      );

      const { data, error } = await resend.emails.send({
        from: emailConfig.from,
        to: [email],
        subject: messages.welcome.subject,
        html: emailHtml,
      });

      if (error) {
        throw new Error(`Resend error: ${error.message}`);
      }

      logSuccess('Welcome email sent successfully', {
        to: email,
        firstName,
        emailId: data?.id,
        language,
      });
    } catch (error) {
      logError(error as Error, 'Email Service - Welcome');
      throw error;
    }
  }

  static async sendVerificationEmail(
    email: string,
    verificationToken: string,
    language: string = 'en'
  ): Promise<void> {
    try {
      const verificationUrl = `${emailConfig.frontendUrl}/auth/verify-email?token=${verificationToken}`;
      const messages = getEmailMessages(language);

      const emailHtml = await render(
        React.createElement(EmailVerificationEmail, {
          verificationUrl,
          language,
          companyName: emailConfig.companyName,
          companyLogo: emailConfig.companyLogo,
        })
      );

      const { data, error } = await resend.emails.send({
        from: emailConfig.from,
        to: [email],
        subject: messages.emailVerification.subject,
        html: emailHtml,
      });

      if (error) {
        throw new Error(`Resend error: ${error.message}`);
      }

      logSuccess('Email verification sent successfully', {
        to: email,
        verificationUrl,
        emailId: data?.id,
        language,
      });
    } catch (error) {
      logError(error as Error, 'Email Service - Verification');
      throw error;
    }
  }
}
