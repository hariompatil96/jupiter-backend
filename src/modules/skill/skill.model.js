const mongoose = require('mongoose');
const { SKILL_CATEGORY, PROFICIENCY_LEVEL } = require('../../utils/constants');

const skillSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    skillName: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: {
        values: Object.values(SKILL_CATEGORY),
        message: `Category must be one of: ${Object.values(SKILL_CATEGORY).join(', ')}`,
      },
    },
    proficiencyLevel: {
      type: String,
      enum: {
        values: Object.values(PROFICIENCY_LEVEL),
        message: `Proficiency level must be one of: ${Object.values(PROFICIENCY_LEVEL).join(', ')}`,
      },
      required: [true, 'Proficiency level is required'],
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [50, 'Years of experience seems too high'],
      default: 0,
    },
    certified: {
      type: Boolean,
      default: false,
    },
    certificationName: {
      type: String,
      trim: true,
      maxlength: [200, 'Certification name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    verifiedByHr: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
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
skillSchema.index({ studentId: 1, skillName: 1 });
skillSchema.index({ verifiedByHr: 1 });
skillSchema.index({ category: 1 });

// Populate student when querying
skillSchema.pre(/^find/, function (next) {
  if (this.options._skipPopulate) {
    return next();
  }
  this.populate({
    path: 'studentId',
    select: 'studentCode firstName lastName email department',
  });
  next();
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
