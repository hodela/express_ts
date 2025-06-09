import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  updateTheme,
  updateLanguage,
  getAllUsers,
  getUserById,
  deleteUser,
  deleteAccount,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  uploadSingle,
  validateUploadedFile,
} from '../middlewares/upload.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get current user profile
router.get('/me', getProfile);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Cập nhật thông tin người dùng hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: URL avatar
 *               theme:
 *                 type: string
 *                 enum: [light, dark, system]
 *                 description: Chủ đề giao diện
 *               language:
 *                 type: string
 *                 enum: [vi, en]
 *                 description: Ngôn ngữ
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update current user profile
router.put(
  '/me',
  validate([
    body('name').optional().notEmpty().withMessage('Tên không được để trống'),
    body('avatar').optional().isURL().withMessage('Avatar không hợp lệ'),
    body('theme')
      .optional()
      .isIn(['light', 'dark', 'system'])
      .withMessage("Theme phải là 'light', 'dark' hoặc 'system'"),
    body('language')
      .optional()
      .isIn(['vi', 'en'])
      .withMessage("Ngôn ngữ phải là 'vi' hoặc 'en'"),
  ]),
  updateProfile
);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu cũ
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: Mật khẩu mới (ít nhất 6 ký tự)
 *               confirmPassword:
 *                 type: string
 *                 description: Xác nhận mật khẩu mới
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Mật khẩu cũ không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Change password
router.put(
  '/change-password',
  validate([
    body('oldPassword')
      .notEmpty()
      .withMessage('Mật khẩu cũ không được để trống'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Mật khẩu xác nhận không được để trống'),
  ]),
  changePassword
);

/**
 * @swagger
 * /api/users/upload-avatar:
 *   post:
 *     summary: Upload avatar
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: File avatar
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 avatarUrl:
 *                   type: string
 *       400:
 *         description: File không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Upload avatar
router.post(
  '/upload-avatar',
  uploadSingle('avatar'),
  validateUploadedFile,
  uploadAvatar
);

/**
 * @swagger
 * /api/users/avatar:
 *   delete:
 *     summary: Xóa avatar
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa avatar thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Delete avatar
router.delete('/avatar', deleteAvatar);

/**
 * @swagger
 * /api/users/theme:
 *   patch:
 *     summary: Cập nhật chủ đề giao diện
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark, system]
 *                 description: Chủ đề giao diện
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update theme
router.patch(
  '/theme',
  validate([
    body('theme')
      .isIn(['light', 'dark', 'system'])
      .withMessage("Theme phải là 'light', 'dark' hoặc 'system'"),
  ]),
  updateTheme
);

/**
 * @swagger
 * /api/users/language:
 *   patch:
 *     summary: Cập nhật ngôn ngữ
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [vi, en]
 *                 description: Ngôn ngữ
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update language
router.patch(
  '/language',
  validate([
    body('language')
      .isIn(['vi', 'en'])
      .withMessage("Ngôn ngữ phải là 'vi' hoặc 'en'"),
  ]),
  updateLanguage
);

/**
 * @swagger
 * /api/users/delete-account:
 *   delete:
 *     summary: Xóa tài khoản của người dùng hiện tại (xóa cứng)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Mật khẩu hiện tại để xác nhận
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Delete current user account
router.delete(
  '/delete-account',
  validate([
    body('password')
      .notEmpty()
      .withMessage('Mật khẩu là bắt buộc để xóa tài khoản'),
  ]),
  deleteAccount
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Số lượng item per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc email
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Admin only routes
router.get('/', authorize('admin'), getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  authorize('admin'),
  validate([param('id').isLength({ min: 1 }).withMessage('Invalid user ID')]),
  getUserById
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  authorize('admin'),
  validate([param('id').isLength({ min: 1 }).withMessage('Invalid user ID')]),
  deleteUser
);

export default router;
