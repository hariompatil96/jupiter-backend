const express = require('express');
const studentController = require('./student.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const {
  adminOrHr,
  blockStudentList,
  studentSelfOrAdminHr,
} = require('../../middlewares/role.middleware');
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

// Statistics endpoint (protected - ADMIN/HR only)
router.get('/stats', authenticate, adminOrHr, studentController.getStats);

// Search endpoint (must come before /:id) - ADMIN/HR only (aligned with Java)
router.get('/search', authenticate, blockStudentList, studentController.searchStudents);

// Get by code (must come before /:id) - ADMIN/HR only for listing
router.get(
  '/code/:studentCode',
  authenticate,
  blockStudentList,
  validate(getStudentByCodeSchema),
  studentController.getStudentByCode
);

// Get by department - ADMIN/HR only (aligned with Java)
router.get(
  '/department/:department',
  authenticate,
  blockStudentList,
  validate(getStudentsByDepartmentSchema),
  studentController.getStudentsByDepartment
);

// Get by status - ADMIN/HR only (aligned with Java)
router.get(
  '/status/:status',
  authenticate,
  blockStudentList,
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

// Get all students - ADMIN/HR only (students cannot list all - aligned with Java)
router.get('/', authenticate, blockStudentList, studentController.getAllStudents);

// Get student by ID - Students can only access their own profile (aligned with Java)
router.get(
  '/:id',
  authenticate,
  studentSelfOrAdminHr('id'),
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
