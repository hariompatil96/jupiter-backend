const skillService = require('./skill.service');
const ApiResponse = require('../../utils/apiResponse');
const { asyncHandler } = require('../../middlewares/error.middleware');
const { MESSAGES } = require('../../utils/constants');

class SkillController {
  /**
   * POST /api/hr/skill
   * Create a new skill
   */
  createSkill = asyncHandler(async (req, res) => {
    const skill = await skillService.createSkill(req.body);
    return ApiResponse.created(res, MESSAGES.SKILL_CREATED, skill);
  });

  /**
   * GET /api/hr/skill/:id
   * Get skill by ID
   */
  getSkillById = asyncHandler(async (req, res) => {
    const skill = await skillService.getSkillById(req.params.id);
    return ApiResponse.success(res, MESSAGES.SKILL_FOUND, skill);
  });

  /**
   * GET /api/hr/skill/student/:studentId
   * Get skills by student ID
   */
  getSkillsByStudentId = asyncHandler(async (req, res) => {
    const skills = await skillService.getSkillsByStudentId(req.params.studentId);
    return ApiResponse.success(res, MESSAGES.SKILLS_FOUND, skills);
  });

  /**
   * GET /api/hr/skill/unverified
   * Get all unverified skills
   */
  getUnverifiedSkills = asyncHandler(async (req, res) => {
    const skills = await skillService.getUnverifiedSkills();
    return ApiResponse.success(res, MESSAGES.SKILLS_FOUND, skills);
  });

  /**
   * PUT /api/hr/skill/:id/verify
   * Verify a skill
   */
  verifySkill = asyncHandler(async (req, res) => {
    const { hrId } = req.query;
    const skill = await skillService.verifySkill(req.params.id, hrId || req.user.id);
    return ApiResponse.success(res, MESSAGES.SKILL_VERIFIED, skill);
  });

  /**
   * PUT /api/hr/skill/:id/reject
   * Reject a skill
   */
  rejectSkill = asyncHandler(async (req, res) => {
    const { rejectionReason } = req.body;
    const skill = await skillService.rejectSkill(
      req.params.id,
      req.user.id,
      rejectionReason
    );
    return ApiResponse.success(res, MESSAGES.SKILL_REJECTED, skill);
  });

  /**
   * DELETE /api/hr/skill/:id
   * Delete a skill
   */
  deleteSkill = asyncHandler(async (req, res) => {
    await skillService.deleteSkill(req.params.id);
    return ApiResponse.success(res, MESSAGES.SKILL_DELETED);
  });

  /**
   * GET /api/hr/skill/stats
   * Get skill statistics
   */
  getStats = asyncHandler(async (req, res) => {
    const stats = await skillService.getStats();
    return ApiResponse.success(res, MESSAGES.STATS_FOUND, stats);
  });
}

module.exports = new SkillController();
