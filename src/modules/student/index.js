const studentRoutes = require('./student.routes');
const studentService = require('./student.service');
const studentController = require('./student.controller');
const Student = require('./student.model');

module.exports = {
  studentRoutes,
  studentService,
  studentController,
  Student,
};
