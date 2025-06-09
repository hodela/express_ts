import fs from 'fs/promises';
import path from 'path';
import { logError, logSuccess } from '../../config/logger';
import { getPublicUrl, getUploadPath } from '../../config/upload.config';
import { IUploadResult, IUploadService } from '../../types/upload.types';

export class LocalUploadService implements IUploadService {
  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      const uploadPath = getUploadPath();
      await fs.mkdir(uploadPath, { recursive: true });
      logSuccess('Upload directory ensured', { path: uploadPath });
    } catch (error) {
      logError(error as Error, 'Failed to create upload directory');
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<IUploadResult> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.originalname);
      const filename = `${timestamp}-${randomString}${fileExtension}`;

      const uploadPath = getUploadPath();
      const filePath = path.join(uploadPath, filename);

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      const result: IUploadResult = {
        filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: getPublicUrl(filename),
        path: filePath,
      };

      logSuccess('File uploaded successfully', {
        filename,
        originalName: file.originalname,
        size: file.size,
      });

      return result;
    } catch (error) {
      logError(error as Error, 'Failed to upload file');
      throw error;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const uploadPath = getUploadPath();
      const filePath = path.join(uploadPath, filename);

      // Check if file exists before attempting to delete
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        logSuccess('File deleted successfully', { filename });
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          logSuccess('File not found for deletion', { filename });
          return;
        }
        throw error;
      }
    } catch (error) {
      logError(error as Error, 'Failed to delete file');
      throw error;
    }
  }

  getFileUrl(filename: string): string {
    return getPublicUrl(filename);
  }
}
