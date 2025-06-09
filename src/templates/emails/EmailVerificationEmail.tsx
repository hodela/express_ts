import * as React from 'react';
import { Text } from '@react-email/components';
import { BaseEmailTemplate } from './BaseEmailTemplate';
import { getEmailMessages } from '../../locales';

interface EmailVerificationEmailProps {
  verificationUrl: string;
  language?: string;
  companyName?: string;
  companyLogo?: string;
}

export const EmailVerificationEmail: React.FC<EmailVerificationEmailProps> = ({
  verificationUrl,
  language = 'en',
  companyName,
  companyLogo,
}) => {
  const messages = getEmailMessages(language);

  return (
    <BaseEmailTemplate
      title={messages.emailVerification.title}
      description={messages.emailVerification.description}
      buttonText={messages.emailVerification.buttonText}
      buttonUrl={verificationUrl}
      footerText={messages.emailVerification.footerText}
      companyName={companyName}
      companyLogo={companyLogo}
      additionalContent={
        <Text style={infoText}>
          {messages.emailVerification.expirationText}
        </Text>
      }
    />
  );
};

const infoText = {
  color: '#3b82f6',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
  backgroundColor: '#dbeafe',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #93c5fd',
};
