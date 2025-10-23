from pydantic import BaseModel
from typing import Optional

class ClothBase(BaseModel):
    item_type: str
    color: Optional[str] = None
    material: Optional[str] = None
    fit: Optional[str] = None
    vibe_tags: Optional[str] = None  # comma-separated tags

class ClothCreate(ClothBase):
    pass

class ClothOut(ClothBase):
    id: int

    class Config:
        from_attributes = True
