const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const env = require('./config/env');
const logger = require('./utils/logger');
const ApiResponse = require('./utils/apiResponse');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

// Import routes
const { authRoutes } = require('./modules/auth');
const { studentRoutes } = require('./modules/student');
const { hrRoutes } = require('./modules/hr');

// Create Express app
const app = express();

// Trust proxy (for production behind load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(cors({
  origin: env.isProduction
    ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../', env.UPLOAD_DIR)));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  return ApiResponse.success(res, 'Server is healthy', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/hr', hrRoutes);

// Root endpoint
app.get('/', (req, res) => {
  return ApiResponse.success(res, 'Welcome to JUPITER - Smart Student & HR Utility Portal API', {
    name: 'JUPITER Backend API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

// API documentation endpoint (placeholder)
app.get('/api/docs', (req, res) => {
  return ApiResponse.success(res, 'API Documentation', {
    endpoints: {
      auth: {
        base: '/api/auth',
        routes: [
          'POST /register - Register a new user',
          'POST /login - Login user',
          'POST /refresh - Refresh access token',
          'POST /logout - Logout user',
          'POST /change-password - Change password',
          'GET /profile - Get user profile',
          'PUT /profile - Update user profile',
          'GET /me - Get current user',
        ],
      },
      students: {
        base: '/api/students',
        routes: [
          'GET /ping - Health check',
          'GET /status - Service status',
          'POST / - Create student',
          'GET / - Get all students (paginated)',
          'GET /:id - Get student by ID',
          'GET /code/:studentCode - Get student by code',
          'GET /department/:department - Get students by department',
          'GET /status/:status - Get students by status',
          'GET /search?name= - Search students',
          'PUT /:id - Update student',
          'PATCH /:id/status?status= - Update student status',
          'DELETE /:id - Delete student',
          'GET /stats - Get student statistics',
        ],
      },
      hr: {
        base: '/api/hr',
        routes: [
          'GET /ping - Health check',
          'GET /status - Service status',
          'GET /dashboard/stats - Dashboard statistics',
        ],
        skill: {
          base: '/api/hr/skill',
          routes: [
            'POST / - Create skill',
            'GET /:id - Get skill by ID',
            'GET /student/:studentId - Get skills by student',
            'GET /unverified - Get unverified skills',
            'PUT /:id/verify?hrId= - Verify skill',
            'DELETE /:id - Delete skill',
          ],
        },
        performance: {
          base: '/api/hr/performance',
          routes: [
            'POST / - Create performance',
            'GET /:id - Get performance by ID',
            'GET /student/:studentId - Get performances by student',
            'GET /pending - Get pending performances',
            'PUT /:id/approve - Approve performance',
            'PUT /:id/reject - Reject performance',
          ],
        },
        document: {
          base: '/api/hr/document',
          routes: [
            'POST / - Upload document',
            'GET /:id - Get document by ID',
            'GET /student/:studentId - Get documents by student',
            'GET /pending - Get pending documents',
            'PUT /:id/verify - Verify document',
            'PUT /:id/reject - Reject document',
            'DELETE /:id - Delete document',
          ],
        },
      },
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
