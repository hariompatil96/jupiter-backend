const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const documentController = require('./document.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { adminOrHr } = require('../../middlewares/role.middleware');
const env = require('../../config/env');
const {
  validate,
  getDocumentByIdSchema,
  getDocumentsByStudentIdSchema,
  verifyDocumentSchema,
  rejectDocumentSchema,
  deleteDocumentSchema,
  updateDocumentSchema,
} = require('./document.validation');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../../', env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPEG, PNG, GIF, XLS, XLSX are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // Default 5MB
  },
});

// All routes require authentication and HR/Admin role
router.use(authenticate, adminOrHr);

// Create/Upload document
router.post('/', upload.single('file'), documentController.createDocument);

// Get pending documents (must come before /:id)
router.get('/pending', documentController.getPendingDocuments);

// Get expiring documents (aligned with Java - documents expiring within 30 days)
router.get('/expiring', documentController.getExpiringDocuments);

// Get documents by student ID
router.get(
  '/student/:studentId',
  validate(getDocumentsByStudentIdSchema),
  documentController.getDocumentsByStudentId
);

// Get document statistics
router.get('/stats', documentController.getStats);

// Get document by ID
router.get(
  '/:id',
  validate(getDocumentByIdSchema),
  documentController.getDocumentById
);

// Update document
router.put(
  '/:id',
  validate(updateDocumentSchema),
  documentController.updateDocument
);

// Verify document
router.put(
  '/:id/verify',
  validate(verifyDocumentSchema),
  documentController.verifyDocument
);

// Reject document
router.put(
  '/:id/reject',
  validate(rejectDocumentSchema),
  documentController.rejectDocument
);

// Delete document
router.delete(
  '/:id',
  validate(deleteDocumentSchema),
  documentController.deleteDocument
);

module.exports = router;
