from pymongo import MongoClient
from datetime import datetime
from typing import List, Optional
from bson import ObjectId
import os
from dotenv import load_dotenv
from models import (
    InsightCreate, InsightUpdate, 
    UserCreate, 
    JobCreate, JobUpdate, JobApplicationCreate,
    ResearchCreate, ResearchUpdate
)
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
research_collection = db["research"]


# Helper function to convert ObjectId to string
def insight_helper(insight) -> dict:
    return {
        "_id": str(insight["_id"]),
        "title": insight.get("title", ""),
        "excerpt": insight.get("excerpt", ""),
        "content": insight.get("content", ""),
        "author": insight.get("author", "DREAMATIC Team"),
        "imageUrl": insight.get("imageUrl"),
        "page": insight.get("page", "ai-work"),
        "published": insight.get("published", True),
        "createdAt": insight.get("createdAt", datetime.utcnow()),
        "updatedAt": insight.get("updatedAt", datetime.utcnow())
    }


def research_helper(res) -> dict:
    return {
        "_id": str(res["_id"]),
        "title": res.get("title", ""),
        "journal": res.get("journal", ""),
        "year": res.get("year", ""),
        "authors": res.get("authors", ""),
        "excerpt": res.get("excerpt", ""),
        "abstract": res.get("abstract", ""),
        "content": res.get("content", ""),
        "imageUrl": res.get("imageUrl"),
        "pdfUrl": res.get("pdfUrl"),
        "linkType": res.get("linkType", "download"),
        "published": res.get("published", True),
        "createdAt": res.get("createdAt"),
        "updatedAt": res.get("updatedAt")
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
        "createdAt": item.get("createdAt", datetime.utcnow()),
        "updatedAt": item.get("updatedAt", datetime.utcnow())
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
        "title": job.get("title", ""),
        "team": job.get("team", ""),
        "location": job.get("location", ""),
        "description": job.get("description", ""),
        "requirements": job.get("requirements", ""),
        "company": job.get("company", "DREAMATIC"),
        "tags": job.get("tags", ""),
        "type": job.get("type", "Full-time"),
        "active": job.get("active", True),
        "isArchived": job.get("isArchived", False),
        "createdAt": job.get("createdAt"),
        "updatedAt": job.get("updatedAt")
    }


def application_helper(app) -> dict:
    return {
        "_id": str(app["_id"]),
        "name": app.get("name", ""),
        "email": app.get("email", ""),
        "phone": app.get("phone", ""),
        "location": app.get("location", ""),
        "experience": app.get("experience", ""),
        "salary": app.get("salary", ""),
        "linkedin": app.get("linkedin", ""),
        "portfolio": app.get("portfolio", ""),
        "notice": app.get("notice", ""),
        "resume": app.get("resume", ""),
        "message": app.get("message", ""),
        "role": app.get("role", ""),
        "jobId": app.get("jobId"),
        "status": app.get("status", "Applied"),
        "history": app.get("history", []),
        "isDeleted": app.get("isDeleted", False),
        "createdAt": app.get("createdAt")
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


# Research CRUD operations
async def get_all_research(published_only: bool = True) -> List[dict]:
    """Retrieve all research publications"""
    query = {}
    if published_only:
        query["published"] = True
        
    papers = []
    for paper in research_collection.find(query).sort("createdAt", -1):
        papers.append(research_helper(paper))
    return papers


async def get_research_by_id(res_id: str) -> Optional[dict]:
    """Retrieve a single research paper by ID"""
    if not ObjectId.is_valid(res_id):
        return None
    res = research_collection.find_one({"_id": ObjectId(res_id)})
    if res:
        return research_helper(res)
    return None


async def create_research(res_data: ResearchCreate) -> dict:
    """Create a new research paper"""
    res_dict = res_data.model_dump()
    res_dict["createdAt"] = datetime.utcnow()
    res_dict["updatedAt"] = datetime.utcnow()
    
    result = research_collection.insert_one(res_dict)
    new_res = research_collection.find_one({"_id": result.inserted_id})
    return research_helper(new_res)


async def update_research(res_id: str, res_data: ResearchUpdate) -> Optional[dict]:
    """Update an existing research paper"""
    if not ObjectId.is_valid(res_id):
        return None
    
    update_data = {k: v for k, v in res_data.model_dump().items() if v is not None}
    if not update_data:
        return None
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = research_collection.update_one(
        {"_id": ObjectId(res_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 1 or result.matched_count == 1:
        updated_res = research_collection.find_one({"_id": ObjectId(res_id)})
        return research_helper(updated_res)
    return None


async def delete_research(res_id: str) -> bool:
    """Delete a research paper"""
    if not ObjectId.is_valid(res_id):
        return False
    
    result = research_collection.delete_one({"_id": ObjectId(res_id)})
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


async def restore_application(app_id: str) -> bool:
    """Restore a soft-deleted job application"""
    try:
        from bson import ObjectId
        history_entry = {
            "status": "Applied",
            "timestamp": datetime.now(),
            "note": "Candidate node reconstituted from archive/deletion."
        }
        result = applications_collection.update_one(
            {"_id": ObjectId(app_id)},
            {
                "$set": {"isDeleted": False, "status": "Applied", "updatedAt": datetime.now()},
                "$push": {"history": history_entry}
            }
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

# Global Search
async def global_search(query: str) -> List[dict]:
    """Search across multiple collections for a matching keyword"""
    results = []
    
    # 1. Search Insights (Blog/Hub)
    insights_query = {
        "published": True,
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"excerpt": {"$regex": query, "$options": "i"}},
            {"content": {"$regex": query, "$options": "i"}}
        ]
    }
    for item in insights_collection.find(insights_query).limit(4):
        results.append({
            "type": "insight",
            "id": str(item["_id"]),
            "title": item["title"],
            "description": item["excerpt"],
            "url": "/resources/hub", # Logic to handle scroll to or modal open
            "category": item.get("page", "General").replace("-", " ").title()
        })

    # 2. Search Research
    research_query = {
        "published": True,
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"authors": {"$regex": query, "$options": "i"}},
            {"abstract": {"$regex": query, "$options": "i"}},
            {"journal": {"$regex": query, "$options": "i"}}
        ]
    }
    for item in research_collection.find(research_query).limit(4):
        results.append({
            "type": "research",
            "id": str(item["_id"]),
            "title": item["title"],
            "description": f"{item['authors']} • {item['journal']} ({item['year']})",
            "url": "/resources/research",
            "category": "Research"
        })

    # 3. Search Jobs
    jobs_query = {
        "active": True,
        "isArchived": {"$ne": True},
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"team": {"$regex": query, "$options": "i"}},
            {"location": {"$regex": query, "$options": "i"}}
        ]
    }
    for item in jobs_collection.find(jobs_query).limit(4):
        results.append({
            "type": "job",
            "id": str(item["_id"]),
            "title": item["title"],
            "description": f"{item['team']} • {item['location']} ({item.get('type', 'Full-time')})",
            "url": "/company/careers",
            "category": "Careers"
        })
        
    return results


# Page Config Operations
pages_collection = db["pages"]

def page_config_helper(page) -> dict:
    return {
        "_id": str(page["_id"]),
        "page_id": page.get("page_id", "unknown"),
        # These are optional — modular/custom pages may not have hero fields
        "hero_badge": page.get("hero_badge"),
        "hero_title": page.get("hero_title"),
        "hero_subtitle": page.get("hero_subtitle"),
        "solutions": page.get("solutions", []),
        "approaches": page.get("approaches", []),
        "values": page.get("values", []),
        "stats": page.get("stats", []),
        "team": page.get("team", []),
        "advisors": page.get("advisors", []),
        "perks": page.get("perks", []),
        # Modular page fields
        "content": page.get("content", []),
        "theme": page.get("theme", {}),
        "isCustom": page.get("isCustom", False),
        "label": page.get("label"),
        "path": page.get("path"),
        "visible": page.get("visible", True),
        "group": page.get("group"),
        "updatedAt": page.get("updatedAt", datetime.utcnow())
    }

async def get_page_config(page_id: str) -> Optional[dict]:
    page = pages_collection.find_one({"page_id": page_id})
    if page:
        return page_config_helper(page)
    return None

async def upsert_page_config(page_id: str, config_data: dict) -> dict:
    config_data["updatedAt"] = datetime.utcnow()
    result = pages_collection.update_one(
        {"page_id": page_id},
        {"$set": config_data},
        upsert=True
    )
    new_page = pages_collection.find_one({"page_id": page_id})
    return page_config_helper(new_page)


async def get_all_custom_pages() -> list:
    """Retrieve all custom (modular) pages from the database"""
    pages = []
    for page in pages_collection.find({"isCustom": True}):
        pages.append(page_config_helper(page))
    return pages


async def delete_page_config(page_id: str) -> bool:
    """Delete a page configuration from the database"""
    result = pages_collection.delete_one({"page_id": page_id})
    return result.deleted_count == 1

# Add to init_default_user or call separately
async def init_default_pages():
    if pages_collection.count_documents({}) == 0:
        default_work = {
            "page_id": "ai-work",
            "hero_badge": "AI FOR WORK",
            "hero_title": "Beyond Automation: Orchestrating the Agentic Frontier",
            "hero_subtitle": "Transform your enterprise into a living neural ecosystem. Eliminate data silos, automate complex reasoning, and deploy autonomous agent swarms that think, learn, and scale with your mission.",
            "solutions": [
                { 
                    "id": 1, 
                    "title": "Conversational AI", 
                    "subtitle": "Custom Chatbots",
                    "description": "Build intelligent conversational interfaces that understand context, intent, and sentiment to deliver human-like interactions at scale.",
                    "features": ["Natural language understanding", "Multi-turn conversations", "Sentiment analysis"],
                    "accent": "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
                },
                { 
                    "id": 2, 
                    "title": "Agentic AI", 
                    "subtitle": "Autonomous Systems",
                    "description": "Deploy self-directed AI agents that can plan, execute, and adapt to achieve complex goals without constant human oversight.",
                    "features": ["Goal-oriented planning", "Self-correction", "Tool integration"],
                    "accent": "linear-gradient(135deg, #8b5cf6 0% , #ec4899 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="3"/></svg>'
                },
                { 
                    "id": 3, 
                    "title": "Generative AI", 
                    "subtitle": "Content Creation",
                    "description": "Generate high-quality text, code, and creative content using state-of-the-art language models fine-tuned for your domain.",
                    "features": ["Text generation", "Code synthesis", "Creative writing"],
                    "accent": "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
                },
                { 
                    "id": 4, 
                    "title": "Image & Video AI", 
                    "subtitle": "Visual Models",
                    "description": "Process, analyze, and generate visual content with advanced computer vision and generative models for images and video.",
                    "features": ["Object detection", "Image generation", "Video analysis"],
                    "accent": "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
                },
                { 
                    "id": 5, 
                    "title": "Predictive Analytics", 
                    "subtitle": "Forecasting",
                    "description": "Leverage machine learning to forecast trends, predict outcomes, and make data-driven decisions with confidence intervals.",
                    "features": ["Time-series forecasting", "Anomaly detection", "Risk assessment"],
                    "accent": "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
                },
                { 
                    "id": 6, 
                    "title": "Recommendation", 
                    "subtitle": "Personalization",
                    "description": "Deliver personalized experiences with recommendation engines that learn user preferences and adapt in real-time.",
                    "features": ["Collaborative filtering", "Content-based matching", "Real-time personalization"],
                    "accent": "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
                },
                { 
                    "id": 7, 
                    "title": "Knowledge Graphs", 
                    "subtitle": "RAG Systems",
                    "description": "Build retrieval-augmented generation systems that combine structured knowledge graphs with LLMs for accurate, grounded responses.",
                    "features": ["Semantic search", "Entity extraction", "Context retrieval"],
                    "accent": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/></svg>'
                },
                { 
                    "id": 8, 
                    "title": "AI Automation", 
                    "subtitle": "Workflow Intelligence",
                    "description": "Automate complex business processes with intelligent workflows that adapt to changing conditions and optimize for efficiency.",
                    "features": ["Process mining", "Smart routing", "Adaptive optimization"],
                    "accent": "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
                }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_service = {
            "page_id": "ai-service",
            "hero_badge": "AI FOR SERVICE",
            "hero_title": "Elevating Experience through Cognitive Media",
            "hero_subtitle": "From multi-modal intelligence to hyper-realistic digital personas. We build the infrastructure that transforms how brands interact, visualize, and scale.",
            "solutions": [
                { "id": 1, "title": "Multi-Modal Training", "subtitle": "Media Intelligence", "description": "Custom neural architectures trained to process and synchronize audio, video, and text for unified comprehension.", "features": ["Synchronized reasoning", "Context-aware indexing", "Semantic search"], "accent": "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="3"/></svg>' },
                { "id": 2, "title": "3D CGI Design", "subtitle": "Automated Visualization", "description": "Procedural generation of high-fidelity 3D assets and environments for architectural and creative industries.", "features": ["Real-time rendering", "Asset automation", "Spatial reasoning"], "accent": "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
                { "id": 3, "title": "Real Estate Vis", "subtitle": "Property Showcasing", "description": "Photorealistic virtual staging and immersive tours that transform property marketing through spatial AI.", "features": ["Virtual staging", "Lighting simulation", "Immersive tours"], "accent": "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' },
                { "id": 4, "title": "Interior Design AI", "subtitle": "Smart Interiors", "description": "Intelligence-driven space planning and aesthetic optimization tailored to architectural constraints and user preference.", "features": ["Layout optimization", "Curation engine", "Material synthesis"], "accent": "linear-gradient(135deg, #14b8a6 0%, #4ade80 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM3 9h18M9 3v18"/></svg>' },
                { "id": 5, "title": "Media Production", "subtitle": "Content Acceleration", "description": "Automated post-production workflows that eliminate technical bottlenecks in the creative process.", "features": ["Auto-grading", "Scene reconstruction", "Asset management"], "accent": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>' },
                { "id": 6, "title": "AI Avatars", "subtitle": "Digital Personas", "description": "Hyper-realistic digital twins capable of autonomous interaction and natural emotional expression.", "features": ["Natural voice synthesis", "Action mapping", "Memory persistence"], "accent": "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
                { "id": 7, "title": "Product Renders", "subtitle": "E-commerce Visuals", "description": "Studio-quality product visualization at scale, replacing traditional sets with generative photography.", "features": ["Multi-angle generation", "Dynamic lighting", "Variant automation"], "accent": "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
                { "id": 8, "title": "Analytics AI", "subtitle": "Business Insights", "description": "Transforming consumer interaction data into predictive intelligence for strategic growth.", "features": ["Behavioral mapping", "Trend forecasting", "ROI attribution"], "accent": "linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>' }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_enterprise = {
            "page_id": "ai-enterprise",
            "hero_badge": "AI FOR ENTERPRISE",
            "hero_title": "Omniscient Scale: The Self-Driving Enterprise",
            "hero_subtitle": "Engineered for global leaders. Orchestrate billions of parameters with enterprise-grade security, multi-agent swarms, and sovereign infrastructure that evolves with your business logic.",
            "solutions": [
                { "id": 1, "title": "Visualizer", "subtitle": "Data Imaging", "description": "Transform complex enterprise data into hyper-immersive visual narratives. Real-time rendering of large-scale dataset structures.", "features": ["Infinite zoom rendering", "Neural voxel clusters", "Interactive data topology"], "accent": "linear-gradient(135deg, #10B981 0%, #059669 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
                { "id": 2, "title": "3D Design", "subtitle": "Spatial Intelligence", "description": "Automated 3D environment generation for product simulation, architectural pre-viz, and industrial digital twins.", "features": ["Physics-aware synthesis", "LIDAR-to-Mesh pipeline", "Real-time Raytracing"], "accent": "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
                { "id": 3, "title": "Real Estate", "subtitle": "Property Intelligence", "description": "Global property analysis and photorealistic virtual staging agents that scale property management across continents.", "features": ["Automated valuation swarms", "Virtual light simulation", "Market sentiment mapping"], "accent": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
                { "id": 4, "title": "Virtual Tour", "subtitle": "Mapping & Telepresence", "description": "Deploy 6DOF immersive tours for industrial sites, retail showrooms, and distributed headquarters with neural stitching.", "features": ["6-Degrees of Freedom", "Neural point cloud sync", "Multi-user telepresence"], "accent": "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' },
                { "id": 5, "title": "Interior AI", "subtitle": "Smart Design Systems", "description": "Autonomous spatial planning for enterprise offices, retail layouts, and industrial floor optimization using generative logic.", "features": ["Constraint-based routing", "Ergonomic heatmaps", "Auto-material sourcing"], "accent": "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M9 8h6M9 12h6M9 16h6M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>' },
                { "id": 6, "title": "Planning", "subtitle": "Strategy & Orchestration", "description": "High-level multi-agent orchestration for corporate strategy, board-level forecasting, and scenario modeling.", "features": ["Monte Carlo swarms", "Competitive game theory", "Recursive goal planning"], "accent": "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>' },
                { "id": 7, "title": "Finance AI", "subtitle": "Risk & Forecasting", "description": "Sovereign financial models for real-time risk assessment, automated hedging, and synthetic market simulations.", "features": ["Predictive liquidity", "Neural fraud detection", "Zero-latency execution"], "accent": "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
                { "id": 8, "title": "Logistics", "subtitle": "Neural Routing", "description": "Autonomous global supply chain routing. Agent swarms that manage port delays, fuel optimization, and fleet logic.", "features": ["Dynamic pathfinding", "Fleet consciousness", "Intermodal sync"], "accent": "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)", "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_superfitter = {
            "page_id": "superfiitter",
            "hero_badge": "AI VIRTUAL TRY-ON",
            "hero_title": "SuperFiitter Real-Time",
            "hero_subtitle": "Transform online shopping into an immersive experience. SuperFiitter enables real-time rendering for deeper customer engagement and confident digital interaction.",
            "solutions": [
                { 
                    "id": 1, "title": "Real-Time Rendering", "subtitle": "Core Engine", 
                    "description": "Instantaneous processing and visualization through high-performance rendering pipelines.", 
                    "features": ["60fps WebGL", "Ray-tracing Support", "Texture Streaming"], 
                    "accent": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
                },
                { 
                    "id": 2, "title": "Motion Understanding", "subtitle": "Vision AI", 
                    "description": "Advanced AI detects posture and movement to align products realistically across all frames.", 
                    "features": ["Pose Estimation", "Cloth Simulation", "Physics Engine"], 
                    "accent": "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
                },
                { 
                    "id": 3, "title": "Visual Fidelity", "subtitle": "Neural Texture", 
                    "description": "High-resolution neural texture mapping that replicates fabric weight, translucency, and drape.", 
                    "features": ["Subsurface Scattering", "Micro-details", "Light Interaction"], 
                    "accent": "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
                },
                { 
                    "id": 4, "title": "Body Mapping", "subtitle": "Precision Fit", 
                    "description": "Extracts precise body measurements from simple 2D images for accurate sizing recommendations.", 
                    "features": ["98% Accuracy", "Privacy First", "Instant Analysis"], 
                    "accent": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
                }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_echoai = {
            "page_id": "echo-ai",
            "hero_badge": "AI VOICE & AUTONOMOUS AGENTS",
            "hero_title": "EchoAI Voice Intelligence",
            "hero_subtitle": "The next evolution in voice intelligence and autonomous BPO automation. Deploy self-learning voice agents that handle complex conversational workflows with human-parity precision.",
            "solutions": [
                { 
                    "id": 1, "title": "AI Voice Calling", "subtitle": "Human Parity", 
                    "description": "Ultra-low latency, human-parity voice synthesis for high-volume customer support operations.", 
                    "features": ["<500ms Latency", "Multi-speaker Support", "Emotion synthesis"], 
                    "accent": "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>'
                },
                { 
                    "id": 2, "title": "Autonomous Agents", "subtitle": "Reasoning Engine", 
                    "description": "Context-aware reasoning engines that handle complex multi-turn inquiries independently.", 
                    "features": ["Memory persistence", "Goal-oriented", "Self-correction"], 
                    "accent": "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
                },
                { 
                    "id": 3, "title": "Enterprise Sync", "subtitle": "Integration", 
                    "description": "Unified task orchestration that replaces manual processes with intelligent agent chains.", 
                    "features": ["CRM Integration", "Live Data Sync", "Secure Handoff"], 
                    "accent": "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="10" y1="14" x2="21" y2="3"/><polyline points="8 21 3 21 3 16"/><line x1="3" y1="21" x2="14" y2="10"/></svg>'
                },
                { 
                    "id": 4, "title": "Sentiment Analysis", "subtitle": "Real-time Intelligence", 
                    "description": "Live monitoring of conversation sentiment with automated escalation and risk detection.", 
                    "features": ["Live Dashboard", "Risk Alerts", "Trend Analysis"], 
                    "accent": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                    "icon": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
                }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_about = {
            "page_id": "about",
            "hero_badge": "OUR MISSION",
            "hero_title": "Building the Agentic OS",
            "hero_subtitle": "We are engineering the operating system for the next generation of work. Deploy, orchestrate, and scale autonomous AI agents that act as trusted team members across your entire enterprise.",
            "approaches": [
                {
                    "title": "Design",
                    "description": "We architect modular agentic workflows with explainability and human-in-the-loop precision at their core.",
                    "accent": "rgba(99, 102, 241, 0.1)",
                    "icon": '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
                },
                {
                    "title": "Deploy",
                    "description": "Our Agentic OS integrates seamlessly with your infrastructure, enabling production readiness in days.",
                    "accent": "rgba(59, 130, 246, 0.1)",
                    "icon": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'
                },
                {
                    "title": "Scale",
                    "description": "Orchestrate global swarms of specialized agents that learn and adapt, delivering exponential efficiency.",
                    "accent": "rgba(16, 185, 129, 0.1)",
                    "icon": '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
                }
            ],
            "values": [
                { 
                    "id": 1, 
                    "title": "Agent-First", 
                    "subtitle": "Architecture",
                    "description": "We build systems where AI agents are first-class citizens, capable of independent decision-making and learning.",
                    "features": ["Independent Reasoning", "Outcome Learning", "Human Collaboration"],
                    "accent": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                },
                { 
                    "id": 2, 
                    "title": "Reliability", 
                    "subtitle": "Enterprise Grade",
                    "description": "Infrastructure built for mission-critical operations with uptime, security, and certifications that define industry standards.",
                    "features": ["99.99% Uptime", "SOC2 Compliance", "Zero-Trust Security"],
                    "accent": "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                },
                { 
                    "id": 3, 
                    "title": "Responsible AI", 
                    "subtitle": "Ethical Core",
                    "description": "Integrating explainability, auditability, and ethical guardrails into every layer of our platform.",
                    "features": ["Full Transparency", "Bias Mitigation", "Audit Trails"],
                    "accent": "linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
                },
                { 
                    "id": 4, 
                    "title": "Scalability", 
                    "subtitle": "Global Reach",
                    "description": "Designed to scale intelligence as easily as compute, handling millions of complex concurrent tasks.",
                    "features": ["Elastic Compute", "Global Edge", "Infinite Scale"],
                    "accent": "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                }
            ],
            "stats": [
                { "val": "99%", "lbl": "Reliability" },
                { "val": "10M+", "lbl": "Tasks Automated" },
                { "val": "Global", "lbl": "Infrastructure" }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_leadership = {
            "page_id": "leadership",
            "hero_badge": "OUR LEADERSHIP",
            "hero_title": "The Team Building Tomorrow",
            "hero_subtitle": "Our founding team combines decades of experience from leading AI research labs, enterprise software companies, and Fortune 500 digital transformations.",
            "team": [
                {
                    "name": "Dr. Amara Singh",
                    "role": "Chief Executive Officer & Co-Founder",
                    "initials": "AS",
                    "bio": "Former Director of AI Strategy at Microsoft Azure. PhD in Computer Science from Stanford. Led enterprise AI deployments serving 50M+ users.",
                    "accent": "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300"
                },
                {
                    "name": "James Chen",
                    "role": "Chief Technology Officer & Co-Founder",
                    "initials": "JC",
                    "bio": "Ex-Principal Engineer at Google DeepMind. Pioneered multi-agent reinforcement learning systems. 15+ publications in top AI conferences.",
                    "accent": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300"
                },
                {
                    "name": "Sarah Okonkwo",
                    "role": "VP of Product & Design",
                    "initials": "SO",
                    "bio": "Previously led Product at Anthropic. Expert in human-AI interaction and enterprise UX. Built products used by 500+ Fortune 1000 companies.",
                    "accent": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300"
                }
            ],
            "advisors": [
                { "name": "Prof. Geoffrey Hinton", "position": "Turing Award Winner, AI Pioneer" },
                { "name": "Marc Andreessen", "position": "Co-Founder, Andreessen Horowitz" },
                { "name": "Dr. Fei-Fei Li", "position": "Professor of CS, Stanford | Co-Director, HAI" }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_careers = {
            "page_id": "careers",
            "hero_badge": "CAREERS",
            "hero_title": "Build the Future of Enterprise AI",
            "hero_subtitle": "Join a team solving some of the hardest problems in artificial intelligence—from real-time agent orchestration to neural architecture optimization. We offer competitive compensation, significant equity, and the opportunity to shape how Fortune 500 companies deploy autonomous AI at scale.",
            "perks": [
                {
                    "title": "Competitive Compensation",
                    "description": "Top-of-market salaries, significant equity grants, and comprehensive benefits.",
                    "icon": '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
                },
                {
                    "title": "Cutting-Edge Research",
                    "description": "Work on problems published in top-tier conferences. Access to state-of-the-art compute.",
                    "icon": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
                },
                {
                    "title": "World-Class Team",
                    "description": "Collaborate with former researchers and engineers from Google DeepMind, OpenAI, and leading labs.",
                    "icon": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'
                }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_hub = {
            "page_id": "hub",
            "hero_badge": "RESOURCE HUB",
            "hero_title": "The Complete Agentic Intelligence Library",
            "hero_subtitle": "From technical implementation guides to strategic enterprise playbooks, access the comprehensive resource library trusted by AI teams at Fortune 500 companies.",
            "stats": [
                { "name": "Implementation Guides", "desc": "Step-by-step tutorials for deploying voice agents...", "count": "42", "icon": "" },
                { "name": "Enterprise Playbooks", "desc": "Strategic frameworks for scaling AI agents...", "count": "28", "icon": "" }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_research = {
            "page_id": "research",
            "hero_badge": "THE LAB",
            "hero_title": "Advancing the Science of Autonomous AI",
            "hero_subtitle": "Our research team publishes at top-tier AI conferences and collaborates with leading academic institutions.",
            "approaches": [
                { "name": "Multi-Agent Coordination", "tag": "Foundational", "desc": "Developing scalable algorithms...", "icon": "" },
                { "name": "Explainable AI", "tag": "Governance", "desc": "Building interpretability layers...", "icon": "" }
            ],
            "updatedAt": datetime.utcnow()
        }

        default_blog = {
            "page_id": "blog",
            "hero_badge": "AGENTIC BLOG",
            "hero_title": "Insights from the Frontier of AI",
            "hero_subtitle": "Strategic analysis and technical deep-dives into the future of autonomous systems.",
            "updatedAt": datetime.utcnow()
        }

        pages_collection.insert_many([default_work, default_service, default_enterprise, default_superfitter, default_echoai, default_about, default_leadership, default_careers, default_hub, default_research, default_blog])
        print("Initialized default page configs (Work, Service, Enterprise, SuperFiitter, EchoAI, About, Leadership, Careers, Hub, Research, Blog)")
