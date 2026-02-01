const Skill = require('./skill.model');
const Student = require('../student/student.model');
const { AppError } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class SkillService {
  /**
   * Create a new skill
   * @param {Object} skillData - Skill data
   * @returns {Object} Created skill
   */
  async createSkill(skillData) {
    // Verify student exists
    const student = await Student.findById(skillData.studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    const skill = await Skill.create(skillData);
    return skill;
  }

  /**
   * Get skill by ID
   * @param {string} id - Skill ID
   * @returns {Object} Skill
   */
  async getSkillById(id) {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new AppError(MESSAGES.SKILL_NOT_FOUND, 404);
    }
    return skill;
  }

  /**
   * Get skills by student ID
   * @param {string} studentId - Student ID
   * @returns {Array} Skills
   */
  async getSkillsByStudentId(studentId) {
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError(MESSAGES.STUDENT_NOT_FOUND, 404);
    }

    const skills = await Skill.find({ studentId }).sort({ createdAt: -1 });
    return skills;
  }

  /**
   * Get all unverified skills (aligned with Java)
   * @returns {Array} Unverified skills
   */
  async getUnverifiedSkills() {
    const skills = await Skill.find({ verifiedByHr: false }).sort({
      createdAt: -1,
    });
    return skills;
  }

  /**
   * Update skill
   * @param {string} id - Skill ID
   * @param {Object} updateData - Update data
   * @returns {Object} Updated skill
   */
  async updateSkill(id, updateData) {
    const skill = await Skill.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      throw new AppError(MESSAGES.SKILL_NOT_FOUND, 404);
    }

    return skill;
  }

  /**
   * Verify skill (aligned with Java)
   * @param {string} id - Skill ID
   * @param {string} hrId - HR User ID
   * @returns {Object} Verified skill
   */
  async verifySkill(id, hrId) {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new AppError(MESSAGES.SKILL_NOT_FOUND, 404);
    }

    if (skill.verifiedByHr) {
      throw new AppError('Skill is already verified', 400);
    }

    skill.verifiedByHr = true;
    skill.verifiedBy = hrId;
    skill.verifiedAt = new Date();

    await skill.save();
    return skill;
  }

  /**
   * Delete skill
   * @param {string} id - Skill ID
   */
  async deleteSkill(id) {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      throw new AppError(MESSAGES.SKILL_NOT_FOUND, 404);
    }
    return skill;
  }

  /**
   * Get skill statistics
   * @returns {Object} Statistics
   */
  async getStats() {
    const [totalSkills, unverifiedSkills, verifiedSkills, categoryStats] =
      await Promise.all([
        Skill.countDocuments(),
        Skill.countDocuments({ verifiedByHr: false }),
        Skill.countDocuments({ verifiedByHr: true }),
        Skill.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

    const byCategory = {};
    categoryStats.forEach((item) => {
      byCategory[item._id] = item.count;
    });

    return {
      total: totalSkills,
      unverified: unverifiedSkills,
      verified: verifiedSkills,
      byCategory,
    };
  }
}

module.exports = new SkillService();
