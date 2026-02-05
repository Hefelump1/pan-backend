from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import os

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# Pydantic Models
class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    date: str
    time: str
    location: str
    description: str
    category: str
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EventCreate(BaseModel):
    title: str
    date: str
    time: str
    location: str
    description: str
    category: str
    image: Optional[str] = None

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    day: str
    name_en: str
    name_pl: str
    time: str
    description_en: str
    description_pl: str
    contact: str
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ActivityCreate(BaseModel):
    day: str
    name_en: str
    name_pl: str
    time: str
    description_en: str
    description_pl: str
    contact: str
    order: int = 0

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    event_type: str
    guests: int
    date: Optional[str] = None
    message: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    name: str
    email: str
    phone: str
    event_type: str
    guests: int
    date: Optional[str] = None
    message: Optional[str] = None

class CommitteeMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    position: str
    bio: str
    image: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CommitteeMemberCreate(BaseModel):
    name: str
    position: str
    bio: str
    image: Optional[str] = None
    order: int = 0

class AssociatedGroup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_en: str
    name_pl: str
    description_en: str
    description_pl: str
    schedule_en: str
    schedule_pl: str
    contact: str
    website: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AssociatedGroupCreate(BaseModel):
    name_en: str
    name_pl: str
    description_en: str
    description_pl: str
    schedule_en: str
    schedule_pl: str
    contact: str
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

# News Model (Bilingual)
class NewsArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title_en: str
    title_pl: str
    summary_en: str
    summary_pl: str
    content_en: Optional[str] = None
    content_pl: Optional[str] = None
    image: Optional[str] = None
    date: str
    published: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class NewsArticleCreate(BaseModel):
    title_en: str
    title_pl: str
    summary_en: str
    summary_pl: str
    content_en: Optional[str] = None
    content_pl: Optional[str] = None
    image: Optional[str] = None
    date: str
    published: bool = True

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

import uuid

# Collections
events_collection = db['events']
activities_collection = db['activities']
bookings_collection = db['bookings']
committee_collection = db['committee']
groups_collection = db['groups']
admin_users_collection = db['admin_users']
news_collection = db['news']
settings_collection = db['settings']
