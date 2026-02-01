package com.spring.api;

import com.spring.model.Document;
import com.spring.model.Performance;
import com.spring.model.Performance.EvaluationStatus;
import com.spring.model.Skill;
import com.spring.service.HRService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * HR REST API Controller
 *
 * Provides REST endpoints for HR operations including skill management,
 * performance evaluation, and document verification.
 * All endpoints return JSON responses.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/hr")
public class HrApiController {

    private static final Logger logger = LoggerFactory.getLogger(HrApiController.class);

    private final HRService hrService;

    @Autowired
    public HrApiController(HRService hrService) {
        this.hrService = hrService;
    }

    /**
     * Health check / Ping endpoint
     *
     * GET /api/hr/ping
     *
     * @return ping response
     */
    @GetMapping(value = "/ping", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> ping() {
        logger.info("HR API Ping endpoint called");
        return ResponseEntity.ok("JUPITER HR API is running! 🚀");
    }

    /**
     * Get API status with details
     *
     * GET /api/hr/status
     *
     * @return API status information
     */
    @GetMapping(value = "/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "JUPITER HR API");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    // ==================== SKILL ENDPOINTS ====================

    /**
     * Add a new skill for a student
     *
     * POST /api/hr/skill
     * Content-Type: application/json
     *
     * @param skill the skill data
     * @return created skill with 201 status
     */
    @PostMapping(
        value = "/skill",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> addSkill(@RequestBody Skill skill) {
        logger.info("Adding new skill: {} for student: {}", skill.getSkillName(), skill.getStudentId());

        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (skill.getStudentId() == null || skill.getStudentId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Student ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (skill.getSkillName() == null || skill.getSkillName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Skill name is required");
                return ResponseEntity.badRequest().body(response);
            }

            Skill createdSkill = hrService.addSkill(skill);

            response.put("success", true);
            response.put("message", "Skill added successfully");
            response.put("data", createdSkill);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error adding skill", e);
            response.put("success", false);
            response.put("message", "An error occurred while adding the skill");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get skill by ID
     *
     * GET /api/hr/skill/{id}
     *
     * @param id the skill ID
     * @return skill data
     */
    @GetMapping(value = "/skill/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getSkillById(@PathVariable String id) {
        logger.info("Fetching skill by ID: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Skill> skillOpt = hrService.findSkillById(id);

        if (skillOpt.isPresent()) {
            response.put("success", true);
            response.put("data", skillOpt.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Skill not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Get all skills for a student
     *
     * GET /api/hr/skill/student/{studentId}
     *
     * @param studentId the student ID
     * @return list of skills
     */
    @GetMapping(value = "/skill/student/{studentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getSkillsByStudent(@PathVariable String studentId) {
        logger.info("Fetching skills for student: {}", studentId);

        Map<String, Object> response = new HashMap<>();
        List<Skill> skills = hrService.findSkillsByStudent(studentId);

        response.put("success", true);
        response.put("data", skills);
        response.put("count", skills.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Get all unverified skills (HR review queue)
     *
     * GET /api/hr/skill/unverified
     *
     * @return list of unverified skills
     */
    @GetMapping(value = "/skill/unverified", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getUnverifiedSkills() {
        logger.info("Fetching all unverified skills");

        Map<String, Object> response = new HashMap<>();
        List<Skill> skills = hrService.findAllUnverifiedSkills();

        response.put("success", true);
        response.put("data", skills);
        response.put("count", skills.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Verify a skill
     *
     * PUT /api/hr/skill/{id}/verify
     *
     * @param id the skill ID
     * @param hrId the HR verifier's ID
     * @return success response
     */
    @PutMapping(value = "/skill/{id}/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> verifySkill(
            @PathVariable String id,
            @RequestParam String hrId) {

        logger.info("Verifying skill {} by HR: {}", id, hrId);

        Map<String, Object> response = new HashMap<>();

        boolean verified = hrService.verifySkill(id, hrId);

        if (verified) {
            response.put("success", true);
            response.put("message", "Skill verified successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Skill not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Delete skill
     *
     * DELETE /api/hr/skill/{id}
     *
     * @param id the skill ID
     * @return success response
     */
    @DeleteMapping(value = "/skill/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> deleteSkill(@PathVariable String id) {
        logger.info("Deleting skill: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Skill> skillOpt = hrService.findSkillById(id);

        if (skillOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Skill not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        hrService.deleteSkill(id);

        response.put("success", true);
        response.put("message", "Skill deleted successfully");

        return ResponseEntity.ok(response);
    }

    // ==================== PERFORMANCE ENDPOINTS ====================

    /**
     * Create a new performance evaluation
     *
     * POST /api/hr/performance
     * Content-Type: application/json
     *
     * @param performance the performance data
     * @return created performance with 201 status
     */
    @PostMapping(
        value = "/performance",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> createPerformance(@RequestBody Performance performance) {
        logger.info("Creating performance evaluation for student: {}", performance.getStudentId());

        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (performance.getStudentId() == null || performance.getStudentId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Student ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (performance.getEvaluatorId() == null || performance.getEvaluatorId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Evaluator ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            Performance createdPerformance = hrService.createPerformance(performance);

            response.put("success", true);
            response.put("message", "Performance evaluation created successfully");
            response.put("data", createdPerformance);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error creating performance evaluation", e);
            response.put("success", false);
            response.put("message", "An error occurred while creating the performance evaluation");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get performance by ID
     *
     * GET /api/hr/performance/{id}
     *
     * @param id the performance ID
     * @return performance data
     */
    @GetMapping(value = "/performance/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPerformanceById(@PathVariable String id) {
        logger.info("Fetching performance by ID: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Performance> perfOpt = hrService.findPerformanceById(id);

        if (perfOpt.isPresent()) {
            response.put("success", true);
            response.put("data", perfOpt.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Performance evaluation not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Get all performance records for a student
     *
     * GET /api/hr/performance/student/{studentId}
     *
     * @param studentId the student ID
     * @return list of performance records
     */
    @GetMapping(value = "/performance/student/{studentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPerformancesByStudent(@PathVariable String studentId) {
        logger.info("Fetching performance records for student: {}", studentId);

        Map<String, Object> response = new HashMap<>();
        List<Performance> performances = hrService.findPerformancesByStudent(studentId);

        response.put("success", true);
        response.put("data", performances);
        response.put("count", performances.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Get pending performance reviews
     *
     * GET /api/hr/performance/pending
     *
     * @return list of pending reviews
     */
    @GetMapping(value = "/performance/pending", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPendingReviews() {
        logger.info("Fetching pending performance reviews");

        Map<String, Object> response = new HashMap<>();
        List<Performance> performances = hrService.findPendingReviews();

        response.put("success", true);
        response.put("data", performances);
        response.put("count", performances.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Approve performance evaluation
     *
     * PUT /api/hr/performance/{id}/approve
     *
     * @param id the performance ID
     * @return success response
     */
    @PutMapping(value = "/performance/{id}/approve", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> approvePerformance(@PathVariable String id) {
        logger.info("Approving performance: {}", id);

        Map<String, Object> response = new HashMap<>();

        boolean approved = hrService.approvePerformance(id);

        if (approved) {
            response.put("success", true);
            response.put("message", "Performance evaluation approved successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Performance evaluation not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Reject performance evaluation
     *
     * PUT /api/hr/performance/{id}/reject
     *
     * @param id the performance ID
     * @return success response
     */
    @PutMapping(value = "/performance/{id}/reject", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> rejectPerformance(@PathVariable String id) {
        logger.info("Rejecting performance: {}", id);

        Map<String, Object> response = new HashMap<>();

        boolean rejected = hrService.rejectPerformance(id);

        if (rejected) {
            response.put("success", true);
            response.put("message", "Performance evaluation rejected");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Performance evaluation not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // ==================== DOCUMENT ENDPOINTS ====================

    /**
     * Upload/Create a new document
     *
     * POST /api/hr/document
     * Content-Type: application/json
     *
     * @param document the document data
     * @return created document with 201 status
     */
    @PostMapping(
        value = "/document",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> createDocument(@RequestBody Document document) {
        logger.info("Creating document: {} for student: {}", document.getDocumentName(), document.getStudentId());

        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (document.getStudentId() == null || document.getStudentId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Student ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (document.getDocumentName() == null || document.getDocumentName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Document name is required");
                return ResponseEntity.badRequest().body(response);
            }

            Document createdDocument = hrService.createDocument(document);

            response.put("success", true);
            response.put("message", "Document created successfully");
            response.put("data", createdDocument);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            logger.error("Error creating document", e);
            response.put("success", false);
            response.put("message", "An error occurred while creating the document");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get document by ID
     *
     * GET /api/hr/document/{id}
     *
     * @param id the document ID
     * @return document data
     */
    @GetMapping(value = "/document/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDocumentById(@PathVariable String id) {
        logger.info("Fetching document by ID: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Document> docOpt = hrService.findDocumentById(id);

        if (docOpt.isPresent()) {
            response.put("success", true);
            response.put("data", docOpt.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Document not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Get all documents for a student
     *
     * GET /api/hr/document/student/{studentId}
     *
     * @param studentId the student ID
     * @return list of documents
     */
    @GetMapping(value = "/document/student/{studentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDocumentsByStudent(@PathVariable String studentId) {
        logger.info("Fetching documents for student: {}", studentId);

        Map<String, Object> response = new HashMap<>();
        List<Document> documents = hrService.findDocumentsByStudent(studentId);

        response.put("success", true);
        response.put("data", documents);
        response.put("count", documents.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Get all pending documents (HR review queue)
     *
     * GET /api/hr/document/pending
     *
     * @return list of pending documents
     */
    @GetMapping(value = "/document/pending", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getPendingDocuments() {
        logger.info("Fetching all pending documents");

        Map<String, Object> response = new HashMap<>();
        List<Document> documents = hrService.findAllPendingDocuments();

        response.put("success", true);
        response.put("data", documents);
        response.put("count", documents.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Verify a document
     *
     * PUT /api/hr/document/{id}/verify
     *
     * @param id the document ID
     * @param hrId the HR verifier's ID
     * @param hrName the HR verifier's name
     * @param remarks verification remarks (optional)
     * @return success response
     */
    @PutMapping(value = "/document/{id}/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> verifyDocument(
            @PathVariable String id,
            @RequestParam String hrId,
            @RequestParam String hrName,
            @RequestParam(required = false, defaultValue = "") String remarks) {

        logger.info("Verifying document {} by HR: {}", id, hrId);

        Map<String, Object> response = new HashMap<>();

        boolean verified = hrService.verifyDocument(id, hrId, hrName, remarks);

        if (verified) {
            response.put("success", true);
            response.put("message", "Document verified successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Document not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Reject a document
     *
     * PUT /api/hr/document/{id}/reject
     *
     * @param id the document ID
     * @param hrId the HR verifier's ID
     * @param hrName the HR verifier's name
     * @param remarks rejection remarks
     * @return success response
     */
    @PutMapping(value = "/document/{id}/reject", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> rejectDocument(
            @PathVariable String id,
            @RequestParam String hrId,
            @RequestParam String hrName,
            @RequestParam(required = false, defaultValue = "") String remarks) {

        logger.info("Rejecting document {} by HR: {}", id, hrId);

        Map<String, Object> response = new HashMap<>();

        boolean rejected = hrService.rejectDocument(id, hrId, hrName, remarks);

        if (rejected) {
            response.put("success", true);
            response.put("message", "Document rejected");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Document not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Delete document
     *
     * DELETE /api/hr/document/{id}
     *
     * @param id the document ID
     * @return success response
     */
    @DeleteMapping(value = "/document/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> deleteDocument(@PathVariable String id) {
        logger.info("Deleting document: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Document> docOpt = hrService.findDocumentById(id);

        if (docOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Document not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        hrService.deleteDocument(id);

        response.put("success", true);
        response.put("message", "Document deleted successfully");

        return ResponseEntity.ok(response);
    }

    // ==================== DASHBOARD STATISTICS ====================

    /**
     * Get HR dashboard statistics
     *
     * GET /api/hr/dashboard/stats
     *
     * @return dashboard statistics
     */
    @GetMapping(value = "/dashboard/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        logger.info("Fetching HR dashboard statistics");

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> stats = new HashMap<>();

        // Skills stats
        stats.put("pendingSkillVerifications", hrService.findAllUnverifiedSkills().size());

        // Document stats
        stats.put("pendingDocuments", hrService.findAllPendingDocuments().size());
        stats.put("expiringDocuments", hrService.findDocumentsExpiringSoon().size());

        // Performance stats
        stats.put("pendingPerformanceReviews", hrService.findPendingReviews().size());

        response.put("success", true);
        response.put("data", stats);

        return ResponseEntity.ok(response);
    }
}
