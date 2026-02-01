package com.spring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Document Entity
 *
 * Represents a document record associated with a student in the JUPITER system.
 * Supports various document types like certificates, transcripts, ID proofs, etc.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@org.springframework.data.mongodb.core.mapping.Document(collection = "documents")
public class Document {

    @Id
    private String id;

    @Indexed
    @Field("student_id")
    private String studentId;

    @Field("document_name")
    private String documentName;

    @Field("document_type")
    private DocumentType documentType;

    @Field("file_name")
    private String fileName;

    @Field("file_path")
    private String filePath;

    @Field("file_size")
    private Long fileSize;

    @Field("mime_type")
    private String mimeType;

    @Field("description")
    private String description;

    @Field("upload_date")
    private LocalDateTime uploadDate;

    @Field("expiry_date")
    private LocalDateTime expiryDate;

    @Field("is_verified")
    private boolean verified = false;

    @Field("verified_by_id")
    private String verifiedById;

    @Field("verified_by_name")
    private String verifiedByName;

    @Field("verification_date")
    private LocalDateTime verificationDate;

    @Field("verification_remarks")
    private String verificationRemarks;

    @Field("status")
    private DocumentStatus status = DocumentStatus.PENDING;

    @Field("is_confidential")
    private boolean confidential = false;

    @Field("tags")
    private String[] tags;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Document type enumeration
     */
    public enum DocumentType {
        ID_PROOF,
        ADDRESS_PROOF,
        ACADEMIC_CERTIFICATE,
        PROFESSIONAL_CERTIFICATE,
        TRANSCRIPT,
        RESUME,
        COVER_LETTER,
        OFFER_LETTER,
        EXPERIENCE_LETTER,
        RECOMMENDATION_LETTER,
        PASSPORT,
        VISA,
        MEDICAL_RECORD,
        OTHER
    }

    /**
     * Document status enumeration
     */
    public enum DocumentStatus {
        PENDING,
        UNDER_REVIEW,
        VERIFIED,
        REJECTED,
        EXPIRED
    }

    // Default constructor
    public Document() {
        this.uploadDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public Document(String studentId, String documentName, DocumentType documentType, String fileName) {
        this();
        this.studentId = studentId;
        this.documentName = documentName;
        this.documentType = documentType;
        this.fileName = fileName;
    }

    // Helper method to check if document is expired
    public boolean isExpired() {
        if (expiryDate == null) return false;
        return LocalDateTime.now().isAfter(expiryDate);
    }

    // Helper method to get file extension
    public String getFileExtension() {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public DocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(DocumentType documentType) {
        this.documentType = documentType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getVerifiedById() {
        return verifiedById;
    }

    public void setVerifiedById(String verifiedById) {
        this.verifiedById = verifiedById;
    }

    public String getVerifiedByName() {
        return verifiedByName;
    }

    public void setVerifiedByName(String verifiedByName) {
        this.verifiedByName = verifiedByName;
    }

    public LocalDateTime getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(LocalDateTime verificationDate) {
        this.verificationDate = verificationDate;
    }

    public String getVerificationRemarks() {
        return verificationRemarks;
    }

    public void setVerificationRemarks(String verificationRemarks) {
        this.verificationRemarks = verificationRemarks;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public boolean isConfidential() {
        return confidential;
    }

    public void setConfidential(boolean confidential) {
        this.confidential = confidential;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Document{" +
                "id='" + id + '\'' +
                ", studentId='" + studentId + '\'' +
                ", documentName='" + documentName + '\'' +
                ", documentType=" + documentType +
                ", fileName='" + fileName + '\'' +
                ", status=" + status +
                ", verified=" + verified +
                '}';
    }
}
