import contextlib
import aiosqlite
import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Union
from dotenv import load_dotenv
from models import (
    InsightCreate, InsightUpdate, 
    UserCreate, 
    JobCreate, JobUpdate, JobApplicationCreate,
    ResearchCreate, ResearchUpdate
)
from auth import get_password_hash

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(__file__), "dreamatic.db")

# Helper functions to convert SQLite rows to dictionaries
def row_to_dict(row, cursor):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}

def insight_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    # Cast published to bool
    res["published"] = bool(res["published"])
    return res

def research_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    res["published"] = bool(res["published"])
    return res

def showcase_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    res["active"] = bool(res["active"])
    return res

def user_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    return res

def job_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    res["active"] = bool(res["active"])
    res["isArchived"] = bool(res["isArchived"])
    return res

def application_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    res["isDeleted"] = bool(res["isDeleted"])
    if isinstance(res.get("history"), str):
        res["history"] = json.loads(res["history"])
    return res

def page_config_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    res["isCustom"] = bool(res["isCustom"])
    res["visible"] = bool(res["visible"])
    
    # Parse JSON fields
    json_fields = ["solutions", "approaches", "values", "stats", "team", "advisors", "perks", "content", "theme"]
    for field in json_fields:
        if isinstance(res.get(field), str):
            res[field] = json.loads(res[field])
    return res

def credential_helper(data) -> dict:
    if not data: return None
    res = dict(data)
    res["_id"] = res.pop("id")
    if isinstance(res.get("transports"), str):
        res["transports"] = json.loads(res["transports"])
    return res

# Database connection manager
@contextlib.asynccontextmanager
async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db

# --- Insights CRUD ---
async def get_all_insights(published_only: bool = True, page: Optional[str] = None) -> List[dict]:
    async with get_db() as db:
        query = "SELECT * FROM insights"
        params = []
        conditions = []
        if published_only:
            conditions.append("published = 1")
        if page:
            conditions.append("page = ?")
            params.append(page)
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        query += " ORDER BY createdAt DESC"
        
        async with db.execute(query, params) as cursor:
            rows = await cursor.fetchall()
            return [insight_helper(row) for row in rows]

async def get_insight_by_id(insight_id: str) -> Optional[dict]:
    async with get_db() as db:
        async with db.execute("SELECT * FROM insights WHERE id = ?", (insight_id,)) as cursor:
            row = await cursor.fetchone()
            return insight_helper(row)

async def create_insight(insight_data: InsightCreate) -> dict:
    new_id = str(uuid.uuid4())
    data = insight_data.model_dump()
    now = datetime.utcnow().isoformat()
    
    async with get_db() as db:
        await db.execute("""
            INSERT INTO insights (id, title, excerpt, content, author, imageUrl, page, published, journal, year, authors, pdfUrl, linkType, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            new_id, data["title"], data["excerpt"], data["content"], data.get("author", "DREAMATIC Team"),
            data.get("imageUrl"), data.get("page", "ai-work"), 1 if data.get("published", True) else 0,
            data.get("journal"), data.get("year"), data.get("authors"), data.get("pdfUrl"),
            data.get("linkType", "download"), now, now
        ))
        await db.commit()
    return await get_insight_by_id(new_id)

async def update_insight(insight_id: str, insight_data: InsightUpdate) -> Optional[dict]:
    async with get_db() as db:
        update_dict = {k: v for k, v in insight_data.model_dump().items() if v is not None}
        if not update_dict: return await get_insight_by_id(insight_id)
        
        query = "UPDATE insights SET "
        params = []
        for k, v in update_dict.items():
            if k == "published": v = 1 if v else 0
            query += f"{k} = ?, "
            params.append(v)
        
        query += "updatedAt = ? WHERE id = ?"
        params.extend([datetime.utcnow().isoformat(), insight_id])
        
        await db.execute(query, params)
        await db.commit()
    return await get_insight_by_id(insight_id)

async def delete_insight(insight_id: str) -> bool:
    async with get_db() as db:
        result = await db.execute("DELETE FROM insights WHERE id = ?", (insight_id,))
        await db.commit()
        return result.rowcount > 0

# --- Research CRUD ---
async def get_all_research(published_only: bool = True) -> List[dict]:
    async with get_db() as db:
        query = "SELECT * FROM research"
        if published_only:
            query += " WHERE published = 1"
        query += " ORDER BY createdAt DESC"
        async with db.execute(query) as cursor:
            rows = await cursor.fetchall()
            return [research_helper(row) for row in rows]

async def get_research_by_id(res_id: str) -> Optional[dict]:
    async with get_db() as db:
        async with db.execute("SELECT * FROM research WHERE id = ?", (res_id,)) as cursor:
            row = await cursor.fetchone()
            return research_helper(row)

async def create_research(res_data: ResearchCreate) -> dict:
    new_id = str(uuid.uuid4())
    data = res_data.model_dump()
    now = datetime.utcnow().isoformat()
    async with get_db() as db:
        await db.execute("""
            INSERT INTO research (id, title, journal, year, authors, excerpt, abstract, content, imageUrl, pdfUrl, linkType, published, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            new_id, data["title"], data["journal"], data["year"], data["authors"], data["excerpt"],
            data.get("abstract"), data["content"], data.get("imageUrl"), data.get("pdfUrl"),
            data.get("linkType", "download"), 1 if data.get("published", True) else 0, now, now
        ))
        await db.commit()
    return await get_research_by_id(new_id)

async def update_research(res_id: str, res_data: ResearchUpdate) -> Optional[dict]:
    async with get_db() as db:
        update_dict = {k: v for k, v in res_data.model_dump().items() if v is not None}
        if not update_dict: return await get_research_by_id(res_id)
        query = "UPDATE research SET "
        params = []
        for k, v in update_dict.items():
            if k == "published": v = 1 if v else 0
            query += f"{k} = ?, "
            params.append(v)
        query += "updatedAt = ? WHERE id = ?"
        params.extend([datetime.utcnow().isoformat(), res_id])
        await db.execute(query, params)
        await db.commit()
    return await get_research_by_id(res_id)

async def delete_research(res_id: str) -> bool:
    async with get_db() as db:
        result = await db.execute("DELETE FROM research WHERE id = ?", (res_id,))
        await db.commit()
        return result.rowcount > 0

# --- Showcase CRUD ---
async def get_all_showcase_items(active_only: bool = True) -> List[dict]:
    async with get_db() as db:
        query = "SELECT * FROM showcase"
        if active_only:
            query += " WHERE active = 1"
        query += " ORDER BY `order` ASC, createdAt DESC"
        async with db.execute(query) as cursor:
            rows = await cursor.fetchall()
            return [showcase_helper(row) for row in rows]

async def create_showcase_item(item_data: dict) -> dict:
    new_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    async with get_db() as db:
        await db.execute("""
            INSERT INTO showcase (id, title, description, mediaUrl, mediaType, tag, product, `order`, active, size, likes, views, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            new_id, item_data["title"], item_data.get("description"), item_data["mediaUrl"],
            item_data["mediaType"], item_data["tag"], item_data["product"], item_data.get("order", 0),
            1 if item_data.get("active", True) else 0, item_data.get("size", "medium"),
            item_data.get("likes", 0), item_data.get("views", 0), now, now
        ))
        await db.commit()
    async with get_db() as db:
        async with db.execute("SELECT * FROM showcase WHERE id = ?", (new_id,)) as cursor:
            return showcase_helper(await cursor.fetchone())

async def update_showcase_item(item_id: str, item_data: dict) -> Optional[dict]:
    async with get_db() as db:
        update_dict = {k: v for k, v in item_data.items() if v is not None}
        if not update_dict: 
            async with db.execute("SELECT * FROM showcase WHERE id = ?", (item_id,)) as cursor:
                return showcase_helper(await cursor.fetchone())
        query = "UPDATE showcase SET "
        params = []
        for k, v in update_dict.items():
            if k in ["active"]: v = 1 if v else 0
            query += f"`{k}` = ?, "
            params.append(v)
        query += "updatedAt = ? WHERE id = ?"
        params.extend([datetime.utcnow().isoformat(), item_id])
        await db.execute(query, params)
        await db.commit()
    async with get_db() as db:
        async with db.execute("SELECT * FROM showcase WHERE id = ?", (item_id,)) as cursor:
            return showcase_helper(await cursor.fetchone())

async def delete_showcase_item(item_id: str) -> bool:
    async with get_db() as db:
        result = await db.execute("DELETE FROM showcase WHERE id = ?", (item_id,))
        await db.commit()
        return result.rowcount > 0

# --- Users CRUD ---
async def get_user_by_username(username: str) -> Optional[dict]:
    async with get_db() as db:
        async with db.execute("SELECT * FROM users WHERE username = ?", (username,)) as cursor:
            row = await cursor.fetchone()
            return user_helper(row) if row else None

async def create_user(user_data: UserCreate) -> dict:
    new_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    async with get_db() as db:
        await db.execute("""
            INSERT INTO users (id, username, email, passwordHash, role, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            new_id, user_data.username, user_data.email, get_password_hash(user_data.password),
            user_data.role, now
        ))
        await db.commit()
    return await get_user_by_username(user_data.username)

async def init_default_user():
    """Create default admin user if no users exist"""
    user = await get_user_by_username("admin")
    if not user:
        await create_user(UserCreate(
            username="admin",
            email="admin@dreamatic.ai",
            password="admin123",
            role="admin"
        ))
        print("👤 Default admin user created (admin/admin123)")

# --- Jobs CRUD ---
async def get_all_jobs(active_only: bool = True, include_archived: bool = False) -> List[dict]:
    async with get_db() as db:
        query = "SELECT * FROM jobs"
        conditions = []
        if active_only:
            conditions.append("active = 1")
        if not include_archived:
            conditions.append("isArchived = 0")
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        query += " ORDER BY createdAt DESC"
        async with db.execute(query) as cursor:
            rows = await cursor.fetchall()
            return [job_helper(row) for row in rows]

async def create_job(job_data: JobCreate) -> dict:
    new_id = str(uuid.uuid4())
    data = job_data.model_dump()
    now = datetime.utcnow().isoformat()
    async with get_db() as db:
        await db.execute("""
            INSERT INTO jobs (id, title, team, location, description, requirements, company, tags, type, active, isArchived, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            new_id, data["title"], data["team"], data["location"], data["description"], data["requirements"],
            data.get("company", "DREAMATIC"), data.get("tags", ""), data.get("type", "Full-time"),
            1 if data.get("active", True) else 0, 1 if data.get("isArchived", False) else 0, now, now
        ))
        await db.commit()
    async with get_db() as db:
        async with db.execute("SELECT * FROM jobs WHERE id = ?", (new_id,)) as cursor:
            return job_helper(await cursor.fetchone())

async def update_job(job_id: str, job_data: JobUpdate) -> Optional[dict]:
    async with get_db() as db:
        update_dict = {k: v for k, v in job_data.model_dump().items() if v is not None}
        if not update_dict:
            async with db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)) as cursor:
                return job_helper(await cursor.fetchone())
        query = "UPDATE jobs SET "
        params = []
        for k, v in update_dict.items():
            if k in ["active", "isArchived"]: v = 1 if v else 0
            query += f"{k} = ?, "
            params.append(v)
        query += "updatedAt = ? WHERE id = ?"
        params.extend([datetime.utcnow().isoformat(), job_id])
        await db.execute(query, params)
        await db.commit()
    async with get_db() as db:
        async with db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)) as cursor:
            return job_helper(await cursor.fetchone())

async def delete_job(job_id: str, permanent: bool = False) -> bool:
    async with get_db() as db:
        if permanent:
            result = await db.execute("DELETE FROM jobs WHERE id = ?", (job_id,))
        else:
            result = await db.execute("UPDATE jobs SET isArchived = 1, updated_at = ? WHERE id = ?", (datetime.utcnow().isoformat(), job_id))
        await db.commit()
        return result.rowcount > 0

async def get_job_by_id(job_id: str) -> Optional[dict]:
    async with get_db() as db:
        async with db.execute("SELECT * FROM jobs WHERE id = ?", (job_id,)) as cursor:
            row = await cursor.fetchone()
            return job_helper(row)

# --- Applications ---
async def get_all_applications(include_deleted: bool = False) -> List[dict]:
    async with get_db() as db:
        query = "SELECT * FROM applications"
        if not include_deleted:
            query += " WHERE isDeleted = 0"
        query += " ORDER BY createdAt DESC"
        async with db.execute(query) as cursor:
            rows = await cursor.fetchall()
            return [application_helper(row) for row in rows]

async def create_job_application(app_data: JobApplicationCreate) -> dict:
    new_id = str(uuid.uuid4())
    data = app_data.model_dump()
    now = datetime.utcnow().isoformat()
    async with get_db() as db:
        await db.execute("""
            INSERT INTO applications (id, name, email, phone, location, experience, salary, linkedin, portfolio, notice, resume, message, role, jobId, status, history, isDeleted, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            new_id, data["name"], data["email"], data["phone"], data["location"], data["experience"],
            data["salary"], data["linkedin"], data["portfolio"], data["notice"], data["resume"],
            data["message"], data["role"], data.get("jobId"), data.get("status", "Applied"),
            json.dumps(data.get("history", [])), 0, now
        ))
        await db.commit()
    async with get_db() as db:
        async with db.execute("SELECT * FROM applications WHERE id = ?", (new_id,)) as cursor:
            return application_helper(await cursor.fetchone())

async def update_application_status(app_id: str, status: str, note: Optional[str] = None) -> bool:
    async with get_db() as db:
        async with db.execute("SELECT history FROM applications WHERE id = ?", (app_id,)) as cursor:
            row = await cursor.fetchone()
            if not row: return False
            history = json.loads(row["history"])
        
        history.append({
            "status": status,
            "note": note,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        await db.execute("UPDATE applications SET status = ?, history = ? WHERE id = ?", (status, json.dumps(history), app_id))
        await db.commit()
        return True

async def delete_application(app_id: str, permanent: bool = False) -> bool:
    async with get_db() as db:
        if permanent:
            result = await db.execute("DELETE FROM applications WHERE id = ?", (app_id,))
        else:
            result = await db.execute("UPDATE applications SET isDeleted = 1 WHERE id = ?", (app_id,))
        await db.commit()
        return result.rowcount > 0

async def restore_application(app_id: str) -> bool:
    async with get_db() as db:
        result = await db.execute("UPDATE applications SET isDeleted = 0 WHERE id = ?", (app_id,))
        await db.commit()
        return result.rowcount > 0

# --- Page Configs ---
async def get_page_config(page_id: str) -> Optional[dict]:
    async with get_db() as db:
        async with db.execute("SELECT * FROM pages WHERE page_id = ?", (page_id,)) as cursor:
            row = await cursor.fetchone()
            return page_config_helper(row)

async def upsert_page_config(page_id: str, config_data: dict) -> dict:
    existing = await get_page_config(page_id)
    now = datetime.utcnow().isoformat()
    
    # Flatten/stringify lists/dicts for SQLite
    data = config_data.copy()
    json_fields = ["solutions", "approaches", "values", "stats", "team", "advisors", "perks", "content", "theme"]
    for field in json_fields:
        if field in data:
            data[field] = json.dumps(data[field])

    async with get_db() as db:
        if existing:
            query = "UPDATE pages SET "
            params = []
            for k, v in data.items():
                query += f"`{k}` = ?, "
                params.append(v)
            query += "updatedAt = ? WHERE page_id = ?"
            params.extend([now, page_id])
            await db.execute(query, params)
        else:
            new_id = str(uuid.uuid4())
            keys = ["id", "page_id", "updatedAt"] + list(data.keys())
            placeholders = ", ".join(["?"] * len(keys))
            cols = ", ".join([f"`{k}`" for k in keys])
            params = [new_id, page_id, now] + list(data.values())
            await db.execute(f"INSERT INTO pages ({cols}) VALUES ({placeholders})", params)
        await db.commit()
    return await get_page_config(page_id)

async def get_all_custom_pages() -> list:
    async with get_db() as db:
        async with db.execute("SELECT * FROM pages WHERE isCustom = 1") as cursor:
            rows = await cursor.fetchall()
            return [page_config_helper(row) for row in rows]

async def delete_page_config(page_id: str) -> bool:
    async with get_db() as db:
        result = await db.execute("DELETE FROM pages WHERE page_id = ?", (page_id,))
        await db.commit()
        return result.rowcount > 0

async def init_default_pages():
    """Initialize essential page configs if they don't exist"""
    # This is typically handled by seeds, but we can add basics here
    pass

async def global_search(q: str) -> List[dict]:
    """Search across insights, research, showcase, and jobs"""
    results = []
    async with get_db() as db:
        # Search Insights
        async with db.execute(
            "SELECT * FROM insights WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) LIMIT 5", 
            (f"%{q}%", f"%{q}%", f"%{q}%")
        ) as cursor:
            rows = await cursor.fetchall()
            for r in rows:
                item = insight_helper(r)
                results.append({
                    "id": item["_id"],
                    "title": item["title"],
                    "description": item["excerpt"],
                    "type": "insight",
                    "category": "INSIGHT",
                    "url": f"/resources/blog?id={item['_id']}"
                })
        
        # Search Research
        async with db.execute(
            "SELECT * FROM research WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR authors LIKE ?) LIMIT 5", 
            (f"%{q}%", f"%{q}%", f"%{q}%")
        ) as cursor:
            rows = await cursor.fetchall()
            for r in rows:
                item = research_helper(r)
                results.append({
                    "id": item["_id"],
                    "title": item["title"],
                    "description": item["excerpt"],
                    "type": "research",
                    "category": "RESEARCH",
                    "url": f"/resources/research?id={item['_id']}"
                })

        # Search Showcase
        async with db.execute(
            "SELECT * FROM showcase WHERE active = 1 AND (title LIKE ? OR description LIKE ? OR tag LIKE ?) LIMIT 5", 
            (f"%{q}%", f"%{q}%", f"%{q}%")
        ) as cursor:
            rows = await cursor.fetchall()
            for r in rows:
                item = showcase_helper(r)
                results.append({
                    "id": item["_id"],
                    "title": item["title"],
                    "description": item["description"] or item["tag"],
                    "type": "insight", # Use insight type for UI styling if 'showcase' type isn't defined
                    "category": "SHOWCASE",
                    "url": f"/showcase?id={item['_id']}"
                })

        # Search Jobs
        async with db.execute(
            "SELECT * FROM jobs WHERE active = 1 AND isArchived = 0 AND (title LIKE ? OR description LIKE ? OR team LIKE ?) LIMIT 5", 
            (f"%{q}%", f"%{q}%", f"%{q}%")
        ) as cursor:
            rows = await cursor.fetchall()
            for r in rows:
                item = job_helper(r)
                results.append({
                    "id": item["_id"],
                    "title": item["title"],
                    "description": f"{item['team']} · {item['location']}",
                    "type": "job",
                    "category": "CAREERS",
                    "url": f"/company/careers?id={item['_id']}"
                })
                
    return results

# --- MFA Security Tools ---
async def get_credentials_by_username(username: str) -> List[dict]:
    async with get_db() as db:
        async with db.execute("SELECT * FROM webauthn_credentials WHERE username = ?", (username,)) as cursor:
            rows = await cursor.fetchall()
            return [credential_helper(row) for row in rows]

async def save_credential(username: str, cred_id: str, public_key: str, sign_count: int, transports: list):
    new_id = str(uuid.uuid4())
    async with get_db() as db:
        await db.execute("""
            INSERT INTO webauthn_credentials (id, username, credential_id, public_key, sign_count, transports, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (new_id, username, cred_id, public_key, sign_count, json.dumps(transports), datetime.utcnow().isoformat()))
        await db.commit()

async def save_challenge(username: str, challenge: str):
    expires_at = datetime.utcnow().timestamp() + 300 # 5 mins
    async with get_db() as db:
        await db.execute("INSERT OR REPLACE INTO webauthn_challenges (username, challenge, expires_at) VALUES (?, ?, ?)", 
                         (username, challenge, str(expires_at)))
        await db.commit()

async def get_challenge(username: str) -> Optional[str]:
    async with get_db() as db:
        async with db.execute("SELECT challenge, expires_at FROM webauthn_challenges WHERE username = ?", (username,)) as cursor:
            row = await cursor.fetchone()
            if not row: return None
            if float(row["expires_at"]) < datetime.utcnow().timestamp():
                return None
            return row["challenge"]
