# Entity Relationship Diagram (ERD)

## Entities

### User
- user_id (PK)
- name
- email
- password

### Assignment
- assignment_id (PK)
- title
- description
- due_date
- status
- user_id (FK)

### Course
- course_id (PK)
- course_name
- course_code

## Relationships

- One User can have many Assignments.
- One Course can have many Assignments.
- Each Assignment belongs to one User.
- Each Assignment belongs to one Course.


# Entity Relationship Diagram

![ER Diagram](../images/Student%20Assignment%20Tracker%20(1).png)