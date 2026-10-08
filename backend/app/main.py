from fastapi import FastAPI

app = FastAPI(
    title="Student Assignment Tracker API",
    description="Backend API for Student Assignment Tracker",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Student Assignment Tracker API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}