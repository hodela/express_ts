import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { uploadConfig } from '../config/upload.config';
import { logError } from '../config/logger';

// Custom error class for upload errors
export class UploadError extends Error {
  statusCode: number;
  code: string;

  constructor(
    message: string,
    statusCode: number = 400,
    code: string = 'UPLOAD_ERROR'
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'UploadError';
  }
}

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Check file extension
  const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

  if (
    !fileExtension ||
    !uploadConfig.allowedExtensions.includes(fileExtension)
  ) {
    const error = new UploadError(
      `Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${uploadConfig.allowedExtensions.join(', ')}`,
      400,
      'INVALID_FILE_TYPE'
    );
    return cb(error);
  }

  // Check mimetype
  const allowedMimetypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (!allowedMimetypes.includes(file.mimetype)) {
    const error = new UploadError(
      'Định dạng file không hợp lệ',
      400,
      'INVALID_MIMETYPE'
    );
    return cb(error);
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory for processing
  limits: {
    fileSize: uploadConfig.maxFileSize,
  },
  fileFilter,
});

// Middleware for single file upload
export const uploadSingle = (fieldName: string = 'avatar') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadMiddleware = upload.single(fieldName);

    uploadMiddleware(req, res, (error: any) => {
      if (error) {
        if (error instanceof multer.MulterError) {
          let message = 'Lỗi upload file';
          let code = 'UPLOAD_ERROR';

          switch (error.code) {
            case 'LIMIT_FILE_SIZE':
              message = `Kích thước file quá lớn. Tối đa ${Math.floor(uploadConfig.maxFileSize / 1024 / 1024)}MB`;
              code = 'FILE_TOO_LARGE';
              break;
            case 'LIMIT_FILE_COUNT':
              message = 'Quá nhiều file được upload';
              code = 'TOO_MANY_FILES';
              break;
            case 'LIMIT_UNEXPECTED_FILE':
              message = 'Field name không hợp lệ';
              code = 'INVALID_FIELD_NAME';
              break;
            default:
              message = error.message;
          }

          logError(error, 'Upload Middleware');
          return res.status(400).json({
            message,
            code,
          });
        }

        if (error instanceof UploadError) {
          logError(error, 'Upload Middleware');
          return res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
          });
        }

        logError(error, 'Upload Middleware');
        return res.status(500).json({
          message: 'Lỗi server khi upload file',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      next();
    });
  };
};

// Middleware to validate uploaded file
export const validateUploadedFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'Không tìm thấy file để upload',
      code: 'NO_FILE_UPLOADED',
    });
  }

  next();
};
