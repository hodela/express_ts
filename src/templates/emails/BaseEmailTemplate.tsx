import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Img,
} from '@react-email/components';

interface BaseEmailTemplateProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
  additionalContent?: React.ReactNode;
  companyName?: string;
  companyLogo?: string;
}

export const BaseEmailTemplate: React.FC<BaseEmailTemplateProps> = ({
  title,
  description,
  buttonText,
  buttonUrl,
  footerText,
  additionalContent,
  companyName = 'Your Company',
  companyLogo,
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            {companyLogo ? (
              <Img
                src={companyLogo}
                width="120"
                height="40"
                alt={companyName}
                style={logo}
              />
            ) : (
              <Text style={logoText}>{companyName}</Text>
            )}
          </Section>

          <Section style={content}>
            <Heading style={h1}>{title}</Heading>
            <Text style={text}>{description}</Text>

            {additionalContent}

            {buttonText && buttonUrl && (
              <Section style={buttonContainer}>
                <Button href={buttonUrl} style={button}>
                  {buttonText}
                </Button>
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            {footerText && <Text style={footerTextStyle}>{footerText}</Text>}
            <Text style={footerTextStyle}>
              © 2025 {companyName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
  margin: '40px auto',
  padding: '40px',
  width: '465px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0',
};

const content = {
  marginBottom: '32px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
  cursor: 'pointer',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  textAlign: 'center' as const,
};

const footerTextStyle = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};
