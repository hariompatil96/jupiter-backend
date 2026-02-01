const authService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, 'User registered successfully', result);
  });

  /**
   * POST /api/auth/login
   * Login user
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return ApiResponse.success(res, MESSAGES.LOGIN_SUCCESS, result);
  });

  /**
   * POST /api/auth/refresh
   * Refresh access token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    return ApiResponse.success(res, MESSAGES.TOKEN_REFRESHED, tokens);
  });

  /**
   * POST /api/auth/logout
   * Logout user
   */
  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);
    return ApiResponse.success(res, MESSAGES.LOGOUT_SUCCESS);
  });

  /**
   * POST /api/auth/change-password
   * Change user password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    return ApiResponse.success(res, 'Password changed successfully');
  });

  /**
   * GET /api/auth/profile
   * Get user profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    return ApiResponse.success(res, 'Profile retrieved successfully', user);
  });

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, 'Profile updated successfully', user);
  });

  /**
   * GET /api/auth/me
   * Get current authenticated user
   */
  me = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    return ApiResponse.success(res, 'User retrieved successfully', user);
  });
}

module.exports = new AuthController();
