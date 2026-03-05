import sqlite3
import os
import requests
import hashlib
import json

DB_PATH = "dreamactic.db"
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
        # Generate filename based on URL hash
        # Try to guess extension
        ext = "jpg"
        if ".mp4" in url.lower(): ext = "mp4"
        elif ".pdf" in url.lower(): ext = "pdf"
        elif ".png" in url.lower(): ext = "png"
        elif ".gif" in url.lower(): ext = "gif"
        elif ".webp" in url.lower(): ext = "webp"
        
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

def update_localized_assets():
    db = sqlite3.connect(DB_PATH)
    cursor = db.cursor()
    
    # Update Insights
    print("📋 Checking Insights...")
    cursor.execute("SELECT id, imageUrl, pdfUrl FROM insights")
    rows = cursor.fetchall()
    for row_id, img_url, pdf_url in rows:
        new_img = download_file(img_url, IMG_DIR)
        new_pdf = download_file(pdf_url, PDF_DIR)
        if new_img != img_url or new_pdf != pdf_url:
            cursor.execute("UPDATE insights SET imageUrl = ?, pdfUrl = ? WHERE id = ?", (new_img, new_pdf, row_id))

    # Update Research
    print("📋 Checking Research...")
    cursor.execute("SELECT id, imageUrl, pdfUrl FROM research")
    rows = cursor.fetchall()
    for row_id, img_url, pdf_url in rows:
        new_img = download_file(img_url, IMG_DIR)
        new_pdf = download_file(pdf_url, PDF_DIR)
        if new_img != img_url or new_pdf != pdf_url:
            cursor.execute("UPDATE research SET imageUrl = ?, pdfUrl = ? WHERE id = ?", (new_img, new_pdf, row_id))

    # Update Showcase
    print("📋 Checking Showcase...")
    cursor.execute("SELECT id, mediaUrl, mediaType FROM showcase")
    rows = cursor.fetchall()
    for row_id, media_url, media_type in rows:
        target = VID_DIR if media_type == "video" else IMG_DIR
        new_media = download_file(media_url, target)
        if new_media != media_url:
            cursor.execute("UPDATE showcase SET mediaUrl = ? WHERE id = ?", (new_media, row_id))

    # Update Applications
    print("📋 Checking Applications...")
    cursor.execute("SELECT id, resume FROM applications")
    rows = cursor.fetchall()
    for row_id, resume_url in rows:
        new_resume = download_file(resume_url, PDF_DIR)
        if new_resume != resume_url:
            cursor.execute("UPDATE applications SET resume = ? WHERE id = ?", (new_resume, row_id))

    db.commit()
    db.close()
    print("✅ All assets checked and localized!")

if __name__ == "__main__":
    update_localized_assets()
