import asyncio
import os
import sys

# Add backend to path
sys.path.append('backend')

from database import init_default_user

async def main():
    try:
        await init_default_user()
        print("SUCCESS")
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(main())
