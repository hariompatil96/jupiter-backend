const { z } = require('zod');
const { PERFORMANCE_STATUS, EVALUATION_TYPE, GRADES } = require('../../utils/constants');

// Metric schema (aligned with Java)
const metricSchema = z.object({
  metricName: z
    .string({
      required_error: 'Metric name is required',
    })
    .min(1, 'Metric name is required')
    .max(100, 'Metric name cannot exceed 100 characters'),
  score: z
    .number({
      required_error: 'Score is required',
    })
    .min(0, 'Score cannot be negative'),
  maxScore: z
    .number({
      required_error: 'Max score is required',
    })
    .min(1, 'Max score must be at least 1'),
  weightage: z.number().min(0).max(100).optional().default(0),
  comments: z.string().max(500).optional(),
});

// Create performance validation schema (aligned with Java)
const createPerformanceSchema = z.object({
  body: z.object({
    studentId: z
      .string({
        required_error: 'Student ID is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    evaluatorId: z
      .string({
        required_error: 'Evaluator ID is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid evaluator ID'),
    evaluatorName: z
      .string({
        required_error: 'Evaluator name is required',
      })
      .min(1, 'Evaluator name is required')
      .max(100, 'Evaluator name cannot exceed 100 characters')
      .trim(),
    evaluationType: z.enum(Object.values(EVALUATION_TYPE), {
      required_error: 'Evaluation type is required',
      invalid_type_error: `Evaluation type must be one of: ${Object.values(EVALUATION_TYPE).join(', ')}`,
    }),
    evaluationPeriod: z.string().max(100).optional(),
    overallScore: z.number().min(0).max(100).optional(),
    grade: z.enum(Object.values(GRADES)).optional(),
    status: z.enum(Object.values(PERFORMANCE_STATUS)).optional().default(PERFORMANCE_STATUS.DRAFT),
    metrics: z.array(metricSchema).optional().default([]),
    feedback: z.string().max(2000).optional(),
    strengths: z.string().max(1000).optional(),
    areasOfImprovement: z.string().max(1000).optional(),
  }),
});

// Update performance validation schema
const updatePerformanceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid performance ID'),
  }),
  body: z.object({
    evaluationType: z.enum(Object.values(EVALUATION_TYPE)).optional(),
    evaluationPeriod: z.string().max(100).optional(),
    overallScore: z.number().min(0).max(100).optional(),
    grade: z.enum(Object.values(GRADES)).optional(),
    metrics: z.array(metricSchema).optional(),
    feedback: z.string().max(2000).optional(),
    strengths: z.string().max(1000).optional(),
    areasOfImprovement: z.string().max(1000).optional(),
  }),
});

// Get performance by ID validation schema
const getPerformanceByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid performance ID'),
  }),
});

// Get performances by student ID validation schema
const getPerformancesByStudentIdSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

// Approve performance validation schema
const approvePerformanceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid performance ID'),
  }),
});

// Reject performance validation schema
const rejectPerformanceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid performance ID'),
  }),
  body: z.object({
    rejectionReason: z.string().max(500).optional(),
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
  createPerformanceSchema,
  updatePerformanceSchema,
  getPerformanceByIdSchema,
  getPerformancesByStudentIdSchema,
  approvePerformanceSchema,
  rejectPerformanceSchema,
  validate,
};
