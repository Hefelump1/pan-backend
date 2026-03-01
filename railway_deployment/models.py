from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import os
import uuid
import logging

logger = logging.getLogger(__name__)

# MongoDB connection - lazy initialization
_client = None
_db = None

def get_database():
    global _client, _db
    if _db is None:
        mongo_url = os.environ.get('MONGO_URL')
        db_name = os.environ.get('DB_NAME', 'pan_database')
        
        if not mongo_url:
            logger.error("MONGO_URL environment variable not set!")
            raise RuntimeError("MONGO_URL environment variable is required")
        
        logger.info(f"Connecting to MongoDB database: {db_name}")
        _client = AsyncIOMotorClient(mongo_url)
        _db = _client[db_name]
    
    return _db

# Lazy database accessor
class LazyDB:
    def __getattr__(self, name):
        return getattr(get_database(), name)
    
    def __getitem__(self, name):
        return get_database()[name]

db = LazyDB()

# Pydantic Models
class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    title_pl: Optional[str] = None
    date: str
    time: str
    location: str
    location_pl: Optional[str] = None
    description: str
    description_pl: Optional[str] = None
    category: str
    image: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EventCreate(BaseModel):
    title: str
    title_pl: Optional[str] = None
    date: str
    time: str
    location: str
    location_pl: Optional[str] = None
    description: str
    description_pl: Optional[str] = None
    category: str
    image: Optional[str] = None
    website: Optional[str] = None

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day: str
    name_en: str
    name_pl: str
    time: str
    description_en: Optional[str] = None
    description_pl: Optional[str] = None
    contact: Optional[str] = None
    order: int = 0
    is_visible: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ActivityCreate(BaseModel):
    day: str
    name_en: str
    name_pl: str
    time: str
    description_en: Optional[str] = None
    description_pl: Optional[str] = None
    contact: Optional[str] = None
    order: int = 0
    is_visible: bool = True

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    event_type: str
    date: str
    guests: int
    message: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    name: str
    email: str
    phone: str
    event_type: str
    date: str
    guests: int
    message: Optional[str] = None

class CommitteeMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    position_pl: Optional[str] = None
    bio: Optional[str] = None
    bio_pl: Optional[str] = None
    image: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CommitteeMemberCreate(BaseModel):
    name: str
    position: str
    position_pl: Optional[str] = None
    bio: Optional[str] = None
    bio_pl: Optional[str] = None
    image: Optional[str] = None
    order: int = 0

class AssociatedGroup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_pl: str
    description_en: Optional[str] = None
    description_pl: Optional[str] = None
    schedule_en: Optional[str] = None
    schedule_pl: Optional[str] = None
    contact: Optional[str] = None
    website: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AssociatedGroupCreate(BaseModel):
    name_en: str
    name_pl: str
    description_en: Optional[str] = None
    description_pl: Optional[str] = None
    schedule_en: Optional[str] = None
    schedule_pl: Optional[str] = None
    contact: Optional[str] = None
    website: Optional[str] = None
    image: Optional[str] = None

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminUserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class AdminUserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title_en: str
    title_pl: str
    summary_en: Optional[str] = None
    summary_pl: Optional[str] = None
    content_en: Optional[str] = None
    content_pl: Optional[str] = None
    image: Optional[str] = None
    date: str
    published: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class NewsArticleCreate(BaseModel):
    title_en: str
    title_pl: str
    summary_en: Optional[str] = None
    summary_pl: Optional[str] = None
    content_en: Optional[str] = None
    content_pl: Optional[str] = None
    image: Optional[str] = None
    date: str
    published: bool = False

# Site Settings Model (for Home page customization)
class SiteSettings(BaseModel):
    id: str = "site_settings"
    hero_image: Optional[str] = None
    welcome_image: Optional[str] = None
    hero_title_en: Optional[str] = None
    hero_title_pl: Optional[str] = None
    hero_subtitle_en: Optional[str] = None
    hero_subtitle_pl: Optional[str] = None
    welcome_text1_en: Optional[str] = None
    welcome_text1_pl: Optional[str] = None
    welcome_text2_en: Optional[str] = None
    welcome_text2_pl: Optional[str] = None
    # Hall Hire images (up to 6 images)
    hall_image_1: Optional[str] = None
    hall_image_2: Optional[str] = None
    hall_image_3: Optional[str] = None
    hall_image_4: Optional[str] = None
    hall_image_5: Optional[str] = None
    hall_image_6: Optional[str] = None
    # AGM Notice settings
    agm_title_en: Optional[str] = None
    agm_title_pl: Optional[str] = None
    agm_date_en: Optional[str] = None
    agm_date_pl: Optional[str] = None
    agm_time_en: Optional[str] = None
    agm_time_pl: Optional[str] = None
    agm_description_en: Optional[str] = None
    agm_description_pl: Optional[str] = None
    agm_document_url: Optional[str] = None
    # Membership form
    membership_form_url: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SiteSettingsUpdate(BaseModel):
    hero_image: Optional[str] = None
    welcome_image: Optional[str] = None
    hero_title_en: Optional[str] = None
    hero_title_pl: Optional[str] = None
    hero_subtitle_en: Optional[str] = None
    hero_subtitle_pl: Optional[str] = None
    welcome_text1_en: Optional[str] = None
    welcome_text1_pl: Optional[str] = None
    welcome_text2_en: Optional[str] = None
    welcome_text2_pl: Optional[str] = None
    # Hall Hire images
    hall_image_1: Optional[str] = None
    hall_image_2: Optional[str] = None
    hall_image_3: Optional[str] = None
    hall_image_4: Optional[str] = None
    hall_image_5: Optional[str] = None
    hall_image_6: Optional[str] = None
    # AGM Notice settings
    agm_title_en: Optional[str] = None
    agm_title_pl: Optional[str] = None
    agm_date_en: Optional[str] = None
    agm_date_pl: Optional[str] = None
    agm_time_en: Optional[str] = None
    agm_time_pl: Optional[str] = None
    agm_description_en: Optional[str] = None
    agm_description_pl: Optional[str] = None
    agm_document_url: Optional[str] = None
    # Membership form
    membership_form_url: Optional[str] = None

# Governance Document Model
class GovernanceDocument(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    file_url: str
    file_type: str  # pdf, doc, docx
    file_size: int = 0
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GovernanceDocumentCreate(BaseModel):
    title: str
    file_url: str
    file_type: str
    file_size: int = 0
    order: int = 0

# Collections - these now use lazy loading
events_collection = db['events']
activities_collection = db['activities']
bookings_collection = db['bookings']
committee_collection = db['committee']
groups_collection = db['groups']
admin_users_collection = db['admin_users']
news_collection = db['news']
settings_collection = db['settings']
documents_collection = db['governance_documents']
