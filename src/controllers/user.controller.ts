import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../middlewares/error.middleware';
import { UserService } from '../services/user.service';
import { logSuccess, logError } from '../config/logger';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Get Profile'
      );
      return res.status(401).json({
        message: 'Không thể lấy thông tin profile',
        code: 'GET_PROFILE_FAILED',
      });
    }

    const user = await UserService.findById(req.user.id);

    logSuccess('Profile retrieved successfully', { userId: req.user.id });
    res.json(user);
  } catch (error) {
    logError(error as Error, 'User Controller - Get Profile');
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Update Profile'
      );
      return res.status(401).json({
        message: 'Cập nhật profile thất bại',
        code: 'UPDATE_PROFILE_FAILED',
      });
    }

    const { name, avatar, theme, language } = req.body;

    const updatedUser = await UserService.updateById(req.user.id, {
      name,
      avatar,
      theme,
      language,
    });

    logSuccess('Profile updated successfully', {
      userId: req.user.id,
      updatedFields: { name, avatar, theme, language },
    });
    res.json({
      user: updatedUser,
      message: 'Cập nhật profile thành công',
    });
  } catch (error) {
    logError(error as Error, 'User Controller - Update Profile');
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Change Password'
      );
      return res.status(401).json({
        message: 'Thay đổi mật khẩu thất bại',
        code: 'CHANGE_PASSWORD_FAILED',
      });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      logError(
        new Error('Password confirmation mismatch'),
        'User Controller - Change Password'
      );
      return res.status(400).json({
        message: 'Thay đổi mật khẩu thất bại',
        code: 'CHANGE_PASSWORD_FAILED',
        details: {
          confirmPassword: ['Mật khẩu xác nhận không khớp'],
        },
      });
    }

    try {
      await UserService.changePassword(req.user.id, oldPassword, newPassword);

      logSuccess('Password changed successfully', { userId: req.user.id });
      res.json({
        message: 'Thay đổi mật khẩu thành công',
      });
    } catch (error: any) {
      if (error.message === 'Old password is incorrect') {
        logError(error, 'User Controller - Change Password');
        return res.status(400).json({
          message: 'Thay đổi mật khẩu thất bại',
          code: 'CHANGE_PASSWORD_FAILED',
          details: {
            oldPassword: ['Mật khẩu cũ không đúng'],
          },
        });
      }
      throw error;
    }
  } catch (error) {
    logError(error as Error, 'User Controller - Change Password');
    next(error);
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Upload Avatar'
      );
      return res.status(401).json({
        message: 'Upload avatar thất bại',
        code: 'UPLOAD_AVATAR_FAILED',
      });
    }

    // For now, we'll just simulate the upload process
    // In a real application, you would handle file upload here
    const avatarUrl = `https://example.com/avatars/${req.user.id}-${Date.now()}.jpg`;

    await UserService.updateById(req.user.id, {
      avatar: avatarUrl,
    });

    logSuccess('Avatar uploaded successfully', {
      userId: req.user.id,
      avatarUrl,
    });
    res.json({
      avatarUrl,
    });
  } catch (error) {
    logError(error as Error, 'User Controller - Upload Avatar');
    next(error);
  }
};

export const deleteAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Delete Avatar'
      );
      return res.status(401).json({
        message: 'Xóa avatar thất bại',
        code: 'DELETE_AVATAR_FAILED',
      });
    }

    await UserService.updateById(req.user.id, {
      avatar: null,
    });

    logSuccess('Avatar deleted successfully', { userId: req.user.id });
    res.json({
      message: 'Xóa avatar thành công',
    });
  } catch (error) {
    logError(error as Error, 'User Controller - Delete Avatar');
    next(error);
  }
};

export const updateTheme = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Update Theme'
      );
      return res.status(401).json({
        message: 'Cập nhật theme thất bại',
        code: 'UPDATE_THEME_FAILED',
      });
    }

    const { theme } = req.body;

    // Validate theme
    if (!['light', 'dark', 'system'].includes(theme)) {
      logError(
        new Error(`Invalid theme: ${theme}`),
        'User Controller - Update Theme'
      );
      return res.status(400).json({
        message: 'Cập nhật theme thất bại',
        code: 'UPDATE_THEME_FAILED',
        details: {
          theme: ["Theme phải là 'light', 'dark' hoặc 'system'"],
        },
      });
    }

    const updatedUser = await UserService.updateById(req.user.id, { theme });

    logSuccess('Theme updated successfully', { userId: req.user.id, theme });
    res.json(updatedUser);
  } catch (error) {
    logError(error as Error, 'User Controller - Update Theme');
    next(error);
  }
};

export const updateLanguage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      logError(
        new Error('User not authenticated'),
        'User Controller - Update Language'
      );
      return res.status(401).json({
        message: 'Cập nhật ngôn ngữ thất bại',
        code: 'UPDATE_LANGUAGE_FAILED',
      });
    }

    const { language } = req.body;

    // Validate language
    if (!['vi', 'en'].includes(language)) {
      logError(
        new Error(`Invalid language: ${language}`),
        'User Controller - Update Language'
      );
      return res.status(400).json({
        message: 'Cập nhật ngôn ngữ thất bại',
        code: 'UPDATE_LANGUAGE_FAILED',
        details: {
          language: ["Ngôn ngữ phải là 'vi' hoặc 'en'"],
        },
      });
    }

    const updatedUser = await UserService.updateById(req.user.id, { language });

    logSuccess('Language updated successfully', {
      userId: req.user.id,
      language,
    });
    res.json(updatedUser);
  } catch (error) {
    logError(error as Error, 'User Controller - Update Language');
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const users = await UserService.findAll({
      page,
      limit,
      search,
    });

    logSuccess('All users retrieved successfully', {
      page,
      limit,
      search: search || 'none',
      totalUsers: users.pagination.total,
    });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    logError(error as Error, 'User Controller - Get All Users');
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await UserService.findById(id);

    logSuccess('User retrieved by ID successfully', { userId: id });
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logError(error as Error, 'User Controller - Get User By ID');
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user && req.user.id === id) {
      const error: CustomError = new Error('Cannot delete your own account');
      error.statusCode = 400;
      logError(error, 'User Controller - Delete User');
      throw error;
    }

    await UserService.deleteById(id);

    logSuccess('User deleted by admin successfully', {
      deletedUserId: id,
      adminUserId: req.user?.id,
    });
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logError(error as Error, 'User Controller - Delete User');
    next(error);
  }
};
