export interface IEmailMessages {
  passwordReset: {
    subject: string;
    title: string;
    description: string;
    buttonText: string;
    footerText: string;
    expirationText: string;
    ignoreText: string;
  };
  welcome: {
    subject: string;
    title: string;
    description: string;
    buttonText: string;
    footerText: string;
  };
  emailVerification: {
    subject: string;
    title: string;
    description: string;
    buttonText: string;
    footerText: string;
    expirationText: string;
  };
}

export const emailMessages: Record<string, IEmailMessages> = {
  en: {
    passwordReset: {
      subject: 'Password Reset Request',
      title: 'Reset your password',
      description:
        'You requested a password reset. Click the button below to reset your password:',
      buttonText: 'Reset Password',
      footerText:
        'If you did not request this password reset, please ignore this email.',
      expirationText: 'This link will expire in 10 minutes.',
      ignoreText: "If you didn't request this, please ignore this email.",
    },
    welcome: {
      subject: 'Welcome to our platform!',
      title: 'Welcome aboard!',
      description:
        "Thank you for joining us. We're excited to have you on board!",
      buttonText: 'Get Started',
      footerText: "We're here to help if you have any questions.",
    },
    emailVerification: {
      subject: 'Verify your email address',
      title: 'Verify your email',
      description:
        'Please click the button below to verify your email address:',
      buttonText: 'Verify Email',
      footerText: 'If you did not create an account, please ignore this email.',
      expirationText: 'This link will expire in 24 hours.',
    },
  },
  vi: {
    passwordReset: {
      subject: 'Yêu cầu đặt lại mật khẩu',
      title: 'Đặt lại mật khẩu của bạn',
      description:
        'Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào nút bên dưới để đặt lại mật khẩu:',
      buttonText: 'Đặt lại mật khẩu',
      footerText:
        'Nếu bạn không yêu cầu đặt lại mật khẩu này, vui lòng bỏ qua email này.',
      expirationText: 'Liên kết này sẽ hết hạn trong 10 phút.',
      ignoreText: 'Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.',
    },
    welcome: {
      subject: 'Chào mừng đến với nền tảng của chúng tôi!',
      title: 'Chào mừng bạn!',
      description:
        'Cảm ơn bạn đã tham gia cùng chúng tôi. Chúng tôi rất vui khi có bạn!',
      buttonText: 'Bắt đầu',
      footerText: 'Chúng tôi sẵn sàng hỗ trợ nếu bạn có bất kỳ câu hỏi nào.',
    },
    emailVerification: {
      subject: 'Xác minh địa chỉ email của bạn',
      title: 'Xác minh email của bạn',
      description:
        'Vui lòng nhấp vào nút bên dưới để xác minh địa chỉ email của bạn:',
      buttonText: 'Xác minh Email',
      footerText: 'Nếu bạn không tạo tài khoản, vui lòng bỏ qua email này.',
      expirationText: 'Liên kết này sẽ hết hạn trong 24 giờ.',
    },
  },
};

export const getEmailMessages = (language: string = 'en'): IEmailMessages => {
  return emailMessages[language] || emailMessages.en;
};
