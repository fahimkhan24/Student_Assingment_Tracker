Final Project Submission Report

Independent University, Bangladesh
CSE309 -- Web Application & Internet

Semester: Autumn 2026
Cover Page
Project Title: Student Assignment Tracker
Submitted by:\
- Name: Muhammad Sanowarul Islam Fahim - Student ID: \(2420864
- Section: 05  - Team Number:Own
- Individual Project
Submitted to:
Sayef Reyadh
Adjunct Lecturer
Department of Computer Science & Engineering
Independent University, Bangladesh

Vercel Frontend: https://student-assingment-tracker-nx17mw8mk-fahimkhan24.vercel.app/
GitHub Repository:
https://github.com/fahimkhan24/Student_Assingment_Tracker
Backend Health Check:
https://student-assingment-tracker.onrender.com/health
API Documentation:
https://student-assingment-tracker.onrender.com/docs
Date of Submission: 28-11-2026
Accuracy note: This report describes features established during
development and deployment discussions. Items marked "Not implemented
/ not verified" must not be presented as completed. Before submission,
check every statement against the deployed application and add the
required screenshots, test output, issue/PR links, and personal
academic details.

Table of Contents
1. Executive Summary
2. Part A -- Product Requirements (PRD)
3. Part B -- Software Requirements (SRS)
4. Part C -- Technical Design (TDD)
5. Part D -- Evidence: Screenshots of the Running Application
6. Part E -- Project Management and Conclusion
7. Appendix -- Final Verification Checklist
1. Executive Summary
1.1 Project Overview
Student Assignment Tracker is a web application designed to help
students view and track academic assignments and allow teachers to
manage assignment records. The application provides authentication and
role-based access so that students have read-only access to assignments,
while teachers can create, update, and delete assignment records. An
administrator can manage user accounts, including creating student and
teacher accounts, banning or unbanning users, and deleting users.

Technology stack: React with TypeScript and Vite, Tailwind CSS,
FastAPI (Python), SQLAlchemy, PostgreSQL hosted by Supabase, and
deployment through Vercel (frontend) and Render (backend).
1.2 What Was Built
- User signup and login using a password-hashing mechanism and
  JWT-based authentication.
- A protected current-user endpoint (/auth/me) used to retrieve the
  authenticated user's account information.
- Three application roles: student, teacher, and admin.
- Server-side role checks for protected operations.
- Student access to view assignment records without teacher editing
  controls.
- Teacher access to create, update, and delete assignment records.
- An administrator interface for listing users, creating student and
  teacher accounts, banning/unbanning accounts, and deleting accounts.
- Persistent database configuration using SQLAlchemy and Supabase
  PostgreSQL for the deployed backend.
- Separate frontend and backend deployments using Vercel and Render.
Not claimed as completed: refresh-token rotation, logout/session
revocation, session listing, audit logging, brute-force lockout, group
membership/permissions, CSV exports, content moderation, and automated
security test coverage were not established in the development
information available for this report. They are listed as limitations or
future work unless verified and implemented before submission.
1.3 Live Links
  Resource                            Link
  GitHub repository                   https://github.com/fahimkhan24/Student_Assingment_Tracker

  Production frontend                 https://student-assingment-tracker.vercel.app/

  Backend health check                https://student-assingment-tracker.onrender.com/health

  FastAPI interactive documentation   https://student-assingment-tracker.onrender.com/docs
Video demonstration                 \(Add video link if available\)
Part A. Product Requirements (PRD)
A1. Problem Statement
Students receive assignments from different courses and need to keep
track of assignment titles, course names, due dates, priorities, and
completion status. When this information is kept in separate messages,
documents, or personal notes, it can become difficult to find the latest
information and remember upcoming work.

Teachers also need a consistent way to create and maintain assignment
information for students. Without a shared application, assignment
information may be updated in one place but remain outdated elsewhere. A
role-aware assignment tracking application can provide a central place
for assignment information and distinguish student viewing privileges
from teacher management privileges.
A2. Users and Roles
  Role              Who they are      Main tasks        Actions they must
not be able to
perform
  Visitor           A person who has  Open the          Access protected
not logged in     application and   assignment or
use the           administration
signup/login      operations
screens           

  Student           An authenticated  View assignment   Create, update, or
student           information and   delete assignment
track assignment  records; access
status where      admin
enabled by the    user-management
application       functions

  Teacher           An authenticated  Create, view,     Manage administrator
teacher           update, and       accounts or use
delete assignment administrator-only
records           user-management
functions
Admin             An authorized     View users;       Publicly register as
administrator     create            an admin or bypass
student/teacher   server-side
accounts; ban,    protections
unban, and delete
users
A3. Goals and Success Measures
  ID                      Goal                    Success measure
  G-01                    Provide account         A valid student signup
registration and login  and login complete
successfully

  G-02                    Enforce role-based      Student requests to
access                  teacher-only write
operations are denied
by the backend

  G-03                    Support assignment      A teacher can create,
management              read, update, and
delete an assignment

  G-04                    Provide administrator   An admin can list users
user management         and perform the
implemented
account-management
actions

  G-05                    Persist production      A newly created account
records                 or assignment remains
available after a
backend restart,
verified against
Supabase
G-06                    Deploy the application  The production frontend
loads and the backend
health endpoint returns
a healthy response
A4. Scope and Non-Goals
In scope
- Student signup and login.
- JWT-based authentication.
- Password hashing.
- Student, teacher, and admin roles.
- Backend authorization checks.
- Assignment CRUD operations.
- Admin user listing and account management.
- SQLAlchemy database access.
- PostgreSQL persistence for the deployed backend.
- React frontend deployment and FastAPI backend deployment.
Out of scope or not implemented / not verified
- Group creation and group membership permissions.
- Refresh-token rotation and refresh-cookie handling.
- Session listing and individual session revocation.
- Audit log and security-event dashboard.
- Brute-force login lockout.
- Admin CSV exports and bulk moderation.
- Automated tests for every security and permission requirement.
- Video demonstration link.
Assumptions and constraints
- The application is accessed through a modern web browser.
- The frontend and backend are deployed separately.
- The frontend uses an API base URL configured through a Vite
  environment variable.
- The backend reads sensitive configuration such as SECRET_KEY and
  DATABASE_URL from environment variables.
- Hosting services may have cold starts or deployment delays.
- Production database access depends on the configured Supabase
  connection string and database availability.
A5. User Stories
  ID                                  User story
  US-01                               As a visitor, I want to create a
student account so that I can
access the application.

  US-02                               As a registered user, I want to log
in so that I can access features
allowed by my role.

  US-03                               As an authenticated user, I want to
retrieve my account information so
that I can confirm which account is
active.

  US-04                               As a student, I want to view
assignments so that I can see the
work assigned to me.

  US-05                               As a student, I want to see
assignment status and priority so
that I can understand the current
state of each assignment.

  US-06                               As a teacher, I want to create an
assignment so that students can see
its details.

  US-07                               As a teacher, I want to update an
assignment so that corrected
information is available.

  US-08                               As a teacher, I want to delete an
assignment when it is no longer
required.

  US-09                               As an admin, I want to list
registered users so that I can
manage accounts.

  US-10                               As an admin, I want to create
student and teacher accounts so
that authorized accounts can be
provisioned.

  US-11                               As an admin, I want to ban or unban
a user so that access can be
controlled.
US-12                               As an admin, I want to delete a
user account when required.
Part B. Software Requirements (SRS)
B1. Introduction
This section records the functional and non-functional requirements for
Student Assignment Tracker. It is intended for the instructor,
evaluator, developer, and anyone reviewing or maintaining the
application.
  Term                                Definition
  JWT                                 JSON Web Token, a signed token used
to carry claims about an
authenticated user

  Access token                        A token presented to protected API
endpoints to identify the
authenticated user

  RBAC                                Role-Based Access Control;
permissions are determined by the
user's assigned role

  Role                                A user category such as student,
teacher, or admin
Password hashing                    A one-way transformation used to
store passwords without storing the
original password
References: FastAPI documentation (https://fastapi.tiangolo.com/),
SQLAlchemy documentation (https://docs.sqlalchemy.org/), React
documentation (https://react.dev/), and RFC 7519 -- JSON Web Token
(https://www.rfc-editor.org/rfc/rfc7519).
B2. Functional Requirements
Authentication requirements
  ID                                  Requirement
  FR-AUTH-01                          The system shall allow a visitor to
register an account using the
signup form.

  FR-AUTH-02                          The public signup operation shall
create a student account and shall
not accept a caller-selected
teacher or admin role.

  FR-AUTH-03                          The system shall allow a registered
user to log in using an email
address and password.

  FR-AUTH-04                          The system shall store a password
hash rather than the original
plaintext password.

  FR-AUTH-05                          The system shall issue a signed JWT
after successful authentication.

  FR-AUTH-06                          The system shall provide an
authenticated endpoint to retrieve
the current user's account
information.

  FR-AUTH-07                          The system shall reject requests
with missing or invalid
authentication credentials on
protected endpoints.

  FR-AUTH-08                          The system shall reject an
inactive/banned user when the
backend authentication dependency
checks the account.
FR-AUTH-09                          The system shall prevent public
signup from assigning privileged
roles through extra request fields.
Refresh-token rotation, logout revocation, session management,
password-change endpoints, and lockout behavior are not verified and
must not be claimed as implemented without additional evidence.
Role-based access requirements
  ID                                  Requirement
  FR-RBAC-01                          The system shall support the
student, teacher, and admin
roles.

  FR-RBAC-02                          The backend shall enforce role
restrictions for protected
operations.

  FR-RBAC-03                          A student shall be allowed to read
assignment information.

  FR-RBAC-04                          A student shall not be allowed to
create, update, or delete
assignments.

  FR-RBAC-05                          A teacher shall be allowed to
create, update, and delete
assignment records.

  FR-RBAC-06                          An admin shall be allowed to access
the implemented user-management
operations.
FR-RBAC-07                          Public signup shall not allow a
visitor to create an admin or
teacher account.
Administrator requirements
  ID                                  Requirement
  FR-ADM-01                           The system shall allow an admin to
retrieve the user list.

  FR-ADM-02                           The system shall allow an admin to
create student and teacher accounts
through the admin interface.

  FR-ADM-03                           The system shall allow an admin to
ban a user.

  FR-ADM-04                           The system shall allow an admin to
unban a user.

  FR-ADM-05                           The system shall allow an admin to
delete a user.
FR-ADM-06                           The system shall prevent non-admin
users from accessing admin-only
endpoints.
Admin statistics, advanced search/filtering, pagination, role-change
actions, session revocation, bulk actions, moderation queues, activity
logs, security analytics, and CSV exports are not verified as
implemented.
Assignment domain requirements
  ID                                  Requirement
  FR-DOMAIN-01                        The system shall store assignment
information including title,
course, due date, priority, and
status.

  FR-DOMAIN-02                        The system shall allow an
authorized teacher to create an
assignment.

  FR-DOMAIN-03                        The system shall allow an
authorized teacher to retrieve
assignment records.

  FR-DOMAIN-04                        The system shall allow an
authorized teacher to update an
assignment.

  FR-DOMAIN-05                        The system shall allow an
authorized teacher to delete an
assignment.
FR-DOMAIN-06                        The system shall provide students
with read access to assignment
information.
B3. Non-Functional Requirements
  ID                      Category                Requirement /
verification
  NFR-SEC-01              Security                The application shall
read secret
configuration from
environment variables
rather than committing
secret values to source
control.

  NFR-SEC-02              Security                Passwords shall be
stored as hashes.

  NFR-SEC-03              Security                Authorization shall be
checked by the backend,
not only by hiding
frontend controls.

  NFR-PERF-01             Performance             API endpoints should
return within a
reasonable time under
normal project
demonstration usage; a
measured response-time
target has not yet been
recorded.

  NFR-USE-01              Usability               The frontend shall
provide forms and
role-appropriate
dashboard views.

  NFR-USE-02              Usability               The frontend shall show
loading and error
feedback for relevant
API operations.

  NFR-REL-01              Reliability             Production account and
assignment data shall
be stored in the
configured persistent
PostgreSQL database.
NFR-MAINT-01            Maintainability         Backend database access
shall be centralized
through the SQLAlchemy
database module.
B4. Roles and Permission Matrix
Endpoint groups by role
  Operation                          Visitor   Student   Teacher             Admin
  Signup as student                      Yes        No        No                No
Login                                  Yes       Yes       Yes               Yes
Read own profile (/auth/me)           No       Yes       Yes               Yes
Read assignments                        No       Yes       Yes               Yes
Create assignment                       No        No       Yes   Not established
Update assignment                       No        No       Yes   Not established
Delete assignment                       No        No       Yes   Not established
List users                              No        No        No               Yes
Create student/teacher account          No        No        No               Yes
Ban/unban user                          No        No        No               Yes
Delete user                             No        No        No               Yes

"Not established" means the precise admin permission for that assignment
operation must be checked in the current backend before submission.
Group permissions
Groups and group-member permission levels are not part of the verified
implementation. Therefore, create/update/assign group permissions and
owner-only group actions are not applicable to the current project.
Admin rules
The verified implementation includes admin-only user-management routes
and does not allow public signup to select the admin role. Additional
safeguards such as preventing an admin from banning another admin or
changing their own role must be tested against the current source code
before being claimed.
B5. Use Cases
UC-01: Register a student account
- Actor: Visitor
- Precondition: The visitor is not logged in and provides valid
  registration information.
- Main flow:
  1. Visitor opens the signup page.
  2. Visitor enters name, email, and password.
  3. Frontend sends the signup request to the backend.
  4. Backend validates the request and creates a student account.
  5. Backend stores the password hash in the database.
- Alternative/error flow: Invalid input is rejected with a
  validation response. A duplicate email is rejected.
- Postcondition: A student account is stored in the database.
UC-02: Log in
- Actor: Student, teacher, or admin
- Precondition: The account exists and is active.
- Main flow:
  1. User enters email and password.
  2. Frontend sends login credentials to the backend over HTTPS.
  3. Backend verifies the password against the stored hash.
  4. Backend issues an authentication token.
  5. Frontend stores the authentication state and displays the
     role-appropriate interface.
- Alternative/error flow: Invalid credentials are rejected;
  inactive users are not authorized.
- Postcondition: The user is authenticated.
UC-03: Create an assignment
- Actor: Teacher
- Precondition: Teacher is authenticated.
- Main flow:
  1. Teacher opens the assignment form.
  2. Teacher enters title, course, due date, and priority.
  3. Frontend sends the create request with authentication.
  4. Backend checks the user's role.
  5. Backend validates and stores the assignment.
  6. Frontend refreshes the assignment list.
- Alternative/error flow: Missing or invalid fields are rejected;
  a user without teacher permission is denied.
- Postcondition: The assignment is stored and available through
  the application.
UC-04: Attempt a restricted assignment action
- Actor: Student
- Precondition: Student is authenticated.
- Main flow:
  1. Student attempts to call a teacher-only write operation.
  2. Backend verifies the token and retrieves the account.
  3. Backend checks the user's role.
  4. Backend rejects the operation because the user is not a teacher.
- Alternative/error flow: Missing or invalid credentials result in
  an authentication error; a valid but unauthorized user receives an
  authorization error.
- Postcondition: No unauthorized assignment change is made.
UC-05: Ban a user
- Actor: Admin
- Precondition: Admin is authenticated and the target user exists.
- Main flow:
  1. Admin opens the user-management dashboard.
  2. Admin selects a user and chooses the ban action.
  3. Frontend sends the request to the admin endpoint.
  4. Backend verifies the admin role and updates the user's active
     state.
  5. The updated state is displayed in the admin interface.
- Alternative/error flow: A non-admin request is rejected; an
  unknown user cannot be updated.
- Postcondition: The target account is inactive, and
  authentication checks reject the inactive account.
UC-06: Delete a user
- Actor: Admin
- Precondition: Admin is authenticated and the target user exists.
- Main flow:
  1. Admin selects a user.
  2. Admin confirms deletion.
  3. Frontend sends the delete request.
  4. Backend verifies admin authorization and deletes the target
     record.
  5. The user list is refreshed.
- Alternative/error flow: Unauthorized requests are rejected;
  database constraints may prevent deletion if related records require
  handling.
- Postcondition: The user record is removed if the operation
  succeeds.
B6. Acceptance Criteria
  ID                Given             When              Then
  AC-01             A visitor         The visitor       A student account
provides valid    submits signup    is created
signup details                      

  AC-02             A visitor         The request is    The extra field
includes a role submitted         is rejected
field in public                     rather than
signup                              granting a
privileged role

  AC-03             A registered      The user logs in  The backend
active user                         returns an
provides valid                      authentication
credentials                         token

  AC-04             A student is      The student       The backend
authenticated     attempts a        denies the
teacher-only      request
write operation   

  AC-05             A teacher is      The teacher       The assignment is
authenticated     creates a valid   saved
assignment        

  AC-06             An admin is       The admin lists   The user list is
authenticated     users             returned

  AC-07             An admin bans a   The banned user   The backend
user              makes a protected rejects the
request           inactive account
AC-08             A non-admin calls The request is    The backend
an admin endpoint processed         denies the
request
Token expiry, token tampering, refresh rotation, group permissions,
audit log behavior, and admin-to-admin protection require separate
implementation verification and tests.
B7. Traceability Matrix
  Requirement       Endpoint / screen Test or verification   Evidence
  FR-AUTH-01/02     Signup page,      Register student;      Add S1
/auth/signup    verify role is
student; try extra
role field             

  FR-AUTH-03/05     Login page,       Login with valid and   Add S2
/auth/login     invalid credentials    

  FR-AUTH-06        /auth/me        Call endpoint with     Add S3
valid token            

  FR-RBAC-03/04     Student dashboard Confirm student can    Add S4
and assignment    read but cannot write
API                                      

  FR-RBAC-05        Teacher dashboard Create/update/delete   Add S5
and assignment    assignment as teacher
API                                      

  FR-ADM-01/02      Admin dashboard,  List users and create  Add S6
/admin/users    student/teacher        

  FR-ADM-03/04      Admin             Ban and unban a test   Add S7
user-management   user
interface                                

  FR-ADM-05         Admin             Delete a test user     Add S8
user-management
interface                                

  NFR-REL-01        Supabase          Create a test record   Add S9
PostgreSQL        and verify persistence
after restart          
Deployment        Vercel, Render,   Open production        Add S10--S12
/docs           frontend, health
endpoint, and docs
Part C. Technical Design (TDD)
C1. Technology Stack
  Component         Technology        Version                    Reason
  Frontend          React             19.x (verify lockfile)     Component-based
framework                                                      user interface

  Frontend language TypeScript        Verify lockfile            Static typing for
frontend code

  Build tool        Vite              Verify lockfile            Frontend
development and
production build

  Styling           Tailwind CSS      4.x (verify lockfile)      Utility-based
styling

  Backend framework FastAPI           fastapi[standard]        Python REST API
version specified in
requirements               

  ORM               SQLAlchemy        Verify requirements        Database models
and queries

  Database          PostgreSQL        Supabase-hosted            Persistent
relational
storage

  Local development SQLite            Built into Python runtime  Local development
database                                                       fallback

  PostgreSQL driver psycopg 3         psycopg[binary]>=3.2.0   PostgreSQL
connectivity

  Password hashing  Argon2 via        Verify installed           Password hashing
configured        package/version
security library                             

  Authentication    JWT               Verify configured library  Signed
and algorithm in source    authentication
tokens

  Frontend hosting  Vercel            Hosted service             Frontend
deployment

  Backend hosting   Render            Hosted service             FastAPI
deployment
Database hosting  Supabase          Hosted PostgreSQL          Persistent
production data
Before final submission, use the package lockfiles and
backend/requirements.txt to replace "verify" with exact installed
versions.
C2. System Architecture
+--------------------------+
| User's Web Browser       |
| React + TypeScript UI    |
+------------+-------------+
             |
             | HTTPS API requests
             | Authorization: Bearer <access token>
             v
+--------------------------+
| Vercel Frontend          |
| student-assingment-      |
| tracker.vercel.app       |
+------------+-------------+
             |
             | HTTPS requests to configured API base URL
             v
+--------------------------+
| Render FastAPI Backend   |
| Authentication, RBAC,   |
| Assignment and Admin API |
+------------+-------------+
             |
             | SQLAlchemy / psycopg
             v
+--------------------------+
| Supabase PostgreSQL      |
| users, assignments      |
+--------------------------+
1. The browser loads the React application from Vercel.
2. The frontend sends API requests to the FastAPI service hosted on
   Render.
3. Protected requests include the access token in the authorization
   header, according to the frontend's configured authentication flow.
4. FastAPI validates authentication and role permissions before
   executing protected operations.
5. SQLAlchemy communicates with Supabase PostgreSQL using the
   configured DATABASE_URL.
6. The backend returns JSON responses to the frontend.
An audit-log component is not included in this architecture because
audit logging was not verified as implemented. Refresh-cookie behavior
is also not claimed.
C3. Backend and Frontend Structure
The following is a representative structure based on files and folders
established during development. Confirm it against the final GitHub
repository and add or remove entries to match the actual tree.
Backend
backend/
├── app/
│   ├── main.py          # FastAPI application and CORS configuration
│   ├── database.py      # SQLAlchemy engine, session and table initialization
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Request and response validation schemas
│   ├── security.py      # Password hashing and JWT configuration
│   └── auth.py          # Current-user and role authorization dependencies
├── create_admin.py      # Local script for creating an admin account
├── requirements.txt     # Python dependencies
└── .env                 # Local environment variables; do not commit
Frontend
frontend/
├── src/
│   ├── components/      # Shared interface components (verify actual files)
│   ├── App.tsx          # Main application interface
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   └── main.tsx         # React entry point
├── package.json
├── package-lock.json
└── vite.config.ts
The frontend also includes login/signup and role-specific dashboard
components developed during the project. Update this tree with the exact
filenames from the final repository.
C4. Data Model
The verified model information establishes two main entities: users and
assignments. Confirm exact column names and constraints in
backend/app/models.py before submission.
User table
  Column                  Purpose                 Notes
  id                    User identifier         Primary key

  name                  User's display name     Required

  email                 Login email             Must be unique

  hashed_password       Password hash           Never store plaintext
password

  role                  Account role            student, teacher,
or admin
is_active             Account availability    Used to reject
banned/inactive
accounts
Assignment table
The assignment schema includes the following application fields. Verify
the exact database column names and SQL types in the model.

  Field                        Purpose
  id                         Assignment identifier
title                      Assignment title
course                     Course name
dueDate / due-date field   Assignment deadline
priority                   Low, Medium, or High
status                     Pending, In Progress, or Completed
Relationships and persistence
The backend uses SQLAlchemy models and Base.metadata.create_all()
during startup to create missing tables. The production DATABASE_URL
points to Supabase PostgreSQL. Local development can fall back to a
SQLite database file when DATABASE_URL is not set. No group
membership, refresh-token, or audit-log table has been verified.

Insert an ER diagram generated from the actual SQLAlchemy models
before submission.
C5. API Design
The following endpoints are established by the project development
context. Confirm exact HTTP methods, request fields, and response codes
in backend/app/main.py and the route modules.
  Method            Path                 Authentication    Purpose
  GET               /                  Public            Backend status
message

  GET               /health            Public            Health check

  POST              /auth/signup       Public            Register a
student

  POST              /auth/login        Public            Authenticate a
user

  GET               /auth/me           Authenticated     Retrieve current
user

  GET               /admin/users       Admin             List users

  Admin user routes /admin/users/...   Admin             Create, ban,
unban, or delete
users; confirm
exact paths
Assignment routes /assignments...    Role-dependent    Assignment CRUD;
confirm exact
paths and methods
FastAPI interactive documentation is available at
https://student-assingment-tracker.onrender.com/docs.

The API uses JSON request and response bodies. Authentication failures
and validation errors are returned using FastAPI's HTTP error response
format. Add the exact response codes and request schemas from the live
API documentation before submission.
C6. JWT Authentication Design
The application uses JWT-based authentication. A user submits
credentials to the login endpoint. The backend checks the account and
password, then issues a signed token. The frontend uses the token when
calling protected API endpoints.

The backend authentication dependency checks the token, retrieves the
user, and rejects missing, invalid, or inactive accounts. The token's
exact claims, signing algorithm, expiration duration, browser storage
mechanism, and logout behavior must be verified from the final source
code before being documented as exact values.
User
  |
  | email + password
  v
POST /auth/login
  |
  v
FastAPI verifies password and account
  |
  v
JWT issued
  |
  v
Frontend stores authentication state
  |
  | protected API request with token
  v
FastAPI validates token and user status
  |
  v
Authorized endpoint or rejection
Do not claim refresh-token rotation, httpOnly refresh cookies, session
revocation, or automatic refresh handling unless these have been
implemented and tested.
C7. RBAC Design
The application supports three roles: student, teacher, and admin. Role
authorization is enforced on the backend through reusable dependencies.

The authorization flow is:
1. Receive the API request.
2. Validate the supplied JWT.
3. Retrieve the corresponding user from the database.
4. Reject the request if the user does not exist or is inactive.
5. Check the required role.
6. Execute the endpoint only if authorization succeeds.
A public signup request cannot assign a privileged role. The signup
schema rejects extra fields, preventing a visitor from submitting
role: "teacher" or role: "admin" to elevate their privileges.

The exact dependency implementation should be quoted from the final
backend/app/auth.py file in the submitted report. Group permissions
and resource ownership rules are not verified features of this project.
C8. Admin Dashboard Design
The admin dashboard provides user-management functionality.
  Feature                 Purpose                 Verified action
  User list               View registered         Yes
accounts                

  Create account          Add a student or        Yes
teacher                 

  Ban user                Make an account         Yes
inactive                

  Unban user              Reactivate an account   Yes

  Delete user             Remove an account       Yes

  Statistics dashboard    Display aggregate       Not verified
metrics                 

  Activity log            Review administrative   Not verified
events                  

  Security analytics      Review failed logins    Not verified
and suspicious activity 
CSV export              Export filtered records Not verified
Add screenshots of the actual admin dashboard and verify every displayed
action before submission.
C9. Security Design and Threats
  Threat                  Implemented or known    Remaining verification
defence                 
  Password database leak  Passwords are stored as Verify algorithm and
hashes using the        parameters
configured
password-hashing
mechanism               

  Stolen access token     JWT signature           Token expiry,
validation is used      revocation, and storage
risks need review

  Stolen refresh token    Refresh-token rotation  Not implemented / not
not verified            verified

  Brute-force login       No lockout mechanism    Add rate limiting and
verified                lockout

  Privilege escalation    Public signup rejects   Test all privileged
extra fields, including endpoints
a caller-supplied role  

  Access to another       Role checks are         Verify ownership rules
user's data             implemented; record
ownership enforcement
must be checked against
actual query logic      

  Cross-site scripting    React escapes ordinary  Review any unsafe HTML
rendered text by        rendering
default                 

  Cross-site request      Token storage and       Review if cookie
forgery                 cookie strategy need    authentication is used
source verification     

  CORS misuse             Backend has an explicit Review production and
allowed-origin list     preview origins

  Secrets in repository   .env files are        Verify Git history and
ignored by Git          deployment environment

  SQL injection           SQLAlchemy ORM is used  Review raw SQL usage
for database operations 
Over-posting            Signup schema forbids   Review all write
extra fields            schemas
C10. Deployment
Frontend
- Hosting: Vercel.
- Production URL: https://student-assingment-tracker.vercel.app/.
- Framework: React, TypeScript, and Vite.
- Build command used by the frontend: npm run build.
- API base URL is configured through the Vite environment variable
  VITE_API_URL.
Backend
- Hosting: Render.
- Service URL: https://student-assingment-tracker.onrender.com.
- Root directory: backend.
- Build command: pip install -r requirements.txt.
- Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT.
Database
- Hosting: Supabase PostgreSQL.
- ORM: SQLAlchemy.
- Driver: psycopg 3.
- Connection is configured through the DATABASE_URL environment
  variable.
Environment variable names
  Variable                Used by                 Purpose
  VITE_API_URL          Vercel frontend         Backend API base URL

  DATABASE_URL          Render backend and      PostgreSQL connection
local backend when      string
configured              
SECRET_KEY            Backend                 JWT signing secret
Never include actual secret values in the report, screenshots, or GitHub
repository. Local development may use a backend/.env file that is
excluded from Git.
C11. Testing
The following are manual verification scenarios. Fill in the result
column only after performing each test on the current deployed
application.
  Test ID           Test               Expected result   Actual result
  T-01              Open production    Application loads \(Run and
                    frontend                             record\)

  T-02              Open backend       Healthy status    \(Run and
                    `/health`          response          record\)

  T-03              Register a student Account is        \(Run and
                    account            created           record\)

  T-04              Attempt signup     Request is        \(Run and
                    with a privileged  rejected          record\)
role field                           

  T-05              Log in with valid  Authentication    \(Run and
                    credentials        succeeds          record\)

  T-06              Retrieve           Current user is   \(Run and
                    `/auth/me` with a  returned          record\)
valid token                          

  T-07              Attempt teacher    Backend denies    \(Run and
                    write operation as request           record\)
student                              

  T-08              Create assignment  Assignment is     \(Run and
                    as teacher         saved             record\)

  T-09              Update assignment  Assignment is     \(Run and
                    as teacher         updated           record\)

  T-10              Delete assignment  Assignment is     \(Run and
                    as teacher         deleted           record\)

  T-11              Open admin user    User list is      \(Run and
                    list as admin      returned          record\)

  T-12              Ban and unban a    Account state     \(Run and
                    test account       changes           record\)

  T-13              Create a user      Student/teacher   \(Run and
                    through admin      account is        record\)
dashboard          created           
T-14              Restart/redeploy   Record remains in \(Run and
                    backend and verify PostgreSQL        record\)
a test record
Automated test output was not provided in the development information
used for this draft. Do not describe these tests as automated or passed
until the test suite has been run and its output captured.
Part D. Evidence: Screenshots of the Running Application
Take screenshots from the deployed production frontend. Keep the browser
address bar visible where possible. Mask passwords, JWTs, database
connection strings, and secret values. Use test accounts only and do not
include real credentials in the repository.
  Screenshot              Evidence to capture     What it should prove
  S1                      Signup page and         Signup interface and
validation feedback     validation

  S2                      Login page and          Authentication
successful login        interface

  S3                      Student dashboard       Student's read-only
assignment view

  S4                      Teacher dashboard with  Teacher assignment
assignment list         management

  S5                      Teacher creates an      Assignment creation
assignment              

  S6                      Teacher updates an      Assignment update
assignment              

  S7                      Teacher deletes a test  Assignment deletion
assignment              

  S8                      Student attempts a      Backend role
restricted write        enforcement
action, with Network
tab                     

  S9                      Admin dashboard user    Admin can view users
list                    

  S10                     Admin creates a         Admin account creation
student/teacher account 

  S11                     Admin bans and then     Account status
unbans a test user      management

  S12                     Admin deletes a test    User deletion
account                 

  S13                     Supabase Table Editor   Production database
showing users and     tables
assignments tables    

  S14                     Render service showing  Backend deployment
successful Live
deployment              

  S15                     Vercel production       Frontend deployment
deployment and domain   

  S16                     FastAPI /docs page    Published API
documentation
S17                     Browser Network tab     Frontend/backend
showing a successful    integration
API request
Insert the real screenshots into the final PDF and add captions that
identify the requirement each screenshot supports. The screenshots have
not been supplied with this draft.
Part E. Project Management and Conclusion
E1. How to Run and Test
Prerequisites
- Python installed.
- Node.js and npm installed.
- Git installed.
- Access to the project repository.
- A PostgreSQL database for persistent deployment, or SQLite for local
  development.
Backend setup
From the repository root:
cd backend
python -m venv .venv
Activate the virtual environment using the command appropriate for the
operating system, then install dependencies:
python -m pip install -r requirements.txt
Create backend/.env for local configuration. Example variable names:
SECRET_KEY=replace_with_a_local_secret
DATABASE_URL=replace_with_your_database_connection_string
Do not commit .env or real secret values. If DATABASE_URL is
omitted, the database module falls back to the local SQLite database.

Start the backend:
python -m uvicorn app.main:app --reload
Open http://127.0.0.1:8000/docs to view the local API documentation.
Frontend setup
Open another terminal:
cd frontend
npm install
Create a frontend environment file with the API base URL expected by the
frontend:
VITE_API_URL=http://127.0.0.1:8000
Start the frontend:
npm run dev
Run a production build:
npm run build
Admin account setup
The project includes backend/create_admin.py for creating an
administrator account. Run it only after confirming that the local
environment is configured to connect to the intended database. It uses
the database configuration imported by the backend. Do not run it
against production unless you intentionally want the account created in
the production database.
Test accounts
Use the test accounts created for the demonstration. Do not place
passwords or secret values in this Markdown file or in the GitHub
repository. If the instructor requires credentials, include them only in
the private PDF appendix in accordance with the course template.
E2. GitHub Work
Repository: https://github.com/fahimkhan24/Student_Assingment_Tracker

The project was developed using Git and GitHub. Work was organized
through feature branches and pull requests. The known feature work
includes the frontend assignment dashboard, FastAPI backend setup,
authentication, role-based authorization, admin user management, and
deployment/database configuration.
  Feature                 Issue / PR link         What it delivered
  Frontend assignment     \(Insert issue/PR URL\) React and TypeScript
dashboard                                       assignment interface

  FastAPI backend setup   \(Insert issue/PR URL\) FastAPI application and
health endpoint

  Authentication          \(Insert issue/PR URL\) Signup, login, JWT,
password hashing

  Role-based access       \(Insert issue/PR URL\) Student, teacher, and
control                                         admin role checks

  Admin user management   \(Insert issue/PR URL\) User list, account
creation, ban/unban,
deletion
PostgreSQL deployment   \(Insert issue/PR URL\) Supabase PostgreSQL
connection and Render
configuration
Add the actual issue and pull request URLs from GitHub. Do not invent
issue numbers, PR numbers, or commit hashes.
E3. Limitations
- Refresh-token rotation and session revocation have not been
  verified.
- A session management page has not been verified.
- Audit logging and a security analytics view have not been verified.
- Brute-force protection and login lockout have not been verified.
- Group membership and fine-grained group permissions are not part of
  the verified feature set.
- CSV exports and bulk moderation have not been verified.
- Automated test coverage and test-run output were not provided for
  this report.
- The exact endpoint list, token claims, token lifetime, and frontend
  token storage must be confirmed from the final source code.
- The exact production persistence behavior should be demonstrated by
  creating a test record and verifying it after a restart or
  redeployment.
E4. Future Work
1. Add automated backend tests for authentication, assignment CRUD, and
   role permissions.
2. Implement refresh-token rotation, logout, and session revocation if
   required by the project specification.
3. Add audit logs for authentication and administrative actions.
4. Add login rate limiting and brute-force protection.
5. Add pagination and advanced filtering to user and assignment lists.
6. Add CSV export for authorized administrators.
7. Improve deployment monitoring and error reporting.
8. Add a documented database migration process for schema changes.
E5. Sources, Libraries and Tools
  Name                    Link / version                    Purpose
  React                   https://react.dev/                Frontend interface

  TypeScript              https://www.typescriptlang.org/   Frontend type checking

  Vite                    https://vite.dev/                 Frontend development
and build

  Tailwind CSS            https://tailwindcss.com/          Styling

  FastAPI                 https://fastapi.tiangolo.com/     REST API backend

  SQLAlchemy              https://www.sqlalchemy.org/       ORM and database access

  psycopg                 https://www.psycopg.org/          PostgreSQL driver

  Supabase                https://supabase.com/docs         Hosted PostgreSQL
database

  Render                  https://render.com/docs           Backend hosting

  Vercel                  https://vercel.com/docs           Frontend hosting

  Git and GitHub          https://docs.github.com/          Version control and
collaboration
