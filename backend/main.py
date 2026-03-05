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
    JobApplicationCreate,
    Research,
    ResearchCreate,
    ResearchUpdate,
    PageConfig,
    PageConfigUpdate,
    SiteSettings
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
    delete_application,
    restore_application,
    get_all_research,
    get_research_by_id,
    create_research,
    update_research,
    delete_research,
    delete_research,
    global_search,
    get_site_settings,
    update_site_settings,
    get_page_config,
    upsert_page_config,
    delete_page_config,
    get_all_custom_pages,
    init_default_pages,
    get_credentials_by_username,
    save_credential,
    save_challenge,
    get_challenge
)
from auth import (
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

load_dotenv()

app = FastAPI(title="DREAMACTIC CMS API", version="1.0.0")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount static files for assets and uploads
app.mount("/static", StaticFiles(directory="static"), name="static")
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
        await init_default_pages()
        print("✅ SQLite connected and initialized")
    except Exception as e:
        print(f"⚠️  Database not available: {e}")
        print("⚠️  Backend will run in limited mode (frontend-only features will work)")


# Public endpoints
@app.get("/")
async def root():
    return {"message": "DREAMACTIC CMS API", "version": "1.0.0"}


@app.get("/api/settings", response_model=SiteSettings)
async def get_public_settings():
    """Get public site settings"""
    return await get_site_settings()


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


# Research public endpoints
@app.get("/api/research", response_model=List[Research])
async def get_research_publications():
    """Get all published research papers (public endpoint)"""
    return await get_all_research(published_only=True)


@app.get("/api/research/{res_id}", response_model=Research)
async def get_research_paper(res_id: str):
    """Get a single research paper by ID (public endpoint)"""
    res = await get_research_by_id(res_id)
    if not res:
        raise HTTPException(status_code=404, detail="Research paper not found")
    return res


@app.post("/api/jobs/apply", response_model=JobApplication)
async def apply_for_job(application: JobApplicationCreate):
    new_app = await create_job_application(application)
    return new_app


@app.get("/api/search")
async def search(q: str):
    """Global search across the platform (public endpoint)"""
    return await global_search(q)
    return await global_search(q)


@app.get("/api/pages", response_model=List[PageConfig])
async def list_custom_pages():
    """List all custom modular pages (public endpoint)"""
    return await get_all_custom_pages()


@app.get("/api/pages/{page_id}", response_model=PageConfig)
async def get_page_configuration(page_id: str):
    """Get dynamic configuration for a specific page (public endpoint)"""
    config = await get_page_config(page_id)
    if not config:
        # Fallback for pages that haven't been configured yet
        raise HTTPException(status_code=404, detail="Page configuration not found")
    return config


# Authentication endpoints
@app.post("/api/auth/login", response_model=dict)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint with MFA check"""
    user = await get_user_by_username(form_data.username)
    if not user or not verify_password(form_data.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user has registered credentials
    credentials = await get_credentials_by_username(user["username"])
    if credentials:
        # MFA Required
        return {
            "mfa_required": True,
            "username": user["username"],
            "message": "MFA Challenge Required"
        }

    # No MFA - proceed normally (or force setup if you want)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "mfa_required": False}


@app.get("/api/auth/mfa/options")
async def get_mfa_options(username: str):
    """Generate authentication options for YubiKey challenge"""
    from webauthn_auth import get_authentication_options
    import json
    
    credentials = await get_credentials_by_username(username)
    if not credentials:
        raise HTTPException(status_code=400, detail="MFA not configured for user")
        
    options = get_authentication_options(credentials)
    # Convert to JSON for frontend
    from webauthn import options_to_json
    options_json = options_to_json(options)
    
    # Save challenge
    import json as pyjson
    opt_dict = pyjson.loads(options_json)
    await save_challenge(username, opt_dict["challenge"])
    
    return pyjson.loads(options_json)


@app.post("/api/auth/mfa/verify")
async def verify_mfa(username: str, auth_response: dict):
    """Verify YubiKey signature and issue final JWT"""
    from webauthn_auth import verify_authentication
    from database import get_challenge, get_credentials_by_username
    
    challenge = await get_challenge(username)
    if not challenge:
        raise HTTPException(status_code=400, detail="Challenge expired or not found")
        
    credentials = await get_credentials_by_username(username)
    # Find the specific credential used
    target_cred = next((c for c in credentials if c["credential_id"] == auth_response["id"]), None)
    
    if not target_cred:
        raise HTTPException(status_code=400, detail="Invalid credential ID")
        
    try:
        verification = verify_authentication(
            credential_id=target_cred["credential_id"],
            public_key=target_cred["public_key"],
            sign_count=target_cred["sign_count"],
            challenge=challenge,
            authentication_response=auth_response
        )
        
        # In production, update the sign_count in database here!
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        print(f"WebAuthn Verification Error: {e}")
        raise HTTPException(status_code=401, detail="Security key verification failed")


@app.get("/api/admin/mfa/register/options")
async def register_mfa_options(current_user: dict = Depends(get_current_user)):
    """Generate options to register a new YubiKey"""
    from webauthn_auth import get_registration_options
    from webauthn import options_to_json
    import json
    
    username = current_user.username
    user = await get_user_by_username(username)
    
    existing_creds = await get_credentials_by_username(username)
    # Convert _id to string for webauthn helper if it's an ObjectId or similar
    user_id = str(user["_id"])
    
    options = get_registration_options(username, user_id, existing_creds)
    options_json = options_to_json(options)
    
    import json as pyjson
    opt_dict = pyjson.loads(options_json)
    await save_challenge(username, opt_dict["challenge"])
    
    return pyjson.loads(options_json)


@app.post("/api/admin/mfa/register/verify")
async def verify_mfa_registration(registration_data: dict, current_user: dict = Depends(get_current_user)):
    """Verify and save a new YubiKey credential"""
    from webauthn_auth import verify_registration
    from database import get_challenge, save_credential
    from webauthn.helpers import bytes_to_base64url
    
    username = current_user.username
    challenge = await get_challenge(username)
    
    if not challenge:
        raise HTTPException(status_code=400, detail="Challenge expired or not found")
        
    try:
        verification = verify_registration(username, challenge, registration_data)
        
        # Save to DB
        await save_credential(
            username=username,
            cred_id=bytes_to_base64url(verification.credential_id),
            public_key=bytes_to_base64url(verification.credential_public_key),
            sign_count=verification.sign_count,
            transports=registration_data.get("response", {}).get("transports", [])
        )
        
        return {"message": "YubiKey successfully registered"}
    except Exception as e:
        print(f"WebAuthn Registration Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to verify security key")


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


# Research admin endpoints
@app.get("/api/admin/research", response_model=List[Research])
async def get_all_research_admin(current_user = Depends(get_current_user)):
    """Get all research papers including unpublished (admin only)"""
    return await get_all_research(published_only=False)


@app.post("/api/admin/research", response_model=Research, status_code=status.HTTP_201_CREATED)
async def create_new_research_paper(
    paper: ResearchCreate,
    current_user = Depends(get_current_user)
):
    """Create a new research paper (admin only)"""
    return await create_research(paper)


@app.put("/api/admin/research/{res_id}", response_model=Research)
async def update_existing_research_paper(
    res_id: str,
    paper: ResearchUpdate,
    current_user = Depends(get_current_user)
):
    """Update an existing research paper (admin only)"""
    updated = await update_research(res_id, paper)
    if not updated:
        raise HTTPException(status_code=404, detail="Research paper not found")
    return updated


@app.delete("/api/admin/research/{res_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_research_paper(
    res_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a research paper (admin only)"""
    deleted = await delete_research(res_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Research paper not found")
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
 
 
@app.post("/api/admin/applications/{app_id}/restore")
async def restore_app_admin(
    app_id: str,
    current_user = Depends(get_current_user)
):
    """Restore a soft-deleted application (admin only)"""
    restored = await restore_application(app_id)
    if not restored:
        raise HTTPException(status_code=404, detail="Application not found or already active")
    return {"message": "Application restored successfully"}
 
 
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


@app.post("/api/admin/pages/{page_id}", response_model=PageConfig)
async def update_page_configuration(
    page_id: str,
    config: PageConfigUpdate,
    current_user = Depends(get_current_user)
):
    """Update or create page configuration (admin only)"""
    updated = await upsert_page_config(page_id, config.model_dump(exclude_unset=True))
    return updated


@app.delete("/api/admin/pages/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_page_configuration(
    page_id: str,
    current_user = Depends(get_current_user)
):
    """Delete a page configuration (admin only)"""
    deleted = await delete_page_config(page_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Page configuration not found")
    return None


@app.get("/api/admin/settings", response_model=SiteSettings)
async def get_admin_settings(current_user: str = Depends(get_current_user)):
    """Get site settings (admin)"""
    return await get_site_settings()


@app.post("/api/admin/settings", response_model=SiteSettings)
async def update_admin_settings(settings: SiteSettings, current_user = Depends(get_current_user)):
    """Update site settings (admin)"""
    return await update_site_settings(settings.model_dump())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
