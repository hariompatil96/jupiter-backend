const fs = require('fs').promises;
const path = require('path');
const Document = require('./document.model');
const Student = require('../student/student.model');
const { AppError } = require('../../middlewares/error.middleware');
const { MESSAGES, DOCUMENT_STATUS } = require('../../utils/constants');
const env = require('../../config/env');

class DocumentService {
  /**
   * Create a new document
   * @param {Object} documentData - Document data
   * @returns {Object} Created document
   */
  async createDocument(documentData) {
    // Verify student exists
    const student = await Student.findById(documentData.studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    const document = await Document.create(documentData);
    return document;
  }

  /**
   * Upload document with file
   * @param {Object} documentData - Document data
   * @param {Object} file - Uploaded file object
   * @returns {Object} Created document
   */
  async uploadDocument(documentData, file) {
    // Verify student exists
    const student = await Student.findById(documentData.studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    // Create document record with file info
    const document = await Document.create({
      ...documentData,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
    });

    return document;
  }

  /**
   * Get document by ID
   * @param {string} id - Document ID
   * @returns {Object} Document
   */
  async getDocumentById(id) {
    const document = await Document.findById(id);
    if (!document) {
      throw new AppError(MESSAGES.DOCUMENT_NOT_FOUND, 404);
    }
    return document;
  }

  /**
   * Get documents by student ID
   * @param {string} studentId - Student ID
   * @returns {Array} Documents
   */
  async getDocumentsByStudentId(studentId) {
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    const documents = await Document.find({ studentId }).sort({ createdAt: -1 });
    return documents;
  }

  /**
   * Get all pending documents
   * @returns {Array} Pending documents
   */
  async getPendingDocuments() {
    const documents = await Document.find({
      status: DOCUMENT_STATUS.PENDING,
    }).sort({ createdAt: -1 });
    return documents;
  }

  /**
   * Update document
   * @param {string} id - Document ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated document
   */
  async updateDocument(id, updateData) {
    const document = await Document.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      throw new AppError(MESSAGES.DOCUMENT_NOT_FOUND, 404);
    }

    return document;
  }

  /**
   * Verify document
   * @param {string} id - Document ID
   * @param {string} userId - User ID who is verifying
   * @returns {Object} Verified document
   */
  async verifyDocument(id, userId) {
    const document = await Document.findById(id);
    if (!document) {
      throw new AppError(MESSAGES.DOCUMENT_NOT_FOUND, 404);
    }

    if (document.status === DOCUMENT_STATUS.VERIFIED) {
      throw new AppError('Document is already verified', 400);
    }

    document.status = DOCUMENT_STATUS.VERIFIED;
    document.verifiedBy = userId;
    document.verifiedAt = new Date();
    document.rejectedBy = undefined;
    document.rejectedAt = undefined;
    document.rejectionReason = undefined;

    await document.save();
    return document;
  }

  /**
   * Reject document
   * @param {string} id - Document ID
   * @param {string} userId - User ID who is rejecting
   * @param {string} rejectionReason - Rejection reason
   * @returns {Object} Rejected document
   */
  async rejectDocument(id, userId, rejectionReason) {
    const document = await Document.findById(id);
    if (!document) {
      throw new AppError(MESSAGES.DOCUMENT_NOT_FOUND, 404);
    }

    document.status = DOCUMENT_STATUS.REJECTED;
    document.rejectedBy = userId;
    document.rejectedAt = new Date();
    document.rejectionReason = rejectionReason;
    document.verifiedBy = undefined;
    document.verifiedAt = undefined;

    await document.save();
    return document;
  }

  /**
   * Delete document
   * @param {string} id - Document ID
   */
  async deleteDocument(id) {
    const document = await Document.findById(id);
    if (!document) {
      throw new AppError(MESSAGES.DOCUMENT_NOT_FOUND, 404);
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(__dirname, '../../../', document.path);
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, continue with deletion
      console.warn(`Could not delete file: ${document.path}`);
    }

    await Document.findByIdAndDelete(id);
    return document;
  }

  /**
   * Get document statistics
   * @returns {Object} Statistics
   */
  async getStats() {
    const [
      totalDocuments,
      pendingDocuments,
      verifiedDocuments,
      rejectedDocuments,
      typeStats,
    ] = await Promise.all([
      Document.countDocuments(),
      Document.countDocuments({ status: DOCUMENT_STATUS.PENDING }),
      Document.countDocuments({ status: DOCUMENT_STATUS.VERIFIED }),
      Document.countDocuments({ status: DOCUMENT_STATUS.REJECTED }),
      Document.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const byType = {};
    typeStats.forEach((item) => {
      byType[item._id] = item.count;
    });

    return {
      total: totalDocuments,
      pending: pendingDocuments,
      verified: verifiedDocuments,
      rejected: rejectedDocuments,
      byType,
    };
  }
}

module.exports = new DocumentService();
