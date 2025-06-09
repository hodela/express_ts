import * as React from 'react';
import { BaseEmailTemplate } from './BaseEmailTemplate';
import { getEmailMessages } from '../../locales';

interface WelcomeEmailProps {
  firstName: string;
  dashboardUrl?: string;
  language?: string;
  companyName?: string;
  companyLogo?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  firstName,
  dashboardUrl,
  language = 'en',
  companyName,
  companyLogo,
}) => {
  const messages = getEmailMessages(language);

  return (
    <BaseEmailTemplate
      title={`${messages.welcome.title} ${firstName}!`}
      description={messages.welcome.description}
      buttonText={dashboardUrl ? messages.welcome.buttonText : undefined}
      buttonUrl={dashboardUrl}
      footerText={messages.welcome.footerText}
      companyName={companyName}
      companyLogo={companyLogo}
    />
  );
};
