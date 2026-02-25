from fastapi import APIRouter, HTTPException, status
from typing import List
from models import (
    Event, EventCreate, events_collection,
    Activity, ActivityCreate, activities_collection,
    Booking, BookingCreate, bookings_collection,
    CommitteeMember, CommitteeMemberCreate, committee_collection,
    AssociatedGroup, AssociatedGroupCreate, groups_collection,
    NewsArticle, NewsArticleCreate, news_collection,
    SiteSettings, SiteSettingsUpdate, settings_collection,
    GovernanceDocument, GovernanceDocumentCreate, documents_collection
)
from datetime import datetime
import uuid

router = APIRouter(prefix="/api", tags=["main"])

# ==================== EVENTS ====================
@router.get("/events", response_model=List[Event])
async def get_events():
    """Get all events"""
    events = await events_collection.find().sort("date", 1).to_list(1000)
    return [Event(**event) for event in events]

@router.post("/events", response_model=Event, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate):
    """Create new event (admin only)"""
    event_dict = event.dict()
    event_obj = Event(**event_dict)
    await events_collection.insert_one(event_obj.dict())
    return event_obj

@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    """Get single event by ID"""
    event = await events_collection.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return Event(**event)

@router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event: EventCreate):
    """Update event (admin only)"""
    existing = await events_collection.find_one({"id": event_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_dict = event.dict()
    update_dict["updated_at"] = datetime.utcnow()
    
    await events_collection.update_one(
        {"id": event_id},
        {"$set": update_dict}
    )
    
    updated = await events_collection.find_one({"id": event_id})
    return Event(**updated)

@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str):
    """Delete event (admin only)"""
    result = await events_collection.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return None

# ==================== ACTIVITIES ====================
@router.get("/activities")
async def get_activities():
    """Get all weekly activities (for admin - includes hidden)"""
    day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7}
    activities = await activities_collection.find({}, {"_id": 0}).to_list(1000)
    # Sort by day order then by order field
    activities.sort(key=lambda x: (day_order.get(x.get("day", ""), 8), x.get("order", 0)))
    return activities

@router.get("/activities/visible")
async def get_visible_activities():
    """Get only visible weekly activities (for public page)"""
    day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7}
    # Only get activities where is_visible is True or not set (for backwards compatibility)
    activities = await activities_collection.find(
        {"$or": [{"is_visible": True}, {"is_visible": {"$exists": False}}]}, 
        {"_id": 0}
    ).to_list(1000)
    # Sort by day order then by order field
    activities.sort(key=lambda x: (day_order.get(x.get("day", ""), 8), x.get("order", 0)))
    return activities

@router.post("/activities", response_model=Activity, status_code=status.HTTP_201_CREATED)
async def create_activity(activity: ActivityCreate):
    """Create new activity (admin only)"""
    activity_dict = activity.dict()
    activity_obj = Activity(**activity_dict)
    await activities_collection.insert_one(activity_obj.dict())
    return activity_obj

@router.put("/activities/{activity_id}", response_model=Activity)
async def update_activity(activity_id: str, activity: ActivityCreate):
    """Update activity (admin only)"""
    existing = await activities_collection.find_one({"id": activity_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    update_dict = activity.dict()
    update_dict["updated_at"] = datetime.utcnow()
    
    await activities_collection.update_one(
        {"id": activity_id},
        {"$set": update_dict}
    )
    
    updated = await activities_collection.find_one({"id": activity_id})
    return Activity(**updated)

@router.patch("/activities/{activity_id}/visibility")
async def toggle_activity_visibility(activity_id: str):
    """Toggle activity visibility (admin only)"""
    existing = await activities_collection.find_one({"id": activity_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    # Toggle the visibility
    current_visibility = existing.get("is_visible", True)
    new_visibility = not current_visibility
    
    await activities_collection.update_one(
        {"id": activity_id},
        {"$set": {"is_visible": new_visibility, "updated_at": datetime.utcnow()}}
    )
    
    updated = await activities_collection.find_one({"id": activity_id}, {"_id": 0})
    return updated

@router.delete("/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(activity_id: str):
    """Delete activity (admin only)"""
    result = await activities_collection.delete_one({"id": activity_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Activity not found")
    return None

# ==================== BOOKINGS ====================
@router.get("/bookings", response_model=List[Booking])
async def get_bookings():
    """Get all bookings (admin only)"""
    bookings = await bookings_collection.find().sort("created_at", -1).to_list(1000)
    return [Booking(**booking) for booking in bookings]

@router.post("/bookings", response_model=Booking, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate):
    """Create hall booking enquiry and send email notification"""
    from email_service import send_booking_notification
    
    booking_dict = booking.dict()
    booking_obj = Booking(**booking_dict)
    await bookings_collection.insert_one(booking_obj.dict())
    
    # Send email notification (non-blocking - don't fail the request if email fails)
    try:
        send_booking_notification(booking_obj.dict())
    except Exception as e:
        # Log the error but don't fail the booking creation
        import logging
        logging.error(f"Failed to send booking notification email: {e}")
    
    return booking_obj

@router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    """Get single booking"""
    booking = await bookings_collection.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**booking)

@router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str):
    """Update booking status (admin only)"""
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await bookings_collection.update_one(
        {"id": booking_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    updated = await bookings_collection.find_one({"id": booking_id})
    return Booking(**updated)

# ==================== COMMITTEE ====================
@router.get("/committee", response_model=List[CommitteeMember])
async def get_committee():
    """Get all committee members"""
    members = await committee_collection.find().sort("order", 1).to_list(1000)
    return [CommitteeMember(**member) for member in members]

@router.post("/committee", response_model=CommitteeMember, status_code=status.HTTP_201_CREATED)
async def create_committee_member(member: CommitteeMemberCreate):
    """Add committee member (admin only)"""
    member_dict = member.dict()
    member_obj = CommitteeMember(**member_dict)
    await committee_collection.insert_one(member_obj.dict())
    return member_obj

@router.put("/committee/{member_id}", response_model=CommitteeMember)
async def update_committee_member(member_id: str, member: CommitteeMemberCreate):
    """Update committee member (admin only)"""
    existing = await committee_collection.find_one({"id": member_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Member not found")
    
    update_dict = member.dict()
    update_dict["updated_at"] = datetime.utcnow()
    
    await committee_collection.update_one(
        {"id": member_id},
        {"$set": update_dict}
    )
    
    updated = await committee_collection.find_one({"id": member_id})
    return CommitteeMember(**updated)

@router.delete("/committee/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_committee_member(member_id: str):
    """Delete committee member (admin only)"""
    result = await committee_collection.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Member not found")
    return None

# ==================== ASSOCIATED GROUPS ====================
@router.get("/groups")
async def get_groups():
    """Get all associated groups"""
    groups = await groups_collection.find({}, {"_id": 0}).to_list(1000)
    return groups

@router.post("/groups", response_model=AssociatedGroup, status_code=status.HTTP_201_CREATED)
async def create_group(group: AssociatedGroupCreate):
    """Create associated group (admin only)"""
    group_dict = group.dict()
    group_obj = AssociatedGroup(**group_dict)
    await groups_collection.insert_one(group_obj.dict())
    return group_obj

@router.put("/groups/{group_id}", response_model=AssociatedGroup)
async def update_group(group_id: str, group: AssociatedGroupCreate):
    """Update associated group (admin only)"""
    existing = await groups_collection.find_one({"id": group_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Group not found")
    
    update_dict = group.dict()
    update_dict["updated_at"] = datetime.utcnow()
    
    await groups_collection.update_one(
        {"id": group_id},
        {"$set": update_dict}
    )
    
    updated = await groups_collection.find_one({"id": group_id})
    return AssociatedGroup(**updated)

@router.delete("/groups/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(group_id: str):
    """Delete associated group (admin only)"""
    result = await groups_collection.delete_one({"id": group_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Group not found")
    return None

# ==================== NEWS ====================
@router.get("/news")
async def get_news():
    """Get all news articles"""
    news = await news_collection.find({}, {"_id": 0}).sort("date", -1).to_list(1000)
    return news

@router.get("/news/published")
async def get_published_news():
    """Get only published news articles"""
    news = await news_collection.find({"published": True}, {"_id": 0}).sort("date", -1).to_list(1000)
    return news

@router.post("/news", response_model=NewsArticle, status_code=status.HTTP_201_CREATED)
async def create_news(news: NewsArticleCreate):
    """Create news article (admin only)"""
    news_dict = news.dict()
    news_obj = NewsArticle(**news_dict)
    await news_collection.insert_one(news_obj.dict())
    return news_obj

@router.get("/news/{news_id}")
async def get_news_article(news_id: str):
    """Get single news article by ID"""
    article = await news_collection.find_one({"id": news_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="News article not found")
    return article

@router.put("/news/{news_id}", response_model=NewsArticle)
async def update_news(news_id: str, news: NewsArticleCreate):
    """Update news article (admin only)"""
    existing = await news_collection.find_one({"id": news_id})
    if not existing:
        raise HTTPException(status_code=404, detail="News article not found")
    
    update_dict = news.dict()
    update_dict["updated_at"] = datetime.utcnow()
    
    await news_collection.update_one(
        {"id": news_id},
        {"$set": update_dict}
    )
    
    updated = await news_collection.find_one({"id": news_id}, {"_id": 0})
    return NewsArticle(**updated)

@router.delete("/news/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news(news_id: str):
    """Delete news article (admin only)"""
    result = await news_collection.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News article not found")
    return None

# ==================== SITE SETTINGS ====================
@router.get("/settings")
async def get_site_settings():
    """Get site settings for home page, hall hire, and AGM notice"""
    settings = await settings_collection.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        # Return default settings
        return {
            "id": "site_settings",
            "hero_image": "https://images.unsplash.com/photo-1768333377265-cb6c3ca2885a",
            "welcome_image": "https://images.unsplash.com/photo-1763733593826-d51c270cc8b4",
            "hero_title_en": None,
            "hero_title_pl": None,
            "hero_subtitle_en": None,
            "hero_subtitle_pl": None,
            "welcome_text1_en": None,
            "welcome_text1_pl": None,
            "welcome_text2_en": None,
            "welcome_text2_pl": None,
            "hall_image_1": None,
            "hall_image_2": None,
            "hall_image_3": None,
            "hall_image_4": None,
            "hall_image_5": None,
            "hall_image_6": None,
            "agm_title_en": None,
            "agm_title_pl": None,
            "agm_date_en": None,
            "agm_date_pl": None,
            "agm_time_en": None,
            "agm_time_pl": None,
            "agm_description_en": None,
            "agm_description_pl": None,
            "agm_document_url": None,
            "membership_form_url": None
        }
    return settings

@router.put("/settings")
async def update_site_settings(settings: SiteSettingsUpdate):
    """Update site settings (admin only)"""
    update_dict = {k: v for k, v in settings.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    update_dict["id"] = "site_settings"
    
    await settings_collection.update_one(
        {"id": "site_settings"},
        {"$set": update_dict},
        upsert=True
    )
    
    updated = await settings_collection.find_one({"id": "site_settings"}, {"_id": 0})
    return updated



# ==================== GOVERNANCE DOCUMENTS ====================
from pydantic import BaseModel as PydanticBaseModel

class DocumentReorderRequest(PydanticBaseModel):
    document_ids: List[str]

@router.get("/documents")
async def get_documents():
    """Get all governance documents ordered by order field"""
    documents = await documents_collection.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return documents

@router.post("/documents", response_model=GovernanceDocument, status_code=status.HTTP_201_CREATED)
async def create_document(document: GovernanceDocumentCreate):
    """Create governance document (admin only)"""
    # Get current max order
    max_order_doc = await documents_collection.find_one(sort=[("order", -1)])
    next_order = (max_order_doc.get("order", 0) + 1) if max_order_doc else 0
    
    document_dict = document.dict()
    document_dict["order"] = next_order
    document_obj = GovernanceDocument(**document_dict)
    await documents_collection.insert_one(document_obj.dict())
    return document_obj

@router.put("/documents/reorder")
async def reorder_documents(request: DocumentReorderRequest):
    """Reorder documents by providing array of document IDs in desired order"""
    for index, doc_id in enumerate(request.document_ids):
        await documents_collection.update_one(
            {"id": doc_id},
            {"$set": {"order": index, "updated_at": datetime.utcnow()}}
        )
    
    # Return updated documents
    documents = await documents_collection.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return documents

@router.put("/documents/{document_id}", response_model=GovernanceDocument)
async def update_document(document_id: str, document: GovernanceDocumentCreate):
    """Update governance document (admin only)"""
    existing = await documents_collection.find_one({"id": document_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Document not found")
    
    update_dict = document.dict()
    update_dict["updated_at"] = datetime.utcnow()
    
    await documents_collection.update_one(
        {"id": document_id},
        {"$set": update_dict}
    )
    
    updated = await documents_collection.find_one({"id": document_id}, {"_id": 0})
    return GovernanceDocument(**updated)

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: str):
    """Delete governance document (admin only)"""
    result = await documents_collection.delete_one({"id": document_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return None
