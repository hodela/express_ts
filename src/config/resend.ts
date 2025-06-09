import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
  companyName: process.env.COMPANY_NAME || 'Your Company',
  companyLogo: process.env.COMPANY_LOGO_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
