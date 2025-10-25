from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base


class ItemCategory(str, enum.Enum):
    clothing = "clothing"
    footwear = "footwear"
    accessory = "accessory"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Guest")
    email = Column(String(255), unique=True, nullable=True)

    wardrobe_items = relationship("WardrobeItem", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("FavoriteOutfit", back_populates="user", cascade="all, delete-orphan")


class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    category = Column(Enum(ItemCategory), nullable=False)
    name = Column(String(200), nullable=False)
    color = Column(String(100), nullable=True)
    season = Column(String(50), nullable=True)  # e.g., summer, winter, all-season
    image_url = Column(String(500), nullable=True)
    notes = Column(String(500), nullable=True)

    user = relationship("User", back_populates="wardrobe_items")


class FavoriteOutfit(Base):
    __tablename__ = "favorite_outfits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=True)  # Optional title
    source_item = Column(String(200), nullable=True)  # The base item
    vibe = Column(String(100), nullable=True)
    payload = Column(Text, nullable=False)  # Store the JSON of the single outfit idea
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="favorites")
