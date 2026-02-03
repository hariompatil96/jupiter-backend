const express = require('express');
const authController = require('./auth.controller');
const { authenticate, optionalAuth } = require('../../middlewares/auth.middleware');
const {
  validate,
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require('./auth.validation');

const router = express.Router();

// Public routes (optionalAuth allows both authenticated and unauthenticated requests)
// - ADMIN registration: No authentication required (first-time setup)
// - HR/STUDENT registration: Requires ADMIN authentication
router.post('/register', optionalAuth, validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.get('/me', authenticate, authController.me);

module.exports = router;
