"""
Add Polish Radio to associated groups
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

polish_radio = {
    "id": "6",
    "name_en": "Polish Radio on 2NUR FM",
    "name_pl": "Polskie Radio na 2NUR FM",
    "description_en": "Tune in to Polish Radio on 2NUR FM 103.7 every second Sunday from 6pm. Enjoy Polish music, news from Poland, community announcements, and cultural programming.",
    "description_pl": "Słuchaj Polskiego Radia na 2NUR FM 103.7 co drugą niedzielę od 18:00. Ciesz się polską muzyką, wiadomościami z Polski, ogłoszeniami społeczności i programami kulturalnymi.",
    "schedule_en": "Every second Sunday from 6:00 PM",
    "schedule_pl": "Co drugą niedzielę od 18:00",
    "contact": "radio@polishassociation.com.au",
    "website": "https://2nurfm.com/",
    "image": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop"
}

async def add_polish_radio():
    """Add Polish Radio to groups"""
    try:
        # Check if already exists
        existing = await db.groups.find_one({"id": "6"})
        if existing:
            print(f"✓ Polish Radio already exists in the database")
        else:
            await db.groups.insert_one(polish_radio)
            print(f"✓ Added Polish Radio on 2NUR FM")
        
        # Get total count
        total = await db.groups.count_documents({})
        print(f"\n✅ Total associated groups: {total}")
        
        # List all groups
        print("\n📋 All associated groups:")
        groups = await db.groups.find({}, {"_id": 0, "id": 1, "name_en": 1}).to_list(length=20)
        for g in groups:
            print(f"   {g['id']}. {g['name_en']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_polish_radio())
