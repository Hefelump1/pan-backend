"""
Authentication routes for admin login and user management
"""
from fastapi import APIRouter, HTTPException, status, Depends
from models import AdminUser, AdminUserCreate, AdminUserLogin, Token, admin_users_collection
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token,
    get_current_user
)
from datetime import timedelta

auth_router = APIRouter(prefix="/api/auth", tags=["authentication"])

@auth_router.post("/register", response_model=AdminUser, status_code=status.HTTP_201_CREATED)
async def register_admin(user: AdminUserCreate):
    """Register a new admin user"""
    # Check if username already exists
    existing = await admin_users_collection.find_one({"username": user.username})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = await admin_users_collection.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new admin user
    admin_dict = user.dict()
    admin_dict["hashed_password"] = get_password_hash(admin_dict.pop("password"))
    admin_obj = AdminUser(**admin_dict)
    
    await admin_users_collection.insert_one(admin_obj.dict())
    return admin_obj

@auth_router.post("/login", response_model=Token)
async def login(credentials: AdminUserLogin):
    """Login admin user and return JWT token"""
    # Find user
    user = await admin_users_collection.find_one({"username": credentials.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user["username"], "user_id": user["id"]},
        expires_delta=timedelta(minutes=1440)  # 24 hours
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information"""
    user = await admin_users_collection.find_one({"username": current_user["username"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove sensitive data
    user.pop("hashed_password", None)
    user.pop("_id", None)
    
    return user

@auth_router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout current user (client-side token removal)"""
    return {"message": "Successfully logged out"}


from pydantic import BaseModel

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@auth_router.post("/change-password")
async def change_password(password_data: PasswordChange, current_user: dict = Depends(get_current_user)):
    """Change password for current authenticated user"""
    # Get user from database
    user = await admin_users_collection.find_one({"username": current_user["username"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(password_data.current_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long"
        )
    
    if password_data.current_password == password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Update password
    new_hashed_password = get_password_hash(password_data.new_password)
    await admin_users_collection.update_one(
        {"username": current_user["username"]},
        {"$set": {"hashed_password": new_hashed_password}}
    )
    
    return {"message": "Password changed successfully"}
