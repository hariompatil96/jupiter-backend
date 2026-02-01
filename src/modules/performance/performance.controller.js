const performanceService = require('./performance.service');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class PerformanceController {
  /**
   * POST /api/hr/performance
   * Create a new performance record
   */
  createPerformance = asyncHandler(async (req, res) => {
    const performance = await performanceService.createPerformance(req.body);
    return ApiResponse.created(res, MESSAGES.PERFORMANCE_CREATED, performance);
  });

  /**
   * GET /api/hr/performance/:id
   * Get performance by ID
   */
  getPerformanceById = asyncHandler(async (req, res) => {
    const performance = await performanceService.getPerformanceById(req.params.id);
    return ApiResponse.success(res, MESSAGES.PERFORMANCE_FOUND, performance);
  });

  /**
   * GET /api/hr/performance/student/:studentId
   * Get performances by student ID
   */
  getPerformancesByStudentId = asyncHandler(async (req, res) => {
    const performances = await performanceService.getPerformancesByStudentId(
      req.params.studentId
    );
    return ApiResponse.success(res, MESSAGES.PERFORMANCES_FOUND, performances);
  });

  /**
   * GET /api/hr/performance/pending
   * Get all pending performances
   */
  getPendingPerformances = asyncHandler(async (req, res) => {
    const performances = await performanceService.getPendingPerformances();
    return ApiResponse.success(res, MESSAGES.PERFORMANCES_FOUND, performances);
  });

  /**
   * PUT /api/hr/performance/:id/approve
   * Approve a performance record
   */
  approvePerformance = asyncHandler(async (req, res) => {
    const performance = await performanceService.approvePerformance(
      req.params.id,
      req.user.id
    );
    return ApiResponse.success(res, MESSAGES.PERFORMANCE_APPROVED, performance);
  });

  /**
   * PUT /api/hr/performance/:id/reject
   * Reject a performance record
   */
  rejectPerformance = asyncHandler(async (req, res) => {
    const { rejectionReason } = req.body;
    const performance = await performanceService.rejectPerformance(
      req.params.id,
      req.user.id,
      rejectionReason
    );
    return ApiResponse.success(res, MESSAGES.PERFORMANCE_REJECTED, performance);
  });

  /**
   * DELETE /api/hr/performance/:id
   * Delete a performance record
   */
  deletePerformance = asyncHandler(async (req, res) => {
    await performanceService.deletePerformance(req.params.id);
    return ApiResponse.success(res, MESSAGES.PERFORMANCE_DELETED);
  });

  /**
   * GET /api/hr/performance/stats
   * Get performance statistics
   */
  getStats = asyncHandler(async (req, res) => {
    const stats = await performanceService.getStats();
    return ApiResponse.success(res, MESSAGES.STATS_FOUND, stats);
  });
}

module.exports = new PerformanceController();
