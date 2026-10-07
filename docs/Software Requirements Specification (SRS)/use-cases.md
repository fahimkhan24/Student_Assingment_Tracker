# Use Cases

## UC-01 User Registration

### Actor

Student

### Precondition

User is not registered.

### Main Flow

1. User opens registration page.
2. User enters required information.
3. User submits form.
4. System validates information.
5. Account is created.

### Postcondition

User account is successfully created.

---

## UC-02 User Login

### Actor

Student

### Precondition

User has a registered account.

### Main Flow

1. User enters credentials.
2. System validates credentials.
3. Dashboard is displayed.

### Postcondition

User gains access to the system.

---

## UC-03 Create Assignment

### Actor

Student

### Precondition

User is logged in.

### Main Flow

1. User clicks Add Assignment.
2. User enters assignment information.
3. User saves assignment.
4. System stores assignment.

### Postcondition

Assignment is added successfully.

---

## UC-04 Update Assignment Status

### Actor

Student

### Precondition

Assignment exists.

### Main Flow

1. User selects assignment.
2. User changes status.
3. System updates assignment.

### Postcondition

New status is saved.

---

## UC-05 Delete Assignment

### Actor

Student

### Precondition

Assignment exists.

### Main Flow

1. User selects assignment.
2. User clicks Delete.
3. System requests confirmation.
4. Assignment is removed.

### Postcondition

Assignment no longer exists.