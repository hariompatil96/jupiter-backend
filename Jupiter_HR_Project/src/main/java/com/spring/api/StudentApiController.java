package com.spring.api;

import com.spring.model.Student;
import com.spring.model.Student.StudentStatus;
import com.spring.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Student REST API Controller
 *
 * Provides REST endpoints for student CRUD operations.
 * All endpoints return JSON responses.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/students")
public class StudentApiController {

    private static final Logger logger = LoggerFactory.getLogger(StudentApiController.class);

    private final StudentService studentService;

    @Autowired
    public StudentApiController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * Health check / Ping endpoint
     *
     * GET /api/students/ping
     *
     * @return ping response
     */
    @GetMapping(value = "/ping", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> ping() {
        logger.info("Ping endpoint called");
        return ResponseEntity.ok("JUPITER Student API is running! 🚀");
    }

    /**
     * Get API status with details
     *
     * GET /api/students/status
     *
     * @return API status information
     */
    @GetMapping(value = "/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "JUPITER Student API");
        response.put("version", "1.0.0");
        response.put("totalStudents", studentService.countAll());
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new student
     *
     * POST /api/students
     * Content-Type: application/json
     *
     * @param student the student data
     * @return created student with 201 status
     */
    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> createStudent(@RequestBody Student student) {
        logger.info("Creating new student: {}", student.getStudentCode());

        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (student.getStudentCode() == null || student.getStudentCode().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Student code is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (student.getFirstName() == null || student.getFirstName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "First name is required");
                return ResponseEntity.badRequest().body(response);
            }

            if (student.getEmail() == null || student.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            Student createdStudent = studentService.createStudent(student);

            response.put("success", true);
            response.put("message", "Student created successfully");
            response.put("data", createdStudent);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            logger.error("Error creating student: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            logger.error("Unexpected error creating student", e);
            response.put("success", false);
            response.put("message", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get student by ID
     *
     * GET /api/students/{id}
     *
     * @param id the student ID
     * @return student data
     */
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getStudentById(@PathVariable String id) {
        logger.info("Fetching student by ID: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Student> studentOpt = studentService.findById(id);

        if (studentOpt.isPresent()) {
            response.put("success", true);
            response.put("data", studentOpt.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Student not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Get student by student code
     *
     * GET /api/students/code/{studentCode}
     *
     * @param studentCode the student code
     * @return student data
     */
    @GetMapping(value = "/code/{studentCode}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getStudentByCode(@PathVariable String studentCode) {
        logger.info("Fetching student by code: {}", studentCode);

        Map<String, Object> response = new HashMap<>();

        Optional<Student> studentOpt = studentService.findByStudentCode(studentCode);

        if (studentOpt.isPresent()) {
            response.put("success", true);
            response.put("data", studentOpt.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Student not found with code: " + studentCode);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Get all students with optional pagination
     *
     * GET /api/students
     * GET /api/students?page=0&size=10
     *
     * @param page page number (optional, default 0)
     * @param size page size (optional, default 20)
     * @return list of students
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        logger.info("Fetching all students - page: {}, size: {}", page, size);

        Map<String, Object> response = new HashMap<>();

        Page<Student> studentPage = studentService.findAllStudents(page, size);

        response.put("success", true);
        response.put("data", studentPage.getContent());
        response.put("currentPage", studentPage.getNumber());
        response.put("totalItems", studentPage.getTotalElements());
        response.put("totalPages", studentPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    /**
     * Get students by department
     *
     * GET /api/students/department/{department}
     *
     * @param department the department name
     * @return list of students
     */
    @GetMapping(value = "/department/{department}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getStudentsByDepartment(@PathVariable String department) {
        logger.info("Fetching students by department: {}", department);

        Map<String, Object> response = new HashMap<>();
        List<Student> students = studentService.findByDepartment(department);

        response.put("success", true);
        response.put("data", students);
        response.put("count", students.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Get students by status
     *
     * GET /api/students/status/{status}
     *
     * @param status the student status
     * @return list of students
     */
    @GetMapping(value = "/status/{status}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getStudentsByStatus(@PathVariable String status) {
        logger.info("Fetching students by status: {}", status);

        Map<String, Object> response = new HashMap<>();

        try {
            StudentStatus studentStatus = StudentStatus.valueOf(status.toUpperCase());
            List<Student> students = studentService.findByStatus(studentStatus);

            response.put("success", true);
            response.put("data", students);
            response.put("count", students.size());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status. Valid values: ACTIVE, INACTIVE, GRADUATED, SUSPENDED, ON_LEAVE");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Search students by name
     *
     * GET /api/students/search?name={name}
     *
     * @param name the name to search
     * @return list of matching students
     */
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> searchStudents(@RequestParam String name) {
        logger.info("Searching students by name: {}", name);

        Map<String, Object> response = new HashMap<>();
        List<Student> students = studentService.searchByName(name);

        response.put("success", true);
        response.put("data", students);
        response.put("count", students.size());

        return ResponseEntity.ok(response);
    }

    /**
     * Update student
     *
     * PUT /api/students/{id}
     * Content-Type: application/json
     *
     * @param id the student ID
     * @param student the updated student data
     * @return updated student
     */
    @PutMapping(
        value = "/{id}",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> updateStudent(
            @PathVariable String id,
            @RequestBody Student student) {

        logger.info("Updating student: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Student> existingStudentOpt = studentService.findById(id);

        if (existingStudentOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        student.setId(id);
        Student updatedStudent = studentService.updateStudent(student);

        response.put("success", true);
        response.put("message", "Student updated successfully");
        response.put("data", updatedStudent);

        return ResponseEntity.ok(response);
    }

    /**
     * Update student status
     *
     * PATCH /api/students/{id}/status
     *
     * @param id the student ID
     * @param status the new status
     * @return success response
     */
    @PatchMapping(value = "/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> updateStudentStatus(
            @PathVariable String id,
            @RequestParam String status) {

        logger.info("Updating status for student {} to {}", id, status);

        Map<String, Object> response = new HashMap<>();

        try {
            StudentStatus studentStatus = StudentStatus.valueOf(status.toUpperCase());
            boolean updated = studentService.updateStatus(id, studentStatus);

            if (updated) {
                response.put("success", true);
                response.put("message", "Student status updated successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Student not found with ID: " + id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status value");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Delete student
     *
     * DELETE /api/students/{id}
     *
     * @param id the student ID
     * @return success response
     */
    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable String id) {
        logger.info("Deleting student: {}", id);

        Map<String, Object> response = new HashMap<>();

        Optional<Student> existingStudentOpt = studentService.findById(id);

        if (existingStudentOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        studentService.deleteStudent(id);

        response.put("success", true);
        response.put("message", "Student deleted successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * Get student statistics
     *
     * GET /api/students/stats
     *
     * @return statistics about students
     */
    @GetMapping(value = "/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getStatistics() {
        logger.info("Fetching student statistics");

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalStudents", studentService.countAll());
        stats.put("activeStudents", studentService.countByStatus(StudentStatus.ACTIVE));
        stats.put("graduatedStudents", studentService.countByStatus(StudentStatus.GRADUATED));
        stats.put("inactiveStudents", studentService.countByStatus(StudentStatus.INACTIVE));

        response.put("success", true);
        response.put("data", stats);

        return ResponseEntity.ok(response);
    }
}
