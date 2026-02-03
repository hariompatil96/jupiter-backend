const mongoose = require('mongoose');
const { DOCUMENT_STATUS, DOCUMENT_TYPES } = require('../../utils/constants');

const documentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
      maxlength: [200, 'Document name cannot exceed 200 characters'],
    },
    documentType: {
      type: String,
      enum: {
        values: Object.values(DOCUMENT_TYPES),
        message: `Document type must be one of: ${Object.values(DOCUMENT_TYPES).join(', ')}`,
      },
      required: [true, 'Document type is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    confidential: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DOCUMENT_STATUS),
        message: `Status must be one of: ${Object.values(DOCUMENT_STATUS).join(', ')}`,
      },
      default: DOCUMENT_STATUS.PENDING,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedByName: {
      type: String,
      trim: true,
      maxlength: [100, 'Verifier name cannot exceed 100 characters'],
    },
    verifiedAt: {
      type: Date,
    },
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
    },
    expiryDate: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes
// Note: studentId and expiryDate single-field indexes are created by index: true in schema
documentSchema.index({ studentId: 1, documentType: 1 }); // Compound index for efficient queries
documentSchema.index({ status: 1 });
documentSchema.index({ documentType: 1 });

// Virtual for checking if document is expired
documentSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Virtual for checking if document is expiring soon (within 30 days)
documentSchema.virtual('isExpiringSoon').get(function () {
  if (!this.expiryDate) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return this.expiryDate <= thirtyDaysFromNow && this.expiryDate > new Date();
});

// Populate student when querying
documentSchema.pre(/^find/, function (next) {
  if (this.options._skipPopulate) {
    return next();
  }
  this.populate({
    path: 'studentId',
    select: 'studentCode firstName lastName email department',
  });
  next();
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
