<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle != null ? pageTitle : 'Student Dashboard - JUPITER'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
        }

        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        }

        .navbar .logo {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .navbar .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .navbar .user-info span {
            color: white;
            font-size: 0.95rem;
        }

        .navbar .btn-logout {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }

        .navbar .btn-logout:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }

        .welcome-section {
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .welcome-section h1 {
            color: #333;
            font-size: 1.8rem;
            margin-bottom: 10px;
        }

        .welcome-section p {
            color: #666;
            font-size: 1rem;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-card .icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 15px;
        }

        .stat-card.skills .icon {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .stat-card.documents .icon {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }

        .stat-card.performance .icon {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
        }

        .stat-card.profile .icon {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: white;
        }

        .stat-card h3 {
            color: #333;
            font-size: 1.2rem;
            margin-bottom: 8px;
        }

        .stat-card p {
            color: #888;
            font-size: 0.9rem;
        }

        .quick-actions {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .quick-actions h2 {
            color: #333;
            font-size: 1.4rem;
            margin-bottom: 20px;
        }

        .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }

        .action-btn {
            padding: 12px 25px;
            border-radius: 10px;
            border: none;
            font-size: 0.95rem;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .action-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .action-btn.secondary {
            background: #f1f5f9;
            color: #475569;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .api-info {
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin-top: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .api-info h2 {
            color: #333;
            font-size: 1.4rem;
            margin-bottom: 15px;
        }

        .api-info code {
            display: block;
            background: #1e293b;
            color: #22d3ee;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Consolas', monospace;
            font-size: 0.9rem;
            margin-bottom: 10px;
            overflow-x: auto;
        }

        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }

            .container {
                margin: 15px auto;
            }

            .welcome-section h1 {
                font-size: 1.4rem;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">JUPITER</div>
        <div class="user-info">
            <span>Welcome, <strong>${user.fullName}</strong> (Student)</span>
            <a href="${pageContext.request.contextPath}/logout" class="btn-logout">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="welcome-section">
            <h1>Student Dashboard</h1>
            <p>Manage your academic profile, skills, documents, and view performance evaluations.</p>
        </div>

        <div class="dashboard-grid">
            <div class="stat-card skills">
                <div class="icon">&#128218;</div>
                <h3>My Skills</h3>
                <p>View and manage your technical and soft skills</p>
            </div>

            <div class="stat-card documents">
                <div class="icon">&#128196;</div>
                <h3>My Documents</h3>
                <p>Upload and track your academic documents</p>
            </div>

            <div class="stat-card performance">
                <div class="icon">&#128200;</div>
                <h3>Performance</h3>
                <p>View your performance evaluations and grades</p>
            </div>

            <div class="stat-card profile">
                <div class="icon">&#128100;</div>
                <h3>My Profile</h3>
                <p>Update your personal and academic information</p>
            </div>
        </div>

        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
                <a href="#" class="action-btn primary">Add New Skill</a>
                <a href="#" class="action-btn primary">Upload Document</a>
                <a href="#" class="action-btn secondary">View Evaluations</a>
                <a href="#" class="action-btn secondary">Edit Profile</a>
            </div>
        </div>

        <div class="api-info">
            <h2>API Endpoints (For React Integration)</h2>
            <code>GET ${pageContext.request.contextPath}/api/students/ping</code>
            <code>GET ${pageContext.request.contextPath}/api/students/{id}</code>
            <code>POST ${pageContext.request.contextPath}/api/students</code>
            <code>GET ${pageContext.request.contextPath}/api/hr/skill/student/{studentId}</code>
            <code>GET ${pageContext.request.contextPath}/api/hr/document/student/{studentId}</code>
        </div>
    </div>
</body>
</html>
