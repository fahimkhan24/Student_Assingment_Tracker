from uuid import uuid4
from typing import Literal

from fastapi import APIRouter, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Student Assignment Tracker API",
    description="Backend API for Student Assignment Tracker",
    version="1.0.0",
)

# CORS configuration for Vercel and local development (localhost + 127.0.0.1)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://student-assingment-tracker.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Assignment status and priority options
AssignmentStatus = Literal["Pending", "In Progress", "Completed"]
AssignmentPriority = Literal["Low", "Medium", "High"]


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


# Temporary in-memory storage
assignments: dict[str, Assignment] = {}

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "healthy"}


# CREATE AND READ ALL ASSIGNMENTS
@router.get("/assignments", response_model=list[Assignment])
def list_assignments():
    return list(assignments.values())


@router.post(
    "/assignments",
    response_model=Assignment,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(assignment: AssignmentCreate):
    assignment_id = str(uuid4())
    new_assignment = Assignment(
        id=assignment_id,
        **assignment.model_dump(),
    )
    assignments[assignment_id] = new_assignment
    return new_assignment


# READ SINGLE ASSIGNMENT
@router.get("/assignments/{assignment_id}", response_model=Assignment)
def get_assignment(assignment_id: str):
    assignment = assignments.get(assignment_id)
    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )
    return assignment


# UPDATE ASSIGNMENT
@router.put("/assignments/{assignment_id}", response_model=Assignment)
def update_assignment(
    assignment_id: str,
    updates: AssignmentUpdate,
):
    assignment = assignments.get(assignment_id)
    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    updated_data = assignment.model_dump()
    updated_data.update(updates.model_dump(exclude_unset=True))

    updated_assignment = Assignment(**updated_data)
    assignments[assignment_id] = updated_assignment
    return updated_assignment


# DELETE ASSIGNMENT
@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: str):
    if assignment_id not in assignments:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    del assignments[assignment_id]
    return {"message": "Assignment deleted successfully"}


@app.get("/")
def root():
    return {"message": "Student Assignment Tracker API is running"}


# Mount routes at both root (/assignments) and /api (/api/assignments)
app.include_router(router)
app.include_router(router, prefix="/api", include_in_schema=False)