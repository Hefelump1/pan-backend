"""
Migration script to update image URLs for single-domain setup.
Run this ONCE after deploying to Vodien.

Usage:
    python migrate_urls.py
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

OLD_DOMAIN = "https://pan-staging-build.preview.emergentagent.com"
NEW_DOMAIN = "https://polishassociationnewcastle.org.au"

async def migrate_urls():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'pan_database')
    
    if not mongo_url:
        print("❌ MONGO_URL not set in environment")
        return
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"Connected to database: {db_name}")
    print(f"Migrating URLs from {OLD_DOMAIN} to {NEW_DOMAIN}")
    print("-" * 50)
    
    # Collections and fields to update
    collections_fields = {
        'committee': ['image'],
        'news': ['image'],
        'events': ['image'],
        'groups': ['image'],
        'settings': [
            'hero_image', 'welcome_image',
            'hall_image_1', 'hall_image_2', 'hall_image_3',
            'hall_image_4', 'hall_image_5', 'hall_image_6',
            'agm_document_url', 'membership_form_url'
        ],
        'governance_documents': ['file_url']
    }
    
    total_updated = 0
    
    for collection_name, fields in collections_fields.items():
        collection = db[collection_name]
        updated_count = 0
        
        async for doc in collection.find({}):
            updates = {}
            for field in fields:
                value = doc.get(field)
                if value and isinstance(value, str) and OLD_DOMAIN in value:
                    new_value = value.replace(OLD_DOMAIN, NEW_DOMAIN)
                    updates[field] = new_value
            
            if updates:
                await collection.update_one(
                    {'_id': doc['_id']},
                    {'$set': updates}
                )
                updated_count += 1
        
        if updated_count > 0:
            print(f"✅ {collection_name}: Updated {updated_count} documents")
            total_updated += updated_count
        else:
            print(f"   {collection_name}: No updates needed")
    
    print("-" * 50)
    print(f"✅ Migration complete! Total documents updated: {total_updated}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_urls())
