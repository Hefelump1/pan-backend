from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os
import uuid
import shutil
from pathlib import Path

upload_router = APIRouter(prefix="/api", tags=["uploads"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
ALLOWED_DOCUMENT_EXTENSIONS = {'.pdf', '.doc', '.docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024  # 50MB for documents

def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

@upload_router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return its URL"""
    
    # Validate file extension
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )
    
    # Reset file position
    await file.seek(0)
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Return the URL path (will be served by static files)
    return {
        "filename": unique_filename,
        "url": f"/api/uploads/{unique_filename}",
        "size": file_size,
        "content_type": file.content_type
    }


@upload_router.post("/upload/document")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document file (PDF, DOC, DOCX) and return its URL"""
    
    # Validate file extension
    ext = get_file_extension(file.filename)
    if ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_DOCUMENT_EXTENSIONS)}"
        )
    
    # Reset file position
    await file.seek(0)
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_DOCUMENT_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_DOCUMENT_SIZE // (1024*1024)}MB"
        )
    
    # Generate unique filename preserving original name for reference
    original_name = Path(file.filename).stem
    unique_filename = f"{uuid.uuid4()}_{original_name}{ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Return the URL path (will be served by static files)
    return {
        "filename": unique_filename,
        "original_name": file.filename,
        "url": f"/api/uploads/{unique_filename}",
        "size": file_size,
        "content_type": file.content_type
    }

@upload_router.delete("/upload/{filename}")
async def delete_image(filename: str):
    """Delete an uploaded image"""
    file_path = UPLOAD_DIR / filename
    
    # Security check - ensure filename doesn't contain path traversal
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        file_path.unlink()
        return {"message": "File deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
