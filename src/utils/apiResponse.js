/**
 * Standard API Response utility
 * Ensures consistent response format across all endpoints
 */

class ApiResponse {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Object} data - Response data
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send created response (201)
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Object} data - Response data
   */
  static created(res, message, data = null) {
    return this.success(res, message, data, 201);
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {Object} errors - Detailed errors (optional)
   */
  static error(res, message, statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      data: errors,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send bad request response (400)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors
   */
  static badRequest(res, message = 'Bad Request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  /**
   * Send unauthorized response (401)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }

  /**
   * Send forbidden response (403)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }

  /**
   * Send not found response (404)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  /**
   * Send conflict response (409)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  /**
   * Send validation error response (422)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors
   */
  static validationError(res, message = 'Validation failed', errors = null) {
    return this.error(res, message, 422, errors);
  }

  /**
   * Send internal server error response (500)
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   */
  static serverError(res, message = 'Internal server error') {
    return this.error(res, message, 500);
  }

  /**
   * Send paginated response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Array} items - Array of items
   * @param {Object} pagination - Pagination metadata
   */
  static paginated(res, message, items, pagination) {
    const response = {
      success: true,
      message,
      data: {
        items,
        pagination: {
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          itemsPerPage: pagination.limit,
          hasNextPage: pagination.page < pagination.totalPages,
          hasPrevPage: pagination.page > 1,
        },
      },
    };
    return res.status(200).json(response);
  }
}

module.exports = ApiResponse;
