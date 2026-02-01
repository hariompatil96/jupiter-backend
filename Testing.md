# JUPITER Backend - API Testing Guide

## Setup & Run Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Start production server
npm start

# Server runs on http://localhost:8080
```

## Base URL
```
http://localhost:8080/api
```

## Response Format
All responses follow this structure:
```json
{
  "success": true | false,
  "message": "string",
  "data": {}
}
```

---

## 1. Authentication APIs (`/api/auth`)

### 1.1 Register User
```
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@jupiter.com",
  "password": "Admin@123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "email": "admin@jupiter.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.2 Login
```
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@jupiter.com",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "email": "admin@jupiter.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.3 Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.4 Get Current User
```
GET /api/auth/me
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User found",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "admin@jupiter.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }
}
```

### 1.5 Change Password
```
POST /api/auth/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "Admin@123",
  "newPassword": "NewAdmin@456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

### 1.6 Logout
```
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 2. Student APIs (`/api/students`)

### 2.1 Health Check (Public)
```
GET /api/students/ping
```

**Response (200):**
```json
{
  "success": true,
  "message": "pong",
  "data": null
}
```

### 2.2 Service Status (Public)
```
GET /api/students/status
```

**Response (200):**
```json
{
  "success": true,
  "message": "Student service is running",
  "data": {
    "service": "student",
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2.3 Create Student (ADMIN/HR only)
```
POST /api/students
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@student.com",
  "department": "COMPUTER_SCIENCE",
  "course": "B.Tech Computer Science",
  "semester": 3,
  "gender": "MALE",
  "dateOfBirth": "2000-05-15",
  "phone": "+91-9876543210",
  "cgpa": 8.5,
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "studentCode": "STU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@student.com",
    "department": "COMPUTER_SCIENCE",
    "course": "B.Tech Computer Science",
    "semester": 3,
    "gender": "MALE",
    "status": "ACTIVE",
    "cgpa": 8.5,
    "fullName": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2.4 Get All Students (ADMIN/HR only)
```
GET /api/students?page=1&limit=10
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Students found",
  "data": {
    "students": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j2",
        "studentCode": "STU2024001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@student.com",
        "department": "COMPUTER_SCIENCE",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

### 2.5 Get Student by ID
```
GET /api/students/:id
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Student found",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "studentCode": "STU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@student.com",
    "department": "COMPUTER_SCIENCE",
    "course": "B.Tech Computer Science",
    "semester": 3,
    "status": "ACTIVE",
    "cgpa": 8.5,
    "fullName": "John Doe"
  }
}
```

### 2.6 Get Student by Code (ADMIN/HR only)
```
GET /api/students/code/STU2024001
Authorization: Bearer <accessToken>
```

### 2.7 Search Students (ADMIN/HR only)
```
GET /api/students/search?name=John
Authorization: Bearer <accessToken>
```

### 2.8 Get Students by Department (ADMIN/HR only)
```
GET /api/students/department/COMPUTER_SCIENCE
Authorization: Bearer <accessToken>
```

### 2.9 Get Students by Status (ADMIN/HR only)
```
GET /api/students/status/ACTIVE
Authorization: Bearer <accessToken>
```

**Valid Status Values:** `ACTIVE`, `INACTIVE`, `GRADUATED`, `SUSPENDED`, `ON_LEAVE`

### 2.10 Update Student (ADMIN/HR only)
```
PUT /api/students/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "+91-9876543211",
  "cgpa": 8.7,
  "semester": 4
}
```

### 2.11 Update Student Status (ADMIN/HR only)
```
PATCH /api/students/:id/status?status=INACTIVE
Authorization: Bearer <accessToken>
```

### 2.12 Delete Student (ADMIN/HR only)
```
DELETE /api/students/:id
Authorization: Bearer <accessToken>
```

### 2.13 Get Student Statistics (ADMIN/HR only)
```
GET /api/students/stats
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Statistics found",
  "data": {
    "total": 100,
    "active": 80,
    "inactive": 10,
    "graduated": 5,
    "suspended": 3,
    "onLeave": 2,
    "byDepartment": {
      "COMPUTER_SCIENCE": 40,
      "ELECTRICAL": 30,
      "MECHANICAL": 30
    }
  }
}
```

---

## 3. HR Module APIs (`/api/hr`)

### 3.1 Health Check
```
GET /api/hr/ping
```

### 3.2 Service Status
```
GET /api/hr/status
```

### 3.3 Dashboard Statistics (ADMIN/HR only)
```
GET /api/hr/dashboard/stats
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard statistics found",
  "data": {
    "students": {
      "total": 100,
      "active": 80,
      "inactive": 10,
      "graduated": 5,
      "suspended": 3,
      "onLeave": 2,
      "byDepartment": {}
    },
    "skills": {
      "total": 250,
      "unverified": 50,
      "verified": 200,
      "topCategories": {}
    },
    "performances": {
      "total": 150,
      "draft": 20,
      "pending": 30,
      "approved": 90,
      "rejected": 10,
      "byEvaluationType": {}
    },
    "documents": {
      "total": 300,
      "pending": 40,
      "verified": 240,
      "rejected": 20,
      "expiringSoon": 15,
      "byType": {}
    },
    "recentActivity": {
      "newStudents": 5,
      "newSkills": 10,
      "newPerformances": 8,
      "newDocuments": 12,
      "period": "7 days"
    },
    "pendingActions": {
      "skillsToVerify": 50,
      "performancesToReview": 30,
      "documentsToVerify": 40,
      "expiringDocuments": 15,
      "total": 120
    }
  }
}
```

---

## 4. Skill APIs (`/api/hr/skill`)

### 4.1 Create Skill (ADMIN/HR only)
```
POST /api/hr/skill
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "skillName": "JavaScript",
  "category": "PROGRAMMING",
  "proficiencyLevel": "ADVANCED",
  "yearsOfExperience": 3,
  "certified": true,
  "certificationName": "JavaScript Developer Certification",
  "description": "Proficient in ES6+, Node.js, and React"
}
```

**Valid Categories:** `TECHNICAL`, `PROGRAMMING`, `DATABASE`, `FRAMEWORK`, `SOFT_SKILL`, `LANGUAGE`, `MANAGEMENT`, `DESIGN`, `OTHER`

**Valid Proficiency Levels:** `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

**Response (201):**
```json
{
  "success": true,
  "message": "Skill created successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "studentId": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "studentCode": "STU2024001",
      "firstName": "John",
      "lastName": "Doe"
    },
    "skillName": "JavaScript",
    "category": "PROGRAMMING",
    "proficiencyLevel": "ADVANCED",
    "yearsOfExperience": 3,
    "certified": true,
    "certificationName": "JavaScript Developer Certification",
    "verifiedByHr": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4.2 Get Skill by ID
```
GET /api/hr/skill/:id
Authorization: Bearer <accessToken>
```

### 4.3 Get Skills by Student ID
```
GET /api/hr/skill/student/:studentId
Authorization: Bearer <accessToken>
```

### 4.4 Get Unverified Skills
```
GET /api/hr/skill/unverified
Authorization: Bearer <accessToken>
```

### 4.5 Verify Skill
```
PUT /api/hr/skill/:id/verify?hrId=<userId>
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Skill verified successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j3",
    "skillName": "JavaScript",
    "verifiedByHr": true,
    "verifiedBy": "65f1a2b3c4d5e6f7g8h9i0j1",
    "verifiedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 4.6 Delete Skill
```
DELETE /api/hr/skill/:id
Authorization: Bearer <accessToken>
```

---

## 5. Performance APIs (`/api/hr/performance`)

### 5.1 Create Performance Record (ADMIN/HR only)
```
POST /api/hr/performance
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": "65f1a2b3c4d5e6f7g8h9i0j2",
  "evaluatorId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "evaluatorName": "Admin User",
  "evaluationType": "ACADEMIC",
  "evaluationPeriod": "Semester 3 - 2024",
  "overallScore": 85,
  "grade": "A",
  "status": "PENDING",
  "metrics": [
    {
      "metricName": "Technical Knowledge",
      "score": 90,
      "maxScore": 100,
      "weightage": 40,
      "comments": "Excellent understanding of core concepts"
    },
    {
      "metricName": "Practical Skills",
      "score": 80,
      "maxScore": 100,
      "weightage": 30,
      "comments": "Good hands-on experience"
    },
    {
      "metricName": "Communication",
      "score": 85,
      "maxScore": 100,
      "weightage": 30,
      "comments": "Clear and effective communication"
    }
  ],
  "feedback": "Overall excellent performance this semester",
  "strengths": "Strong technical foundation, quick learner",
  "areasOfImprovement": "Can improve on project documentation"
}
```

**Valid Evaluation Types:** `ACADEMIC`, `INTERNSHIP`, `PROJECT`, `QUARTERLY`, `ANNUAL`, `PROBATION`, `SKILL_ASSESSMENT`

**Valid Grades:** `A_PLUS`, `A`, `B_PLUS`, `B`, `C_PLUS`, `C`, `D`, `F`

**Valid Status:** `DRAFT`, `PENDING`, `APPROVED`, `REJECTED`

**Response (201):**
```json
{
  "success": true,
  "message": "Performance created successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "studentId": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "studentCode": "STU2024001",
      "firstName": "John",
      "lastName": "Doe"
    },
    "evaluatorId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "evaluatorName": "Admin User",
    "evaluationType": "ACADEMIC",
    "overallScore": 85,
    "grade": "A",
    "status": "PENDING",
    "metrics": [...],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5.2 Get Performance by ID
```
GET /api/hr/performance/:id
Authorization: Bearer <accessToken>
```

### 5.3 Get Performances by Student ID
```
GET /api/hr/performance/student/:studentId
Authorization: Bearer <accessToken>
```

### 5.4 Get Pending Performances
```
GET /api/hr/performance/pending
Authorization: Bearer <accessToken>
```

### 5.5 Approve Performance
```
PUT /api/hr/performance/:id/approve
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Performance approved successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j4",
    "status": "APPROVED",
    "approvedBy": "65f1a2b3c4d5e6f7g8h9i0j1",
    "approvedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5.6 Reject Performance
```
PUT /api/hr/performance/:id/reject
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rejectionReason": "Incomplete evaluation metrics"
}
```

---

## 6. Document APIs (`/api/hr/document`)

### 6.1 Upload Document (ADMIN/HR only)
```
POST /api/hr/document
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**
```
file: <file>
studentId: 65f1a2b3c4d5e6f7g8h9i0j2
documentName: John's Resume
documentType: RESUME
confidential: false
expiryDate: 2025-12-31
```

**Valid Document Types:** `RESUME`, `TRANSCRIPT`, `CERTIFICATE`, `ID_PROOF`, `ADDRESS_PROOF`, `PHOTO`, `OFFER_LETTER`, `EXPERIENCE_LETTER`, `SALARY_SLIP`, `BANK_STATEMENT`, `PAN_CARD`, `AADHAR_CARD`, `PASSPORT`, `OTHER`

**Response (201):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "studentId": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "studentCode": "STU2024001",
      "firstName": "John",
      "lastName": "Doe"
    },
    "documentName": "John's Resume",
    "documentType": "RESUME",
    "fileName": "doc-1705312200000-123456789.pdf",
    "filePath": "uploads/doc-1705312200000-123456789.pdf",
    "fileSize": 102400,
    "mimeType": "application/pdf",
    "status": "PENDING",
    "verified": false,
    "confidential": false,
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 6.2 Get Document by ID
```
GET /api/hr/document/:id
Authorization: Bearer <accessToken>
```

### 6.3 Get Documents by Student ID
```
GET /api/hr/document/student/:studentId
Authorization: Bearer <accessToken>
```

### 6.4 Get Pending Documents
```
GET /api/hr/document/pending
Authorization: Bearer <accessToken>
```

### 6.5 Get Expiring Documents
```
GET /api/hr/document/expiring?days=30
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Documents found",
  "data": [
    {
      "id": "65f1a2b3c4d5e6f7g8h9i0j5",
      "documentName": "John's ID Proof",
      "documentType": "ID_PROOF",
      "expiryDate": "2024-02-10T00:00:00.000Z",
      "isExpiringSoon": true
    }
  ]
}
```

### 6.6 Get Document Statistics
```
GET /api/hr/document/stats
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Statistics found",
  "data": {
    "total": 300,
    "pending": 40,
    "verified": 240,
    "rejected": 20,
    "expiringSoon": 15,
    "byType": {
      "RESUME": 100,
      "TRANSCRIPT": 80,
      "CERTIFICATE": 60,
      "ID_PROOF": 40,
      "OTHER": 20
    }
  }
}
```

### 6.7 Verify Document
```
PUT /api/hr/document/:id/verify
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body (optional):**
```json
{
  "hrId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "hrName": "Admin User",
  "remarks": "Document verified and approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Document verified successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j5",
    "status": "VERIFIED",
    "verified": true,
    "verifiedBy": "65f1a2b3c4d5e6f7g8h9i0j1",
    "verifiedByName": "Admin User",
    "verifiedAt": "2024-01-15T11:00:00.000Z",
    "remarks": "Document verified and approved"
  }
}
```

### 6.8 Reject Document
```
PUT /api/hr/document/:id/reject
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "hrId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "hrName": "Admin User",
  "remarks": "Document is blurry and unreadable"
}
```

### 6.9 Update Document
```
PUT /api/hr/document/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentName": "Updated Resume",
  "confidential": true,
  "expiryDate": "2026-12-31"
}
```

### 6.10 Delete Document
```
DELETE /api/hr/document/:id
Authorization: Bearer <accessToken>
```

---

## Testing Flow (Recommended Order)

### Step 1: Authentication
1. Register an ADMIN user
2. Login to get accessToken
3. Save the accessToken for subsequent requests

### Step 2: Create Test Data
4. Create a student
5. Save the student ID

### Step 3: Test Skill APIs
6. Create a skill for the student
7. Get unverified skills
8. Verify the skill
9. Get skills by student ID

### Step 4: Test Performance APIs
10. Create a performance record
11. Get pending performances
12. Approve the performance

### Step 5: Test Document APIs
13. Upload a document
14. Get pending documents
15. Verify the document
16. Get expiring documents

### Step 6: Dashboard
17. Get dashboard statistics

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "data": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please login.",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required roles: ADMIN, HR",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Student not found",
  "data": null
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": [
    {
      "field": "studentId",
      "message": "Invalid student ID"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null
}
```

---

## cURL Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jupiter.com","password":"Admin@123"}'
```

### Create Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@student.com",
    "department": "COMPUTER_SCIENCE",
    "semester": 3
  }'
```

### Upload Document
```bash
curl -X POST http://localhost:8080/api/hr/document \
  -H "Authorization: Bearer <accessToken>" \
  -F "file=@/path/to/resume.pdf" \
  -F "studentId=65f1a2b3c4d5e6f7g8h9i0j2" \
  -F "documentName=John's Resume" \
  -F "documentType=RESUME"
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8080/api/hr/dashboard/stats \
  -H "Authorization: Bearer <accessToken>"
```

---

## Postman Collection Setup

1. Create environment variables:
   - `baseUrl`: `http://localhost:8080/api`
   - `accessToken`: (set after login)
   - `studentId`: (set after creating student)

2. In Tests tab of Login request, add:
```javascript
var jsonData = pm.response.json();
if (jsonData.success) {
    pm.environment.set("accessToken", jsonData.data.accessToken);
}
```

3. For authenticated requests, add header:
   - Key: `Authorization`
   - Value: `Bearer {{accessToken}}`
