from sqlalchemy import Column, Integer, String
from .database import Base

# This is our SQLAlchemy model for a piece of clothing.
# It defines the structure of the 'clothes' table in our database.
class Cloth(Base):
    __tablename__ = "clothes"

    # The primary key for the table. Each item will have a unique ID.
    id = Column(Integer, primary_key=True, index=True)

    # We use 'index=True' on columns that we might want to search or filter by later.
    item_type = Column(String, index=True) # e.g., "Shirt", "Pants", "Jacket"
    color = Column(String, index=True)     # e.g., "Black", "Powder Pink"
    material = Column(String)              # e.g., "Cotton", "Leather"
    fit = Column(String)                   # e.g., "Slim Fit", "Oversized"
    vibe_tags = Column(String)             # e.g., "streetwear, casual"
