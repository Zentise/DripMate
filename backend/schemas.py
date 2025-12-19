"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum


# Enums
class ItemCategory(str, Enum):
    clothing = "clothing"
    footwear = "footwear"
    accessory = "accessory"


# Auth schemas
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    gender: str
    age_group: Optional[str] = None
    skin_colour: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    gender: str
    age_group: Optional[str] = None
    skin_colour: Optional[str] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# Chat request/response schemas
class ChatRequest(BaseModel):
    """Request model for outfit suggestions."""
    # Required
    item: str
    vibe: str
    
    # Optional (uses user profile if not provided)
    gender: Optional[str] = None
    age_group: Optional[str] = None
    skin_colour: Optional[str] = None
    num_ideas: int = Field(default=1, ge=1, le=3)
    more_details: Optional[str] = None
    layering_preference: str = "AI Decides"
    use_wardrobe_only: bool = False
    
    # Model selection
    ai_provider: str = "groq"  # "groq", "gemini" or "ollama"
    model: str = "llama-3.3-70b"


class OutfitItem(BaseModel):
    """Single item in an outfit."""
    name: str
    reason: str


class Outfit(BaseModel):
    """Complete outfit suggestion."""
    id: int
    item1: OutfitItem
    item2: OutfitItem
    footwear: OutfitItem


class ChatResponse(BaseModel):
    """Response model for outfit suggestions."""
    outfits: List[Outfit]


# Image upload schemas
class ImageUploadResponse(BaseModel):
    """Response from image-based outfit analysis."""
    detected_item: Optional[dict] = None
    outfits: List[dict] = []
    error: Optional[str] = None


# Wardrobe schemas
class WardrobeItemCreate(BaseModel):
    category: ItemCategory
    name: str = Field(..., max_length=200)
    color: Optional[str] = Field(None, max_length=100)
    season: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = Field(None, max_length=500)


class WardrobeItemOut(BaseModel):
    id: int
    category: ItemCategory
    name: str
    color: Optional[str]
    season: Optional[str]
    image_url: Optional[str]
    notes: Optional[str]
    
    class Config:
        from_attributes = True


# Favorites schemas
class FavoriteCreate(BaseModel):
    title: Optional[str] = None
    source_item: Optional[str] = None
    vibe: Optional[str] = None
    payload: dict  # The outfit JSON


class FavoriteOut(BaseModel):
    id: int
    title: Optional[str]
    source_item: Optional[str]
    vibe: Optional[str]
    payload: str  # JSON string
    created_at: datetime
    
    class Config:
        from_attributes = True
