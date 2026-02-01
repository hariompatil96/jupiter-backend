package com.spring.repository;

import com.spring.model.Student;
import com.spring.model.Student.StudentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Student Repository Interface
 *
 * Provides data access operations for Student entities using Spring Data MongoDB.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Repository
public interface StudentRepository extends MongoRepository<Student, String> {

    /**
     * Find student by student code
     *
     * @param studentCode the unique student code
     * @return Optional containing the student if found
     */
    Optional<Student> findByStudentCode(String studentCode);

    /**
     * Find student by email
     *
     * @param email the student's email
     * @return Optional containing the student if found
     */
    Optional<Student> findByEmail(String email);

    /**
     * Find student by user ID
     *
     * @param userId the associated user ID
     * @return Optional containing the student if found
     */
    Optional<Student> findByUserId(String userId);

    /**
     * Find all students by department
     *
     * @param department the department name
     * @return list of students in the department
     */
    List<Student> findByDepartment(String department);

    /**
     * Find all students by course
     *
     * @param course the course name
     * @return list of students enrolled in the course
     */
    List<Student> findByCourse(String course);

    /**
     * Find all students by status
     *
     * @param status the student status
     * @return list of students with the status
     */
    List<Student> findByStatus(StudentStatus status);

    /**
     * Find all students by department and status
     *
     * @param department the department name
     * @param status the student status
     * @return list of matching students
     */
    List<Student> findByDepartmentAndStatus(String department, StudentStatus status);

    /**
     * Find all students by semester
     *
     * @param semester the semester number
     * @return list of students in the semester
     */
    List<Student> findBySemester(Integer semester);

    /**
     * Find students with CGPA greater than or equal to specified value
     *
     * @param cgpa the minimum CGPA
     * @return list of students meeting the CGPA criteria
     */
    List<Student> findByCgpaGreaterThanEqual(Double cgpa);

    /**
     * Find all students with pagination
     *
     * @param pageable pagination parameters
     * @return page of students
     */
    Page<Student> findAll(Pageable pageable);

    /**
     * Find students by department with pagination
     *
     * @param department the department name
     * @param pageable pagination parameters
     * @return page of students
     */
    Page<Student> findByDepartment(String department, Pageable pageable);

    /**
     * Search students by first name or last name (case insensitive)
     *
     * @param firstName the first name pattern
     * @param lastName the last name pattern
     * @return list of matching students
     */
    @Query("{ $or: [ { 'first_name': { $regex: ?0, $options: 'i' } }, { 'last_name': { $regex: ?1, $options: 'i' } } ] }")
    List<Student> searchByName(String firstName, String lastName);

    /**
     * Check if student code exists
     *
     * @param studentCode the student code to check
     * @return true if exists
     */
    boolean existsByStudentCode(String studentCode);

    /**
     * Check if email exists
     *
     * @param email the email to check
     * @return true if exists
     */
    boolean existsByEmail(String email);

    /**
     * Count students by department
     *
     * @param department the department name
     * @return count of students
     */
    long countByDepartment(String department);

    /**
     * Count students by status
     *
     * @param status the student status
     * @return count of students
     */
    long countByStatus(StudentStatus status);

    /**
     * Get distinct departments
     *
     * @return list of unique department names
     */
    @Query(value = "{}", fields = "{ 'department': 1 }")
    List<Student> findDistinctDepartments();

    /**
     * Get distinct courses
     *
     * @return list of unique course names
     */
    @Query(value = "{}", fields = "{ 'course': 1 }")
    List<Student> findDistinctCourses();
}
