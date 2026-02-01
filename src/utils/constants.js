/**
 * Application Constants - Centralized Enum Definitions
 * All enums aligned with Java Spring MVC backend
 */

// User Roles
const ROLES = {
  ADMIN: 'ADMIN',
  HR: 'HR',
  STUDENT: 'STUDENT',
};

// Student Status (aligned with Java)
const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  GRADUATED: 'GRADUATED',
  SUSPENDED: 'SUSPENDED',
  ON_LEAVE: 'ON_LEAVE',
};

// Gender
const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

// Departments
const DEPARTMENTS = {
  COMPUTER_SCIENCE: 'COMPUTER_SCIENCE',
  INFORMATION_TECHNOLOGY: 'INFORMATION_TECHNOLOGY',
  ELECTRONICS: 'ELECTRONICS',
  MECHANICAL: 'MECHANICAL',
  CIVIL: 'CIVIL',
  ELECTRICAL: 'ELECTRICAL',
  CHEMICAL: 'CHEMICAL',
  BIOTECHNOLOGY: 'BIOTECHNOLOGY',
};

// Skill Category (aligned with Java)
const SKILL_CATEGORY = {
  TECHNICAL: 'TECHNICAL',
  PROGRAMMING: 'PROGRAMMING',
  DATABASE: 'DATABASE',
  FRAMEWORK: 'FRAMEWORK',
  SOFT_SKILL: 'SOFT_SKILL',
  LANGUAGE: 'LANGUAGE',
  MANAGEMENT: 'MANAGEMENT',
  DESIGN: 'DESIGN',
  OTHER: 'OTHER',
};

// Skill Proficiency Level (aligned with Java)
const PROFICIENCY_LEVEL = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT',
};

// Performance/Evaluation Type (aligned with Java)
const EVALUATION_TYPE = {
  ACADEMIC: 'ACADEMIC',
  INTERNSHIP: 'INTERNSHIP',
  PROJECT: 'PROJECT',
  QUARTERLY: 'QUARTERLY',
  ANNUAL: 'ANNUAL',
  PROBATION: 'PROBATION',
  SKILL_ASSESSMENT: 'SKILL_ASSESSMENT',
};

// Performance Status (aligned with Java)
const PERFORMANCE_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Grade Scale
const GRADES = {
  A_PLUS: 'A+',
  A: 'A',
  A_MINUS: 'A-',
  B_PLUS: 'B+',
  B: 'B',
  B_MINUS: 'B-',
  C_PLUS: 'C+',
  C: 'C',
  C_MINUS: 'C-',
  D: 'D',
  F: 'F',
};

// Document Status
const DOCUMENT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

// Document Types (aligned with Java)
const DOCUMENT_TYPES = {
  ID_PROOF: 'ID_PROOF',
  ADDRESS_PROOF: 'ADDRESS_PROOF',
  ACADEMIC_CERTIFICATE: 'ACADEMIC_CERTIFICATE',
  PROFESSIONAL_CERTIFICATE: 'PROFESSIONAL_CERTIFICATE',
  TRANSCRIPT: 'TRANSCRIPT',
  RESUME: 'RESUME',
  COVER_LETTER: 'COVER_LETTER',
  OFFER_LETTER: 'OFFER_LETTER',
  EXPERIENCE_LETTER: 'EXPERIENCE_LETTER',
  RECOMMENDATION_LETTER: 'RECOMMENDATION_LETTER',
  PASSPORT: 'PASSPORT',
  VISA: 'VISA',
  MEDICAL_RECORD: 'MEDICAL_RECORD',
  OTHER: 'OTHER',
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// API Messages
const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',

  // Student
  STUDENT_CREATED: 'Student created successfully',
  STUDENT_UPDATED: 'Student updated successfully',
  STUDENT_DELETED: 'Student deleted successfully',
  STUDENT_FOUND: 'Student retrieved successfully',
  STUDENTS_FOUND: 'Students retrieved successfully',
  STUDENT_NOT_FOUND: 'Student not found',
  STUDENT_CODE_EXISTS: 'Student code already exists',
  STUDENT_EMAIL_EXISTS: 'Student email already exists',
  STUDENT_STATUS_UPDATED: 'Student status updated successfully',

  // Skill
  SKILL_CREATED: 'Skill created successfully',
  SKILL_UPDATED: 'Skill updated successfully',
  SKILL_DELETED: 'Skill deleted successfully',
  SKILL_FOUND: 'Skill retrieved successfully',
  SKILLS_FOUND: 'Skills retrieved successfully',
  SKILL_NOT_FOUND: 'Skill not found',
  SKILL_VERIFIED: 'Skill verified successfully',
  SKILL_REJECTED: 'Skill rejected successfully',

  // Performance
  PERFORMANCE_CREATED: 'Performance record created successfully',
  PERFORMANCE_UPDATED: 'Performance record updated successfully',
  PERFORMANCE_DELETED: 'Performance record deleted successfully',
  PERFORMANCE_FOUND: 'Performance record retrieved successfully',
  PERFORMANCES_FOUND: 'Performance records retrieved successfully',
  PERFORMANCE_NOT_FOUND: 'Performance record not found',
  PERFORMANCE_APPROVED: 'Performance record approved successfully',
  PERFORMANCE_REJECTED: 'Performance record rejected successfully',

  // Document
  DOCUMENT_UPLOADED: 'Document uploaded successfully',
  DOCUMENT_UPDATED: 'Document updated successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  DOCUMENT_FOUND: 'Document retrieved successfully',
  DOCUMENTS_FOUND: 'Documents retrieved successfully',
  DOCUMENT_NOT_FOUND: 'Document not found',
  DOCUMENT_VERIFIED: 'Document verified successfully',
  DOCUMENT_REJECTED: 'Document rejected successfully',

  // General
  PING_SUCCESS: 'pong',
  STATUS_SUCCESS: 'Service is running',
  STATS_FOUND: 'Statistics retrieved successfully',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
};

module.exports = {
  ROLES,
  STUDENT_STATUS,
  GENDER,
  DEPARTMENTS,
  SKILL_CATEGORY,
  PROFICIENCY_LEVEL,
  EVALUATION_TYPE,
  PERFORMANCE_STATUS,
  GRADES,
  DOCUMENT_STATUS,
  DOCUMENT_TYPES,
  PAGINATION,
  MESSAGES,
};
