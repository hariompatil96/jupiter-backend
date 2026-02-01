package com.spring.repository;

import com.spring.model.Document;
import com.spring.model.Document.DocumentStatus;
import com.spring.model.Document.DocumentType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Document Repository Interface
 *
 * Provides data access operations for Document entities using Spring Data MongoDB.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Repository
public interface DocumentRepository extends MongoRepository<Document, String> {

    /**
     * Find all documents for a student
     *
     * @param studentId the student's ID
     * @return list of documents for the student
     */
    List<Document> findByStudentId(String studentId);

    /**
     * Find all documents for a student ordered by upload date
     *
     * @param studentId the student's ID
     * @return list of documents ordered by upload date descending
     */
    List<Document> findByStudentIdOrderByUploadDateDesc(String studentId);

    /**
     * Find documents by type
     *
     * @param documentType the document type
     * @return list of documents of the type
     */
    List<Document> findByDocumentType(DocumentType documentType);

    /**
     * Find documents by status
     *
     * @param status the document status
     * @return list of documents with the status
     */
    List<Document> findByStatus(DocumentStatus status);

    /**
     * Find documents by student and type
     *
     * @param studentId the student's ID
     * @param documentType the document type
     * @return list of matching documents
     */
    List<Document> findByStudentIdAndDocumentType(String studentId, DocumentType documentType);

    /**
     * Find documents by student and status
     *
     * @param studentId the student's ID
     * @param status the document status
     * @return list of matching documents
     */
    List<Document> findByStudentIdAndStatus(String studentId, DocumentStatus status);

    /**
     * Find verified documents for a student
     *
     * @param studentId the student's ID
     * @param verified verification status
     * @return list of verified/unverified documents
     */
    List<Document> findByStudentIdAndVerified(String studentId, boolean verified);

    /**
     * Find documents by file name
     *
     * @param fileName the file name
     * @return Optional containing the document if found
     */
    Optional<Document> findByFileName(String fileName);

    /**
     * Find documents verified by a specific user
     *
     * @param verifiedById the verifier's ID
     * @return list of documents verified by the user
     */
    List<Document> findByVerifiedById(String verifiedById);

    /**
     * Find all pending documents (for HR review)
     *
     * @return list of pending documents
     */
    List<Document> findByVerified(boolean verified);

    /**
     * Find expired documents
     *
     * @param currentDateTime the current date/time
     * @return list of expired documents
     */
    List<Document> findByExpiryDateBefore(LocalDateTime currentDateTime);

    /**
     * Find documents expiring soon
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return list of documents expiring within the range
     */
    List<Document> findByExpiryDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find confidential documents for a student
     *
     * @param studentId the student's ID
     * @param confidential confidentiality status
     * @return list of confidential/non-confidential documents
     */
    List<Document> findByStudentIdAndConfidential(String studentId, boolean confidential);

    /**
     * Search documents by name (case insensitive)
     *
     * @param documentName the document name pattern
     * @return list of matching documents
     */
    @Query("{ 'document_name': { $regex: ?0, $options: 'i' } }")
    List<Document> searchByDocumentName(String documentName);

    /**
     * Count documents by student
     *
     * @param studentId the student's ID
     * @return count of documents
     */
    long countByStudentId(String studentId);

    /**
     * Count documents by status
     *
     * @param status the document status
     * @return count of documents
     */
    long countByStatus(DocumentStatus status);

    /**
     * Count verified documents by student
     *
     * @param studentId the student's ID
     * @param verified verification status
     * @return count of verified/unverified documents
     */
    long countByStudentIdAndVerified(String studentId, boolean verified);

    /**
     * Delete all documents for a student
     *
     * @param studentId the student's ID
     */
    void deleteByStudentId(String studentId);

    /**
     * Find documents uploaded within a date range
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return list of documents uploaded within the range
     */
    List<Document> findByUploadDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find documents by MIME type
     *
     * @param mimeType the MIME type
     * @return list of documents with the MIME type
     */
    List<Document> findByMimeType(String mimeType);
}
