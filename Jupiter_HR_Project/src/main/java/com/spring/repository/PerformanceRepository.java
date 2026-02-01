package com.spring.repository;

import com.spring.model.Performance;
import com.spring.model.Performance.EvaluationStatus;
import com.spring.model.Performance.EvaluationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Performance Repository Interface
 *
 * Provides data access operations for Performance entities using Spring Data MongoDB.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Repository
public interface PerformanceRepository extends MongoRepository<Performance, String> {

    /**
     * Find all performance records for a student
     *
     * @param studentId the student's ID
     * @return list of performance records
     */
    List<Performance> findByStudentId(String studentId);

    /**
     * Find all performance records for a student ordered by evaluation date
     *
     * @param studentId the student's ID
     * @return list of performance records ordered by date descending
     */
    List<Performance> findByStudentIdOrderByEvaluationDateDesc(String studentId);

    /**
     * Find performance records by evaluator
     *
     * @param evaluatorId the evaluator's ID
     * @return list of performance records created by the evaluator
     */
    List<Performance> findByEvaluatorId(String evaluatorId);

    /**
     * Find performance records by type
     *
     * @param evaluationType the evaluation type
     * @return list of performance records of the type
     */
    List<Performance> findByEvaluationType(EvaluationType evaluationType);

    /**
     * Find performance records by status
     *
     * @param status the evaluation status
     * @return list of performance records with the status
     */
    List<Performance> findByStatus(EvaluationStatus status);

    /**
     * Find performance record by student and evaluation period
     *
     * @param studentId the student's ID
     * @param evaluationPeriod the evaluation period
     * @return Optional containing the performance record if found
     */
    Optional<Performance> findByStudentIdAndEvaluationPeriod(String studentId, String evaluationPeriod);

    /**
     * Find performance records by student and type
     *
     * @param studentId the student's ID
     * @param evaluationType the evaluation type
     * @return list of matching performance records
     */
    List<Performance> findByStudentIdAndEvaluationType(String studentId, EvaluationType evaluationType);

    /**
     * Find performance records by student and status
     *
     * @param studentId the student's ID
     * @param status the evaluation status
     * @return list of matching performance records
     */
    List<Performance> findByStudentIdAndStatus(String studentId, EvaluationStatus status);

    /**
     * Find performance records between dates
     *
     * @param startDate the start date
     * @param endDate the end date
     * @return list of performance records within the date range
     */
    List<Performance> findByEvaluationDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Find performance records by student within date range
     *
     * @param studentId the student's ID
     * @param startDate the start date
     * @param endDate the end date
     * @return list of matching performance records
     */
    List<Performance> findByStudentIdAndEvaluationDateBetween(String studentId, LocalDate startDate, LocalDate endDate);

    /**
     * Find performance records with score greater than or equal to value
     *
     * @param overallScore the minimum score
     * @return list of performance records meeting the criteria
     */
    List<Performance> findByOverallScoreGreaterThanEqual(Double overallScore);

    /**
     * Find top performers with pagination
     *
     * @param pageable pagination parameters
     * @return page of performance records ordered by score
     */
    Page<Performance> findAllByOrderByOverallScoreDesc(Pageable pageable);

    /**
     * Find performance records by grade
     *
     * @param grade the grade
     * @return list of performance records with the grade
     */
    List<Performance> findByGrade(String grade);

    /**
     * Count performance records by student
     *
     * @param studentId the student's ID
     * @return count of performance records
     */
    long countByStudentId(String studentId);

    /**
     * Count performance records by status
     *
     * @param status the evaluation status
     * @return count of performance records
     */
    long countByStatus(EvaluationStatus status);

    /**
     * Calculate average score for a student
     *
     * @param studentId the student's ID
     * @return aggregation result with average score
     */
    @Query(value = "{ 'student_id': ?0 }", fields = "{ 'overall_score': 1 }")
    List<Performance> findScoresByStudentId(String studentId);

    /**
     * Delete all performance records for a student
     *
     * @param studentId the student's ID
     */
    void deleteByStudentId(String studentId);

    /**
     * Find latest performance record for a student
     *
     * @param studentId the student's ID
     * @return the most recent performance record
     */
    Optional<Performance> findFirstByStudentIdOrderByEvaluationDateDesc(String studentId);
}
