const express = require('express');
const studentController = require('./student.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { adminOrHr } = require('../../middlewares/role.middleware');
const {
  validate,
  createStudentSchema,
  updateStudentSchema,
  getStudentByIdSchema,
  getStudentByCodeSchema,
  getStudentsByDepartmentSchema,
  getStudentsByStatusSchema,
  updateStudentStatusSchema,
  deleteStudentSchema,
} = require('./student.validation');

const router = express.Router();

// Health check endpoints (public)
router.get('/ping', studentController.ping);
router.get('/status', studentController.status);

// Statistics endpoint (protected)
router.get('/stats', authenticate, adminOrHr, studentController.getStats);

// Search endpoint (must come before /:id)
router.get('/search', authenticate, studentController.searchStudents);

// Get by code (must come before /:id)
router.get(
  '/code/:studentCode',
  authenticate,
  validate(getStudentByCodeSchema),
  studentController.getStudentByCode
);

// Get by department
router.get(
  '/department/:department',
  authenticate,
  validate(getStudentsByDepartmentSchema),
  studentController.getStudentsByDepartment
);

// Get by status
router.get(
  '/status/:status',
  authenticate,
  validate(getStudentsByStatusSchema),
  studentController.getStudentsByStatus
);

// CRUD operations
router.post(
  '/',
  authenticate,
  adminOrHr,
  validate(createStudentSchema),
  studentController.createStudent
);

router.get('/', authenticate, studentController.getAllStudents);

router.get(
  '/:id',
  authenticate,
  validate(getStudentByIdSchema),
  studentController.getStudentById
);

router.put(
  '/:id',
  authenticate,
  adminOrHr,
  validate(updateStudentSchema),
  studentController.updateStudent
);

router.patch(
  '/:id/status',
  authenticate,
  adminOrHr,
  validate(updateStudentStatusSchema),
  studentController.updateStudentStatus
);

router.delete(
  '/:id',
  authenticate,
  adminOrHr,
  validate(deleteStudentSchema),
  studentController.deleteStudent
);

module.exports = router;
