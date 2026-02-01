const express = require('express');
const performanceController = require('./performance.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { adminOrHr } = require('../../middlewares/role.middleware');
const {
  validate,
  createPerformanceSchema,
  getPerformanceByIdSchema,
  getPerformancesByStudentIdSchema,
  approvePerformanceSchema,
  rejectPerformanceSchema,
} = require('./performance.validation');

const router = express.Router();

// All routes require authentication and HR/Admin role
router.use(authenticate, adminOrHr);

// Create performance
router.post('/', validate(createPerformanceSchema), performanceController.createPerformance);

// Get pending performances (must come before /:id)
router.get('/pending', performanceController.getPendingPerformances);

// Get performances by student ID
router.get(
  '/student/:studentId',
  validate(getPerformancesByStudentIdSchema),
  performanceController.getPerformancesByStudentId
);

// Get performance statistics
router.get('/stats', performanceController.getStats);

// Get performance by ID
router.get(
  '/:id',
  validate(getPerformanceByIdSchema),
  performanceController.getPerformanceById
);

// Approve performance
router.put(
  '/:id/approve',
  validate(approvePerformanceSchema),
  performanceController.approvePerformance
);

// Reject performance
router.put(
  '/:id/reject',
  validate(rejectPerformanceSchema),
  performanceController.rejectPerformance
);

// Delete performance
router.delete(
  '/:id',
  validate(getPerformanceByIdSchema),
  performanceController.deletePerformance
);

module.exports = router;
