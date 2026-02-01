const { z } = require('zod');
const { STUDENT_STATUS, DEPARTMENTS, PAGINATION } = require('../../utils/constants');

// Address schema
const addressSchema = z.object({
  street: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
}).optional();

// Emergency contact schema
const emergencyContactSchema = z.object({
  name: z.string().max(100).optional(),
  relationship: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
}).optional();

// Create student validation schema
const createStudentSchema = z.object({
  body: z.object({
    studentCode: z
      .string()
      .regex(/^STU[0-9]{6}$/, 'Student code must be in format STU followed by 6 digits')
      .optional(),
    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters')
      .trim(),
    lastName: z
      .string({
        required_error: 'Last name is required',
      })
      .min(1, 'Last name is required')
      .max(50, 'Last name cannot exceed 50 characters')
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .regex(/^[+]?[\d\s-]{10,15}$/, 'Invalid phone number format')
      .optional(),
    dateOfBirth: z
      .string()
      .datetime()
      .optional()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    address: addressSchema,
    department: z.enum(Object.values(DEPARTMENTS), {
      required_error: 'Department is required',
      invalid_type_error: `Department must be one of: ${Object.values(DEPARTMENTS).join(', ')}`,
    }),
    semester: z.number().int().min(1).max(8).optional(),
    enrollmentYear: z
      .number({
        required_error: 'Enrollment year is required',
      })
      .int()
      .min(2000, 'Enrollment year must be after 2000')
      .max(new Date().getFullYear() + 1, 'Invalid enrollment year'),
    expectedGraduationYear: z.number().int().min(2000).optional(),
    cgpa: z.number().min(0).max(10).optional(),
    status: z
      .enum(Object.values(STUDENT_STATUS))
      .optional()
      .default(STUDENT_STATUS.ACTIVE),
    profileImage: z.string().url().optional(),
    emergencyContact: emergencyContactSchema,
    notes: z.string().max(500).optional(),
  }),
});

// Update student validation schema
const updateStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
  body: z.object({
    firstName: z.string().min(1).max(50).trim().optional(),
    lastName: z.string().min(1).max(50).trim().optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z
      .string()
      .regex(/^[+]?[\d\s-]{10,15}$/, 'Invalid phone number format')
      .optional(),
    dateOfBirth: z
      .string()
      .datetime()
      .optional()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    address: addressSchema,
    department: z.enum(Object.values(DEPARTMENTS)).optional(),
    semester: z.number().int().min(1).max(8).optional(),
    enrollmentYear: z
      .number()
      .int()
      .min(2000)
      .max(new Date().getFullYear() + 1)
      .optional(),
    expectedGraduationYear: z.number().int().min(2000).optional(),
    cgpa: z.number().min(0).max(10).optional(),
    profileImage: z.string().url().optional().nullable(),
    emergencyContact: emergencyContactSchema,
    notes: z.string().max(500).optional(),
  }),
});

// Get student by ID validation schema
const getStudentByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

// Get student by code validation schema
const getStudentByCodeSchema = z.object({
  params: z.object({
    studentCode: z
      .string()
      .regex(/^STU[0-9]{6}$/, 'Invalid student code format'),
  }),
});

// Get students by department validation schema
const getStudentsByDepartmentSchema = z.object({
  params: z.object({
    department: z.enum(Object.values(DEPARTMENTS), {
      invalid_type_error: `Department must be one of: ${Object.values(DEPARTMENTS).join(', ')}`,
    }),
  }),
});

// Get students by status validation schema
const getStudentsByStatusSchema = z.object({
  params: z.object({
    status: z.enum(Object.values(STUDENT_STATUS), {
      invalid_type_error: `Status must be one of: ${Object.values(STUDENT_STATUS).join(', ')}`,
    }),
  }),
});

// Update student status validation schema
const updateStudentStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
  query: z.object({
    status: z.enum(Object.values(STUDENT_STATUS), {
      required_error: 'Status is required',
      invalid_type_error: `Status must be one of: ${Object.values(STUDENT_STATUS).join(', ')}`,
    }),
  }),
});

// Search students validation schema
const searchStudentsSchema = z.object({
  query: z.object({
    name: z.string().min(1).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

// Pagination validation schema
const paginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/)
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : PAGINATION.DEFAULT_PAGE)),
    limit: z
      .string()
      .regex(/^\d+$/)
      .optional()
      .transform((val) => {
        const limit = val ? parseInt(val, 10) : PAGINATION.DEFAULT_LIMIT;
        return Math.min(limit, PAGINATION.MAX_LIMIT);
      }),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Delete student validation schema
const deleteStudentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

// Validate middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.slice(1).join('.'),
        message: err.message,
      }));

      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        data: errors,
      });
    }

    // Replace request data with parsed data
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;

    next();
  };
};

module.exports = {
  createStudentSchema,
  updateStudentSchema,
  getStudentByIdSchema,
  getStudentByCodeSchema,
  getStudentsByDepartmentSchema,
  getStudentsByStatusSchema,
  updateStudentStatusSchema,
  searchStudentsSchema,
  paginationSchema,
  deleteStudentSchema,
  validate,
};
