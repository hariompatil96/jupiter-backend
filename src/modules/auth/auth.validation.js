const { z } = require('zod');
const { ROLES } = require('../../utils/constants');

// Login validation schema
const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(1, 'Password is required'),
  }),
});

// Register validation schema
const registerSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password cannot exceed 128 characters'),
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
      role: z.enum(Object.values(ROLES), {
        errorMap: (issue, ctx) => {
          if (issue.code === 'invalid_type') {
            return { message: 'Role is required' };
          }
          if (issue.code === 'invalid_enum_value') {
            return { message: `Role must be one of: ${Object.values(ROLES).join(', ')}` };
          }
          return { message: ctx.defaultError };
        },
      }),
      studentId: z
        .string({
          required_error: 'Student ID is required for STUDENT role',
        })
        .optional(),
    })
    .refine(
      (data) => {
        // If role is STUDENT, studentId is required
        if (data.role === ROLES.STUDENT) {
          return !!data.studentId;
        }
        return true;
      },
      {
        message: 'studentId is required when role is STUDENT',
        path: ['studentId'],
      }
    )
    .refine(
      (data) => {
        // If role is NOT STUDENT, studentId must NOT be present
        if (data.role !== ROLES.STUDENT) {
          return !data.studentId;
        }
        return true;
      },
      {
        message: 'studentId must not be provided for non-STUDENT roles',
        path: ['studentId'],
      }
    ),
});

// Refresh token validation schema
const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string({
        required_error: 'Refresh token is required',
      })
      .min(1, 'Refresh token is required'),
  }),
});

// Change password validation schema
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({
        required_error: 'Current password is required',
      })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'New password must be at least 6 characters')
      .max(128, 'New password cannot exceed 128 characters'),
    confirmPassword: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(1, 'Confirm password is required'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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
    req.body = result.data.body || req.body;
    req.query = result.data.query || req.query;
    req.params = result.data.params || req.params;

    next();
  };
};

module.exports = {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  changePasswordSchema,
  validate,
};