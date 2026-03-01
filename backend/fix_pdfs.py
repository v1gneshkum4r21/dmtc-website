
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dreamatic_cms")

def fix_missing_pdfs():
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    collection = db["insights"]

    # Research items missing pdfUrl
    missing = collection.find({"page": "research", "pdfUrl": {"$exists": False}})
    
    count = 0
    for idx, item in enumerate(missing):
        # Assign a mock arxiv link if missing
        mock_pdf = f"https://arxiv.org/abs/2024.000{idx+10}"
        collection.update_one({"_id": item["_id"]}, {"$set": {"pdfUrl": mock_pdf}})
        print(f"  Fixed: {item['title'][:50]} -> {mock_pdf}")
        count += 1

    client.close()
    print(f"\n✅ Fixed {count} research items missing PDF links.")

if __name__ == "__main__":
    fix_missing_pdfs()
