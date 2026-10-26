from uuid import uuid4
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Assignment as AssignmentModel


# Create database tables when the application starts.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Student Assignment Tracker API",
    description="Backend API for Student Assignment Tracker",
    version="1.0.0",
)


AssignmentStatus = Literal["Pending", "In Progress", "Completed"]
AssignmentPriority = Literal["Low", "Medium", "High"]


# -------------------------
# Pydantic schemas
# -------------------------

class AssignmentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    course: str = Field(min_length=1, max_length=100)
    dueDate: str
    priority: AssignmentPriority = "Medium"
    status: AssignmentStatus = "Pending"


class Assignment(AssignmentCreate):
    id: str


class AssignmentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    course: str | None = Field(default=None, min_length=1, max_length=100)
    dueDate: str | None = None
    priority: AssignmentPriority | None = None
    status: AssignmentStatus | None = None


# -------------------------
# Helper function
# -------------------------

def to_assignment_response(
    assignment: AssignmentModel,
) -> Assignment:
    return Assignment(
        id=assignment.id,
        title=assignment.title,
        course=assignment.course,
        dueDate=assignment.dueDate,
        priority=assignment.priority,
        status=assignment.status,
    )


# -------------------------
# Basic routes
# -------------------------

@app.get("/")
def root():
    return {"message": "Student Assignment Tracker API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# -------------------------
# Assignment CRUD
# -------------------------

@app.get("/assignments", response_model=list[Assignment])
def list_assignments(db: Session = Depends(get_db)):
    assignments = db.query(AssignmentModel).all()

    return [
        to_assignment_response(assignment)
        for assignment in assignments
    ]


@app.post(
    "/assignments",
    response_model=Assignment,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
):
    assignment_id = str(uuid4())

    new_assignment = AssignmentModel(
        id=assignment_id,
        title=assignment.title,
        course=assignment.course,
        dueDate=assignment.dueDate,
        priority=assignment.priority,
        status=assignment.status,
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return to_assignment_response(new_assignment)


@app.get("/assignments/{assignment_id}", response_model=Assignment)
def get_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
):
    assignment = (
        db.query(AssignmentModel)
        .filter(AssignmentModel.id == assignment_id)
        .first()
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    return to_assignment_response(assignment)


@app.put("/assignments/{assignment_id}", response_model=Assignment)
def update_assignment(
    assignment_id: str,
    updates: AssignmentUpdate,
    db: Session = Depends(get_db),
):
    assignment = (
        db.query(AssignmentModel)
        .filter(AssignmentModel.id == assignment_id)
        .first()
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    update_data = updates.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(assignment, field, value)

    db.commit()
    db.refresh(assignment)

    return to_assignment_response(assignment)


@app.delete("/assignments/{assignment_id}")
def delete_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
):
    assignment = (
        db.query(AssignmentModel)
        .filter(AssignmentModel.id == assignment_id)
        .first()
    )

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}