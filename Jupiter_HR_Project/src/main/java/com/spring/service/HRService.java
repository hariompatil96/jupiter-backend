package com.spring.service;

import com.spring.model.Document;
import com.spring.model.Document.DocumentStatus;
import com.spring.model.Performance;
import com.spring.model.Performance.EvaluationStatus;
import com.spring.model.Skill;
import com.spring.repository.DocumentRepository;
import com.spring.repository.PerformanceRepository;
import com.spring.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * HR Service
 *
 * Provides business logic for HR operations including skill management,
 * performance evaluation, and document verification.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Service
public class HRService {

    private static final Logger logger = LoggerFactory.getLogger(HRService.class);

    private final SkillRepository skillRepository;
    private final PerformanceRepository performanceRepository;
    private final DocumentRepository documentRepository;

    @Autowired
    public HRService(SkillRepository skillRepository,
                     PerformanceRepository performanceRepository,
                     DocumentRepository documentRepository) {
        this.skillRepository = skillRepository;
        this.performanceRepository = performanceRepository;
        this.documentRepository = documentRepository;
    }

    // ==================== SKILL MANAGEMENT ====================

    /**
     * Add a new skill for a student
     *
     * @param skill the skill to add
     * @return the created skill
     */
    public Skill addSkill(Skill skill) {
        logger.info("Adding skill '{}' for student: {}", skill.getSkillName(), skill.getStudentId());

        skill.setCreatedAt(LocalDateTime.now());
        skill.setUpdatedAt(LocalDateTime.now());

        Skill savedSkill = skillRepository.save(skill);
        logger.info("Skill added successfully: {}", savedSkill.getId());
        return savedSkill;
    }

    /**
     * Find skill by ID
     *
     * @param id the skill ID
     * @return Optional containing the skill if found
     */
    public Optional<Skill> findSkillById(String id) {
        return skillRepository.findById(id);
    }

    /**
     * Find all skills for a student
     *
     * @param studentId the student ID
     * @return list of skills
     */
    public List<Skill> findSkillsByStudent(String studentId) {
        return skillRepository.findByStudentId(studentId);
    }

    /**
     * Find verified skills for a student
     *
     * @param studentId the student ID
     * @return list of verified skills
     */
    public List<Skill> findVerifiedSkills(String studentId) {
        return skillRepository.findByStudentIdAndVerifiedByHr(studentId, true);
    }

    /**
     * Find unverified skills for a student
     *
     * @param studentId the student ID
     * @return list of unverified skills
     */
    public List<Skill> findUnverifiedSkills(String studentId) {
        return skillRepository.findByStudentIdAndVerifiedByHr(studentId, false);
    }

    /**
     * Find all unverified skills (for HR review queue)
     *
     * @return list of all unverified skills
     */
    public List<Skill> findAllUnverifiedSkills() {
        return skillRepository.findByVerifiedByHr(false);
    }

    /**
     * Verify a skill
     *
     * @param skillId the skill ID
     * @param hrId the HR verifier's ID
     * @return true if skill was verified
     */
    public boolean verifySkill(String skillId, String hrId) {
        logger.info("Verifying skill {} by HR: {}", skillId, hrId);

        Optional<Skill> skillOpt = skillRepository.findById(skillId);
        if (skillOpt.isPresent()) {
            Skill skill = skillOpt.get();
            skill.setVerifiedByHr(true);
            skill.setHrVerifierId(hrId);
            skill.setVerificationDate(LocalDateTime.now());
            skill.setUpdatedAt(LocalDateTime.now());
            skillRepository.save(skill);
            logger.info("Skill verified successfully: {}", skillId);
            return true;
        }

        logger.warn("Skill not found for verification: {}", skillId);
        return false;
    }

    /**
     * Update skill
     *
     * @param skill the skill to update
     * @return the updated skill
     */
    public Skill updateSkill(Skill skill) {
        logger.info("Updating skill: {}", skill.getId());
        skill.setUpdatedAt(LocalDateTime.now());
        return skillRepository.save(skill);
    }

    /**
     * Delete skill
     *
     * @param skillId the skill ID
     */
    public void deleteSkill(String skillId) {
        logger.info("Deleting skill: {}", skillId);
        skillRepository.deleteById(skillId);
    }

    /**
     * Search skills by name
     *
     * @param name the skill name pattern
     * @return list of matching skills
     */
    public List<Skill> searchSkillsByName(String name) {
        return skillRepository.searchBySkillName(name);
    }

    // ==================== PERFORMANCE MANAGEMENT ====================

    /**
     * Create a new performance evaluation
     *
     * @param performance the performance record to create
     * @return the created performance record
     */
    public Performance createPerformance(Performance performance) {
        logger.info("Creating performance evaluation for student: {}", performance.getStudentId());

        performance.setCreatedAt(LocalDateTime.now());
        performance.setUpdatedAt(LocalDateTime.now());
        performance.setEvaluationDate(LocalDate.now());

        // Calculate overall score if metrics are provided
        if (performance.getMetrics() != null && !performance.getMetrics().isEmpty()) {
            performance.calculateOverallScore();
        }

        Performance savedPerformance = performanceRepository.save(performance);
        logger.info("Performance evaluation created successfully: {}", savedPerformance.getId());
        return savedPerformance;
    }

    /**
     * Find performance by ID
     *
     * @param id the performance ID
     * @return Optional containing the performance if found
     */
    public Optional<Performance> findPerformanceById(String id) {
        return performanceRepository.findById(id);
    }

    /**
     * Find all performance records for a student
     *
     * @param studentId the student ID
     * @return list of performance records
     */
    public List<Performance> findPerformancesByStudent(String studentId) {
        return performanceRepository.findByStudentIdOrderByEvaluationDateDesc(studentId);
    }

    /**
     * Find latest performance record for a student
     *
     * @param studentId the student ID
     * @return Optional containing the latest performance record
     */
    public Optional<Performance> findLatestPerformance(String studentId) {
        return performanceRepository.findFirstByStudentIdOrderByEvaluationDateDesc(studentId);
    }

    /**
     * Find performance records by evaluator
     *
     * @param evaluatorId the evaluator's ID
     * @return list of performance records
     */
    public List<Performance> findPerformancesByEvaluator(String evaluatorId) {
        return performanceRepository.findByEvaluatorId(evaluatorId);
    }

    /**
     * Find performance records by status
     *
     * @param status the evaluation status
     * @return list of performance records
     */
    public List<Performance> findPerformancesByStatus(EvaluationStatus status) {
        return performanceRepository.findByStatus(status);
    }

    /**
     * Find pending performance reviews
     *
     * @return list of pending performance records
     */
    public List<Performance> findPendingReviews() {
        return performanceRepository.findByStatus(EvaluationStatus.UNDER_REVIEW);
    }

    /**
     * Update performance evaluation
     *
     * @param performance the performance to update
     * @return the updated performance
     */
    public Performance updatePerformance(Performance performance) {
        logger.info("Updating performance: {}", performance.getId());
        performance.setUpdatedAt(LocalDateTime.now());

        // Recalculate score if metrics changed
        if (performance.getMetrics() != null && !performance.getMetrics().isEmpty()) {
            performance.calculateOverallScore();
        }

        return performanceRepository.save(performance);
    }

    /**
     * Approve performance evaluation
     *
     * @param performanceId the performance ID
     * @return true if approved
     */
    public boolean approvePerformance(String performanceId) {
        logger.info("Approving performance: {}", performanceId);

        Optional<Performance> perfOpt = performanceRepository.findById(performanceId);
        if (perfOpt.isPresent()) {
            Performance performance = perfOpt.get();
            performance.setStatus(EvaluationStatus.APPROVED);
            performance.setUpdatedAt(LocalDateTime.now());
            performanceRepository.save(performance);
            logger.info("Performance approved: {}", performanceId);
            return true;
        }

        logger.warn("Performance not found for approval: {}", performanceId);
        return false;
    }

    /**
     * Reject performance evaluation
     *
     * @param performanceId the performance ID
     * @return true if rejected
     */
    public boolean rejectPerformance(String performanceId) {
        logger.info("Rejecting performance: {}", performanceId);

        Optional<Performance> perfOpt = performanceRepository.findById(performanceId);
        if (perfOpt.isPresent()) {
            Performance performance = perfOpt.get();
            performance.setStatus(EvaluationStatus.REJECTED);
            performance.setUpdatedAt(LocalDateTime.now());
            performanceRepository.save(performance);
            logger.info("Performance rejected: {}", performanceId);
            return true;
        }

        logger.warn("Performance not found for rejection: {}", performanceId);
        return false;
    }

    /**
     * Delete performance evaluation
     *
     * @param performanceId the performance ID
     */
    public void deletePerformance(String performanceId) {
        logger.info("Deleting performance: {}", performanceId);
        performanceRepository.deleteById(performanceId);
    }

    // ==================== DOCUMENT MANAGEMENT ====================

    /**
     * Upload/Create a new document
     *
     * @param document the document to create
     * @return the created document
     */
    public Document createDocument(Document document) {
        logger.info("Creating document '{}' for student: {}", document.getDocumentName(), document.getStudentId());

        document.setUploadDate(LocalDateTime.now());
        document.setCreatedAt(LocalDateTime.now());
        document.setUpdatedAt(LocalDateTime.now());
        document.setStatus(DocumentStatus.PENDING);

        Document savedDocument = documentRepository.save(document);
        logger.info("Document created successfully: {}", savedDocument.getId());
        return savedDocument;
    }

    /**
     * Find document by ID
     *
     * @param id the document ID
     * @return Optional containing the document if found
     */
    public Optional<Document> findDocumentById(String id) {
        return documentRepository.findById(id);
    }

    /**
     * Find all documents for a student
     *
     * @param studentId the student ID
     * @return list of documents
     */
    public List<Document> findDocumentsByStudent(String studentId) {
        return documentRepository.findByStudentIdOrderByUploadDateDesc(studentId);
    }

    /**
     * Find verified documents for a student
     *
     * @param studentId the student ID
     * @return list of verified documents
     */
    public List<Document> findVerifiedDocuments(String studentId) {
        return documentRepository.findByStudentIdAndVerified(studentId, true);
    }

    /**
     * Find all pending documents (for HR review queue)
     *
     * @return list of pending documents
     */
    public List<Document> findAllPendingDocuments() {
        return documentRepository.findByStatus(DocumentStatus.PENDING);
    }

    /**
     * Verify a document
     *
     * @param documentId the document ID
     * @param hrId the HR verifier's ID
     * @param hrName the HR verifier's name
     * @param remarks verification remarks
     * @return true if document was verified
     */
    public boolean verifyDocument(String documentId, String hrId, String hrName, String remarks) {
        logger.info("Verifying document {} by HR: {}", documentId, hrId);

        Optional<Document> docOpt = documentRepository.findById(documentId);
        if (docOpt.isPresent()) {
            Document document = docOpt.get();
            document.setVerified(true);
            document.setVerifiedById(hrId);
            document.setVerifiedByName(hrName);
            document.setVerificationDate(LocalDateTime.now());
            document.setVerificationRemarks(remarks);
            document.setStatus(DocumentStatus.VERIFIED);
            document.setUpdatedAt(LocalDateTime.now());
            documentRepository.save(document);
            logger.info("Document verified successfully: {}", documentId);
            return true;
        }

        logger.warn("Document not found for verification: {}", documentId);
        return false;
    }

    /**
     * Reject a document
     *
     * @param documentId the document ID
     * @param hrId the HR verifier's ID
     * @param hrName the HR verifier's name
     * @param remarks rejection remarks
     * @return true if document was rejected
     */
    public boolean rejectDocument(String documentId, String hrId, String hrName, String remarks) {
        logger.info("Rejecting document {} by HR: {}", documentId, hrId);

        Optional<Document> docOpt = documentRepository.findById(documentId);
        if (docOpt.isPresent()) {
            Document document = docOpt.get();
            document.setVerified(false);
            document.setVerifiedById(hrId);
            document.setVerifiedByName(hrName);
            document.setVerificationDate(LocalDateTime.now());
            document.setVerificationRemarks(remarks);
            document.setStatus(DocumentStatus.REJECTED);
            document.setUpdatedAt(LocalDateTime.now());
            documentRepository.save(document);
            logger.info("Document rejected: {}", documentId);
            return true;
        }

        logger.warn("Document not found for rejection: {}", documentId);
        return false;
    }

    /**
     * Update document
     *
     * @param document the document to update
     * @return the updated document
     */
    public Document updateDocument(Document document) {
        logger.info("Updating document: {}", document.getId());
        document.setUpdatedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }

    /**
     * Delete document
     *
     * @param documentId the document ID
     */
    public void deleteDocument(String documentId) {
        logger.info("Deleting document: {}", documentId);
        documentRepository.deleteById(documentId);
    }

    /**
     * Find expired documents
     *
     * @return list of expired documents
     */
    public List<Document> findExpiredDocuments() {
        return documentRepository.findByExpiryDateBefore(LocalDateTime.now());
    }

    /**
     * Find documents expiring soon (within 30 days)
     *
     * @return list of documents expiring soon
     */
    public List<Document> findDocumentsExpiringSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysLater = now.plusDays(30);
        return documentRepository.findByExpiryDateBetween(now, thirtyDaysLater);
    }

    /**
     * Search documents by name
     *
     * @param name the document name pattern
     * @return list of matching documents
     */
    public List<Document> searchDocumentsByName(String name) {
        return documentRepository.searchByDocumentName(name);
    }

    // ==================== STATISTICS ====================

    /**
     * Count skills by student
     *
     * @param studentId the student ID
     * @return count of skills
     */
    public long countSkillsByStudent(String studentId) {
        return skillRepository.countByStudentId(studentId);
    }

    /**
     * Count verified skills by student
     *
     * @param studentId the student ID
     * @return count of verified skills
     */
    public long countVerifiedSkillsByStudent(String studentId) {
        return skillRepository.countByStudentIdAndVerifiedByHr(studentId, true);
    }

    /**
     * Count documents by student
     *
     * @param studentId the student ID
     * @return count of documents
     */
    public long countDocumentsByStudent(String studentId) {
        return documentRepository.countByStudentId(studentId);
    }

    /**
     * Count performance evaluations by student
     *
     * @param studentId the student ID
     * @return count of evaluations
     */
    public long countPerformancesByStudent(String studentId) {
        return performanceRepository.countByStudentId(studentId);
    }
}
