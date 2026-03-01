
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dreamatic_cms")

def verify():
    client = MongoClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    coll = db["insights"]
    
    research_count = coll.count_documents({"page": "research"})
    pdf_count = coll.count_documents({"page": "research", "pdfUrl": {"$exists": True}})
    
    print(f"Total Research Papers: {research_count}")
    print(f"Papers with PDF Links: {pdf_count}")
    
    if research_count > 0:
        latest = coll.find_one({"page": "research"}, sort=[("createdAt", -1)])
        print(f"Latest Paper: {latest['title']}")
        print(f"PDF URL: {latest.get('pdfUrl', 'MISSING')}")

    client.close()

if __name__ == "__main__":
    verify()
