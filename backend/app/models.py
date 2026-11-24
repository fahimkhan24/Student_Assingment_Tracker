
from sqlalchemy import Column, Integer, String, Boolean
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(String(255), nullable=False)

    # Supported roles: student, teacher, admin
    role = Column(String(20), nullable=False, default="student")

    # Admin can ban or unban accounts
    is_active = Column(Boolean, default=True, nullable=False)


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    course = Column(String(100), nullable=False)

    dueDate = Column(String(50), nullable=False)

    priority = Column(String(20), nullable=False, default="Medium")

    status = Column(String(20), nullable=False, default="Pending")
