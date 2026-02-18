from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.staticfiles import StaticFiles
import shutil
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import List, Optional
import os
from dotenv import load_dotenv

from models import (
    Insight,
    InsightCreate,
    InsightUpdate, 
    Token, 
    UserCreate,
    ShowcaseItem,
    ShowcaseItemCreate,
    ShowcaseItemUpdate,
    Job,
    JobCreate,
    JobUpdate,
    JobApplication,
    JobApplicationCreate
)
from database import (
    get_all_insights,
    get_insight_by_id,
    create_insight,
    update_insight,
    delete_insight,
    get_all_showcase_items,
    create_showcase_item,
    update_showcase_item,
    delete_showcase_item,
    get_user_by_username,
    create_user,
    init_default_user,
    get_all_jobs,
    get_job_by_id,
    create_job,
    update_job,
    delete_job,
    create_job_application,
    get_all_applications,
    update_application_status,
    delete_application
)
from auth import (
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

load_dotenv()

app = FastAPI(title="DREAMATIC CMS API", version="1.0.0")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize default admin user on startup"""
    try:
        await init_default_user()
        print("✅ MongoDB connected and default user initialized")
    except Exception as e:
        print(f"⚠️  MongoDB not available: {e}")
        print("⚠️  Backend will run in limited mode (frontend-only features will work)")


# Public endpoints
@app.get("/")
async def root():
    return {"message": "DREAMATIC CMS API", "version": "1.0.0"}


@app.get("/api/insights", response_model=List[Insight])
async def get_insights(page: Optional[str] = None):
    """Get published insights, optionally filtered by page (public endpoint)"""
    insights = await get_all_insights(published_only=True, page=page)
    return insights


@app.get("/api/insights/{insight_id}", response_model=Insight)
async def get_insight(insight_id: str):
    """Get a single insight by ID (public endpoint)"""
    insight = await get_insight_by_id(insight_id)
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    return insight


@app.get("/api/showcase", response_model=List[ShowcaseItem])
async def get_showcase():
    """Get all active showcase items (public endpoint)"""
    items = await get_all_showcase_items(active_only=True)
    return items


@app.get("/api/jobs", response_model=List[Job])
async def get_jobs():
    """Get all active jobs (public endpoint)"""
    jobs = await get_all_jobs(active_only=True)
    return jobs


@app.get("/api/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    """Get a single job by ID (public endpoint)"""
    job = await get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.post("/api/jobs/apply", response_model=JobApplication)
async def apply_for_job(application: JobApplicationCreate):
    """Submit a job application (public endpoint)"""
    new_app = await create_job_application(application)
    return new_app
 
 
 # Authentication endpoints
@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint to get JWT token"""
    user = await get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Protected admin endpoints
@app.get("/api/admin/insights", response_model=List[Insight])
async def get_all_insights_admin(
    page: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """Get all insights including unpublished, optionally filtered by page (admin only)"""
    insights = await get_all_insights(published_only=False, page=page)
    return insights


@app.post("/api/admin/insights", response_model=Insight, status_code=status.HTTP_201_CREATED)
async def create_new_insight(
    insight: InsightCreate,
    current_user = Depends(get_current_user)
):
    """Create a new insight (admin only)"""
    new_insight = await create_insight(insight)
    return new_insight


@app.put("/api/admin/insights/{insight_id}", response_model=Insight)
async def update_existing_insight(
    insight_id: str,
    insight: InsightUpdate,
    current_user = Depends(get_current_user)
):
    """Update an existing insight (admin only)"""
    updated_insight = await update_insight(insight_id, insight)
    if not updated_insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    return updated_insight


@app.delete("/api/admin/insights/{insight_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_insight(
    insight_id: str,
    current_user = Depends(get_current_user)
):
    """Delete an insight (admin only)"""
    deleted = await delete_insight(insight_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Insight not found")
    return None


# Admin Showcase endpoints
@app.get("/api/admin/showcase", response_model=List[ShowcaseItem])
async def get_all_showcase_admin(current_user = Depends(get_current_user)):
    """Get all showcase items including inactive (admin only)"""
    items = await get_all_showcase_items(active_only=False)
    return items


@app.post("/api/admin/showcase", response_model=ShowcaseItem, status_code=status.HTTP_201_CREATED)
async def create_new_showcase_item(
    item: ShowcaseItemCreate,
    current_user = Depends(get_current_user)
):
    """Create a new showcase item (admin only)"""
    new_item = await create_showcase_item(item.model_dump())
    return new_item


@app.put("/api/admin/showcase/{item_id}", response_model=ShowcaseItem)
async def update_existing_showcase_item(
    item_id: str,
    item: ShowcaseItemUpdate,
    current_user = Depends(get_current_user)
):
    """Update an existing showcase item (admin only)"""
    updated_item = await update_showcase_item(item_id, item.model_dump())
    if not updated_item:
        raise HTTPException(status_code=404, detail="Showcase item not found")
    return updated_item


@app.delete("/api/admin/showcase/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_showcase_item(
    item_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a showcase item (admin only)"""
    deleted = await delete_showcase_item(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Showcase item not found")
    return None


@app.get("/api/admin/applications", response_model=List[JobApplication])
async def get_applications_admin(
    include_deleted: bool = False,
    current_user = Depends(get_current_user)
):
    """Get all job applications (admin only)"""
    apps = await get_all_applications(include_deleted=include_deleted)
    return apps


@app.patch("/api/admin/applications/{app_id}/status")
async def update_app_status_admin(
    app_id: str,
    status_update: dict,
    current_user = Depends(get_current_user)
):
    """Update application status with optional note (admin only)"""
    status = status_update.get("status")
    note = status_update.get("note")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    updated = await update_application_status(app_id, status, note)
    if not updated:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Status updated successfully"}


@app.delete("/api/admin/applications/{app_id}")
async def delete_app_admin(
    app_id: str,
    permanent: bool = False,
    current_user = Depends(get_current_user)
):
    """Delete application (admin only, supports soft/permanent delete)"""
    try:
        print(f"🗑️ Attempting to delete application: {app_id} (permanent={permanent})")
        deleted = await delete_application(app_id, permanent=permanent)
        if not deleted:
            print(f"❌ Application {app_id} not found or deletion failed")
            raise HTTPException(status_code=404, detail="Application not found")
        print(f"✅ Application {app_id} deleted successfully")
        return {"message": "Application deleted successfully"}
    except Exception as e:
        print(f"🔥 Error deleting application: {e}")
        raise HTTPException(status_code=500, detail=str(e))
 
 
 # Admin Jobs endpoints
@app.get("/api/admin/jobs", response_model=List[Job])
async def get_all_jobs_admin(
    active_only: bool = False,
    include_archived: bool = True,
    current_user = Depends(get_current_user)
):
    """Get all jobs including inactive and archived (admin only)"""
    jobs = await get_all_jobs(active_only=active_only, include_archived=include_archived)
    return jobs


@app.post("/api/admin/jobs", response_model=Job, status_code=status.HTTP_201_CREATED)
async def create_new_job_admin(
    job: JobCreate,
    current_user = Depends(get_current_user)
):
    """Create a new job (admin only)"""
    new_job = await create_job(job)
    return new_job


@app.put("/api/admin/jobs/{job_id}", response_model=Job)
async def update_existing_job_admin(
    job_id: str,
    job: JobUpdate,
    current_user = Depends(get_current_user)
):
    """Update an existing job (admin only)"""
    updated_job = await update_job(job_id, job)
    if not updated_job:
        raise HTTPException(status_code=404, detail="Job not found")
    return updated_job


@app.delete("/api/admin/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_job_admin(
    job_id: str,
    permanent: bool = False,
    current_user = Depends(get_current_user)
):
    """Delete a job (admin only, supports archiving/soft-delete by default)"""
    deleted = await delete_job(job_id, permanent=permanent)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job not found")
    return None


@app.post("/api/upload")
async def upload_file_public(
    file: UploadFile = File(...)
):
    """Upload a file (public endpoint for resumes)"""
    # Create a unique filename to prevent collisions
    import uuid
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"http://localhost:8000/uploads/{unique_filename}", "filename": file.filename}


@app.post("/api/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """Upload a file (admin only)"""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL to access the file
    # In a real production app, you'd use a more robust URL generation
    return {"url": f"http://localhost:8000/uploads/{file.filename}", "filename": file.filename}


@app.post("/api/admin/users", status_code=status.HTTP_201_CREATED)
async def create_new_user(
    user: UserCreate,
    current_user = Depends(get_current_user)
):
    """Create a new admin user (admin only)"""
    existing_user = await get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = await create_user(user)
    return new_user


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
