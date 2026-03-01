import asyncio
from database import init_default_pages, db

async def force_update():
    print("Force updating page configs...")
    # Drop the collection to force re-initialization
    db.pages.drop()
    print("Dropped 'pages' collection.")
    await init_default_pages()
    print("Re-initialized with new full data.")

if __name__ == "__main__":
    asyncio.run(force_update())
