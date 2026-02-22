"""
Seed script to populate MongoDB with initial data from mock.js
Run this once to initialize the database with sample data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'polish_association')]

# Sample data matching frontend mock
events_data = [
    {
        "id": "1",
        "title": "Polish Independence Day Celebration",
        "date": "2025-11-11",
        "time": "18:00",
        "location": "Polish Cultural Centre",
        "description": "Join us for a special celebration of Polish Independence Day with traditional music, dance performances, and Polish cuisine.",
        "category": "cultural",
        "image": "https://images.pexels.com/photos/34337833/pexels-photo-34337833.jpeg"
    },
    {
        "id": "2",
        "title": "Easter Monday Celebration (Śmigus-Dyngus)",
        "date": "2025-04-21",
        "time": "12:00",
        "location": "Polish Cultural Centre",
        "description": "Traditional Easter Monday celebration with water games, Polish food, and family activities.",
        "category": "cultural",
        "image": "https://images.unsplash.com/photo-1768333377265-cb6c3ca2885a"
    },
    {
        "id": "3",
        "title": "AGM 2025",
        "date": "2025-03-15",
        "time": "15:00",
        "location": "Polish Cultural Centre",
        "description": "Annual General Meeting of the Polish Association of Newcastle. All members are encouraged to attend.",
        "category": "meeting",
        "image": "https://images.unsplash.com/photo-1515187029135-18ee286d815b"
    },
    {
        "id": "4",
        "title": "Polish Language Workshop",
        "date": "2025-02-20",
        "time": "10:00",
        "location": "Polish Cultural Centre",
        "description": "Interactive Polish language workshop for beginners. Learn basic phrases and conversational skills.",
        "category": "education",
        "image": "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a"
    },
    {
        "id": "5",
        "title": "Traditional Polish Cooking Class",
        "date": "2025-03-08",
        "time": "14:00",
        "location": "Polish Cultural Centre Kitchen",
        "description": "Learn to make traditional Polish pierogi and other classic dishes with our experienced chefs.",
        "category": "cultural",
        "image": "https://images.unsplash.com/photo-1763842092319-56e717355ab8"
    },
    {
        "id": "6",
        "title": "Rzeszowiacy Dance Group Performance",
        "date": "2025-04-05",
        "time": "19:00",
        "location": "Polish Cultural Centre",
        "description": "Beautiful performance of traditional Polish folk dances by our talented Rzeszowiacy dance group.",
        "category": "performance",
        "image": "https://images.pexels.com/photos/34073252/pexels-photo-34073252.jpeg"
    }
]

committee_data = [
    {
        "id": "1",
        "name": "Jan Kowalski",
        "position": "President",
        "bio": "Leading the Polish Association of Newcastle since 2022, dedicated to preserving Polish culture and heritage in our community.",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        "order": 1
    },
    {
        "id": "2",
        "name": "Anna Nowak",
        "position": "Vice President",
        "bio": "Active member of the Polish community for over 15 years, passionate about cultural education and youth programs.",
        "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        "order": 2
    },
    {
        "id": "3",
        "name": "Piotr Wiśniewski",
        "position": "Secretary",
        "bio": "Ensuring smooth operations and communication within our association.",
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        "order": 3
    },
    {
        "id": "4",
        "name": "Maria Lewandowska",
        "position": "Treasurer",
        "bio": "Managing the financial health of our association with transparency and dedication.",
        "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        "order": 4
    },
    {
        "id": "5",
        "name": "Tomasz Kamiński",
        "position": "Committee Member",
        "bio": "Coordinating cultural events and community outreach programs.",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "order": 5
    },
    {
        "id": "6",
        "name": "Katarzyna Zielińska",
        "position": "Committee Member",
        "bio": "Supporting youth programs and educational initiatives.",
        "image": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
        "order": 6
    }
]

groups_data = [
    {
        "id": "1",
        "name": "Children's Polish School",
        "description": "Polish language and culture classes for children aged 5-15. We offer engaging lessons that combine language learning with cultural activities.",
        "schedule": "Wednesdays 16:30 - 18:30",
        "contact": "school@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop"
    },
    {
        "id": "2",
        "name": "Adults Polish School",
        "description": "Polish language classes for adults of all levels. Whether you're a beginner or looking to improve your fluency, join our friendly classes.",
        "schedule": "Saturdays 10:00 - 12:00",
        "contact": "adultschool@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
    },
    {
        "id": "3",
        "name": "Little Poland Dining",
        "description": "Experience authentic Polish cuisine in our restaurant. From traditional pierogi to hearty bigos, enjoy homemade Polish dishes in a warm atmosphere.",
        "schedule": "Tue-Sun (see weekly schedule)",
        "contact": "dining@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop"
    },
    {
        "id": "4",
        "name": "Rzeszowiacy Dance Group",
        "description": "Traditional Polish folk dance ensemble showcasing the beauty of Polish regional dances. New dancers of all ages welcome!",
        "schedule": "Thursdays 18:00 - 20:00",
        "contact": "dance@polishassociation.com.au",
        "website": "#",
        "image": "https://images.pexels.com/photos/34337833/pexels-photo-34337833.jpeg"
    },
    {
        "id": "5",
        "name": "Polish Seniors Group",
        "description": "A social group for Polish seniors to connect, share stories, and enjoy activities together. Join us for coffee, conversation, and companionship.",
        "schedule": "Mondays 10:00 - 13:00",
        "contact": "seniors@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=600&h=400&fit=crop"
    }
]

async def seed_database():
    """Seed the database with initial data"""
    try:
        # Clear existing data
        print("Clearing existing data...")
        await db.events.delete_many({})
        await db.committee.delete_many({})
        await db.groups.delete_many({})
        
        # Insert events
        print("Seeding events...")
        await db.events.insert_many(events_data)
        print(f"✓ Inserted {len(events_data)} events")
        
        # Insert committee members
        print("Seeding committee members...")
        await db.committee.insert_many(committee_data)
        print(f"✓ Inserted {len(committee_data)} committee members")
        
        # Insert associated groups
        print("Seeding associated groups...")
        await db.groups.insert_many(groups_data)
        print(f"✓ Inserted {len(groups_data)} associated groups")
        
        print("\n✅ Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
