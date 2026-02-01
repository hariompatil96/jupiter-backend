const ApiResponse = require('../utils/apiResponse');
const { MESSAGES, ROLES } = require('../utils/constants');

/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return ApiResponse.unauthorized(res, MESSAGES.UNAUTHORIZED);
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Admin only middleware
 */
const adminOnly = authorize(ROLES.ADMIN);

/**
 * HR only middleware
 */
const hrOnly = authorize(ROLES.HR);

/**
 * Admin or HR middleware
 */
const adminOrHr = authorize(ROLES.ADMIN, ROLES.HR);

/**
 * Student only middleware
 */
const studentOnly = authorize(ROLES.STUDENT);

/**
 * All authenticated users middleware
 */
const allRoles = authorize(ROLES.ADMIN, ROLES.HR, ROLES.STUDENT);

/**
 * Check if user owns the resource or is admin/HR
 * @param {string} paramName - The request parameter containing the resource owner ID
 */
const ownerOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, MESSAGES.UNAUTHORIZED);
    }

    const resourceOwnerId = req.params[paramName];
    const isOwner = req.user.id === resourceOwnerId;
    const isAdminOrHr = [ROLES.ADMIN, ROLES.HR].includes(req.user.role);

    if (!isOwner && !isAdminOrHr) {
      return ApiResponse.forbidden(res, MESSAGES.FORBIDDEN);
    }

    next();
  };
};

/**
 * Restrict STUDENT role from accessing certain endpoints
 * Students can only access their own data (aligned with Java)
 * @param {string} studentIdParam - The request parameter containing the student ID
 */
const studentOwnDataOnly = (studentIdParam = 'studentId') => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, MESSAGES.UNAUTHORIZED);
    }

    // Admin and HR can access all data
    if ([ROLES.ADMIN, ROLES.HR].includes(req.user.role)) {
      return next();
    }

    // Students can only access their own data
    if (req.user.role === ROLES.STUDENT) {
      const requestedStudentId = req.params[studentIdParam];

      // If student ID is in params, check if it matches the user's linked student
      if (requestedStudentId && req.user.studentId) {
        if (requestedStudentId !== req.user.studentId.toString()) {
          return ApiResponse.forbidden(
            res,
            'Students can only access their own data'
          );
        }
      }
    }

    next();
  };
};

/**
 * Block STUDENT role from accessing list endpoints
 * Aligned with Java - students cannot list all resources
 */
const blockStudentList = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.unauthorized(res, MESSAGES.UNAUTHORIZED);
  }

  // Block students from accessing list endpoints
  if (req.user.role === ROLES.STUDENT) {
    return ApiResponse.forbidden(
      res,
      'Students cannot access this endpoint. Please contact HR or Admin.'
    );
  }

  next();
};

/**
 * Check if student is accessing their own profile
 * For student routes where ID might be the student's own ID
 */
const studentSelfOrAdminHr = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, MESSAGES.UNAUTHORIZED);
    }

    // Admin and HR can access any profile
    if ([ROLES.ADMIN, ROLES.HR].includes(req.user.role)) {
      return next();
    }

    // Students can only access their own profile
    if (req.user.role === ROLES.STUDENT) {
      const requestedId = req.params[paramName];

      // Check if the requested ID matches the user's linked student ID
      if (req.user.studentId && requestedId === req.user.studentId.toString()) {
        return next();
      }

      return ApiResponse.forbidden(
        res,
        'Students can only access their own profile'
      );
    }

    next();
  };
};

module.exports = {
  authorize,
  adminOnly,
  hrOnly,
  adminOrHr,
  studentOnly,
  allRoles,
  ownerOrAdmin,
  studentOwnDataOnly,
  blockStudentList,
  studentSelfOrAdminHr,
};
