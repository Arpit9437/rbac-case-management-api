# Anti-Doping Management System

This repository contains the backend code for an Anti-Doping Management System. The system is designed to manage cases, users, and roles for anti-doping investigations.

## Models

### User Model
- Fields: username, email, password, role, status, confirmationToken, confirmationTokenExpires, assignedCases
- Supports password hashing and comparison
- Timestamps for creation and updates

### Role Model
- Fields: name, description, permissions
- Predefined roles: superAdmin, analyst, investigator, labExpert

### Case Model
- Fields: athleteName, sport, status, createdBy, assignedUsers, responses, testResults, reports
- Timestamps for creation and updates

## API Routes

### Authentication Routes
- POST /api/auth/init-superadmin: Create initial super admin
- POST /api/auth/login: User login
- POST /api/auth/logout: User logout (requires authentication)

### User Routes
- POST /api/users/create: Create a new user (requires super admin)
- GET /api/users/confirm/:token: Confirm user account
- GET /api/users: Get all users (requires super admin)

### Case Routes
- POST /api/cases: Create a new case (requires authentication and permission)
- GET /api/cases: Get all cases for the authenticated user
- GET /api/cases/:id: Get a specific case (requires authentication)
- PUT /api/cases/:id: Update a case (requires authentication and permission)
- DELETE /api/cases/:id: Delete a case (requires authentication and permission)
- POST /api/cases/:id/assign: Assign a case to a user (requires authentication and permission)
- POST /api/cases/:id/respond: Add a response to a case (requires authentication)

## Environment Variables

Create a `.env` file in the root directory with the following structure:
PORT = port_number
MONGO_URI = mongodb://localhost:27017/your_database_name
JWT_SECRET = your_jwt_secret_key
EMAIL_USER = your_email
EMAIL_PASSWORD = your_email_password
FRONTEND_URL = your_url
Make sure to replace the placeholder values with your actual configuration.

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file as described above
4. Start the server: `nodemon server.js / node server.js`
