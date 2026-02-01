const skillRoutes = require('./skill.routes');
const skillService = require('./skill.service');
const skillController = require('./skill.controller');
const Skill = require('./skill.model');

module.exports = {
  skillRoutes,
  skillService,
  skillController,
  Skill,
};
