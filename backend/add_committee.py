"""
Add 3 additional committee members to the database
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

new_committee_members = [
    {
        "id": "7",
        "name": "Wojciech Szymański",
        "position": "Events Coordinator",
        "bio": "Organizing cultural events and celebrations that bring our Polish community together.",
        "image": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop",
        "order": 7
    },
    {
        "id": "8",
        "name": "Magdalena Dąbrowska",
        "position": "Youth Programs Director",
        "bio": "Developing educational programs and activities for children and young adults in our community.",
        "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        "order": 8
    },
    {
        "id": "9",
        "name": "Paweł Woźniak",
        "position": "Facilities Manager",
        "bio": "Maintaining our community hall and ensuring it remains a welcoming space for all activities.",
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        "order": 9
    }
]

async def add_committee_members():
    """Add 3 new committee members"""
    try:
        print("Adding 3 new committee members...")
        
        for member in new_committee_members:
            # Check if member already exists
            existing = await db.committee.find_one({"id": member["id"]})
            if existing:
                print(f"✓ {member['name']} already exists, skipping...")
                continue
            
            await db.committee.insert_one(member)
            print(f"✓ Added {member['name']} - {member['position']}")
        
        # Get total count
        total = await db.committee.count_documents({})
        print(f"\n✅ Total committee members: {total}")
        
    except Exception as e:
        print(f"❌ Error adding committee members: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_committee_members())
