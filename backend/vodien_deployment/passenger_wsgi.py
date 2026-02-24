import sys
import os

# Add the application directory to the Python path
app_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, app_dir)

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(os.path.join(app_dir, '.env'))

# Import the FastAPI app and create ASGI application
from server import app as application
