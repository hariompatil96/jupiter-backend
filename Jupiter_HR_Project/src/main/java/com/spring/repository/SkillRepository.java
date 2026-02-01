package com.spring.repository;

import com.spring.model.Skill;
import com.spring.model.Skill.ProficiencyLevel;
import com.spring.model.Skill.SkillCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Skill Repository Interface
 *
 * Provides data access operations for Skill entities using Spring Data MongoDB.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {

    /**
     * Find all skills for a student
     *
     * @param studentId the student's ID
     * @return list of skills for the student
     */
    List<Skill> findByStudentId(String studentId);

    /**
     * Find skills by category
     *
     * @param category the skill category
     * @return list of skills in the category
     */
    List<Skill> findByCategory(SkillCategory category);

    /**
     * Find skills by proficiency level
     *
     * @param proficiencyLevel the proficiency level
     * @return list of skills at the level
     */
    List<Skill> findByProficiencyLevel(ProficiencyLevel proficiencyLevel);

    /**
     * Find skills by student and category
     *
     * @param studentId the student's ID
     * @param category the skill category
     * @return list of matching skills
     */
    List<Skill> findByStudentIdAndCategory(String studentId, SkillCategory category);

    /**
     * Find verified skills for a student
     *
     * @param studentId the student's ID
     * @param verifiedByHr verification status
     * @return list of verified/unverified skills
     */
    List<Skill> findByStudentIdAndVerifiedByHr(String studentId, boolean verifiedByHr);

    /**
     * Find certified skills for a student
     *
     * @param studentId the student's ID
     * @param certified certification status
     * @return list of certified/non-certified skills
     */
    List<Skill> findByStudentIdAndCertified(String studentId, boolean certified);

    /**
     * Find skill by student and skill name
     *
     * @param studentId the student's ID
     * @param skillName the skill name
     * @return Optional containing the skill if found
     */
    Optional<Skill> findByStudentIdAndSkillName(String studentId, String skillName);

    /**
     * Search skills by name (case insensitive)
     *
     * @param skillName the skill name pattern
     * @return list of matching skills
     */
    @Query("{ 'skill_name': { $regex: ?0, $options: 'i' } }")
    List<Skill> searchBySkillName(String skillName);

    /**
     * Find all unverified skills (for HR review)
     *
     * @return list of unverified skills
     */
    List<Skill> findByVerifiedByHr(boolean verifiedByHr);

    /**
     * Count skills by student
     *
     * @param studentId the student's ID
     * @return count of skills
     */
    long countByStudentId(String studentId);

    /**
     * Count verified skills by student
     *
     * @param studentId the student's ID
     * @param verifiedByHr verification status
     * @return count of verified/unverified skills
     */
    long countByStudentIdAndVerifiedByHr(String studentId, boolean verifiedByHr);

    /**
     * Delete all skills for a student
     *
     * @param studentId the student's ID
     */
    void deleteByStudentId(String studentId);

    /**
     * Find skills verified by a specific HR
     *
     * @param hrVerifierId the HR's ID
     * @return list of skills verified by the HR
     */
    List<Skill> findByHrVerifierId(String hrVerifierId);

    /**
     * Find skills with experience greater than specified years
     *
     * @param years minimum years of experience
     * @return list of matching skills
     */
    List<Skill> findByYearsOfExperienceGreaterThanEqual(Double years);
}
