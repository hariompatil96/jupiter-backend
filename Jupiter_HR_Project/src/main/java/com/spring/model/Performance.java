package com.spring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Performance Entity
 *
 * Represents a performance evaluation record for a student in the JUPITER system.
 * Tracks academic and professional performance metrics.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Document(collection = "performances")
@CompoundIndex(name = "student_period_idx", def = "{'student_id': 1, 'evaluation_period': 1}")
public class Performance {

    @Id
    private String id;

    @Indexed
    @Field("student_id")
    private String studentId;

    @Field("evaluator_id")
    private String evaluatorId;

    @Field("evaluator_name")
    private String evaluatorName;

    @Field("evaluation_type")
    private EvaluationType evaluationType;

    @Field("evaluation_period")
    private String evaluationPeriod;

    @Field("evaluation_date")
    private LocalDate evaluationDate;

    @Field("overall_score")
    private Double overallScore;

    @Field("max_score")
    private Double maxScore = 100.0;

    @Field("grade")
    private String grade;

    @Field("metrics")
    private List<PerformanceMetric> metrics = new ArrayList<>();

    @Field("strengths")
    private List<String> strengths = new ArrayList<>();

    @Field("areas_for_improvement")
    private List<String> areasForImprovement = new ArrayList<>();

    @Field("comments")
    private String comments;

    @Field("goals")
    private List<String> goals = new ArrayList<>();

    @Field("status")
    private EvaluationStatus status = EvaluationStatus.DRAFT;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Evaluation type enumeration
     */
    public enum EvaluationType {
        ACADEMIC,
        INTERNSHIP,
        PROJECT,
        QUARTERLY,
        ANNUAL,
        PROBATION,
        SKILL_ASSESSMENT
    }

    /**
     * Evaluation status enumeration
     */
    public enum EvaluationStatus {
        DRAFT,
        SUBMITTED,
        UNDER_REVIEW,
        APPROVED,
        REJECTED
    }

    /**
     * Embedded PerformanceMetric class
     */
    public static class PerformanceMetric {
        private String metricName;
        private Double score;
        private Double maxScore;
        private Double weightage;
        private String comments;

        public PerformanceMetric() {}

        public PerformanceMetric(String metricName, Double score, Double maxScore, Double weightage) {
            this.metricName = metricName;
            this.score = score;
            this.maxScore = maxScore;
            this.weightage = weightage;
        }

        // Getters and Setters
        public String getMetricName() { return metricName; }
        public void setMetricName(String metricName) { this.metricName = metricName; }
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
        public Double getMaxScore() { return maxScore; }
        public void setMaxScore(Double maxScore) { this.maxScore = maxScore; }
        public Double getWeightage() { return weightage; }
        public void setWeightage(Double weightage) { this.weightage = weightage; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }

        public Double getPercentage() {
            if (maxScore == null || maxScore == 0) return 0.0;
            return (score / maxScore) * 100;
        }
    }

    // Default constructor
    public Performance() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public Performance(String studentId, String evaluatorId, EvaluationType evaluationType) {
        this();
        this.studentId = studentId;
        this.evaluatorId = evaluatorId;
        this.evaluationType = evaluationType;
        this.evaluationDate = LocalDate.now();
    }

    // Helper method to calculate overall score from metrics
    public void calculateOverallScore() {
        if (metrics == null || metrics.isEmpty()) {
            this.overallScore = 0.0;
            return;
        }

        double totalWeightedScore = 0.0;
        double totalWeightage = 0.0;

        for (PerformanceMetric metric : metrics) {
            if (metric.getWeightage() != null && metric.getScore() != null && metric.getMaxScore() != null) {
                double percentage = (metric.getScore() / metric.getMaxScore()) * 100;
                totalWeightedScore += percentage * metric.getWeightage();
                totalWeightage += metric.getWeightage();
            }
        }

        this.overallScore = totalWeightage > 0 ? totalWeightedScore / totalWeightage : 0.0;
        this.grade = calculateGrade(this.overallScore);
    }

    // Helper method to calculate grade
    private String calculateGrade(Double score) {
        if (score >= 90) return "A+";
        if (score >= 80) return "A";
        if (score >= 70) return "B+";
        if (score >= 60) return "B";
        if (score >= 50) return "C";
        if (score >= 40) return "D";
        return "F";
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

    public String getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(String evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public String getEvaluatorName() {
        return evaluatorName;
    }

    public void setEvaluatorName(String evaluatorName) {
        this.evaluatorName = evaluatorName;
    }

    public EvaluationType getEvaluationType() {
        return evaluationType;
    }

    public void setEvaluationType(EvaluationType evaluationType) {
        this.evaluationType = evaluationType;
    }

    public String getEvaluationPeriod() {
        return evaluationPeriod;
    }

    public void setEvaluationPeriod(String evaluationPeriod) {
        this.evaluationPeriod = evaluationPeriod;
    }

    public LocalDate getEvaluationDate() {
        return evaluationDate;
    }

    public void setEvaluationDate(LocalDate evaluationDate) {
        this.evaluationDate = evaluationDate;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public Double getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Double maxScore) {
        this.maxScore = maxScore;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public List<PerformanceMetric> getMetrics() {
        return metrics;
    }

    public void setMetrics(List<PerformanceMetric> metrics) {
        this.metrics = metrics;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getAreasForImprovement() {
        return areasForImprovement;
    }

    public void setAreasForImprovement(List<String> areasForImprovement) {
        this.areasForImprovement = areasForImprovement;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public List<String> getGoals() {
        return goals;
    }

    public void setGoals(List<String> goals) {
        this.goals = goals;
    }

    public EvaluationStatus getStatus() {
        return status;
    }

    public void setStatus(EvaluationStatus status) {
        this.status = status;
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
        return "Performance{" +
                "id='" + id + '\'' +
                ", studentId='" + studentId + '\'' +
                ", evaluationType=" + evaluationType +
                ", evaluationPeriod='" + evaluationPeriod + '\'' +
                ", overallScore=" + overallScore +
                ", grade='" + grade + '\'' +
                ", status=" + status +
                '}';
    }
}
