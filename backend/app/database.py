import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Locate the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load local environment variables from backend/.env
load_dotenv(BASE_DIR / ".env")

# Use PostgreSQL when DATABASE_URL exists.
# Otherwise, use SQLite for local development.
DATABASE_URL = os.getenv("DATABASE_URL") or (
    f"sqlite:///{BASE_DIR / 'assignments.db'}"
)

# Support Supabase PostgreSQL connection strings with psycopg 3
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://", "postgresql+psycopg://", 1
    )
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://", "postgresql+psycopg://", 1
    )

# Configure database engine
engine_options = {"pool_pre_ping": True}

if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {
        "check_same_thread": False
    }

engine = create_engine(DATABASE_URL, **engine_options)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from . import models

    Base.metadata.create_all(bind=engine)