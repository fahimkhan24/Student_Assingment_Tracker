
from uuid import uuid4
from typing import Literal

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .auth import get_current_user, require_role, require_admin
from .database import get_db, init_db
from .models import User, Assignment as AssignmentModel
from .schemas import SignupRequest, LoginRequest, UserResponse
from .security import hash_password, verify_password, create_access_token


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="Student Assignment Tracker API",
    description="Backend API for Student Assignment Tracker",
    version="1.0.0",
)


@app.on_event("startup")
def startup():
    init_db()


# ==================================================
# CORS CONFIGURATION
# ==================================================

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


# ==================================================
# ASSIGNMENT SCHEMAS
# ==================================================

AssignmentStatus = Literal["Pending", "In Progress", "Completed"]
AssignmentPriority = Literal["Low", "Medium", "High"]


class AssignmentCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    course: str = Field(min_length=1, max_length=100)
    dueDate: str
    priority: AssignmentPriority = "Medium"
    status: AssignmentStatus = "Pending"


class Assignment(BaseModel):
    id: str
    title: str
    course: str
    dueDate: str
    priority: AssignmentPriority
    status: AssignmentStatus

    model_config = ConfigDict(from_attributes=True)


class AssignmentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    course: str | None = Field(default=None, min_length=1, max_length=100)
    dueDate: str | None = None
    priority: AssignmentPriority | None = None
    status: AssignmentStatus | None = None


# ==================================================
# ADMIN SCHEMAS
# ==================================================

class AdminUserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["student", "teacher"] = "student"


class AdminUserResponse(UserResponse):
    is_active: bool


# ==================================================
# AUTHENTICATION - SIGNUP
# ==================================================

@app.post(
    "/auth/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: SignupRequest,
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email is already registered",
        )

    new_user = User(
        name=payload.name.strip(),
        email=email,
        hashed_password=hash_password(payload.password),
        role="student",
        is_active=True,
    )

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email is already registered",
        )

    return new_user


# ==================================================
# AUTHENTICATION - LOGIN
# ==================================================

@app.post("/auth/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user or not verify_password(
        payload.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Your account has been banned or deactivated",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }


# ==================================================
# CURRENT USER
# ==================================================

@app.get("/auth/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user


# ==================================================
# TEACHER TEST
# ==================================================

@app.get("/auth/teacher-test")
def teacher_test(
    current_user: User = Depends(require_role("teacher")),
):
    return {
        "message": "Teacher access granted",
        "name": current_user.name,
        "role": current_user.role,
    }


# ==================================================
# ADMIN - VIEW ALL USERS
# ==================================================

@app.get(
    "/admin/users",
    response_model=list[AdminUserResponse],
)
def get_all_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.id).all()


# ==================================================
# ADMIN - CREATE USER
# ==================================================

@app.post(
    "/admin/users",
    response_model=AdminUserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    payload: AdminUserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email is already registered",
        )

    new_user = User(
        name=payload.name.strip(),
        email=email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        is_active=True,
    )

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email is already registered",
        )

    return new_user


# ==================================================
# ADMIN - BAN USER
# ==================================================

@app.patch("/admin/users/{user_id}/ban")
def ban_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot ban your own account",
        )

    if user.role == "admin" and user.is_active:
        active_admins = db.query(User).filter(
            User.role == "admin",
            User.is_active.is_(True),
        ).count()

        if active_admins <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot ban the last active admin",
            )

    user.is_active = False
    db.commit()

    return {"message": "User banned successfully"}


# ==================================================
# ADMIN - UNBAN USER
# ==================================================

@app.patch("/admin/users/{user_id}/unban")
def unban_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user.is_active = True
    db.commit()

    return {"message": "User unbanned successfully"}


# ==================================================
# ADMIN - DELETE USER
# ==================================================

@app.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    if user.role == "admin":
        admin_count = db.query(User).filter(
            User.role == "admin"
        ).count()

        if admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete the last admin",
            )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ==================================================
# ASSIGNMENTS - VIEW ALL
# ==================================================

@app.get("/assignments", response_model=list[Assignment])
def list_assignments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(AssignmentModel).all()


# ==================================================
# ASSIGNMENTS - CREATE (TEACHER ONLY)
# ==================================================

@app.post(
    "/assignments",
    response_model=Assignment,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(
    assignment: AssignmentCreate,
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db),
):
    new_assignment = AssignmentModel(
        id=str(uuid4()),
        **assignment.model_dump(),
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return new_assignment


# ==================================================
# ASSIGNMENTS - VIEW SINGLE
# ==================================================

@app.get(
    "/assignments/{assignment_id}",
    response_model=Assignment,
)
def get_assignment(
    assignment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    assignment = db.query(AssignmentModel).filter(
        AssignmentModel.id == assignment_id
    ).first()

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    return assignment


# ==================================================
# ASSIGNMENTS - UPDATE (TEACHER ONLY)
# ==================================================

@app.put(
    "/assignments/{assignment_id}",
    response_model=Assignment,
)
def update_assignment(
    assignment_id: str,
    updates: AssignmentUpdate,
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db),
):
    assignment = db.query(AssignmentModel).filter(
        AssignmentModel.id == assignment_id
    ).first()

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    updated_data = updates.model_dump(exclude_unset=True)

    for field, value in updated_data.items():
        setattr(assignment, field, value)

    db.commit()
    db.refresh(assignment)

    return assignment


# ==================================================
# ASSIGNMENTS - DELETE (TEACHER ONLY)
# ==================================================

@app.delete("/assignments/{assignment_id}")
def delete_assignment(
    assignment_id: str,
    current_user: User = Depends(require_role("teacher")),
    db: Session = Depends(get_db),
):
    assignment = db.query(AssignmentModel).filter(
        AssignmentModel.id == assignment_id
    ).first()

    if assignment is None:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found",
        )

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted successfully"}


# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():
    return {
        "message": "Student Assignment Tracker API is running"
    }
