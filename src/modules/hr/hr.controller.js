const hrService = require('./hr.service');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class HRController {
  /**
   * GET /api/hr/ping
   * Health check endpoint
   */
  ping = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, MESSAGES.PING_SUCCESS, { ping: 'pong' });
  });

  /**
   * GET /api/hr/status
   * Service status endpoint
   */
  status = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, MESSAGES.STATUS_SUCCESS, {
      service: 'HR Service',
      status: 'running',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * GET /api/hr/dashboard/stats
   * Get comprehensive dashboard statistics
   */
  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await hrService.getDashboardStats();
    return ApiResponse.success(res, MESSAGES.STATS_FOUND, stats);
  });
}

module.exports = new HRController();
