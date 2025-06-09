import path from 'path';
import { IUploadConfig } from '../types/upload.types';

export const uploadConfig: IUploadConfig = {
  engine: (process.env.UPLOAD_ENGINE as IUploadConfig['engine']) || 'local',
  maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || '5242880'), // 5MB default
  allowedExtensions: (
    process.env.UPLOAD_ALLOWED_EXTENSIONS || 'jpg,jpeg,png,gif,webp'
  ).split(','),
  uploadPath: process.env.UPLOAD_PATH || 'src/assets/upload',
  urlPrefix: process.env.UPLOAD_URL_PREFIX || '/uploads',
};

// Ensure upload directory exists
export const getUploadPath = (): string => {
  return path.resolve(uploadConfig.uploadPath!);
};

export const getPublicUrl = (filename: string): string => {
  return `${uploadConfig.urlPrefix}/${filename}`;
};
