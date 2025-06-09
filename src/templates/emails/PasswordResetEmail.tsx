import * as React from 'react';
import { Text } from '@react-email/components';
import { BaseEmailTemplate } from './BaseEmailTemplate';
import { getEmailMessages } from '../../locales';

interface PasswordResetEmailProps {
  resetUrl: string;
  language?: string;
  companyName?: string;
  companyLogo?: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetUrl,
  language = 'en',
  companyName,
  companyLogo,
}) => {
  const messages = getEmailMessages(language);

  return (
    <BaseEmailTemplate
      title={messages.passwordReset.title}
      description={messages.passwordReset.description}
      buttonText={messages.passwordReset.buttonText}
      buttonUrl={resetUrl}
      footerText={messages.passwordReset.footerText}
      companyName={companyName}
      companyLogo={companyLogo}
      additionalContent={
        <Text style={warningText}>{messages.passwordReset.expirationText}</Text>
      }
    />
  );
};

const warningText = {
  color: '#f59e0b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
  backgroundColor: '#fef3c7',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #fcd34d',
};
