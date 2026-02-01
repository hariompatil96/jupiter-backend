const performanceRoutes = require('./performance.routes');
const performanceService = require('./performance.service');
const performanceController = require('./performance.controller');
const Performance = require('./performance.model');

module.exports = {
  performanceRoutes,
  performanceService,
  performanceController,
  Performance,
};
