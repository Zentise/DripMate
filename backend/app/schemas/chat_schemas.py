from pydantic import BaseModel, Field
from typing import List, Optional

# --- Request Models ---
class ChatRequest(BaseModel):
    # Required fields
    item: str
    vibe: str
    gender: str
    
    # Optional fields
    age_group: Optional[str] = None
    skin_colour: Optional[str] = None
    num_ideas: int = Field(default=1, ge=1, le=3)
    more_details: Optional[str] = None
    layering_preference: str = "AI Decides" # New field with a default

# --- Response Models ---
class OutfitItem(BaseModel):
    name: str
    reason: str

class Outfit(BaseModel):
    id: int
    top: Optional[OutfitItem] = None
    bottom: Optional[OutfitItem] = None
    layer: Optional[OutfitItem] = None
    footwear: Optional[OutfitItem] = None

class ChatResponse(BaseModel):
    outfits: List[Outfit]