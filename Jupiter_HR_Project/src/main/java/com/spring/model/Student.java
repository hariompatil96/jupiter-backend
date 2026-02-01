package com.spring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Student Entity
 *
 * Represents a student in the JUPITER system with personal details,
 * academic information, and associated skills/documents.
 *
 * @author JUPITER Development Team
 * @version 1.0.0
 */
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Field("user_id")
    private String userId;

    @Indexed(unique = true)
    @Field("student_code")
    private String studentCode;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Indexed
    @Field("email")
    private String email;

    @Field("phone")
    private String phone;

    @Field("date_of_birth")
    private LocalDate dateOfBirth;

    @Field("gender")
    private String gender;

    @Field("address")
    private Address address;

    @Field("department")
    private String department;

    @Field("course")
    private String course;

    @Field("semester")
    private Integer semester;

    @Field("enrollment_date")
    private LocalDate enrollmentDate;

    @Field("graduation_date")
    private LocalDate graduationDate;

    @Field("cgpa")
    private Double cgpa;

    @Field("status")
    private StudentStatus status = StudentStatus.ACTIVE;

    @Field("skill_ids")
    private List<String> skillIds = new ArrayList<>();

    @Field("document_ids")
    private List<String> documentIds = new ArrayList<>();

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    /**
     * Student status enumeration
     */
    public enum StudentStatus {
        ACTIVE,
        INACTIVE,
        GRADUATED,
        SUSPENDED,
        ON_LEAVE
    }

    /**
     * Embedded Address class
     */
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;

        public Address() {}

        public Address(String street, String city, String state, String zipCode, String country) {
            this.street = street;
            this.city = city;
            this.state = state;
            this.zipCode = zipCode;
            this.country = country;
        }

        // Getters and Setters
        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getZipCode() { return zipCode; }
        public void setZipCode(String zipCode) { this.zipCode = zipCode; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

        @Override
        public String toString() {
            return street + ", " + city + ", " + state + " " + zipCode + ", " + country;
        }
    }

    // Default constructor
    public Student() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public Student(String studentCode, String firstName, String lastName, String email) {
        this();
        this.studentCode = studentCode;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Full name helper method
    public String getFullName() {
        return firstName + " " + lastName;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public LocalDate getGraduationDate() {
        return graduationDate;
    }

    public void setGraduationDate(LocalDate graduationDate) {
        this.graduationDate = graduationDate;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }

    public List<String> getSkillIds() {
        return skillIds;
    }

    public void setSkillIds(List<String> skillIds) {
        this.skillIds = skillIds;
    }

    public List<String> getDocumentIds() {
        return documentIds;
    }

    public void setDocumentIds(List<String> documentIds) {
        this.documentIds = documentIds;
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
        return "Student{" +
                "id='" + id + '\'' +
                ", studentCode='" + studentCode + '\'' +
                ", fullName='" + getFullName() + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", course='" + course + '\'' +
                ", status=" + status +
                '}';
    }
}
