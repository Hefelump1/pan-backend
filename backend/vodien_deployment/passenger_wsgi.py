import sys
import os

# Add the application directory to the Python path
app_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, app_dir)

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(os.path.join(app_dir, '.env'))

# Import the FastAPI app
from server import app

# Create WSGI application for Passenger
# FastAPI/Starlette is ASGI, so we need an adapter
from asgiref.wsgi import WsgiToAsgi

# For Passenger, we need to expose the application
application = app
