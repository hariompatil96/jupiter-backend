const Performance = require('./performance.model');
const Student = require('../student/student.model');
const { AppError } = require('../../middlewares/error.middleware');
const { MESSAGES, PERFORMANCE_STATUS } = require('../../utils/constants');

class PerformanceService {
  /**
   * Create a new performance record
   * @param {Object} performanceData - Performance data
   * @returns {Object} Created performance
   */
  async createPerformance(performanceData) {
    // Verify student exists
    const student = await Student.findById(performanceData.studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    const performance = await Performance.create(performanceData);
    return performance;
  }

  /**
   * Get performance by ID
   * @param {string} id - Performance ID
   * @returns {Object} Performance
   */
  async getPerformanceById(id) {
    const performance = await Performance.findById(id);
    if (!performance) {
      throw new AppError(MESSAGES.PERFORMANCE_NOT_FOUND, 404);
    }
    return performance;
  }

  /**
   * Get performances by student ID
   * @param {string} studentId - Student ID
   * @returns {Array} Performances
   */
  async getPerformancesByStudentId(studentId) {
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    const performances = await Performance.find({ studentId }).sort({ createdAt: -1 });
    return performances;
  }

  /**
   * Get all pending performances
   * @returns {Array} Pending performances
   */
  async getPendingPerformances() {
    const performances = await Performance.find({
      status: PERFORMANCE_STATUS.PENDING,
    }).sort({ createdAt: -1 });
    return performances;
  }

  /**
   * Update performance
   * @param {string} id - Performance ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated performance
   */
  async updatePerformance(id, updateData) {
    const performance = await Performance.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!performance) {
      throw new AppError(MESSAGES.PERFORMANCE_NOT_FOUND, 404);
    }

    return performance;
  }

  /**
   * Approve performance
   * @param {string} id - Performance ID
   * @param {string} userId - User ID who is approving
   * @returns {Object} Approved performance
   */
  async approvePerformance(id, userId) {
    const performance = await Performance.findById(id);
    if (!performance) {
      throw new AppError(MESSAGES.PERFORMANCE_NOT_FOUND, 404);
    }

    if (performance.status === PERFORMANCE_STATUS.APPROVED) {
      throw new AppError('Performance is already approved', 400);
    }

    performance.status = PERFORMANCE_STATUS.APPROVED;
    performance.approvedBy = userId;
    performance.approvedAt = new Date();
    performance.rejectedBy = undefined;
    performance.rejectedAt = undefined;
    performance.rejectionReason = undefined;

    await performance.save();
    return performance;
  }

  /**
   * Reject performance
   * @param {string} id - Performance ID
   * @param {string} userId - User ID who is rejecting
   * @param {string} rejectionReason - Rejection reason
   * @returns {Object} Rejected performance
   */
  async rejectPerformance(id, userId, rejectionReason) {
    const performance = await Performance.findById(id);
    if (!performance) {
      throw new AppError(MESSAGES.PERFORMANCE_NOT_FOUND, 404);
    }

    performance.status = PERFORMANCE_STATUS.REJECTED;
    performance.rejectedBy = userId;
    performance.rejectedAt = new Date();
    performance.rejectionReason = rejectionReason;
    performance.approvedBy = undefined;
    performance.approvedAt = undefined;

    await performance.save();
    return performance;
  }

  /**
   * Delete performance
   * @param {string} id - Performance ID
   */
  async deletePerformance(id) {
    const performance = await Performance.findByIdAndDelete(id);
    if (!performance) {
      throw new AppError(MESSAGES.PERFORMANCE_NOT_FOUND, 404);
    }
    return performance;
  }

  /**
   * Get performance statistics
   * @returns {Object} Statistics
   */
  async getStats() {
    const [
      totalPerformances,
      draftPerformances,
      pendingPerformances,
      approvedPerformances,
      rejectedPerformances,
      typeStats,
    ] = await Promise.all([
      Performance.countDocuments(),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.DRAFT }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.PENDING }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.APPROVED }),
      Performance.countDocuments({ status: PERFORMANCE_STATUS.REJECTED }),
      Performance.aggregate([
        { $group: { _id: '$evaluationType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const byType = {};
    typeStats.forEach((item) => {
      byType[item._id] = item.count;
    });

    return {
      total: totalPerformances,
      draft: draftPerformances,
      pending: pendingPerformances,
      approved: approvedPerformances,
      rejected: rejectedPerformances,
      byEvaluationType: byType,
    };
  }
}

module.exports = new PerformanceService();
