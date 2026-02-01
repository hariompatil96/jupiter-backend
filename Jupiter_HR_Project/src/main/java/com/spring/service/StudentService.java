package com.spring.service;

import com.spring.model.Student;
import com.spring.model.Student.StudentStatus;
import com.spring.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Student Service
 *
 * Provides business logic for student management operations.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Service
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Create a new student
     *
     * @param student the student to create
     * @return the created student
     * @throws IllegalArgumentException if student code or email already exists
     */
    public Student createStudent(Student student) {
        logger.info("Creating new student: {}", student.getStudentCode());

        // Validate unique constraints
        if (studentRepository.existsByStudentCode(student.getStudentCode())) {
            throw new IllegalArgumentException("Student code already exists: " + student.getStudentCode());
        }

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + student.getEmail());
        }

        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        student.setStatus(StudentStatus.ACTIVE);

        Student savedStudent = studentRepository.save(student);
        logger.info("Student created successfully: {}", savedStudent.getId());
        return savedStudent;
    }

    /**
     * Find student by ID
     *
     * @param id the student ID
     * @return Optional containing the student if found
     */
    public Optional<Student> findById(String id) {
        return studentRepository.findById(id);
    }

    /**
     * Find student by student code
     *
     * @param studentCode the student code
     * @return Optional containing the student if found
     */
    public Optional<Student> findByStudentCode(String studentCode) {
        return studentRepository.findByStudentCode(studentCode);
    }

    /**
     * Find student by email
     *
     * @param email the student's email
     * @return Optional containing the student if found
     */
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    /**
     * Find student by user ID
     *
     * @param userId the associated user ID
     * @return Optional containing the student if found
     */
    public Optional<Student> findByUserId(String userId) {
        return studentRepository.findByUserId(userId);
    }

    /**
     * Find all students
     *
     * @return list of all students
     */
    public List<Student> findAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Find all students with pagination
     *
     * @param page the page number (0-based)
     * @param size the page size
     * @return page of students
     */
    public Page<Student> findAllStudents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return studentRepository.findAll(pageable);
    }

    /**
     * Find students by department
     *
     * @param department the department name
     * @return list of students in the department
     */
    public List<Student> findByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    /**
     * Find students by department with pagination
     *
     * @param department the department name
     * @param page the page number
     * @param size the page size
     * @return page of students
     */
    public Page<Student> findByDepartment(String department, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentRepository.findByDepartment(department, pageable);
    }

    /**
     * Find students by course
     *
     * @param course the course name
     * @return list of students in the course
     */
    public List<Student> findByCourse(String course) {
        return studentRepository.findByCourse(course);
    }

    /**
     * Find students by status
     *
     * @param status the student status
     * @return list of students with the status
     */
    public List<Student> findByStatus(StudentStatus status) {
        return studentRepository.findByStatus(status);
    }

    /**
     * Find active students
     *
     * @return list of active students
     */
    public List<Student> findActiveStudents() {
        return studentRepository.findByStatus(StudentStatus.ACTIVE);
    }

    /**
     * Find students by department and status
     *
     * @param department the department name
     * @param status the student status
     * @return list of matching students
     */
    public List<Student> findByDepartmentAndStatus(String department, StudentStatus status) {
        return studentRepository.findByDepartmentAndStatus(department, status);
    }

    /**
     * Find students by semester
     *
     * @param semester the semester number
     * @return list of students in the semester
     */
    public List<Student> findBySemester(Integer semester) {
        return studentRepository.findBySemester(semester);
    }

    /**
     * Find students with high CGPA
     *
     * @param minCgpa the minimum CGPA
     * @return list of students with CGPA >= minCgpa
     */
    public List<Student> findHighAchievers(Double minCgpa) {
        return studentRepository.findByCgpaGreaterThanEqual(minCgpa);
    }

    /**
     * Search students by name
     *
     * @param name the name pattern
     * @return list of matching students
     */
    public List<Student> searchByName(String name) {
        return studentRepository.searchByName(name, name);
    }

    /**
     * Update student
     *
     * @param student the student to update
     * @return the updated student
     */
    public Student updateStudent(Student student) {
        logger.info("Updating student: {}", student.getId());

        student.setUpdatedAt(LocalDateTime.now());
        Student updatedStudent = studentRepository.save(student);
        logger.info("Student updated successfully: {}", updatedStudent.getId());
        return updatedStudent;
    }

    /**
     * Update student status
     *
     * @param studentId the student ID
     * @param status the new status
     * @return true if status was updated
     */
    public boolean updateStatus(String studentId, StudentStatus status) {
        logger.info("Updating status for student: {} to {}", studentId, status);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            student.setStatus(status);
            student.setUpdatedAt(LocalDateTime.now());
            studentRepository.save(student);
            logger.info("Status updated successfully for student: {}", studentId);
            return true;
        }

        logger.warn("Student not found for status update: {}", studentId);
        return false;
    }

    /**
     * Update student CGPA
     *
     * @param studentId the student ID
     * @param cgpa the new CGPA
     * @return true if CGPA was updated
     */
    public boolean updateCgpa(String studentId, Double cgpa) {
        logger.info("Updating CGPA for student: {} to {}", studentId, cgpa);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            student.setCgpa(cgpa);
            student.setUpdatedAt(LocalDateTime.now());
            studentRepository.save(student);
            logger.info("CGPA updated successfully for student: {}", studentId);
            return true;
        }

        logger.warn("Student not found for CGPA update: {}", studentId);
        return false;
    }

    /**
     * Add skill to student
     *
     * @param studentId the student ID
     * @param skillId the skill ID to add
     * @return true if skill was added
     */
    public boolean addSkill(String studentId, String skillId) {
        logger.info("Adding skill {} to student: {}", skillId, studentId);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (!student.getSkillIds().contains(skillId)) {
                student.getSkillIds().add(skillId);
                student.setUpdatedAt(LocalDateTime.now());
                studentRepository.save(student);
            }
            logger.info("Skill added successfully to student: {}", studentId);
            return true;
        }

        logger.warn("Student not found for adding skill: {}", studentId);
        return false;
    }

    /**
     * Add document to student
     *
     * @param studentId the student ID
     * @param documentId the document ID to add
     * @return true if document was added
     */
    public boolean addDocument(String studentId, String documentId) {
        logger.info("Adding document {} to student: {}", documentId, studentId);

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (!student.getDocumentIds().contains(documentId)) {
                student.getDocumentIds().add(documentId);
                student.setUpdatedAt(LocalDateTime.now());
                studentRepository.save(student);
            }
            logger.info("Document added successfully to student: {}", studentId);
            return true;
        }

        logger.warn("Student not found for adding document: {}", studentId);
        return false;
    }

    /**
     * Delete student
     *
     * @param studentId the student ID
     */
    public void deleteStudent(String studentId) {
        logger.info("Deleting student: {}", studentId);
        studentRepository.deleteById(studentId);
        logger.info("Student deleted successfully: {}", studentId);
    }

    /**
     * Count students by department
     *
     * @param department the department name
     * @return count of students
     */
    public long countByDepartment(String department) {
        return studentRepository.countByDepartment(department);
    }

    /**
     * Count students by status
     *
     * @param status the student status
     * @return count of students
     */
    public long countByStatus(StudentStatus status) {
        return studentRepository.countByStatus(status);
    }

    /**
     * Count all students
     *
     * @return total count of students
     */
    public long countAll() {
        return studentRepository.count();
    }

    /**
     * Check if student code exists
     *
     * @param studentCode the student code to check
     * @return true if exists
     */
    public boolean studentCodeExists(String studentCode) {
        return studentRepository.existsByStudentCode(studentCode);
    }

    /**
     * Check if email exists
     *
     * @param email the email to check
     * @return true if exists
     */
    public boolean emailExists(String email) {
        return studentRepository.existsByEmail(email);
    }
}
