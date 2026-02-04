"""
Update associated groups with bilingual content (English and Polish)
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

bilingual_groups = [
    {
        "id": "1",
        "name_en": "Children's Polish School",
        "name_pl": "Polska Szkoła dla Dzieci",
        "description_en": "Polish language and culture classes for children aged 5-15. We offer engaging lessons that combine language learning with cultural activities.",
        "description_pl": "Lekcje języka polskiego i kultury dla dzieci w wieku 5-15 lat. Oferujemy angażujące zajęcia łączące naukę języka z działaniami kulturalnymi.",
        "schedule_en": "Wednesdays 16:30 - 18:30",
        "schedule_pl": "Środy 16:30 - 18:30",
        "contact": "school@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop"
    },
    {
        "id": "2",
        "name_en": "Adults Polish School",
        "name_pl": "Polska Szkoła dla Dorosłych",
        "description_en": "Polish language classes for adults of all levels. Whether you're a beginner or looking to improve your fluency, join our friendly classes.",
        "description_pl": "Lekcje języka polskiego dla dorosłych na wszystkich poziomach. Niezależnie czy jesteś początkującym czy chcesz poprawić płynność, dołącz do naszych przyjaznych zajęć.",
        "schedule_en": "Saturdays 10:00 - 12:00",
        "schedule_pl": "Soboty 10:00 - 12:00",
        "contact": "adultschool@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
    },
    {
        "id": "3",
        "name_en": "Little Poland Dining",
        "name_pl": "Restauracja Mała Polska",
        "description_en": "Experience authentic Polish cuisine in our restaurant. From traditional pierogi to hearty bigos, enjoy homemade Polish dishes in a warm atmosphere.",
        "description_pl": "Doświadcz autentycznej polskiej kuchni w naszej restauracji. Od tradycyjnych pierogów po sycący bigos, ciesz się domowymi polskimi potrawami w ciepłej atmosferze.",
        "schedule_en": "Tue-Sun (see weekly schedule)",
        "schedule_pl": "Wt-Niedz (zobacz harmonogram tygodniowy)",
        "contact": "dining@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop"
    },
    {
        "id": "4",
        "name_en": "Rzeszowiacy Dance Group",
        "name_pl": "Zespół Taneczny Rzeszowiacy",
        "description_en": "Traditional Polish folk dance ensemble showcasing the beauty of Polish regional dances. New dancers of all ages welcome!",
        "description_pl": "Tradycyjny polski zespół tańców ludowych prezentujący piękno polskich tańców regionalnych. Nowi tancerze w każdym wieku są mile widziani!",
        "schedule_en": "Thursdays 18:00 - 20:00",
        "schedule_pl": "Czwartki 18:00 - 20:00",
        "contact": "dance@polishassociation.com.au",
        "website": "#",
        "image": "https://images.pexels.com/photos/34337833/pexels-photo-34337833.jpeg"
    },
    {
        "id": "5",
        "name_en": "Polish Seniors Group",
        "name_pl": "Grupa Polskich Seniorów",
        "description_en": "A social group for Polish seniors to connect, share stories, and enjoy activities together. Join us for coffee, conversation, and companionship.",
        "description_pl": "Grupa towarzyska dla polskich seniorów, aby się spotykać, dzielić historiami i wspólnie cieszyć się zajęciami. Dołącz do nas na kawę, rozmowę i towarzystwo.",
        "schedule_en": "Mondays 10:00 - 13:00",
        "schedule_pl": "Poniedziałki 10:00 - 13:00",
        "contact": "seniors@polishassociation.com.au",
        "website": "#",
        "image": "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=600&h=400&fit=crop"
    }
]

async def update_groups():
    """Update groups with bilingual content"""
    try:
        print("Updating groups with bilingual content...")
        
        for group in bilingual_groups:
            result = await db.groups.replace_one(
                {"id": group["id"]},
                group,
                upsert=True
            )
            print(f"✓ Updated: {group['name_en']} / {group['name_pl']}")
        
        # Verify
        total = await db.groups.count_documents({})
        print(f"\n✅ Total groups updated: {total}")
        
        # Show sample
        sample = await db.groups.find_one({"id": "1"}, {"_id": 0})
        print(f"\nSample document:")
        for key, value in sample.items():
            print(f"  {key}: {value[:50] if isinstance(value, str) and len(value) > 50 else value}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_groups())
