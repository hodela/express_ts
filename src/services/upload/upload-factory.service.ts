import { IUploadService } from '../../types/upload.types';
import { uploadConfig } from '../../config/upload.config';
import { LocalUploadService } from './local-upload.service';

export class UploadFactory {
  static createUploadService(): IUploadService {
    switch (uploadConfig.engine) {
      case 'local':
        return new LocalUploadService();
      // case 'aws':
      //   return new AWSUploadService();
      // case 'cloudinary':
      //   return new CloudinaryUploadService();
      // case 'gcp':
      //   return new GCPUploadService();
      default:
        throw new Error(`Unsupported upload engine: ${uploadConfig.engine}`);
    }
  }
}

// Export singleton instance
export const uploadService = UploadFactory.createUploadService();
