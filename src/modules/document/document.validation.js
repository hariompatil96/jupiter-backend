const { z } = require('zod');
const { DOCUMENT_STATUS, DOCUMENT_TYPES } = require('../../utils/constants');

// Create document validation schema (aligned with Java)
const createDocumentSchema = z.object({
  body: z.object({
    studentId: z
      .string({
        required_error: 'Student ID is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
    documentName: z
      .string({
        required_error: 'Document name is required',
      })
      .min(1, 'Document name is required')
      .max(200, 'Document name cannot exceed 200 characters')
      .trim(),
    documentType: z.enum(Object.values(DOCUMENT_TYPES), {
      required_error: 'Document type is required',
      invalid_type_error: `Document type must be one of: ${Object.values(DOCUMENT_TYPES).join(', ')}`,
    }),
    fileName: z
      .string({
        required_error: 'File name is required',
      })
      .min(1, 'File name is required'),
    filePath: z
      .string({
        required_error: 'File path is required',
      })
      .min(1, 'File path is required'),
    fileSize: z.number({
      required_error: 'File size is required',
    }).min(0, 'File size cannot be negative'),
    mimeType: z
      .string({
        required_error: 'MIME type is required',
      })
      .min(1, 'MIME type is required'),
    confidential: z.boolean().optional().default(false),
    expiryDate: z
      .string()
      .datetime()
      .optional()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  }),
});

// Update document validation schema
const updateDocumentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid document ID'),
  }),
  body: z.object({
    documentName: z.string().min(1).max(200).trim().optional(),
    documentType: z.enum(Object.values(DOCUMENT_TYPES)).optional(),
    confidential: z.boolean().optional(),
    expiryDate: z
      .string()
      .datetime()
      .optional()
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  }),
});

// Get document by ID validation schema
const getDocumentByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid document ID'),
  }),
});

// Get documents by student ID validation schema
const getDocumentsByStudentIdSchema = z.object({
  params: z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  }),
});

// Verify document validation schema (aligned with Java - accepts hrId, hrName, remarks)
const verifyDocumentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid document ID'),
  }),
  body: z.object({
    hrId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid HR ID').optional(),
    hrName: z.string().max(100).optional(),
    remarks: z.string().max(500).optional(),
  }).optional(),
});

// Reject document validation schema (aligned with Java - accepts hrId, hrName, remarks)
const rejectDocumentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid document ID'),
  }),
  body: z.object({
    hrId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid HR ID').optional(),
    hrName: z.string().max(100).optional(),
    remarks: z.string().max(500).optional(),
  }).optional(),
});

// Delete document validation schema
const deleteDocumentSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid document ID'),
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
  createDocumentSchema,
  updateDocumentSchema,
  getDocumentByIdSchema,
  getDocumentsByStudentIdSchema,
  verifyDocumentSchema,
  rejectDocumentSchema,
  deleteDocumentSchema,
  validate,
};
