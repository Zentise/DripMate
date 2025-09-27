from pydantic import BaseModel

# This defines the structure of the data we expect to RECEIVE from the frontend
class ChatRequest(BaseModel):
    clothing_desc: str
    vibe: str

# This defines a single item in the outfit suggestion
class OutfitItem(BaseModel):
    name: str
    reason: str

# This defines the structure of the data we will SEND BACK to the frontend
class ChatResponse(BaseModel):
    item1: OutfitItem
    item2: OutfitItem
    footwear: OutfitItem