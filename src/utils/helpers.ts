import crypto from 'crypto';

export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateRandomNumber = (min: number = 100000, max: number = 999999): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 6 characters, contains at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

export const sanitizeUser = (user: any) => {
  const { password, resetToken, resetTokenExpiry, ...sanitizedUser } = user;
  return sanitizedUser;
};

export const formatResponse = (success: boolean, data?: any, message?: string, error?: any) => {
  const response: any = { success };
  
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  if (error) response.error = error;
  
  return response;
};

export const calculatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getClientIp = (req: any): string => {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.headers['x-forwarded-for']?.split(',')[0] ||
         'unknown';
};

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(username.length - 2)
    : username;
  return `${maskedUsername}@${domain}`;
}; 