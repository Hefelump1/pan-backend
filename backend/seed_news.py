"""
Seed script to add initial news articles to the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
from datetime import datetime

async def seed_news():
    mongo_url = os.environ.get('MONGO_URL')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'test_database')]
    news_collection = db['news']
    
    # Check if news already exist
    existing = await news_collection.count_documents({})
    if existing > 0:
        print(f"News collection already has {existing} articles. Skipping seed.")
        return
    
    news_articles = [
        {
            "id": str(uuid.uuid4()),
            "date": "2025-01-28",
            "title_en": "Polish Independence Day Celebration a Great Success",
            "title_pl": "Obchody Święta Niepodległości wielkim sukcesem",
            "summary_en": "Over 200 community members gathered at the Polish Community Hall to celebrate Polish Independence Day with traditional music, dance, and cuisine.",
            "summary_pl": "Ponad 200 członków społeczności zebrało się w Polskiej Sali Społeczności, aby uczcić Święto Niepodległości tradycyjną muzyką, tańcem i kuchnią.",
            "content_en": "The Polish Association of Newcastle hosted a memorable Independence Day celebration that brought together over 200 community members.",
            "content_pl": "Polskie Stowarzyszenie w Newcastle zorganizowało niezapomniane obchody Święta Niepodległości, które zgromadziły ponad 200 członków społeczności.",
            "image": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=400&fit=crop",
            "published": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2025-01-15",
            "title_en": "New Polish Language Classes Starting in February",
            "title_pl": "Nowe zajęcia z języka polskiego od lutego",
            "summary_en": "We are excited to announce new beginner Polish language classes for adults starting in February. Register now to secure your place.",
            "summary_pl": "Z radością ogłaszamy nowe zajęcia z języka polskiego dla początkujących dorosłych, rozpoczynające się w lutym. Zarejestruj się teraz, aby zarezerwować miejsce.",
            "content_en": "New Polish language courses will be available for all skill levels starting February 2025.",
            "content_pl": "Nowe kursy języka polskiego będą dostępne dla wszystkich poziomów zaawansowania od lutego 2025.",
            "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
            "published": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2025-01-08",
            "title_en": "Rzeszowiacy Dance Group Wins Regional Competition",
            "title_pl": "Zespół Taneczny Rzeszowiacy wygrywa konkurs regionalny",
            "summary_en": "Congratulations to our Rzeszowiacy Dance Group for their outstanding performance and first place win at the NSW Folk Dance Competition.",
            "summary_pl": "Gratulacje dla naszego Zespołu Tanecznego Rzeszowiacy za wspaniały występ i zajęcie pierwszego miejsca w Konkursie Tańców Ludowych NSW.",
            "content_en": "Our beloved Rzeszowiacy Dance Group has achieved a remarkable victory at the NSW Folk Dance Competition.",
            "content_pl": "Nasz ukochany Zespół Taneczny Rzeszowiacy odniósł wspaniałe zwycięstwo w Konkursie Tańców Ludowych NSW.",
            "image": "https://images.pexels.com/photos/34337833/pexels-photo-34337833.jpeg?w=600&h=400&fit=crop",
            "published": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2024-12-20",
            "title_en": "Christmas Wigilia Dinner Brings Community Together",
            "title_pl": "Kolacja Wigilijna jednoczy społeczność",
            "summary_en": "Our annual Wigilia dinner was a wonderful evening of traditional Polish Christmas customs, delicious food, and community spirit.",
            "summary_pl": "Nasza coroczna kolacja wigilijna była wspaniałym wieczorem tradycyjnych polskich zwyczajów bożonarodzeniowych, pysznego jedzenia i ducha wspólnoty.",
            "content_en": "The annual Wigilia dinner brought together families from across the Newcastle Polish community.",
            "content_pl": "Coroczna kolacja wigilijna zgromadziła rodziny z całej polskiej społeczności Newcastle.",
            "image": "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&h=400&fit=crop",
            "published": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "date": "2024-12-05",
            "title_en": "Hall Renovations Complete",
            "title_pl": "Remont sali zakończony",
            "summary_en": "We are pleased to announce the completion of our hall renovation project, including new flooring, lighting, and air conditioning.",
            "summary_pl": "Z przyjemnością ogłaszamy zakończenie projektu remontu naszej sali, w tym nowe podłogi, oświetlenie i klimatyzację.",
            "content_en": "After months of work, our community hall has been fully renovated with modern amenities.",
            "content_pl": "Po miesiącach prac nasza sala społeczności została w pełni odnowiona z nowoczesnymi udogodnieniami.",
            "image": "https://images.unsplash.com/photo-1747296252929-ca8fbe6d238c?w=600&h=400&fit=crop",
            "published": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = await news_collection.insert_many(news_articles)
    print(f"Successfully seeded {len(result.inserted_ids)} news articles")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_news())
