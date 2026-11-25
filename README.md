# Student Assignment Tracker

A role-based web application for managing and tracking student
assignments. Students can view assignments, teachers can create and
manage assignments, and administrators can manage platform users.

## Features

### Authentication

-   User registration and login
-   Password hashing
-   JWT-based authentication
-   Protected API endpoints

### Role-Based Access Control

The application supports three roles:

  -----------------------------------------------------------------------
  Role                                Permissions
  ----------------------------------- -----------------------------------
  **Student**                         View assignments

  **Teacher**                         Create, view, update, and delete
                                      assignments

  **Admin**                           Manage users, create
                                      student/teacher accounts, ban or
                                      unban users, and delete users
  -----------------------------------------------------------------------

Public registration creates student accounts. Admin accounts are created
separately using the backend admin-creation script.

### Assignment Management

-   View the assignment list
-   Create assignments (teachers)
-   Update assignment status
-   Delete assignments (teachers)
-   Filter and search assignments
-   Track assignment status: Pending, In Progress, and Completed
-   Set assignment priority: Low, Medium, and High

### Admin Dashboard

-   View user statistics
-   Search and filter users
-   Create student and teacher accounts
-   Ban and unban accounts
-   Delete users

## Technology Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS

### Backend

-   Python
-   FastAPI
-   SQLAlchemy
-   SQLite
-   JWT authentication
-   Argon2 password hashing

## Project Structure

``` text
Student_Assignment_Tracker/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── AdminDashboard.tsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── security.py
│   │   └── database.py
│   ├── create_admin.py
│   ├── requirements.txt
│   └── .env
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### 1. Clone the repository

``` bash
git clone https://github.com/fahimkhan24/Student_Assingment_Tracker.git
cd Student_Assingment_Tracker
```

### 2. Backend setup

Open a terminal in the project root.

Create and activate a virtual environment:

**Windows PowerShell**

``` powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Git Bash**

``` bash
python -m venv .venv
source .venv/Scripts/activate
```

Install backend dependencies:

``` bash
pip install -r backend/requirements.txt
```

Create a file named `backend/.env` and add a strong secret key:

``` env
SECRET_KEY=replace_with_a_long_random_secret
```

Generate a secret key locally with:

``` bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the generated value into `backend/.env`. Do not commit this file or
share the secret key.

Start the backend from the `backend` directory:

``` bash
cd backend
python -m uvicorn app.main:app --reload
```

The API should be available at:

-   API: `http://127.0.0.1:8000`
-   Interactive API documentation: `http://127.0.0.1:8000/docs`
-   Health check: `http://127.0.0.1:8000/health`

### 3. Create the first administrator

With the backend environment configured, open a second terminal,
activate the same virtual environment, and run the admin creation script
from the `backend` directory:

``` bash
python create_admin.py
```

Follow the prompts to enter the administrator's name, email, and
password.

Keep administrator credentials private. Do not add passwords or tokens
to the repository.

### 4. Frontend setup

Open another terminal and move to the frontend directory:

``` bash
cd frontend
npm install
```

Create a frontend environment file named `frontend/.env`:

``` env
VITE_API_URL=http://localhost:8000
```

Start the frontend development server:

``` bash
npm run dev
```

Open the local URL printed by Vite in your terminal (commonly
`http://localhost:5173`).

## Using the Application

1.  Register a student account using the signup page, or sign in with an
    account created by an administrator.
2.  Students can view assignments.
3.  Teachers can create assignments and manage their status.
4.  Administrators can open the admin dashboard to manage users.
5.  Use the Logout option to end the current session.

## API Overview

The backend provides endpoints for authentication, assignment
management, and administration.

  --------------------------------------------------------------------------------------
  Area                    Endpoint                               Purpose
  ----------------------- -------------------------------------- -----------------------
  Authentication          `POST /auth/signup`                    Register a student
                                                                 account

  Authentication          `POST /auth/login`                     Log in

  Authentication          `GET /auth/me`                         Get the current
                                                                 authenticated user

  Administration          `GET /admin/users`                     List users (admin only)

  Administration          `POST /admin/users`                    Create a student or
                                                                 teacher (admin only)

  Administration          `PATCH /admin/users/{user_id}/ban`     Ban a user (admin only)

  Administration          `PATCH /admin/users/{user_id}/unban`   Unban a user (admin
                                                                 only)

  Administration          `DELETE /admin/users/{user_id}`        Delete a user (admin
                                                                 only)

  Assignments             `/assignments`                         Assignment CRUD
                                                                 endpoints

  Health                  `GET /health`                          Check backend health
  --------------------------------------------------------------------------------------

For request and response schemas, open the interactive Swagger
documentation at `/docs` while the backend is running.

## Deployment

The project has been deployed using:

-   **Frontend:** Vercel ---
    https://student-assingment-tracker.vercel.app/
-   **Backend:** Render ---
    https://student-assingment-tracker.onrender.com/health

For production deployment:

1.  Set `VITE_API_URL` in the frontend hosting environment to the
    deployed backend base URL (without a trailing slash).
2.  Set `SECRET_KEY` in the backend hosting environment to a secure
    secret value.
3.  Configure the backend CORS settings to allow the deployed frontend
    origin.
4.  Ensure the deployed backend has a persistent database configuration
    if user and assignment data must survive service restarts or
    redeployments.
5.  Redeploy the frontend after changing its environment variables.

Never commit `.env` files, secret keys, passwords, or access tokens.

## Security Notes

-   Passwords should be stored as hashes, not as plain text.
-   Protected endpoints require a valid authentication token.
-   The backend checks user roles before allowing restricted actions.
-   Banned or deactivated accounts are prevented from using protected
    endpoints.
-   Admin privileges should only be granted through a trusted
    administrative process.
-   Keep secrets in environment variables and out of source control.

## Build

To create a production frontend build:

``` bash
cd frontend
npm run build
```

## Future Improvements

-   Add automated backend and frontend tests.
-   Add pagination for large user and assignment lists.
-   Add assignment ownership and course-level access rules.
-   Improve production database configuration and backups.
-   Add password reset and account recovery workflows.

## Author

**Student Assignment Tracker**\
A full-stack project built with React, TypeScript, FastAPI, and
SQLAlchemy.
