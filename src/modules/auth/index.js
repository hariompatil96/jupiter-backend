const authRoutes = require('./auth.routes');
const authService = require('./auth.service');
const authController = require('./auth.controller');
const User = require('./user.model');

module.exports = {
  authRoutes,
  authService,
  authController,
  User,
};
