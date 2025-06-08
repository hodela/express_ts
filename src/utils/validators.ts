import { body, param, query } from 'express-validator';
import { VALIDATION_MESSAGES } from './constants';

// Auth validators
export const registerValidator = [
  body('firstName')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED)
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED)
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage(VALIDATION_MESSAGES.REQUIRED),
];

export const forgotPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
];

// User validators
export const updateProfileValidator = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage(VALIDATION_MESSAGES.INVALID_EMAIL)
    .normalizeEmail(),
];

export const userIdValidator = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
];

// Pagination validators
export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
]; 