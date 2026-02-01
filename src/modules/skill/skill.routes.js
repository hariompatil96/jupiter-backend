const express = require('express');
const skillController = require('./skill.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { adminOrHr } = require('../../middlewares/role.middleware');
const {
  validate,
  createSkillSchema,
  getSkillByIdSchema,
  getSkillsByStudentIdSchema,
  verifySkillSchema,
  deleteSkillSchema,
  rejectSkillSchema,
} = require('./skill.validation');

const router = express.Router();

// All routes require authentication and HR/Admin role
router.use(authenticate, adminOrHr);

// Create skill
router.post('/', validate(createSkillSchema), skillController.createSkill);

// Get unverified skills (must come before /:id)
router.get('/unverified', skillController.getUnverifiedSkills);

// Get skills by student ID
router.get(
  '/student/:studentId',
  validate(getSkillsByStudentIdSchema),
  skillController.getSkillsByStudentId
);

// Get skill statistics
router.get('/stats', skillController.getStats);

// Get skill by ID
router.get('/:id', validate(getSkillByIdSchema), skillController.getSkillById);

// Verify skill
router.put('/:id/verify', validate(verifySkillSchema), skillController.verifySkill);

// Reject skill
router.put('/:id/reject', validate(rejectSkillSchema), skillController.rejectSkill);

// Delete skill
router.delete('/:id', validate(deleteSkillSchema), skillController.deleteSkill);

module.exports = router;
