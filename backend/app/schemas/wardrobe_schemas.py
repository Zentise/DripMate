from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime


class ItemCategory(str, Enum):
    clothing = "clothing"
    footwear = "footwear"
    accessory = "accessory"


class WardrobeItemBase(BaseModel):
    category: ItemCategory
    name: str = Field(..., max_length=200)
    color: Optional[str] = Field(None, max_length=100)
    season: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = Field(None, max_length=500)


class WardrobeItemCreate(WardrobeItemBase):
    pass


class WardrobeItemUpdate(BaseModel):
    category: Optional[ItemCategory] = None
    name: Optional[str] = Field(None, max_length=200)
    color: Optional[str] = Field(None, max_length=100)
    season: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = Field(None, max_length=500)


class WardrobeItemOut(WardrobeItemBase):
    id: int

    class Config:
        from_attributes = True


class FavoriteOutfitCreate(BaseModel):
    title: Optional[str] = None
    source_item: Optional[str] = None
    vibe: Optional[str] = None
    payload: dict


class FavoriteOutfitOut(BaseModel):
    id: int
    title: Optional[str]
    source_item: Optional[str]
    vibe: Optional[str]
    payload: dict
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileOut(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    wardrobe_count: int
    favorites_count: int
