import os
import json
import sqlite3
import requests
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import hashlib

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dreamatic_cms")
SQLITE_PATH = "dreamatic.db"

ASSETS_DIR = "static/assets"
IMG_DIR = os.path.join(ASSETS_DIR, "images")
VID_DIR = os.path.join(ASSETS_DIR, "videos")
PDF_DIR = os.path.join(ASSETS_DIR, "pdfs")

# Ensure directories exist
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(VID_DIR, exist_ok=True)
os.makedirs(PDF_DIR, exist_ok=True)

def download_file(url, target_dir):
    if not url or not url.startswith("http"):
        return url
    
    try:
        # Generate filename based on URL hash to avoid duplicates and illegal characters
        ext = url.split('.')[-1].split('?')[0]
        if len(ext) > 4: # Handle cases with no clear extension
            ext = "jpg"
        
        filename = hashlib.md5(url.encode()).hexdigest() + "." + ext
        filepath = os.path.join(target_dir, filename)
        
        if os.path.exists(filepath):
            return f"/static/assets/{target_dir.split('/')[-1]}/{filename}"
            
        print(f"📥 Downloading {url}...")
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return f"/static/assets/{target_dir.split('/')[-1]}/{filename}"
    except Exception as e:
        print(f"❌ Failed to download {url}: {e}")
    
    return url

def migrate():
    # Connect to MongoDB
    mongo_client = MongoClient(MONGODB_URL)
    m_db = mongo_client[DATABASE_NAME]
    
    # Connect to SQLite
    s_db = sqlite3.connect(SQLITE_PATH)
    cursor = s_db.cursor()
    
    # --- Create Tables ---
    cursor.execute("DROP TABLE IF EXISTS insights")
    cursor.execute("""
        CREATE TABLE insights (
            id TEXT PRIMARY KEY,
            title TEXT,
            excerpt TEXT,
            content TEXT,
            author TEXT,
            imageUrl TEXT,
            page TEXT,
            published INTEGER,
            journal TEXT,
            year TEXT,
            authors TEXT,
            pdfUrl TEXT,
            linkType TEXT,
            createdAt TEXT,
            updatedAt TEXT
        )
    """)
    
    cursor.execute("DROP TABLE IF EXISTS research")
    cursor.execute("""
        CREATE TABLE research (
            id TEXT PRIMARY KEY,
            title TEXT,
            journal TEXT,
            year TEXT,
            authors TEXT,
            excerpt TEXT,
            abstract TEXT,
            content TEXT,
            imageUrl TEXT,
            pdfUrl TEXT,
            linkType TEXT,
            published INTEGER,
            createdAt TEXT,
            updatedAt TEXT
        )
    """)
    
    cursor.execute("DROP TABLE IF EXISTS showcase")
    cursor.execute("""
        CREATE TABLE showcase (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            mediaUrl TEXT,
            mediaType TEXT,
            tag TEXT,
            product TEXT,
            `order` INTEGER,
            active INTEGER,
            size TEXT,
            likes INTEGER,
            views INTEGER,
            createdAt TEXT,
            updatedAt TEXT
        )
    """)
    
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("""
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            email TEXT,
            passwordHash TEXT,
            role TEXT,
            createdAt TEXT
        )
    """)
    
    cursor.execute("DROP TABLE IF EXISTS jobs")
    cursor.execute("""
        CREATE TABLE jobs (
            id TEXT PRIMARY KEY,
            title TEXT,
            team TEXT,
            location TEXT,
            description TEXT,
            requirements TEXT,
            company TEXT,
            tags TEXT,
            type TEXT,
            active INTEGER,
            isArchived INTEGER,
            createdAt TEXT,
            updatedAt TEXT
        )
    """)
    
    cursor.execute("DROP TABLE IF EXISTS applications")
    cursor.execute("""
        CREATE TABLE applications (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            phone TEXT,
            location TEXT,
            experience TEXT,
            salary TEXT,
            linkedin TEXT,
            portfolio TEXT,
            notice TEXT,
            resume TEXT,
            message TEXT,
            role TEXT,
            jobId TEXT,
            status TEXT,
            history TEXT,
            isDeleted INTEGER,
            createdAt TEXT
        )
    """)
    
    cursor.execute("DROP TABLE IF EXISTS pages")
    cursor.execute("""
        CREATE TABLE pages (
            id TEXT PRIMARY KEY,
            page_id TEXT UNIQUE,
            hero_badge TEXT,
            hero_title TEXT,
            hero_subtitle TEXT,
            solutions TEXT,
            approaches TEXT,
            `values` TEXT,
            stats TEXT,
            team TEXT,
            advisors TEXT,
            perks TEXT,
            content TEXT,
            theme TEXT,
            isCustom INTEGER,
            label TEXT,
            path TEXT,
            visible INTEGER,
            `group` TEXT,
            updatedAt TEXT
        )
    """)

    cursor.execute("DROP TABLE IF EXISTS webauthn_credentials")
    cursor.execute("""
        CREATE TABLE webauthn_credentials (
            id TEXT PRIMARY KEY,
            username TEXT,
            credential_id TEXT,
            public_key TEXT,
            sign_count INTEGER,
            transports TEXT,
            created_at TEXT
        )
    """)

    cursor.execute("DROP TABLE IF EXISTS webauthn_challenges")
    cursor.execute("""
        CREATE TABLE webauthn_challenges (
            username TEXT PRIMARY KEY,
            challenge TEXT,
            expires_at TEXT
        )
    """)

    # --- Migrate Insights ---
    print("🚀 Migrating Insights...")
    for doc in m_db["insights"].find():
        doc["imageUrl"] = download_file(doc.get("imageUrl"), IMG_DIR)
        doc["pdfUrl"] = download_file(doc.get("pdfUrl"), PDF_DIR)
        
        cursor.execute("""
            INSERT INTO insights (id, title, excerpt, content, author, imageUrl, page, published, journal, year, authors, pdfUrl, linkType, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("title"),
            doc.get("excerpt"),
            doc.get("content"),
            doc.get("author", "DREAMATIC Team"),
            doc.get("imageUrl"),
            doc.get("page", "ai-work"),
            1 if doc.get("published", True) else 0,
            doc.get("journal"),
            doc.get("year"),
            doc.get("authors"),
            doc.get("pdfUrl"),
            doc.get("linkType", "download"),
            doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt"),
            doc.get("updatedAt").isoformat() if isinstance(doc.get("updatedAt"), datetime) else doc.get("updatedAt")
        ))

    # --- Migrate Research ---
    print("🚀 Migrating Research...")
    for doc in m_db["research"].find():
        doc["imageUrl"] = download_file(doc.get("imageUrl"), IMG_DIR)
        doc["pdfUrl"] = download_file(doc.get("pdfUrl"), PDF_DIR)
        
        cursor.execute("""
            INSERT INTO research (id, title, journal, year, authors, excerpt, abstract, content, imageUrl, pdfUrl, linkType, published, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("title"),
            doc.get("journal"),
            doc.get("year"),
            doc.get("authors"),
            doc.get("excerpt"),
            doc.get("abstract"),
            doc.get("content"),
            doc.get("imageUrl"),
            doc.get("pdfUrl"),
            doc.get("linkType", "download"),
            1 if doc.get("published", True) else 0,
            doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt"),
            doc.get("updatedAt").isoformat() if isinstance(doc.get("updatedAt"), datetime) else doc.get("updatedAt")
        ))

    # --- Migrate Showcase ---
    print("🚀 Migrating Showcase...")
    for doc in m_db["showcase"].find():
        target = VID_DIR if doc.get("mediaType") == "video" else IMG_DIR
        doc["mediaUrl"] = download_file(doc.get("mediaUrl"), target)
        
        cursor.execute("""
            INSERT INTO showcase (id, title, description, mediaUrl, mediaType, tag, product, `order`, active, size, likes, views, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("title"),
            doc.get("description"),
            doc.get("mediaUrl"),
            doc.get("mediaType"),
            doc.get("tag"),
            doc.get("product"),
            doc.get("order", 0),
            1 if doc.get("active", True) else 0,
            doc.get("size", "medium"),
            doc.get("likes", 0),
            doc.get("views", 0),
            doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt"),
            doc.get("updatedAt").isoformat() if isinstance(doc.get("updatedAt"), datetime) else doc.get("updatedAt")
        ))

    # --- Migrate Users ---
    print("🚀 Migrating Users...")
    for doc in m_db["users"].find():
        cursor.execute("""
            INSERT INTO users (id, username, email, passwordHash, role, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("username"),
            doc.get("email"),
            doc.get("passwordHash"),
            doc.get("role", "admin"),
            doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt")
        ))

    # --- Migrate Jobs ---
    print("🚀 Migrating Jobs...")
    for doc in m_db["jobs"].find():
        cursor.execute("""
            INSERT INTO jobs (id, title, team, location, description, requirements, company, tags, type, active, isArchived, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("title"),
            doc.get("team"),
            doc.get("location"),
            doc.get("description"),
            doc.get("requirements"),
            doc.get("company", "DREAMATIC"),
            doc.get("tags", ""),
            doc.get("type", "Full-time"),
            1 if doc.get("active", True) else 0,
            1 if doc.get("isArchived", False) else 0,
            doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt"),
            doc.get("updatedAt").isoformat() if isinstance(doc.get("updatedAt"), datetime) else doc.get("updatedAt")
        ))

    # --- Migrate Applications ---
    print("🚀 Migrating Applications...")
    for doc in m_db["applications"].find():
        doc["resume"] = download_file(doc.get("resume"), PDF_DIR)
        
        cursor.execute("""
            INSERT INTO applications (id, name, email, phone, location, experience, salary, linkedin, portfolio, notice, resume, message, role, jobId, status, history, isDeleted, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("name"),
            doc.get("email"),
            doc.get("phone"),
            doc.get("location"),
            doc.get("experience"),
            doc.get("salary"),
            doc.get("linkedin"),
            doc.get("portfolio"),
            doc.get("notice"),
            doc.get("resume"),
            doc.get("message"),
            doc.get("role"),
            str(doc.get("jobId")) if doc.get("jobId") else None,
            doc.get("status", "Applied"),
            json.dumps(doc.get("history", [])),
            1 if doc.get("isDeleted", False) else 0,
            doc.get("createdAt").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt")
        ))

    # --- Migrate Page Configs ---
    print("🚀 Migrating Page Configs...")
    for doc in m_db["pages"].find():
        # Pages have complex nested structures, store as JSON
        cursor.execute("""
            INSERT INTO pages (id, page_id, hero_badge, hero_title, hero_subtitle, solutions, approaches, `values`, stats, team, advisors, perks, content, theme, isCustom, label, path, visible, `group`, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("page_id"),
            doc.get("hero_badge"),
            doc.get("hero_title"),
            doc.get("hero_subtitle"),
            json.dumps(doc.get("solutions", [])),
            json.dumps(doc.get("approaches", [])),
            json.dumps(doc.get("values", [])),
            json.dumps(doc.get("stats", [])),
            json.dumps(doc.get("team", [])),
            json.dumps(doc.get("advisors", [])),
            json.dumps(doc.get("perks", [])),
            json.dumps(doc.get("content", [])),
            json.dumps(doc.get("theme", {})),
            1 if doc.get("isCustom", False) else 0,
            doc.get("label"),
            doc.get("path"),
            1 if doc.get("visible", True) else 0,
            doc.get("group"),
            doc.get("updatedAt").isoformat() if isinstance(doc.get("updatedAt"), datetime) else doc.get("updatedAt")
        ))
    
    # --- Migrate Credentials ---
    print("🚀 Migrating MFA Credentials...")
    for doc in m_db["webauthn_credentials"].find():
        cursor.execute("""
            INSERT INTO webauthn_credentials (id, username, credential_id, public_key, sign_count, transports, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            str(doc["_id"]),
            doc.get("username"),
            doc.get("credential_id"),
            doc.get("public_key"),
            doc.get("sign_count", 0),
            json.dumps(doc.get("transports", [])),
            doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else doc.get("created_at")
        ))
    
    s_db.commit()
    print("✅ Migration to SQLite complete!")
    mongo_client.close()
    s_db.close()

if __name__ == "__main__":
    migrate()
