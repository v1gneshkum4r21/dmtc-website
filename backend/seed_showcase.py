import json
import asyncio
import os
import sys
from datetime import datetime

# Add the current directory to sys.path so we can import internal modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import showcase_collection, db
from models import ShowcaseItemCreate

async def seed_showcase():
    # Path to the JSON file
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src/data/showcase-demo.json')
    
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r') as f:
        demo_data = json.load(f)

    print(f"Loaded {len(demo_data)} items from JSON.")

    # Clear existing showcase items
    result = showcase_collection.delete_many({})
    print(f"Cleared {result.deleted_count} existing items.")

    count = 0
    for item in demo_data:
        # Remove the string _id from JSON so MongoDB generates a new one
        if '_id' in item:
            item.pop('_id')
        
        # Add timestamps
        item["createdAt"] = datetime.utcnow()
        item["updatedAt"] = datetime.utcnow()
        
        # Ensure numeric fields are present (preserve if exist)
        if "likes" not in item:
            item["likes"] = 0
        if "views" not in item:
            item["views"] = 0
        if "order" not in item:
            item["order"] = 0
            
        result = showcase_collection.insert_one(item)
        if result.inserted_id:
            count += 1

    print(f"Successfully seeded {count} items into the database.")

if __name__ == "__main__":
    asyncio.run(seed_showcase())
