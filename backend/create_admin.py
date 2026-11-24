
from getpass import getpass

from app.database import SessionLocal
from app.models import User
from app.security import hash_password


db = SessionLocal()

try:
    existing_admin = db.query(User).filter(
        User.role == "admin"
    ).first()

    if existing_admin:
        print("An admin account already exists.")
    else:
        name = input("Admin name: ").strip()
        email = input("Admin email: ").strip().lower()
        password = getpass("Admin password (minimum 8 characters): ")
        confirm = getpass("Confirm password: ")

        if len(name) < 2:
            raise ValueError("Name must contain at least 2 characters.")

        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters.")

        if password != confirm:
            raise ValueError("Passwords do not match.")

        if db.query(User).filter(User.email == email).first():
            raise ValueError("This email is already registered.")

        admin = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully!")

except Exception as error:
    db.rollback()
    print("Error:", error)

finally:
    db.close()
