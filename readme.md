# JUPITER - Smart Student & HR Utility Portal

A Spring MVC application for managing students, skills, performance evaluations, and documents with MongoDB backend.

**Base URL:** `http://localhost:8080/JUPITER`

---

## Quick Start

### Prerequisites
- Java 17
- MongoDB (running on localhost:27017)
- Apache Tomcat 10+

### Build & Deploy
```bash
cd Jupiter_HR_Project
mvn clean package -DskipTests
# Copy target/JUPITER.war to Tomcat webapps/
```

### Demo Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| HR | hr1 | pass123 |
| Student | student1 | pass123 |

---

## Web Pages

| Page | URL |
|------|-----|
| Login | http://localhost:8080/JUPITER/login |
| Student Dashboard | http://localhost:8080/JUPITER/student/dashboard |
| HR Dashboard | http://localhost:8080/JUPITER/hr/dashboard |
| Logout | http://localhost:8080/JUPITER/logout |

---

# API Documentation

## Student APIs

Base Path: `/api/students`

---

### 1. Ping (Health Check)

```
GET /api/students/ping
```

**Response:** `text/plain`
```
JUPITER Student API is running! 🚀
```

---

### 2. API Status

```
GET /api/students/status
```

**Response:**
```json
{
  "status": "UP",
  "service": "JUPITER Student API",
  "version": "1.0.0",
  "totalStudents": 10,
  "timestamp": 1706789012345
}
```

---

### 3. Create Student

```
POST /api/students
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentCode": "STU2024001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "2000-05-15",
  "gender": "Male",
  "department": "Computer Science",
  "course": "B.Tech",
  "semester": 6,
  "cgpa": 8.5,
  "address": {
    "street": "123 University Ave",
    "city": "Boston",
    "state": "Massachusetts",
    "zipCode": "02101",
    "country": "USA"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "65a1b2c3d4e5f6789012345a",
    "studentCode": "STU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

---

### 4. Get Student by ID

```
GET /api/students/{id}
```

**Example:** `GET /api/students/65a1b2c3d4e5f6789012345a`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6789012345a",
    "studentCode": "STU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "department": "Computer Science",
    "status": "ACTIVE"
  }
}
```

---

### 5. Get Student by Code

```
GET /api/students/code/{studentCode}
```

**Example:** `GET /api/students/code/STU2024001`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6789012345a",
    "studentCode": "STU2024001",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 6. Get All Students (Paginated)

```
GET /api/students?page=0&size=10
```

**Query Parameters:**
| Param | Default | Description |
|-------|---------|-------------|
| page | 0 | Page number |
| size | 20 | Items per page |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "65a1b2c3d4e5f6789012345a",
      "studentCode": "STU2024001",
      "firstName": "John",
      "lastName": "Doe"
    }
  ],
  "currentPage": 0,
  "totalItems": 50,
  "totalPages": 5
}
```

---

### 7. Get Students by Department

```
GET /api/students/department/{department}
```

**Example:** `GET /api/students/department/Computer%20Science`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 15
}
```

---

### 8. Get Students by Status

```
GET /api/students/status/{status}
```

**Valid Status Values:** `ACTIVE`, `INACTIVE`, `GRADUATED`, `SUSPENDED`, `ON_LEAVE`

**Example:** `GET /api/students/status/ACTIVE`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

---

### 9. Search Students by Name

```
GET /api/students/search?name={name}
```

**Example:** `GET /api/students/search?name=John`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

---

### 10. Update Student

```
PUT /api/students/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentCode": "STU2024001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.updated@university.edu",
  "semester": 7,
  "cgpa": 8.8
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {...}
}
```

---

### 11. Update Student Status

```
PATCH /api/students/{id}/status?status={status}
```

**Example:** `PATCH /api/students/65a1b2c3d4e5f6789012345a/status?status=GRADUATED`

**Response:**
```json
{
  "success": true,
  "message": "Student status updated successfully"
}
```

---

### 12. Delete Student

```
DELETE /api/students/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

### 13. Get Student Statistics

```
GET /api/students/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "activeStudents": 120,
    "graduatedStudents": 25,
    "inactiveStudents": 5
  }
}
```

---

## HR APIs

Base Path: `/api/hr`

---

### 1. Ping (Health Check)

```
GET /api/hr/ping
```

**Response:** `text/plain`
```
JUPITER HR API is running! 🚀
```

---

### 2. API Status

```
GET /api/hr/status
```

**Response:**
```json
{
  "status": "UP",
  "service": "JUPITER HR API",
  "version": "1.0.0",
  "timestamp": 1706789012345
}
```

---

## Skill APIs

---

### 3. Add Skill

```
POST /api/hr/skill
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65a1b2c3d4e5f6789012345a",
  "skillName": "Java Programming",
  "category": "PROGRAMMING",
  "proficiencyLevel": "ADVANCED",
  "yearsOfExperience": 3.5,
  "certified": true,
  "certificationName": "Oracle Certified Professional",
  "description": "Strong experience in Java SE and Java EE"
}
```

**Category Values:** `TECHNICAL`, `PROGRAMMING`, `DATABASE`, `FRAMEWORK`, `SOFT_SKILL`, `LANGUAGE`, `MANAGEMENT`, `DESIGN`, `OTHER`

**Proficiency Values:** `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {
    "id": "65b1c2d3e4f5678901234567",
    "studentId": "65a1b2c3d4e5f6789012345a",
    "skillName": "Java Programming",
    "category": "PROGRAMMING",
    "proficiencyLevel": "ADVANCED",
    "verifiedByHr": false,
    "createdAt": "2024-01-15T11:00:00"
  }
}
```

---

### 4. Get Skill by ID

```
GET /api/hr/skill/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65b1c2d3e4f5678901234567",
    "studentId": "65a1b2c3d4e5f6789012345a",
    "skillName": "Java Programming",
    "verifiedByHr": false
  }
}
```

---

### 5. Get Skills by Student

```
GET /api/hr/skill/student/{studentId}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### 6. Get Unverified Skills

```
GET /api/hr/skill/unverified
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 10
}
```

---

### 7. Verify Skill

```
PUT /api/hr/skill/{id}/verify?hrId={hrId}
```

**Example:** `PUT /api/hr/skill/65b1c2d3e4f5678901234567/verify?hrId=hr123`

**Response:**
```json
{
  "success": true,
  "message": "Skill verified successfully"
}
```

---

### 8. Delete Skill

```
DELETE /api/hr/skill/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

---

## Performance APIs

---

### 9. Create Performance Evaluation

```
POST /api/hr/performance
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65a1b2c3d4e5f6789012345a",
  "evaluatorId": "hr123",
  "evaluatorName": "HR Manager",
  "evaluationType": "QUARTERLY",
  "evaluationPeriod": "Q1 2024",
  "overallScore": 85.5,
  "grade": "A",
  "metrics": [
    {
      "metricName": "Technical Skills",
      "score": 90,
      "maxScore": 100,
      "weightage": 0.4,
      "comments": "Excellent coding skills"
    },
    {
      "metricName": "Communication",
      "score": 80,
      "maxScore": 100,
      "weightage": 0.3
    }
  ],
  "strengths": ["Problem-solving", "Quick learner"],
  "areasForImprovement": ["Time management"],
  "comments": "Great performance this quarter",
  "goals": ["Complete AWS certification"]
}
```

**Evaluation Types:** `ACADEMIC`, `INTERNSHIP`, `PROJECT`, `QUARTERLY`, `ANNUAL`, `PROBATION`, `SKILL_ASSESSMENT`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Performance evaluation created successfully",
  "data": {
    "id": "65d1e2f3a4b5678901234567",
    "studentId": "65a1b2c3d4e5f6789012345a",
    "evaluationType": "QUARTERLY",
    "overallScore": 85.5,
    "grade": "A",
    "status": "DRAFT"
  }
}
```

---

### 10. Get Performance by ID

```
GET /api/hr/performance/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

### 11. Get Performances by Student

```
GET /api/hr/performance/student/{studentId}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 4
}
```

---

### 12. Get Pending Reviews

```
GET /api/hr/performance/pending
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

### 13. Approve Performance

```
PUT /api/hr/performance/{id}/approve
```

**Response:**
```json
{
  "success": true,
  "message": "Performance evaluation approved successfully"
}
```

---

### 14. Reject Performance

```
PUT /api/hr/performance/{id}/reject
```

**Response:**
```json
{
  "success": true,
  "message": "Performance evaluation rejected"
}
```

---

## Document APIs

---

### 15. Create Document

```
POST /api/hr/document
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65a1b2c3d4e5f6789012345a",
  "documentName": "Academic Transcript",
  "documentType": "TRANSCRIPT",
  "fileName": "transcript_2024.pdf",
  "filePath": "/uploads/transcripts/transcript_2024.pdf",
  "fileSize": 524288,
  "mimeType": "application/pdf",
  "description": "Official transcript for 2023-2024",
  "confidential": false
}
```

**Document Types:** `ID_PROOF`, `ADDRESS_PROOF`, `ACADEMIC_CERTIFICATE`, `PROFESSIONAL_CERTIFICATE`, `TRANSCRIPT`, `RESUME`, `COVER_LETTER`, `OFFER_LETTER`, `EXPERIENCE_LETTER`, `RECOMMENDATION_LETTER`, `PASSPORT`, `VISA`, `MEDICAL_RECORD`, `OTHER`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Document created successfully",
  "data": {
    "id": "65e1f2a3b4c5678901234567",
    "documentName": "Academic Transcript",
    "documentType": "TRANSCRIPT",
    "status": "PENDING",
    "verified": false
  }
}
```

---

### 16. Get Document by ID

```
GET /api/hr/document/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {...}
}
```

---

### 17. Get Documents by Student

```
GET /api/hr/document/student/{studentId}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

---

### 18. Get Pending Documents

```
GET /api/hr/document/pending
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 8
}
```

---

### 19. Verify Document

```
PUT /api/hr/document/{id}/verify?hrId={hrId}&hrName={hrName}&remarks={remarks}
```

**Query Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| hrId | Yes | HR user ID |
| hrName | Yes | HR user name |
| remarks | No | Verification notes |

**Example:** `PUT /api/hr/document/65e1f2a3b4c5678901234567/verify?hrId=hr123&hrName=John%20HR&remarks=Verified`

**Response:**
```json
{
  "success": true,
  "message": "Document verified successfully"
}
```

---

### 20. Reject Document

```
PUT /api/hr/document/{id}/reject?hrId={hrId}&hrName={hrName}&remarks={remarks}
```

**Response:**
```json
{
  "success": true,
  "message": "Document rejected"
}
```

---

### 21. Delete Document

```
DELETE /api/hr/document/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### 22. Get Dashboard Statistics

```
GET /api/hr/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingSkillVerifications": 15,
    "pendingDocuments": 8,
    "expiringDocuments": 3,
    "pendingPerformanceReviews": 5
  }
}
```

---

## API Summary Table

### Student APIs (13 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/ping` | Health check |
| GET | `/api/students/status` | API status |
| POST | `/api/students` | Create student |
| GET | `/api/students/{id}` | Get by ID |
| GET | `/api/students/code/{code}` | Get by code |
| GET | `/api/students` | List all (paginated) |
| GET | `/api/students/department/{dept}` | Filter by department |
| GET | `/api/students/status/{status}` | Filter by status |
| GET | `/api/students/search?name=` | Search by name |
| PUT | `/api/students/{id}` | Update student |
| PATCH | `/api/students/{id}/status?status=` | Update status |
| DELETE | `/api/students/{id}` | Delete student |
| GET | `/api/students/stats` | Statistics |

### HR APIs (22 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hr/ping` | Health check |
| GET | `/api/hr/status` | API status |
| POST | `/api/hr/skill` | Add skill |
| GET | `/api/hr/skill/{id}` | Get skill |
| GET | `/api/hr/skill/student/{studentId}` | Skills by student |
| GET | `/api/hr/skill/unverified` | Unverified skills |
| PUT | `/api/hr/skill/{id}/verify?hrId=` | Verify skill |
| DELETE | `/api/hr/skill/{id}` | Delete skill |
| POST | `/api/hr/performance` | Create evaluation |
| GET | `/api/hr/performance/{id}` | Get evaluation |
| GET | `/api/hr/performance/student/{studentId}` | By student |
| GET | `/api/hr/performance/pending` | Pending reviews |
| PUT | `/api/hr/performance/{id}/approve` | Approve |
| PUT | `/api/hr/performance/{id}/reject` | Reject |
| POST | `/api/hr/document` | Create document |
| GET | `/api/hr/document/{id}` | Get document |
| GET | `/api/hr/document/student/{studentId}` | By student |
| GET | `/api/hr/document/pending` | Pending documents |
| PUT | `/api/hr/document/{id}/verify?hrId=&hrName=` | Verify |
| PUT | `/api/hr/document/{id}/reject?hrId=&hrName=` | Reject |
| DELETE | `/api/hr/document/{id}` | Delete document |
| GET | `/api/hr/dashboard/stats` | Dashboard stats |

---

## Postman Collection

### Test Sequence

1. **Health Check**
   ```
   GET http://localhost:8080/JUPITER/api/students/ping
   ```

2. **Create Student**
   ```
   POST http://localhost:8080/JUPITER/api/students
   Body: { "studentCode": "STU001", "firstName": "Test", "lastName": "User", "email": "test@test.com" }
   ```

3. **Add Skill**
   ```
   POST http://localhost:8080/JUPITER/api/hr/skill
   Body: { "studentId": "<student_id>", "skillName": "Java", "category": "PROGRAMMING", "proficiencyLevel": "ADVANCED" }
   ```

4. **Create Performance**
   ```
   POST http://localhost:8080/JUPITER/api/hr/performance
   Body: { "studentId": "<student_id>", "evaluatorId": "hr1", "evaluatorName": "HR", "evaluationType": "QUARTERLY", "overallScore": 85 }
   ```

5. **Create Document**
   ```
   POST http://localhost:8080/JUPITER/api/hr/document
   Body: { "studentId": "<student_id>", "documentName": "Resume", "documentType": "RESUME", "fileName": "resume.pdf" }
   ```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Language | Java 17 |
| Framework | Spring MVC 6.1.4 |
| Database | MongoDB |
| Server | Apache Tomcat 10+ |
| Build | Maven |

---

## License

This project is developed for educational purposes.

---

**JUPITER Development Team** | Version 1.0.0
