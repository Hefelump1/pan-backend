from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Load environment variables FIRST, before importing other modules
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Now import routes that depend on environment variables
from routes import router
from auth_routes import auth_router
from upload_routes import upload_router

# Create the main app
app = FastAPI(title="Polish Association of Newcastle API", version="1.0.0")

# Create uploads directory if it doesn't exist
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Mount static files for uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include API routes
app.include_router(router)
app.include_router(auth_router)
app.include_router(upload_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Health check endpoints - BOTH paths to ensure Railway finds it
@app.get("/")
async def root():
    return {"status": "ok", "service": "Polish Association API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Polish Association API"}

@app.get("/api/health")
async def api_health_check():
    return {"status": "healthy", "service": "Polish Association API"}
