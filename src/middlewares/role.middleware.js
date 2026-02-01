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

module.exports = {
  authorize,
  adminOnly,
  hrOnly,
  adminOrHr,
  studentOnly,
  allRoles,
  ownerOrAdmin,
};
