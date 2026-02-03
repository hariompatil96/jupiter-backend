const jwt = require('jsonwebtoken');
const User = require('./user.model');
const Student = require('../student/student.model');
const env = require('../../config/env');
const { AppError } = require('../../middlewares/error.middleware');
const { MESSAGES, ROLES } = require('../../utils/constants');

class AuthService {
  /**
   * Generate access token
   * @param {Object} user - User object
   * @returns {string} Access token
   */
  generateAccessToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Include studentId in JWT payload for STUDENT users
    if (user.role === ROLES.STUDENT && user.studentId) {
      payload.studentId = user.studentId;
    }

    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.TOKEN_EXPIRES_IN });
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @returns {string} Refresh token
   */
  generateRefreshToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Include studentId in JWT payload for STUDENT users
    if (user.role === ROLES.STUDENT && user.studentId) {
      payload.studentId = user.studentId;
    }

    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_EXPIRES_IN });
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} user - User object
   * @returns {Object} Tokens object
   */
  generateTokens(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {Object} requestingUser - The user making the request (null for public registration)
   * @returns {Object} User and tokens
   */
  async register(userData, requestingUser = null) {
    const { email, password, firstName, lastName, role, studentId } = userData;

    // AUTHORIZATION: Only ADMIN can create HR or STUDENT users
    if (role === ROLES.HR || role === ROLES.STUDENT) {
      if (!requestingUser) {
        throw new AppError('Authentication required to create HR or STUDENT users', 401);
      }
      if (requestingUser.role !== ROLES.ADMIN) {
        throw new AppError('Only ADMIN can create HR or STUDENT users', 403);
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // STUDENT-specific validation: Verify studentId exists in Student collection
    let linkedStudent = null;
    if (role === ROLES.STUDENT) {
      if (!studentId) {
        throw new AppError('studentId is required for STUDENT role', 400);
      }

      linkedStudent = await Student.findById(studentId);
      if (!linkedStudent) {
        throw new AppError('Student not found. studentId must reference an existing student.', 404);
      }

      // Check if this student is already linked to another user
      const existingStudentUser = await User.findOne({ studentId });
      if (existingStudentUser) {
        throw new AppError('This student is already linked to another user account', 409);
      }
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      studentId: role === ROLES.STUDENT ? studentId : null,
    });

    // Link the User back to the Student record
    if (linkedStudent) {
      linkedStudent.userId = user._id;
      await linkedStudent.save();
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Save refresh token to user
    user.refreshToken = tokens.refreshToken;
    await user.save();

    const responseUser = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    // Include studentId in response for STUDENT users
    if (user.role === ROLES.STUDENT && user.studentId) {
      responseUser.studentId = user.studentId;
    }

    return {
      user: responseUser,
      ...tokens,
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User and tokens
   */
  async login(email, password) {
    // Find user with password
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support.', 401);
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Update last login and refresh token
    user.lastLogin = new Date();
    user.refreshToken = tokens.refreshToken;
    await user.save();

    const responseUser = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    // Include studentId in response for STUDENT users
    if (user.role === ROLES.STUDENT && user.studentId) {
      responseUser.studentId = user.studentId;
    }

    return {
      user: responseUser,
      ...tokens,
    };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

      // Find user and verify refresh token matches
      const user = await User.findById(decoded.id).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Update refresh token in database
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token has expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid refresh token', 401);
      }
      throw error;
    }
  }

  /**
   * Logout user
   * @param {string} userId - User ID
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  /**
   * Change password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Object} User profile
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated user
   */
  async updateProfile(userId, updateData) {
    const allowedFields = ['firstName', 'lastName'];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

module.exports = new AuthService();
