# Student Assignment Tracker - Database Design

## Database Overview

- Engine: **MongoDB**
- Model: **NoSQL Document Database**
- Database Type: **Collection-based design**
- Data Format: **BSON / JSON documents**
- Backend: **FastAPI**
- Frontend: **React + TypeScript**

---

# Database Collections

## Users Collection

### Purpose
Stores user account information.

### Structure

```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "created_at": "2026-06-17T10:00:00Z",
  "updated_at": "2026-06-17T10:00:00Z"
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique user ID |
| `name` | String | User name |
| `email` | String | Login email |
| `password` | String | Encrypted password |
| `created_at` | Date | Account creation time |
| `updated_at` | Date | Last update time |

---

# Courses Collection

### Purpose
Stores course information.

### Structure

```json
{
  "_id": "ObjectId",
  "course_name": "Web Programming",
  "course_code": "CSE301",
  "created_at": "2026-06-17T10:00:00Z"
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique course ID |
| `course_name` | String | Course name |
| `course_code` | String | Course code |
| `created_at` | Date | Creation date |

---

# Assignments Collection

### Purpose
Stores assignment details.

### Structure

```json
{
  "_id": "ObjectId",
  "title": "Project Report",
  "description": "Prepare final report",
  "due_date": "2026-07-01",
  "status": "Pending",
  "priority": "High",
  "user_id": "ObjectId",
  "course_id": "ObjectId",
  "created_at": "2026-06-17T10:00:00Z",
  "updated_at": "2026-06-17T10:00:00Z"
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Assignment ID |
| `title` | String | Assignment title |
| `description` | String | Assignment details |
| `due_date` | Date | Submission deadline |
| `status` | String | Pending / Completed |
| `priority` | String | Assignment priority |
| `user_id` | ObjectId | Assignment owner |
| `course_id` | ObjectId | Related course |
| `created_at` | Date | Created time |
| `updated_at` | Date | Updated time |

---

# Entity Relationships

## User → Assignment

Relationship:

```
User
 |
 | user_id
 |
Assignment
```

Description:

- One user can have many assignments.
- Each assignment belongs to one user.

---

## Course → Assignment

Relationship:

```
Course
 |
 | course_id
 |
Assignment
```

Description:

- One course can contain many assignments.
- Each assignment belongs to one course.

---

# Attribute Dictionary

| Attribute | Type | Used In |
|---|---|---|
| `_id` | ObjectId | All collections |
| `user_id` | ObjectId | Assignments |
| `course_id` | ObjectId | Assignments |
| `title` | String | Assignments |
| `description` | String | Assignments |
| `status` | String | Assignments |
| `priority` | String | Assignments |
| `due_date` | Date | Assignments |
| `created_at` | Date | All collections |
| `updated_at` | Date | All collections |

---

# Index Design

Indexes improve database search speed.

| Collection | Index | Purpose |
|---|---|---|
| Users | email | Faster login search |
| Courses | course_code | Course search |
| Assignments | user_id | Find user assignments |
| Assignments | course_id | Find course assignments |
| Assignments | due_date | Sort deadlines |
| Assignments | status | Filter assignments |

---

# Data Integrity Strategy

## Validation

- Required fields must be provided.
- Invalid data is rejected before storing.

## Unique Constraint

- Email must be unique.
- Prevents duplicate accounts.

## Reference Validation

- `user_id` must match an existing user.
- `course_id` must match an existing course.

## Password Security

- Passwords are stored using hashing.
- Original passwords are never stored.

## Soft Delete

Optional soft delete can be used.

Example:

```json
{
 "is_deleted": true
}
```

---

# Database Operations

| Operation | Description |
|---|---|
| Create | Add new user/course/assignment |
| Read | View records |
| Update | Edit assignment details |
| Delete | Remove records |
| Search | Find assignments |
| Filter | Filter by status/course |

---

# Performance Strategy

| Area | Approach |
|---|---|
| Query Speed | MongoDB indexing |
| Large Data | Pagination |
| Sorting | Indexed fields |
| Search | Optimized queries |
| API Response | Only required data returned |

---

# Security Design

| Area | Solution |
|---|---|
| Authentication | JWT Token |
| Password Security | Hashing |
| Authorization | User access control |
| Validation | Backend validation |
| Database Access | Protected API routes |

---

# NoSQL Design Discussion

- MongoDB is used because the project requires flexible data storage.
- Collections represent major application entities.
- Relationships are maintained using ObjectId references.
- The design avoids complex SQL joins.
- The database supports fast assignment tracking and easy maintenance.