const Student = require('./student.model');
const { AppError } = require('../../middlewares/error.middleware');
const { MESSAGES, PAGINATION } = require('../../utils/constants');

class StudentService {
  /**
   * Create a new student
   * @param {Object} studentData - Student data
   * @returns {Object} Created student
   */
  async createStudent(studentData) {
    // Generate student code if not provided
    if (!studentData.studentCode) {
      studentData.studentCode = await Student.generateStudentCode();
    }

    // Check for duplicate student code
    const existingCode = await Student.findOne({ studentCode: studentData.studentCode });
    if (existingCode) {
      throw new AppError(MESSAGES.STUDENT_CODE_EXISTS, 409);
    }

    // Check for duplicate email
    const existingEmail = await Student.findOne({ email: studentData.email });
    if (existingEmail) {
      throw new AppError(MESSAGES.STUDENT_EMAIL_EXISTS, 409);
    }

    const student = await Student.create(studentData);
    return student;
  }

  /**
   * Get student by ID
   * @param {string} id - Student ID
   * @returns {Object} Student
   */
  async getStudentById(id) {
    const student = await Student.findById(id);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }
    return student;
  }

  /**
   * Get student by student code
   * @param {string} studentCode - Student code
   * @returns {Object} Student
   */
  async getStudentByCode(studentCode) {
    const student = await Student.findOne({ studentCode: studentCode.toUpperCase() });
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }
    return student;
  }

  /**
   * Get all students with pagination
   * @param {Object} options - Pagination options
   * @returns {Object} Students and pagination info
   */
  async getAllStudents(options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [students, totalItems] = await Promise.all([
      Student.find().sort(sort).skip(skip).limit(limit),
      Student.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: students,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * Get students by department
   * @param {string} department - Department
   * @param {Object} options - Pagination options
   * @returns {Object} Students and pagination info
   */
  async getStudentsByDepartment(department, options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [students, totalItems] = await Promise.all([
      Student.find({ department }).sort(sort).skip(skip).limit(limit),
      Student.countDocuments({ department }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: students,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * Get students by status
   * @param {string} status - Status
   * @param {Object} options - Pagination options
   * @returns {Object} Students and pagination info
   */
  async getStudentsByStatus(status, options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [students, totalItems] = await Promise.all([
      Student.find({ status }).sort(sort).skip(skip).limit(limit),
      Student.countDocuments({ status }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: students,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * Search students by name
   * @param {string} name - Search query
   * @param {Object} options - Pagination options
   * @returns {Object} Students and pagination info
   */
  async searchStudents(name, options = {}) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = options;

    const skip = (page - 1) * limit;

    // Create a regex pattern for case-insensitive search
    const searchPattern = new RegExp(name, 'i');

    const query = {
      $or: [
        { firstName: searchPattern },
        { lastName: searchPattern },
        { email: searchPattern },
        { studentCode: searchPattern },
      ],
    };

    const [students, totalItems] = await Promise.all([
      Student.find(query).sort({ firstName: 1 }).skip(skip).limit(limit),
      Student.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: students,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * Update student
   * @param {string} id - Student ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated student
   */
  async updateStudent(id, updateData) {
    // Check if email is being updated and if it's unique
    if (updateData.email) {
      const existingEmail = await Student.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        throw new AppError(MESSAGES.STUDENT_EMAIL_EXISTS, 409);
      }
    }

    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    return student;
  }

  /**
   * Update student status
   * @param {string} id - Student ID
   * @param {string} status - New status
   * @returns {Object} Updated student
   */
  async updateStudentStatus(id, status) {
    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    return student;
  }

  /**
   * Delete student
   * @param {string} id - Student ID
   */
  async deleteStudent(id) {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }
    return student;
  }

  /**
   * Get student statistics
   * @returns {Object} Statistics
   */
  async getStats() {
    const [
      totalStudents,
      activeStudents,
      inactiveStudents,
      graduatedStudents,
      departmentStats,
      statusStats,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'ACTIVE' }),
      Student.countDocuments({ status: 'INACTIVE' }),
      Student.countDocuments({ status: 'GRADUATED' }),
      Student.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Student.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Convert department stats to object
    const byDepartment = {};
    departmentStats.forEach((item) => {
      byDepartment[item._id] = item.count;
    });

    // Convert status stats to object
    const byStatus = {};
    statusStats.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    return {
      total: totalStudents,
      active: activeStudents,
      inactive: inactiveStudents,
      graduated: graduatedStudents,
      byDepartment,
      byStatus,
    };
  }
}

module.exports = new StudentService();
