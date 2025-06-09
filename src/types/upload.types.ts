export interface IUploadConfig {
  engine: 'local' | 'aws' | 'cloudinary' | 'gcp';
  maxFileSize: number;
  allowedExtensions: string[];
  uploadPath?: string;
  urlPrefix?: string;
  // AWS S3 config (for future use)
  awsConfig?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  // Cloudinary config (for future use)
  cloudinaryConfig?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export interface IUploadResult {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  path?: string;
}

export interface IUploadService {
  uploadFile(file: Express.Multer.File): Promise<IUploadResult>;
  deleteFile(filename: string): Promise<void>;
  getFileUrl(filename: string): string;
}

export interface IUploadMiddleware {
  single(fieldName: string): any;
  validateFile(file: Express.Multer.File): void;
}
