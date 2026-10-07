# Acceptance Criteria

## User Registration

User Story:
US-01

Acceptance Criteria:
- User can enter name, email, and password.
- Email must be unique.
- Password must be at least 8 characters.
- Successful registration redirects to login page.

---

## User Login

User Story:
US-02

Acceptance Criteria:
- User enters valid credentials.
- System authenticates successfully.
- Dashboard loads after login.
- Invalid credentials show error message.

---

## Create Assignment

User Story:
US-03

Acceptance Criteria:
- User enters title.
- User selects due date.
- Assignment is saved in database.
- Assignment appears in dashboard.

---

## Edit Assignment

User Story:
US-04

Acceptance Criteria:
- User can modify assignment details.
- Changes are saved immediately.

---

## Delete Assignment

User Story:
US-05

Acceptance Criteria:
- User can delete assignment.
- Deleted assignment no longer appears.

---

## Update Assignment Status

User Story:
US-06

Acceptance Criteria:
- User can choose:
  - Pending
  - In Progress
  - Completed
- Status updates successfully.

---

## Deadline Reminder

User Story:
US-08

Acceptance Criteria:
- Reminder generated before due date.
- Notification appears on dashboard.
- User can dismiss notification.

---

## Dashboard Statistics

User Story:
US-09

Acceptance Criteria:
- Dashboard displays:
  - Total Assignments
  - Pending Assignments
  - Completed Assignments
  - Upcoming Deadlines
- Statistics update automatically.