const express = require('express');
const hrController = require('./hr.controller');
const { skillRoutes } = require('../skill');
const { performanceRoutes } = require('../performance');
const { documentRoutes } = require('../document');
const { authenticate } = require('../../middlewares/auth.middleware');
const { adminOrHr } = require('../../middlewares/role.middleware');

const router = express.Router();

// Health check endpoints (public)
router.get('/ping', hrController.ping);
router.get('/status', hrController.status);

// Mount skill routes
router.use('/skill', skillRoutes);

// Mount performance routes
router.use('/performance', performanceRoutes);

// Mount document routes
router.use('/document', documentRoutes);

// Dashboard statistics (protected)
router.get('/dashboard/stats', authenticate, adminOrHr, hrController.getDashboardStats);

module.exports = router;
