const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');
const { MESSAGES } = require('../utils/constants');
const { asyncHandler } = require('./error.middleware');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Check for token in cookies (if using cookie-based auth)
  if (!token && req.cookies) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return ApiResponse.unauthorized(res, MESSAGES.UNAUTHORIZED);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Attach user info to request (include studentId for STUDENT users)
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      ...(decoded.studentId && { studentId: decoded.studentId }),
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, MESSAGES.TOKEN_EXPIRED);
    }
    return ApiResponse.unauthorized(res, MESSAGES.TOKEN_INVALID);
  }
});

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't block if not
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        ...(decoded.studentId && { studentId: decoded.studentId }),
      };
    } catch (error) {
      // Token invalid or expired, continue without user
      req.user = null;
    }
  }

  next();
});

/**
 * Refresh token verification middleware
 */
const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return ApiResponse.badRequest(res, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      ...(decoded.studentId && { studentId: decoded.studentId }),
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Refresh token has expired');
    }
    return ApiResponse.unauthorized(res, 'Invalid refresh token');
  }
});

module.exports = {
  authenticate,
  optionalAuth,
  verifyRefreshToken,
};
