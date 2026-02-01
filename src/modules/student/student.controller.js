const studentService = require('./student.service');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class StudentController {
  /**
   * GET /api/students/ping
   * Health check endpoint
   */
  ping = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, MESSAGES.PING_SUCCESS, { ping: 'pong' });
  });

  /**
   * GET /api/students/status
   * Service status endpoint
   */
  status = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, MESSAGES.STATUS_SUCCESS, {
      service: 'Student Service',
      status: 'running',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/students
   * Create a new student
   */
  createStudent = asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.body);
    return ApiResponse.created(res, MESSAGES.STUDENT_CREATED, student);
  });

  /**
   * GET /api/students/:id
   * Get student by ID
   */
  getStudentById = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);
    return ApiResponse.success(res, MESSAGES.STUDENT_FOUND, student);
  });

  /**
   * GET /api/students/code/:studentCode
   * Get student by student code
   */
  getStudentByCode = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentByCode(req.params.studentCode);
    return ApiResponse.success(res, MESSAGES.STUDENT_FOUND, student);
  });

  /**
   * GET /api/students
   * Get all students with pagination
   */
  getAllStudents = asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await studentService.getAllStudents({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy,
      sortOrder,
    });
    return ApiResponse.paginated(res, MESSAGES.STUDENTS_FOUND, result.items, result.pagination);
  });

  /**
   * GET /api/students/department/:department
   * Get students by department
   */
  getStudentsByDepartment = asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await studentService.getStudentsByDepartment(req.params.department, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy,
      sortOrder,
    });
    return ApiResponse.paginated(res, MESSAGES.STUDENTS_FOUND, result.items, result.pagination);
  });

  /**
   * GET /api/students/status/:status
   * Get students by status
   */
  getStudentsByStatus = asyncHandler(async (req, res) => {
    const { page, limit, sortBy, sortOrder } = req.query;
    const result = await studentService.getStudentsByStatus(req.params.status, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      sortBy,
      sortOrder,
    });
    return ApiResponse.paginated(res, MESSAGES.STUDENTS_FOUND, result.items, result.pagination);
  });

  /**
   * GET /api/students/search
   * Search students by name
   */
  searchStudents = asyncHandler(async (req, res) => {
    const { name, page, limit } = req.query;

    if (!name) {
      return ApiResponse.badRequest(res, 'Search query (name) is required');
    }

    const result = await studentService.searchStudents(name, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    });
    return ApiResponse.paginated(res, MESSAGES.STUDENTS_FOUND, result.items, result.pagination);
  });

  /**
   * PUT /api/students/:id
   * Update student
   */
  updateStudent = asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(req.params.id, req.body);
    return ApiResponse.success(res, MESSAGES.STUDENT_UPDATED, student);
  });

  /**
   * PATCH /api/students/:id/status
   * Update student status
   */
  updateStudentStatus = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const student = await studentService.updateStudentStatus(req.params.id, status);
    return ApiResponse.success(res, MESSAGES.STUDENT_STATUS_UPDATED, student);
  });

  /**
   * DELETE /api/students/:id
   * Delete student
   */
  deleteStudent = asyncHandler(async (req, res) => {
    await studentService.deleteStudent(req.params.id);
    return ApiResponse.success(res, MESSAGES.STUDENT_DELETED);
  });

  /**
   * GET /api/students/stats
   * Get student statistics
   */
  getStats = asyncHandler(async (req, res) => {
    const stats = await studentService.getStats();
    return ApiResponse.success(res, MESSAGES.STATS_FOUND, stats);
  });
}

module.exports = new StudentController();
