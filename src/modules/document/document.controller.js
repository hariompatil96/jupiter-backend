const documentService = require('./document.service');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class DocumentController {
  /**
   * POST /api/hr/document
   * Create/Upload a new document
   */
  createDocument = asyncHandler(async (req, res) => {
    let document;

    if (req.file) {
      // File was uploaded
      document = await documentService.uploadDocument(req.body, req.file);
    } else {
      // No file, just document metadata
      document = await documentService.createDocument(req.body);
    }

    return ApiResponse.created(res, MESSAGES.DOCUMENT_UPLOADED, document);
  });

  /**
   * GET /api/hr/document/:id
   * Get document by ID
   */
  getDocumentById = asyncHandler(async (req, res) => {
    const document = await documentService.getDocumentById(req.params.id);
    return ApiResponse.success(res, MESSAGES.DOCUMENT_FOUND, document);
  });

  /**
   * GET /api/hr/document/student/:studentId
   * Get documents by student ID
   */
  getDocumentsByStudentId = asyncHandler(async (req, res) => {
    const documents = await documentService.getDocumentsByStudentId(
      req.params.studentId
    );
    return ApiResponse.success(res, MESSAGES.DOCUMENTS_FOUND, documents);
  });

  /**
   * GET /api/hr/document/pending
   * Get all pending documents
   */
  getPendingDocuments = asyncHandler(async (req, res) => {
    const documents = await documentService.getPendingDocuments();
    return ApiResponse.success(res, MESSAGES.DOCUMENTS_FOUND, documents);
  });

  /**
   * PUT /api/hr/document/:id
   * Update a document
   */
  updateDocument = asyncHandler(async (req, res) => {
    const document = await documentService.updateDocument(req.params.id, req.body);
    return ApiResponse.success(res, MESSAGES.DOCUMENT_UPDATED, document);
  });

  /**
   * PUT /api/hr/document/:id/verify
   * Verify a document (aligned with Java - accepts hrId, hrName, remarks in body)
   */
  verifyDocument = asyncHandler(async (req, res) => {
    const { hrId, hrName, remarks } = req.body || {};
    const document = await documentService.verifyDocument(req.params.id, {
      hrId: hrId || req.user.id,
      hrName: hrName || `${req.user.firstName} ${req.user.lastName}`,
      remarks,
    });
    return ApiResponse.success(res, MESSAGES.DOCUMENT_VERIFIED, document);
  });

  /**
   * PUT /api/hr/document/:id/reject
   * Reject a document (aligned with Java - accepts hrId, hrName, remarks in body)
   */
  rejectDocument = asyncHandler(async (req, res) => {
    const { hrId, hrName, remarks } = req.body || {};
    const document = await documentService.rejectDocument(req.params.id, {
      hrId: hrId || req.user.id,
      hrName: hrName || `${req.user.firstName} ${req.user.lastName}`,
      remarks,
    });
    return ApiResponse.success(res, MESSAGES.DOCUMENT_REJECTED, document);
  });

  /**
   * DELETE /api/hr/document/:id
   * Delete a document
   */
  deleteDocument = asyncHandler(async (req, res) => {
    await documentService.deleteDocument(req.params.id);
    return ApiResponse.success(res, MESSAGES.DOCUMENT_DELETED);
  });

  /**
   * GET /api/hr/document/stats
   * Get document statistics
   */
  getStats = asyncHandler(async (req, res) => {
    const stats = await documentService.getStats();
    return ApiResponse.success(res, MESSAGES.STATS_FOUND, stats);
  });

  /**
   * GET /api/hr/document/expiring
   * Get documents expiring soon (within 30 days)
   */
  getExpiringDocuments = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 30;
    const documents = await documentService.getExpiringDocuments(days);
    return ApiResponse.success(res, MESSAGES.DOCUMENTS_FOUND, documents);
  });
}

module.exports = new DocumentController();
