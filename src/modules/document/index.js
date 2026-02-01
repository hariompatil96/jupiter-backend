const documentRoutes = require('./document.routes');
const documentService = require('./document.service');
const documentController = require('./document.controller');
const Document = require('./document.model');

module.exports = {
  documentRoutes,
  documentService,
  documentController,
  Document,
};
