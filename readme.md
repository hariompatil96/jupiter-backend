# JUPITER - Smart Student & HR Utility Portal

A production-ready Node.js backend for managing students, skills, performance records, and documents.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (Access + Refresh Tokens)
- **Validation:** Zod
- **File Upload:** Multer
- **Logging:** Winston
- **Security:** Helmet, CORS

## Project Structure

```
jupiter-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment configuration
│   │
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   │   ├── user.model.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.validation.js
│   │   │   └── index.js
│   │   │
│   │   ├── student/           # Student module
│   │   │   ├── student.model.js
│   │   │   ├── student.service.js
│   │   │   ├── student.controller.js
│   │   │   ├── student.routes.js
│   │   │   ├── student.validation.js
│   │   │   └── index.js
│   │   │
│   │   ├── hr/                # HR module (aggregates skill, performance, document)
│   │   │   ├── hr.service.js
│   │   │   ├── hr.controller.js
│   │   │   ├── hr.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── skill/             # Skill module
│   │   │   ├── skill.model.js
│   │   │   ├── skill.service.js
│   │   │   ├── skill.controller.js
│   │   │   ├── skill.routes.js
│   │   │   ├── skill.validation.js
│   │   │   └── index.js
│   │   │
│   │   ├── performance/       # Performance module
│   │   │   ├── performance.model.js
│   │   │   ├── performance.service.js
│   │   │   ├── performance.controller.js
│   │   │   ├── performance.routes.js
│   │   │   ├── performance.validation.js
│   │   │   └── index.js
│   │   │
│   │   └── document/          # Document module
│   │       ├── document.model.js
│   │       ├── document.service.js
│   │       ├── document.controller.js
│   │       ├── document.routes.js
│   │       ├── document.validation.js
│   │       └── index.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT authentication
│   │   ├── role.middleware.js   # Role-based access control
│   │   └── error.middleware.js  # Global error handling
│   │
│   ├── utils/
│   │   ├── apiResponse.js      # Standard API response format
│   │   ├── constants.js        # Application constants
│   │   └── logger.js           # Winston logger
│   │
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
│
├── uploads/                    # Uploaded files directory
├── logs/                       # Log files (production)
├── .env.example                # Environment template
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 20 or higher
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd jupiter-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=8080
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jupiter
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   TOKEN_EXPIRES_IN=15m
   REFRESH_EXPIRES_IN=7d
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

5. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

### Running with Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## API Overview

### Base URL
```
http://localhost:8080/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true | false,
  "message": "string",
  "data": {}
}
```

### User Roles
- **ADMIN** - Full access to all resources
- **HR** - Access to HR-related endpoints
- **STUDENT** - Limited access to own data

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /register | Register new user | No |
| POST | /login | Login user | No |
| POST | /refresh | Refresh access token | No |
| POST | /logout | Logout user | Yes |
| POST | /change-password | Change password | Yes |
| GET | /profile | Get user profile | Yes |
| PUT | /profile | Update user profile | Yes |
| GET | /me | Get current user | Yes |

### Students (`/api/students`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /ping | Health check | No | - |
| GET | /status | Service status | No | - |
| POST | / | Create student | Yes | ADMIN, HR |
| GET | / | Get all students (paginated) | Yes | All |
| GET | /:id | Get student by ID | Yes | All |
| GET | /code/:studentCode | Get student by code | Yes | All |
| GET | /department/:department | Get by department | Yes | All |
| GET | /status/:status | Get by status | Yes | All |
| GET | /search?name= | Search students | Yes | All |
| PUT | /:id | Update student | Yes | ADMIN, HR |
| PATCH | /:id/status?status= | Update status | Yes | ADMIN, HR |
| DELETE | /:id | Delete student | Yes | ADMIN, HR |
| GET | /stats | Get statistics | Yes | ADMIN, HR |

### HR Module (`/api/hr`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /ping | Health check | No | - |
| GET | /status | Service status | No | - |
| GET | /dashboard/stats | Dashboard statistics | Yes | ADMIN, HR |

#### Skills (`/api/hr/skill`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | / | Create skill | Yes | ADMIN, HR |
| GET | /:id | Get skill by ID | Yes | ADMIN, HR |
| GET | /student/:studentId | Get skills by student | Yes | ADMIN, HR |
| GET | /unverified | Get unverified skills | Yes | ADMIN, HR |
| PUT | /:id/verify?hrId= | Verify skill | Yes | ADMIN, HR |
| PUT | /:id/reject | Reject skill | Yes | ADMIN, HR |
| DELETE | /:id | Delete skill | Yes | ADMIN, HR |

#### Performance (`/api/hr/performance`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | / | Create performance | Yes | ADMIN, HR |
| GET | /:id | Get performance by ID | Yes | ADMIN, HR |
| GET | /student/:studentId | Get by student | Yes | ADMIN, HR |
| GET | /pending | Get pending | Yes | ADMIN, HR |
| PUT | /:id/approve | Approve performance | Yes | ADMIN, HR |
| PUT | /:id/reject | Reject performance | Yes | ADMIN, HR |

#### Documents (`/api/hr/document`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | / | Upload document | Yes | ADMIN, HR |
| GET | /:id | Get document by ID | Yes | ADMIN, HR |
| GET | /student/:studentId | Get by student | Yes | ADMIN, HR |
| GET | /pending | Get pending | Yes | ADMIN, HR |
| PUT | /:id/verify | Verify document | Yes | ADMIN, HR |
| PUT | /:id/reject | Reject document | Yes | ADMIN, HR |
| DELETE | /:id | Delete document | Yes | ADMIN, HR |

## Postman Testing Order

### 1. Setup and Authentication

```
1. POST /api/auth/register
   Body: {
     "email": "admin@jupiter.com",
     "password": "admin123",
     "firstName": "Admin",
     "lastName": "User",
     "role": "ADMIN"
   }

2. POST /api/auth/login
   Body: {
     "email": "admin@jupiter.com",
     "password": "admin123"
   }
   → Save accessToken and refreshToken

3. Set Authorization header for subsequent requests:
   Authorization: Bearer <accessToken>
```

### 2. Test Student Endpoints

```
4. GET /api/students/ping
5. GET /api/students/status

6. POST /api/students
   Body: {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@student.com",
     "department": "COMPUTER_SCIENCE",
     "enrollmentYear": 2023,
     "semester": 3
   }
   → Save student ID and studentCode

7. GET /api/students
8. GET /api/students/:id
9. GET /api/students/code/:studentCode
10. GET /api/students/department/COMPUTER_SCIENCE
11. GET /api/students/status/ACTIVE
12. GET /api/students/search?name=John

13. PUT /api/students/:id
    Body: {
      "phone": "+1234567890",
      "cgpa": 8.5
    }

14. PATCH /api/students/:id/status?status=INACTIVE
15. GET /api/students/stats
```

### 3. Test Skill Endpoints

```
16. POST /api/hr/skill
    Body: {
      "studentId": "<student_id>",
      "name": "JavaScript",
      "category": "Programming",
      "level": "INTERMEDIATE",
      "yearsOfExperience": 2
    }
    → Save skill ID

17. GET /api/hr/skill/:id
18. GET /api/hr/skill/student/:studentId
19. GET /api/hr/skill/unverified
20. PUT /api/hr/skill/:id/verify?hrId=<user_id>
```

### 4. Test Performance Endpoints

```
21. POST /api/hr/performance
    Body: {
      "studentId": "<student_id>",
      "type": "ACADEMIC",
      "title": "Semester 3 Results",
      "description": "Achieved excellent grades",
      "semester": 3,
      "academicYear": "2023-2024",
      "score": 85,
      "grade": "A"
    }
    → Save performance ID

22. GET /api/hr/performance/:id
23. GET /api/hr/performance/student/:studentId
24. GET /api/hr/performance/pending
25. PUT /api/hr/performance/:id/approve
```

### 5. Test Document Endpoints

```
26. POST /api/hr/document (multipart/form-data)
    - file: <upload file>
    - studentId: <student_id>
    - type: RESUME
    - title: John's Resume
    → Save document ID

27. GET /api/hr/document/:id
28. GET /api/hr/document/student/:studentId
29. GET /api/hr/document/pending
30. PUT /api/hr/document/:id/verify
```

### 6. Test Dashboard

```
31. GET /api/hr/ping
32. GET /api/hr/status
33. GET /api/hr/dashboard/stats
```

### 7. Cleanup (Optional)

```
34. DELETE /api/hr/document/:id
35. DELETE /api/hr/skill/:id
36. DELETE /api/students/:id
37. POST /api/auth/logout
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| NODE_ENV | Environment | development |
| MONGO_URI | MongoDB connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| TOKEN_EXPIRES_IN | Access token expiry | 15m |
| REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| UPLOAD_DIR | Upload directory | uploads |
| MAX_FILE_SIZE | Max upload size (bytes) | 5242880 |
| LOG_LEVEL | Winston log level | info |

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Helmet.js security headers
- CORS configuration
- Request validation with Zod
- Role-based access control
- Rate limiting ready (can be added)

## Logging

Winston logger with:
- Console output (development)
- File output (production): `logs/error.log`, `logs/combined.log`
- Request/response logging
- Error stack traces

## License

ISC
