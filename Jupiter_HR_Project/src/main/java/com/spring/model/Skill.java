package com.spring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

/**
 * Skill Entity
 *
 * Represents a skill record associated with a student in the JUPITER system.
 * Tracks technical and soft skills with proficiency levels.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Document(collection = "skills")
public class Skill {

    @Id
    private String id;

    @Indexed
    @Field("student_id")
    private String studentId;

    @Indexed
    @Field("skill_name")
    private String skillName;

    @Field("category")
    private SkillCategory category;

    @Field("proficiency_level")
    private ProficiencyLevel proficiencyLevel;

    @Field("years_of_experience")
    private Double yearsOfExperience;

    @Field("is_certified")
    private boolean certified = false;

    @Field("certification_name")
    private String certificationName;

    @Field("certification_date")
    private LocalDateTime certificationDate;

    @Field("description")
    private String description;

    @Field("verified_by_hr")
    private boolean verifiedByHr = false;

    @Field("hr_verifier_id")
    private String hrVerifierId;

    @Field("verification_date")
    private LocalDateTime verificationDate;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Skill category enumeration
     */
    public enum SkillCategory {
        TECHNICAL,
        PROGRAMMING,
        DATABASE,
        FRAMEWORK,
        SOFT_SKILL,
        LANGUAGE,
        MANAGEMENT,
        DESIGN,
        OTHER
    }

    /**
     * Proficiency level enumeration
     */
    public enum ProficiencyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }

    // Default constructor
    public Skill() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public Skill(String studentId, String skillName, SkillCategory category, ProficiencyLevel proficiencyLevel) {
        this();
        this.studentId = studentId;
        this.skillName = skillName;
        this.category = category;
        this.proficiencyLevel = proficiencyLevel;
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

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public SkillCategory getCategory() {
        return category;
    }

    public void setCategory(SkillCategory category) {
        this.category = category;
    }

    public ProficiencyLevel getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public Double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Double yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public boolean isCertified() {
        return certified;
    }

    public void setCertified(boolean certified) {
        this.certified = certified;
    }

    public String getCertificationName() {
        return certificationName;
    }

    public void setCertificationName(String certificationName) {
        this.certificationName = certificationName;
    }

    public LocalDateTime getCertificationDate() {
        return certificationDate;
    }

    public void setCertificationDate(LocalDateTime certificationDate) {
        this.certificationDate = certificationDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isVerifiedByHr() {
        return verifiedByHr;
    }

    public void setVerifiedByHr(boolean verifiedByHr) {
        this.verifiedByHr = verifiedByHr;
    }

    public String getHrVerifierId() {
        return hrVerifierId;
    }

    public void setHrVerifierId(String hrVerifierId) {
        this.hrVerifierId = hrVerifierId;
    }

    public LocalDateTime getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(LocalDateTime verificationDate) {
        this.verificationDate = verificationDate;
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
        return "Skill{" +
                "id='" + id + '\'' +
                ", studentId='" + studentId + '\'' +
                ", skillName='" + skillName + '\'' +
                ", category=" + category +
                ", proficiencyLevel=" + proficiencyLevel +
                ", verifiedByHr=" + verifiedByHr +
                '}';
    }
}
