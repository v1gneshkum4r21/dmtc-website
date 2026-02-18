from pymongo import MongoClient
from datetime import datetime
from typing import List, Optional
from bson import ObjectId
import os
from dotenv import load_dotenv
from models import InsightCreate, InsightUpdate, UserCreate, JobCreate, JobUpdate, JobApplicationCreate
from auth import get_password_hash

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dreamatic_cms")

# MongoDB client
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Collections
insights_collection = db["insights"]
users_collection = db["users"]
showcase_collection = db["showcase"]
jobs_collection = db["jobs"]
applications_collection = db["applications"]


# Helper function to convert ObjectId to string
def insight_helper(insight) -> dict:
    return {
        "_id": str(insight["_id"]),
        "title": insight["title"],
        "excerpt": insight["excerpt"],
        "content": insight["content"],
        "author": insight.get("author", "DREAMATIC Team"),
        "imageUrl": insight.get("imageUrl"),
        "page": insight.get("page", "ai-work"),
        "published": insight.get("published", True),
        "createdAt": insight["createdAt"],
        "updatedAt": insight["updatedAt"]
    }


def showcase_helper(item) -> dict:
    return {
        "_id": str(item["_id"]),
        "title": item["title"],
        "description": item.get("description"),
        "mediaUrl": item["mediaUrl"],
        "mediaType": item["mediaType"],
        "tag": item["tag"],
        "product": item.get("product"),
        "order": item.get("order", 0),
        "active": item.get("active", True),
        "size": item.get("size", "medium"),
        "likes": item.get("likes", 0),
        "views": item.get("views", 0),
        "createdAt": item["createdAt"],
        "updatedAt": item["updatedAt"]
    }


def user_helper(user) -> dict:
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "createdAt": user["createdAt"]
    }


def job_helper(job) -> dict:
    return {
        "_id": str(job["_id"]),
        "title": job["title"],
        "team": job["team"],
        "location": job["location"],
        "description": job["description"],
        "requirements": job["requirements"],
        "company": job.get("company", "DREAMATIC"),
        "tags": job.get("tags", ""),
        "type": job.get("type", "Full-time"),
        "active": job.get("active", True),
        "isArchived": job.get("isArchived", False),
        "createdAt": job["createdAt"],
        "updatedAt": job["updatedAt"]
    }


def application_helper(app) -> dict:
    return {
        "_id": str(app["_id"]),
        "name": app["name"],
        "email": app["email"],
        "phone": app["phone"],
        "location": app["location"],
        "experience": app["experience"],
        "salary": app["salary"],
        "linkedin": app["linkedin"],
        "portfolio": app["portfolio"],
        "notice": app["notice"],
        "resume": app["resume"],
        "message": app["message"],
        "role": app["role"],
        "jobId": app.get("jobId"),
        "status": app.get("status", "Applied"),
        "history": app.get("history", []),
        "isDeleted": app.get("isDeleted", False),
        "createdAt": app["createdAt"]
    }


# Insights CRUD operations
async def get_all_insights(published_only: bool = True, page: Optional[str] = None) -> List[dict]:
    """Retrieve all insights"""
    query = {}
    if published_only:
        query["published"] = True
    if page:
        query["page"] = page
        
    insights = []
    for insight in insights_collection.find(query).sort("createdAt", -1):
        insights.append(insight_helper(insight))
    return insights


async def get_insight_by_id(insight_id: str) -> Optional[dict]:
    """Retrieve a single insight by ID"""
    if not ObjectId.is_valid(insight_id):
        return None
    insight = insights_collection.find_one({"_id": ObjectId(insight_id)})
    if insight:
        return insight_helper(insight)
    return None


async def create_insight(insight_data: InsightCreate) -> dict:
    """Create a new insight"""
    insight_dict = insight_data.model_dump()
    insight_dict["createdAt"] = datetime.utcnow()
    insight_dict["updatedAt"] = datetime.utcnow()
    
    result = insights_collection.insert_one(insight_dict)
    new_insight = insights_collection.find_one({"_id": result.inserted_id})
    return insight_helper(new_insight)


async def update_insight(insight_id: str, insight_data: InsightUpdate) -> Optional[dict]:
    """Update an existing insight"""
    if not ObjectId.is_valid(insight_id):
        return None
    
    update_data = {k: v for k, v in insight_data.model_dump().items() if v is not None}
    if not update_data:
        return None
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = insights_collection.update_one(
        {"_id": ObjectId(insight_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 1:
        updated_insight = insights_collection.find_one({"_id": ObjectId(insight_id)})
        return insight_helper(updated_insight)
    return None


async def delete_insight(insight_id: str) -> bool:
    """Delete an insight"""
    if not ObjectId.is_valid(insight_id):
        return False
    
    result = insights_collection.delete_one({"_id": ObjectId(insight_id)})
    return result.deleted_count == 1


# Showcase CRUD operations
async def get_all_showcase_items(active_only: bool = True) -> List[dict]:
    """Retrieve all showcase items"""
    query = {}
    if active_only:
        query["active"] = True
        
    items = []
    for item in showcase_collection.find(query).sort("order", 1).sort("createdAt", -1):
        items.append(showcase_helper(item))
    return items


async def create_showcase_item(item_data: dict) -> dict:
    """Create a new showcase item"""
    item_dict = item_data.copy()
    item_dict["createdAt"] = datetime.utcnow()
    item_dict["updatedAt"] = datetime.utcnow()
    item_dict["likes"] = 0
    item_dict["views"] = 0
    
    result = showcase_collection.insert_one(item_dict)
    new_item = showcase_collection.find_one({"_id": result.inserted_id})
    return showcase_helper(new_item)


async def update_showcase_item(item_id: str, item_data: dict) -> Optional[dict]:
    """Update an existing showcase item"""
    if not ObjectId.is_valid(item_id):
        return None
    
    update_data = {k: v for k, v in item_data.items() if v is not None}
    if not update_data:
        return None
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = showcase_collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": update_data}
    )
    
    updated_item = showcase_collection.find_one({"_id": ObjectId(item_id)})
    if updated_item:
        return showcase_helper(updated_item)
    return None


async def delete_showcase_item(item_id: str) -> bool:
    """Delete a showcase item"""
    if not ObjectId.is_valid(item_id):
        return False
    
    result = showcase_collection.delete_one({"_id": ObjectId(item_id)})
    return result.deleted_count == 1


# Jobs CRUD operations
async def get_all_jobs(active_only: bool = True, include_archived: bool = False) -> List[dict]:
    """Retrieve all jobs"""
    query = {}
    if active_only:
        query["active"] = True
    if not include_archived:
        query["isArchived"] = {"$ne": True}
        
    jobs = []
    for job in jobs_collection.find(query).sort("createdAt", -1):
        jobs.append(job_helper(job))
    return jobs


async def get_job_by_id(job_id: str) -> Optional[dict]:
    """Retrieve a single job by ID"""
    if not ObjectId.is_valid(job_id):
        return None
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if job:
        return job_helper(job)
    return None


async def create_job(job_data: JobCreate) -> dict:
    """Create a new job"""
    job_dict = job_data.model_dump()
    job_dict["createdAt"] = datetime.utcnow()
    job_dict["updatedAt"] = datetime.utcnow()
    job_dict["isArchived"] = False
    
    result = jobs_collection.insert_one(job_dict)
    new_job = jobs_collection.find_one({"_id": result.inserted_id})
    return job_helper(new_job)


async def update_job(job_id: str, job_data: JobUpdate) -> Optional[dict]:
    """Update an existing job"""
    if not ObjectId.is_valid(job_id):
        return None
    
    update_data = {k: v for k, v in job_data.model_dump().items() if v is not None}
    if not update_data:
        return None
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": update_data}
    )
    
    updated_job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if updated_job:
        return job_helper(updated_job)
    return None


async def delete_job(job_id: str, permanent: bool = False) -> bool:
    """Soft delete or permanent delete a job"""
    if not ObjectId.is_valid(job_id):
        return False
    
    if permanent:
        result = jobs_collection.delete_one({"_id": ObjectId(job_id)})
        return result.deleted_count == 1
    else:
        result = jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"isArchived": True, "updatedAt": datetime.utcnow()}}
        )
        return result.modified_count == 1


# Application operations
async def create_job_application(app_data: JobApplicationCreate) -> dict:
    """Store a new job application"""
    app_dict = app_data.model_dump()
    app_dict["createdAt"] = datetime.utcnow()
    app_dict["status"] = "Applied"
    app_dict["isDeleted"] = False
    app_dict["history"] = [
        {
            "status": "Applied",
            "timestamp": datetime.utcnow(),
            "note": "Initial application submission"
        }
    ]
    
    result = applications_collection.insert_one(app_dict)
    new_app = applications_collection.find_one({"_id": result.inserted_id})
    return application_helper(new_app)


async def get_all_applications(include_deleted: bool = False) -> List[dict]:
    """Retrieve all job applications (admin only)"""
    query = {}
    if not include_deleted:
        query["isDeleted"] = {"$ne": True}
        
    apps = []
    for app in applications_collection.find(query).sort("createdAt", -1):
        apps.append(application_helper(app))
    return apps

async def update_application_status(app_id: str, status: str, note: Optional[str] = None) -> bool:
    """Update the status of a job application and log to history"""
    try:
        from bson import ObjectId
        history_entry = {
            "status": status,
            "timestamp": datetime.now(),
            "note": note or f"Status updated to {status}"
        }
        
        result = applications_collection.update_one(
            {"_id": ObjectId(app_id)},
            {
                "$set": {"status": status, "updatedAt": datetime.now()},
                "$push": {"history": history_entry}
            }
        )
        return result.modified_count > 0
    except:
        return False


async def delete_application(app_id: str, permanent: bool = False) -> bool:
    """Soft delete or permanent delete a job application"""
    try:
        from bson import ObjectId
        if permanent:
            result = applications_collection.delete_one({"_id": ObjectId(app_id)})
            return result.deleted_count > 0
        else:
            result = applications_collection.update_one(
                {"_id": ObjectId(app_id)},
                {"$set": {"isDeleted": True, "updatedAt": datetime.now()}}
            )
            return result.modified_count > 0
    except:
        return False


# User operations
async def get_user_by_username(username: str) -> Optional[dict]:
    """Retrieve a user by username"""
    user = users_collection.find_one({"username": username})
    if user:
        return user
    return None


async def create_user(user_data: UserCreate) -> dict:
    """Create a new user"""
    user_dict = user_data.model_dump()
    password = user_dict.pop("password")
    user_dict["passwordHash"] = get_password_hash(password)
    user_dict["createdAt"] = datetime.utcnow()
    
    result = users_collection.insert_one(user_dict)
    new_user = users_collection.find_one({"_id": result.inserted_id})
    return user_helper(new_user)


async def init_default_user():
    """Initialize a default admin user if none exists"""
    existing_user = await get_user_by_username("admin")
    if not existing_user:
        default_user = UserCreate(
            username="admin",
            email="admin@dreamatic.com",
            password="admin123",  # Change this in production!
            role="admin"
        )
        await create_user(default_user)
        print("Default admin user created: username='admin', password='admin123'")
    
    # Initialize showcase if empty
    if showcase_collection.count_documents({}) == 0:
        initial_items = [
            {
                "title": "Futuristic Fashion Editorial",
                "description": "A stunning AI-generated fashion look for SuperFiitter.",
                "mediaUrl": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1200&fit=crop",
                "mediaType": "image",
                "tag": "FASHION",
                "product": "SuperFiitter",
                "order": 1,
                "active": True,
                "size": "large"
            },
            {
                "title": "AI Customer Service Demo",
                "description": "Visual representation of EchoAI voice interactions.",
                "mediaUrl": "https://cdn.coverr.co/videos/coverr-woman-working-on-a-laptop-7467/1080p.mp4",
                "mediaType": "video",
                "tag": "VOICE AI",
                "product": "EchoAI",
                "order": 2,
                "active": True,
                "size": "medium"
            },
            {
                "title": "Virtual Try-On Experience",
                "description": "Real-time garment mapping sample.",
                "mediaUrl": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=500&fit=crop",
                "mediaType": "image",
                "tag": "RETAIL",
                "product": "SuperFiitter",
                "order": 3,
                "active": True,
                "size": "small"
            }
        ]
        for item in initial_items:
            await create_showcase_item(item)
        print("Initialized default showcase items")

    # Initialize jobs if empty
    if jobs_collection.count_documents({}) == 0:
        initial_jobs = [
            {
                "title": "Senior ML Engineer – Agent Orchestration",
                "team": "Core Platform",
                "location": "San Francisco / Remote (US)",
                "description": "Lead the development of our core agent orchestration engine.",
                "requirements": "5+ years of experience in ML, expertise in Python and PyTorch.",
                "type": "Full-time",
                "active": True
            },
            {
                "title": "Research Scientist – Multi-Agent Systems",
                "team": "AI Research",
                "location": "San Francisco",
                "description": "Conduct cutting-edge research on multi-agent collaboration and safety.",
                "requirements": "PhD in AI/ML, publication record in top-tier conferences.",
                "type": "Full-time",
                "active": True
            },
            {
                "title": "Full-Stack Engineer – Voice Infrastructure",
                "team": "EchoAI",
                "location": "Hybrid",
                "description": "Build scalable infrastructure for real-time voice AI interactions.",
                "requirements": "Proficiency in Vue.js, Node.js, and real-time streaming protocols.",
                "type": "Full-time",
                "active": True
            }
        ]
        for job in initial_jobs:
            await create_job(JobCreate(**job))
        print("Initialized default jobs")
