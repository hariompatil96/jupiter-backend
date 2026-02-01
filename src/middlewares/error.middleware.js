const { ZodError } = require('zod');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { MESSAGES } = require('../utils/constants');

/**
 * Custom Application Error class
 */
class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper to catch async errors
 * @param {Function} fn - Async function to wrap
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not Found middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error(`${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    stack: err.stack,
  });

  // Zod Validation Error
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.validationError(res, MESSAGES.VALIDATION_ERROR, errors);
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    return ApiResponse.badRequest(res, message);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for field: ${field}`;
    return ApiResponse.conflict(res, message);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.validationError(res, MESSAGES.VALIDATION_ERROR, errors);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, MESSAGES.TOKEN_INVALID);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, MESSAGES.TOKEN_EXPIRED);
  }

  // Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return ApiResponse.badRequest(res, 'File too large');
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return ApiResponse.badRequest(res, 'Unexpected file field');
  }

  // Operational errors (AppError)
  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Programming or unknown errors
  console.error('ERROR:', err);
  return ApiResponse.serverError(res, MESSAGES.SERVER_ERROR);
};

module.exports = {
  AppError,
  asyncHandler,
  notFoundHandler,
  errorHandler,
};
