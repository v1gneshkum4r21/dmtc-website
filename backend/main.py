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
    ShowcaseItemUpdate
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
    init_default_user
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
    await init_default_user()


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
