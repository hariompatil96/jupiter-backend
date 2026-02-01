<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle != null ? pageTitle : 'HR Dashboard - JUPITER'}</title>
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
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
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
            max-width: 1400px;
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

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-box {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .stat-box:hover {
            transform: translateY(-5px);
        }

        .stat-box .number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stat-box.pending .number { color: #f59e0b; }
        .stat-box.verified .number { color: #10b981; }
        .stat-box.students .number { color: #6366f1; }
        .stat-box.documents .number { color: #ec4899; }

        .stat-box .label {
            color: #666;
            font-size: 0.9rem;
        }

        .dashboard-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
        }

        .section-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .section-card h2 {
            color: #333;
            font-size: 1.3rem;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f1f5f9;
        }

        .task-list {
            list-style: none;
        }

        .task-list li {
            padding: 15px 0;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .task-list li:last-child {
            border-bottom: none;
        }

        .task-list .task-info h4 {
            color: #333;
            font-size: 0.95rem;
            margin-bottom: 3px;
        }

        .task-list .task-info p {
            color: #888;
            font-size: 0.85rem;
        }

        .badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .badge.pending {
            background: #fef3c7;
            color: #d97706;
        }

        .badge.verified {
            background: #d1fae5;
            color: #059669;
        }

        .badge.review {
            background: #e0e7ff;
            color: #4f46e5;
        }

        .quick-actions {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .quick-actions h2 {
            color: #333;
            font-size: 1.3rem;
            margin-bottom: 20px;
        }

        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
        }

        .action-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            color: inherit;
            border: 2px solid transparent;
        }

        .action-card:hover {
            background: white;
            border-color: #6366f1;
            transform: translateY(-3px);
        }

        .action-card .icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .action-card h4 {
            color: #333;
            font-size: 0.95rem;
            margin-bottom: 5px;
        }

        .action-card p {
            color: #888;
            font-size: 0.8rem;
        }

        .api-section {
            background: white;
            padding: 25px;
            border-radius: 15px;
            margin-top: 30px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .api-section h2 {
            color: #333;
            font-size: 1.3rem;
            margin-bottom: 20px;
        }

        .api-group {
            margin-bottom: 20px;
        }

        .api-group h3 {
            color: #6366f1;
            font-size: 1rem;
            margin-bottom: 10px;
        }

        .api-section code {
            display: block;
            background: #1e293b;
            color: #22d3ee;
            padding: 12px 15px;
            border-radius: 8px;
            font-family: 'Consolas', monospace;
            font-size: 0.85rem;
            margin-bottom: 8px;
            overflow-x: auto;
        }

        .api-section code .method {
            color: #fbbf24;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }

            .dashboard-section {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">JUPITER</div>
        <div class="user-info">
            <span>Welcome, <strong>${user.fullName}</strong> (${user.role == 'ADMIN' ? 'Administrator' : 'HR Manager'})</span>
            <a href="${pageContext.request.contextPath}/logout" class="btn-logout">Logout</a>
        </div>
    </nav>

    <div class="container">
        <div class="welcome-section">
            <h1>HR Management Dashboard</h1>
            <p>Manage students, verify skills and documents, conduct performance evaluations, and more.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-box pending">
                <div class="number">--</div>
                <div class="label">Pending Verifications</div>
            </div>
            <div class="stat-box verified">
                <div class="number">--</div>
                <div class="label">Verified This Month</div>
            </div>
            <div class="stat-box students">
                <div class="number">--</div>
                <div class="label">Total Students</div>
            </div>
            <div class="stat-box documents">
                <div class="number">--</div>
                <div class="label">Documents Pending</div>
            </div>
        </div>

        <div class="dashboard-section">
            <div class="section-card">
                <h2>Pending Skill Verifications</h2>
                <ul class="task-list">
                    <li>
                        <div class="task-info">
                            <h4>Java Programming</h4>
                            <p>Submitted by Student #12345</p>
                        </div>
                        <span class="badge pending">Pending</span>
                    </li>
                    <li>
                        <div class="task-info">
                            <h4>Spring Framework</h4>
                            <p>Submitted by Student #12346</p>
                        </div>
                        <span class="badge pending">Pending</span>
                    </li>
                    <li>
                        <div class="task-info">
                            <h4>MongoDB</h4>
                            <p>Submitted by Student #12347</p>
                        </div>
                        <span class="badge review">Under Review</span>
                    </li>
                </ul>
            </div>

            <div class="section-card">
                <h2>Document Verification Queue</h2>
                <ul class="task-list">
                    <li>
                        <div class="task-info">
                            <h4>Academic Transcript</h4>
                            <p>Uploaded by Student #12345</p>
                        </div>
                        <span class="badge pending">Pending</span>
                    </li>
                    <li>
                        <div class="task-info">
                            <h4>ID Proof</h4>
                            <p>Uploaded by Student #12348</p>
                        </div>
                        <span class="badge pending">Pending</span>
                    </li>
                    <li>
                        <div class="task-info">
                            <h4>Certificate</h4>
                            <p>Uploaded by Student #12349</p>
                        </div>
                        <span class="badge verified">Verified</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-grid">
                <a href="#" class="action-card">
                    <div class="icon">&#128101;</div>
                    <h4>Manage Students</h4>
                    <p>View and edit student records</p>
                </a>
                <a href="#" class="action-card">
                    <div class="icon">&#128218;</div>
                    <h4>Verify Skills</h4>
                    <p>Review pending skill submissions</p>
                </a>
                <a href="#" class="action-card">
                    <div class="icon">&#128196;</div>
                    <h4>Verify Documents</h4>
                    <p>Review pending documents</p>
                </a>
                <a href="#" class="action-card">
                    <div class="icon">&#128200;</div>
                    <h4>Performance Review</h4>
                    <p>Conduct evaluations</p>
                </a>
                <a href="#" class="action-card">
                    <div class="icon">&#128202;</div>
                    <h4>Reports</h4>
                    <p>Generate analytics reports</p>
                </a>
                <a href="#" class="action-card">
                    <div class="icon">&#9881;</div>
                    <h4>Settings</h4>
                    <p>Configure preferences</p>
                </a>
            </div>
        </div>

        <div class="api-section">
            <h2>HR API Endpoints (For React/Postman Integration)</h2>

            <div class="api-group">
                <h3>Skills API</h3>
                <code><span class="method">POST</span> ${pageContext.request.contextPath}/api/hr/skill</code>
                <code><span class="method">GET</span> ${pageContext.request.contextPath}/api/hr/skill/{id}</code>
                <code><span class="method">GET</span> ${pageContext.request.contextPath}/api/hr/skill/student/{studentId}</code>
                <code><span class="method">PUT</span> ${pageContext.request.contextPath}/api/hr/skill/{id}/verify?hrId={hrId}</code>
            </div>

            <div class="api-group">
                <h3>Performance API</h3>
                <code><span class="method">POST</span> ${pageContext.request.contextPath}/api/hr/performance</code>
                <code><span class="method">GET</span> ${pageContext.request.contextPath}/api/hr/performance/{id}</code>
                <code><span class="method">GET</span> ${pageContext.request.contextPath}/api/hr/performance/student/{studentId}</code>
                <code><span class="method">PUT</span> ${pageContext.request.contextPath}/api/hr/performance/{id}/approve</code>
            </div>

            <div class="api-group">
                <h3>Documents API</h3>
                <code><span class="method">POST</span> ${pageContext.request.contextPath}/api/hr/document</code>
                <code><span class="method">GET</span> ${pageContext.request.contextPath}/api/hr/document/{id}</code>
                <code><span class="method">GET</span> ${pageContext.request.contextPath}/api/hr/document/pending</code>
                <code><span class="method">PUT</span> ${pageContext.request.contextPath}/api/hr/document/{id}/verify?hrId={hrId}&hrName={hrName}</code>
            </div>
        </div>
    </div>
</body>
</html>
