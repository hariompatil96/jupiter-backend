const { z } = require('zod');
const { SKILL_CATEGORY, PROFICIENCY_LEVEL } = require('../../utils/constants');

// Create skill validation schema (aligned with Java)
const createSkillSchema = z.object({
  body: z.object({
    studentId: z
      .string({
        required_error: 'Student ID is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    skillName: z
      .string({
        required_error: 'Skill name is required',
      })
      .min(1, 'Skill name is required')
      .max(100, 'Skill name cannot exceed 100 characters')
      .trim(),
    category: z.enum(Object.values(SKILL_CATEGORY), {
      required_error: 'Category is required',
      invalid_type_error: `Category must be one of: ${Object.values(SKILL_CATEGORY).join(', ')}`,
    }),
    proficiencyLevel: z.enum(Object.values(PROFICIENCY_LEVEL), {
      required_error: 'Proficiency level is required',
      invalid_type_error: `Proficiency level must be one of: ${Object.values(PROFICIENCY_LEVEL).join(', ')}`,
    }),
    yearsOfExperience: z.number().min(0).max(50).optional().default(0),
    certified: z.boolean().optional().default(false),
    certificationName: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
  }),
});

// Update skill validation schema
const updateSkillSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID'),
  }),
  body: z.object({
    skillName: z.string().min(1).max(100).trim().optional(),
    category: z.enum(Object.values(SKILL_CATEGORY)).optional(),
    proficiencyLevel: z.enum(Object.values(PROFICIENCY_LEVEL)).optional(),
    yearsOfExperience: z.number().min(0).max(50).optional(),
    certified: z.boolean().optional(),
    certificationName: z.string().max(200).optional(),
    description: z.string().max(1000).optional(),
  }),
});

// Get skill by ID validation schema
const getSkillByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID'),
  }),
});

// Get skills by student ID validation schema
const getSkillsByStudentIdSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

// Verify skill validation schema (aligned with Java - accepts hrId in query)
const verifySkillSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID'),
  }),
  query: z.object({
    hrId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid HR ID').optional(),
  }),
});

// Delete skill validation schema
const deleteSkillSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid skill ID'),
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
  createSkillSchema,
  updateSkillSchema,
  getSkillByIdSchema,
  getSkillsByStudentIdSchema,
  verifySkillSchema,
  deleteSkillSchema,
  validate,
};
