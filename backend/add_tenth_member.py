"""
Add 10th committee member to the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

tenth_member = {
    "id": "10",
    "name": "Agnieszka Krawczyk",
    "position": "Cultural Heritage Officer",
    "bio": "Preserving Polish traditions and coordinating cultural education programs to share our heritage with future generations.",
    "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    "order": 10
}

async def add_tenth_member():
    """Add the 10th committee member"""
    try:
        # Check if member already exists
        existing = await db.committee.find_one({"id": "10"})
        if existing:
            print(f"✓ {tenth_member['name']} already exists in the database")
        else:
            await db.committee.insert_one(tenth_member)
            print(f"✓ Added {tenth_member['name']} - {tenth_member['position']}")
        
        # Get total count
        total = await db.committee.count_documents({})
        print(f"\n✅ Total committee members: {total}")
        
        # List all members
        print("\n📋 All committee members:")
        members = await db.committee.find({}, {"_id": 0}).sort("order", 1).to_list(length=20)
        for m in members:
            print(f"   {m.get('order', '?')}. {m['name']} - {m['position']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_tenth_member())
