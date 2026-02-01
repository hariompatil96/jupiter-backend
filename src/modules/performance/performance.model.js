const mongoose = require('mongoose');
const { PERFORMANCE_STATUS, EVALUATION_TYPE, GRADES } = require('../../utils/constants');

// Metric sub-document schema (aligned with Java)
const metricSchema = new mongoose.Schema(
  {
    metricName: {
      type: String,
      required: [true, 'Metric name is required'],
      trim: true,
      maxlength: [100, 'Metric name cannot exceed 100 characters'],
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
    },
    maxScore: {
      type: Number,
      required: [true, 'Max score is required'],
      min: [1, 'Max score must be at least 1'],
    },
    weightage: {
      type: Number,
      min: [0, 'Weightage cannot be negative'],
      max: [100, 'Weightage cannot exceed 100'],
      default: 0,
    },
    comments: {
      type: String,
      maxlength: [500, 'Comments cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

const performanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Evaluator ID is required'],
    },
    evaluatorName: {
      type: String,
      required: [true, 'Evaluator name is required'],
      trim: true,
      maxlength: [100, 'Evaluator name cannot exceed 100 characters'],
    },
    evaluationType: {
      type: String,
      enum: {
        values: Object.values(EVALUATION_TYPE),
        message: `Evaluation type must be one of: ${Object.values(EVALUATION_TYPE).join(', ')}`,
      },
      required: [true, 'Evaluation type is required'],
    },
    evaluationPeriod: {
      type: String,
      trim: true,
      maxlength: [100, 'Evaluation period cannot exceed 100 characters'],
    },
    overallScore: {
      type: Number,
      min: [0, 'Overall score cannot be negative'],
      max: [100, 'Overall score cannot exceed 100'],
    },
    grade: {
      type: String,
      enum: {
        values: Object.values(GRADES),
        message: `Grade must be one of: ${Object.values(GRADES).join(', ')}`,
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PERFORMANCE_STATUS),
        message: `Status must be one of: ${Object.values(PERFORMANCE_STATUS).join(', ')}`,
      },
      default: PERFORMANCE_STATUS.DRAFT,
    },
    metrics: [metricSchema],
    feedback: {
      type: String,
      maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    strengths: {
      type: String,
      maxlength: [1000, 'Strengths cannot exceed 1000 characters'],
    },
    areasOfImprovement: {
      type: String,
      maxlength: [1000, 'Areas of improvement cannot exceed 1000 characters'],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
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
performanceSchema.index({ studentId: 1, evaluationType: 1 });
performanceSchema.index({ status: 1 });
performanceSchema.index({ evaluationType: 1 });
performanceSchema.index({ evaluatorId: 1 });

// Populate student when querying
performanceSchema.pre(/^find/, function (next) {
  if (this.options._skipPopulate) {
    return next();
  }
  this.populate({
    path: 'studentId',
    select: 'studentCode firstName lastName email department',
  });
  next();
});

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
