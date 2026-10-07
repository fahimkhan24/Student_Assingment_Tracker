# Student Assignment Tracker - API Design

## API Standards

| Item | Standard |
|---|---|
| Base URL | `/api` |
| Format | JSON |
| Authentication | JWT Token |
| Error Model | `message`, `error` |
| Time Format | ISO-8601 |

> **Path Convention:** All endpoints are relative to `/api`.

---

# Authentication APIs

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/auth/register` | POST | Register new user | Public |
| `/auth/login` | POST | Login user and receive token | Public |
| `/auth/logout` | POST | Logout user | Bearer |

## Register User Example

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "message": "Registration successful",
  "user_id": "user_101"
}
```

---

# User APIs

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/users/profile` | GET | View user profile | Bearer |
| `/users/profile` | PUT | Update user profile | Bearer |
| `/users/{user_id}` | DELETE | Delete user account | Bearer |

---

# Assignment APIs

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/assignments` | GET | Get all assignments | Bearer |
| `/assignments/{id}` | GET | Get assignment details | Bearer |
| `/assignments` | POST | Create assignment | Bearer |
| `/assignments/{id}` | PUT | Update assignment | Bearer |
| `/assignments/{id}` | DELETE | Delete assignment | Bearer |
| `/assignments/{id}/status` | PATCH | Update assignment status | Bearer |

## Create Assignment Example

### Request

```json
{
  "title": "Database Project",
  "description": "Complete MongoDB design",
  "course_id": "CSE301",
  "due_date": "2026-06-20",
  "status": "Pending"
}
```

### Response

```json
{
  "assignment_id": "A101",
  "message": "Assignment created successfully"
}
```

---

# Course APIs

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/courses` | GET | Get all courses | Bearer |
| `/courses/{id}` | GET | Get course details | Bearer |
| `/courses` | POST | Add new course | Bearer |
| `/courses/{id}` | PUT | Update course | Bearer |
| `/courses/{id}` | DELETE | Delete course | Bearer |

## Add Course Example

### Request

```json
{
  "course_name": "Web Programming",
  "course_code": "CSE301",
  "teacher": "Mr. Rahman"
}
```

### Response

```json
{
  "course_id": "CSE301",
  "message": "Course added successfully"
}
```

---

# Search and Filter APIs

| Endpoint | Method | Description | Auth |
|---|---|---|---|
| `/assignments/search` | GET | Search assignments | Bearer |
| `/assignments/filter` | GET | Filter assignments | Bearer |

## Query Parameters

```
keyword
status
course_id
due_date
page
limit
```

Example:

```
GET /api/assignments/filter?status=Pending
```

---

# Validation Rules

| Area | Rule |
|---|---|
| User | Email must be valid |
| Password | Password must meet minimum length |
| Assignment | Title and due date required |
| Course | Course name and code required |
| Status | Only Pending or Completed allowed |

---

# Status Codes

| Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Deleted successfully |
| 400 | Invalid request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource not found |
| 500 | Server error |

---

# Error Response

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Assignment title is required"
}
```

---

# API-to-Requirement Mapping

| API Domain | Requirement |
|---|---|
| Authentication | User Registration and Login |
| Users | User Profile Management |
| Assignments | Assignment CRUD Operations |
| Courses | Course Management |
| Search & Filter | Assignment Tracking Features |