from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
import os
import uuid
from pathlib import Path
import base64
from pymongo import MongoClient

upload_router = APIRouter(prefix="/api", tags=["uploads"])

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf', '.doc', '.docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024  # 50MB for documents

CONTENT_TYPES = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf', '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

def get_db():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    client = MongoClient(mongo_url)
    return client[db_name]

def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

@upload_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and store it in MongoDB"""
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")

    await file.seek(0)
    content = await file.read()
    file_size = len(content)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB")

    unique_filename = f"{uuid.uuid4()}{ext}"
    content_type = CONTENT_TYPES.get(ext, file.content_type)

    db = get_db()
    db.uploaded_files.insert_one({
        "filename": unique_filename,
        "content": base64.b64encode(content).decode('utf-8'),
        "content_type": content_type,
        "size": file_size,
        "original_name": file.filename
    })

    return {
        "filename": unique_filename,
        "url": f"/api/uploads/{unique_filename}",
        "size": file_size,
        "content_type": content_type
    }

@upload_router.post("/upload/document")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document file and store it in MongoDB"""
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_DOCUMENT_EXTENSIONS)}")

    await file.seek(0)
    content = await file.read()
    file_size = len(content)

    if file_size > MAX_DOCUMENT_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {MAX_DOCUMENT_SIZE // (1024*1024)}MB")

    original_name = Path(file.filename).stem
    unique_filename = f"{uuid.uuid4()}_{original_name}{ext}"
    content_type = CONTENT_TYPES.get(ext, file.content_type)

    db = get_db()
    db.uploaded_files.insert_one({
        "filename": unique_filename,
        "content": base64.b64encode(content).decode('utf-8'),
        "content_type": content_type,
        "size": file_size,
        "original_name": file.filename
    })

    return {
        "filename": unique_filename,
        "original_name": file.filename,
        "url": f"/api/uploads/{unique_filename}",
        "size": file_size,
        "content_type": content_type
    }

@upload_router.get("/uploads/{filename}")
async def serve_file(filename: str):
    """Serve an uploaded file from MongoDB"""
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    db = get_db()
    file_doc = db.uploaded_files.find_one({"filename": filename}, {"_id": 0})

    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    content = base64.b64decode(file_doc["content"])
    content_type = file_doc.get("content_type", "application/octet-stream")

    return Response(
        content=content,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=31536000"}
    )

@upload_router.delete("/upload/{filename}")
async def delete_image(filename: str):
    """Delete an uploaded file from MongoDB"""
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    db = get_db()
    result = db.uploaded_files.delete_one({"filename": filename})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="File not found")

    return {"message": "File deleted successfully"}
