"""
Create initial admin user for the system
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import sys
sys.path.append('/app/backend')
from auth import get_password_hash

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

async def create_admin():
    """Create initial admin user"""
    try:
        # Check if admin already exists
        existing = await db.admin_users.find_one({"username": "admin"})
        if existing:
            print("✓ Admin user already exists")
            print(f"  Username: admin")
            return
        
        # Create admin user
        admin_user = {
            "id": "admin-001",
            "username": "admin",
            "email": "admin@polishassociationnewcastle.org.au",
            "hashed_password": get_password_hash("#ZwiazekPolski1"),
            "full_name": "Administrator",
            "is_active": True,
            "is_superuser": True
        }
        
        await db.admin_users.insert_one(admin_user)
        print("✅ Admin user created successfully!")
        print(f"  Username: admin")
        print(f"  Password: #ZwiazekPolski1")
        print(f"  Email: admin@polishassociationnewcastle.org.au")
        print("\n⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
