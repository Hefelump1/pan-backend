"""
Seed script to add initial weekly activities to the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from datetime import datetime

async def seed_activities():
    mongo_url = os.environ.get('MONGO_URL')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'test_database')]
    activities_collection = db['activities']
    
    # Check if activities already exist
    existing = await activities_collection.count_documents({})
    if existing > 0:
        print(f"Activities collection already has {existing} records. Skipping seed.")
        return
    
    activities = [
        {
            "id": str(uuid.uuid4()),
            "day": "Monday",
            "name_en": "Polish Seniors Group",
            "name_pl": "Grupa Seniorów Polskich",
            "time": "10:00 - 13:00",
            "description_en": "Social gathering for Polish seniors with coffee and conversation.",
            "description_pl": "Spotkanie towarzyskie dla polskich seniorów przy kawie i rozmowie.",
            "contact": "seniors@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Tuesday",
            "name_en": "Little Poland Dining",
            "name_pl": "Restauracja Mała Polska",
            "time": "17:00 - 21:00",
            "description_en": "Enjoy authentic Polish cuisine in our restaurant.",
            "description_pl": "Ciesz się autentyczną polską kuchnią w naszej restauracji.",
            "contact": "dining@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Wednesday",
            "name_en": "Children's Polish School",
            "name_pl": "Polska Szkoła dla Dzieci",
            "time": "16:30 - 18:30",
            "description_en": "Polish language and culture classes for children aged 5-15.",
            "description_pl": "Zajęcia z języka polskiego i kultury dla dzieci w wieku 5-15 lat.",
            "contact": "school@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Thursday",
            "name_en": "Rzeszowiacy Dance Practice",
            "name_pl": "Próba Zespołu Tanecznego Rzeszowiacy",
            "time": "18:00 - 20:00",
            "description_en": "Traditional Polish folk dance rehearsals. New members welcome!",
            "description_pl": "Próby tradycyjnych polskich tańców ludowych. Nowi członkowie mile widziani!",
            "contact": "dance@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Friday",
            "name_en": "Little Poland Dining",
            "name_pl": "Restauracja Mała Polska",
            "time": "17:00 - 22:00",
            "description_en": "Enjoy authentic Polish cuisine in our restaurant.",
            "description_pl": "Ciesz się autentyczną polską kuchnią w naszej restauracji.",
            "contact": "dining@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Saturday",
            "name_en": "Adults Polish School",
            "name_pl": "Polska Szkoła dla Dorosłych",
            "time": "10:00 - 12:00",
            "description_en": "Polish language classes for adults - all levels welcome.",
            "description_pl": "Zajęcia z języka polskiego dla dorosłych - mile widziane wszystkie poziomy.",
            "contact": "adultschool@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Saturday",
            "name_en": "Little Poland Dining",
            "name_pl": "Restauracja Mała Polska",
            "time": "17:00 - 22:00",
            "description_en": "Enjoy authentic Polish cuisine in our restaurant.",
            "description_pl": "Ciesz się autentyczną polską kuchnią w naszej restauracji.",
            "contact": "dining@polishassociation.com.au",
            "order": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "day": "Sunday",
            "name_en": "Little Poland Dining",
            "name_pl": "Restauracja Mała Polska",
            "time": "12:00 - 20:00",
            "description_en": "Sunday lunch and dinner service with traditional Polish dishes.",
            "description_pl": "Niedzielne obiady i kolacje z tradycyjnymi polskimi daniami.",
            "contact": "dining@polishassociation.com.au",
            "order": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = await activities_collection.insert_many(activities)
    print(f"Successfully seeded {len(result.inserted_ids)} weekly activities")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_activities())
