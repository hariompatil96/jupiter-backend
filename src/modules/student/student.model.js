const mongoose = require('mongoose');
const { STUDENT_STATUS, DEPARTMENTS, GENDER } = require('../../utils/constants');

const studentSchema = new mongoose.Schema(
  {
    studentCode: {
      type: String,
      required: [true, 'Student code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      immutable: true, // Cannot be modified once set (aligned with Java)
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s-]{10,15}$/, 'Please provide a valid phone number'],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(GENDER),
        message: `Gender must be one of: ${Object.values(GENDER).join(', ')}`,
      },
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: Object.values(DEPARTMENTS),
        message: `Department must be one of: ${Object.values(DEPARTMENTS).join(', ')}`,
      },
    },
    course: {
      type: String,
      trim: true,
      maxlength: [100, 'Course cannot exceed 100 characters'],
    },
    semester: {
      type: Number,
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
    },
    address: {
      street: { type: String, trim: true, maxlength: 200 },
      city: { type: String, trim: true, maxlength: 100 },
      state: { type: String, trim: true, maxlength: 100 },
      zipCode: { type: String, trim: true, maxlength: 20 },
      country: { type: String, trim: true, maxlength: 100, default: 'India' },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(STUDENT_STATUS),
        message: `Status must be one of: ${Object.values(STUDENT_STATUS).join(', ')}`,
      },
      default: STUDENT_STATUS.ACTIVE,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    profileImage: {
      type: String,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
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
studentSchema.index({ studentCode: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Virtual for full name
studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Static method to generate next student code (format: STU2024001 - aligned with Java)
studentSchema.statics.generateStudentCode = async function () {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `STU${currentYear}`;

  // Find the last student code for the current year
  const lastStudent = await this.findOne(
    { studentCode: { $regex: `^${yearPrefix}` } },
    {},
    { sort: { studentCode: -1 } }
  );

  if (!lastStudent) {
    return `${yearPrefix}001`;
  }

  // Extract the sequence number and increment
  const lastSequence = parseInt(lastStudent.studentCode.slice(-3), 10);
  const newSequence = (lastSequence + 1).toString().padStart(3, '0');
  return `${yearPrefix}${newSequence}`;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
