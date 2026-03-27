from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import Response
import uuid
from pathlib import Path
import base64

upload_router = APIRouter(prefix="/api", tags=["uploads"])

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf', '.doc', '.docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024

CONTENT_TYPES = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf', '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

def get_files_collection():
    from models import get_database
    db = get_database()
    return db['uploaded_files']

@upload_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed.")

    await file.seek(0)
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large.")

    unique_filename = f"{uuid.uuid4()}{ext}"
    content_type = CONTENT_TYPES.get(ext, file.content_type)

    collection = get_files_collection()
    await collection.insert_one({
        "filename": unique_filename,
        "content": base64.b64encode(content).decode('utf-8'),
        "content_type": content_type,
        "size": len(content),
        "original_name": file.filename
    })

    return {"filename": unique_filename, "url": f"/api/uploads/{unique_filename}", "size": len(content), "content_type": content_type}

@upload_router.post("/upload/document")
async def upload_document(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed.")

    await file.seek(0)
    content = await file.read()
    if len(content) > MAX_DOCUMENT_SIZE:
        raise HTTPException(status_code=400, detail="File too large.")

    original_name = Path(file.filename).stem
    unique_filename = f"{uuid.uuid4()}_{original_name}{ext}"
    content_type = CONTENT_TYPES.get(ext, file.content_type)

    collection = get_files_collection()
    await collection.insert_one({
        "filename": unique_filename,
        "content": base64.b64encode(content).decode('utf-8'),
        "content_type": content_type,
        "size": len(content),
        "original_name": file.filename
    })

    return {"filename": unique_filename, "original_name": file.filename, "url": f"/api/uploads/{unique_filename}", "size": len(content), "content_type": content_type}

@upload_router.get("/uploads/{filename}")
async def serve_file(filename: str):
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    collection = get_files_collection()
    file_doc = await collection.find_one({"filename": filename}, {"_id": 0})

    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")

    content = base64.b64decode(file_doc["content"])
    content_type = file_doc.get("content_type", "application/octet-stream")

    return Response(content=content, media_type=content_type, headers={"Cache-Control": "public, max-age=31536000"})

@upload_router.delete("/upload/{filename}")
async def delete_image(filename: str):
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    collection = get_files_collection()
    result = await collection.delete_one({"filename": filename})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="File not found")

    return {"message": "File deleted successfully"}
