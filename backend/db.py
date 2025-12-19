"""
Database setup and models for DripMate.
Simple SQLite database with SQLAlchemy.
"""
from sqlalchemy import create_engine, Column, Integer, String, Enum, ForeignKey, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import enum

from config import DB_URL


# Database setup
engine = create_engine(
    DB_URL,
    connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Enums
class ItemCategory(str, enum.Enum):
    clothing = "clothing"
    footwear = "footwear"
    accessory = "accessory"


# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Guest")
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    gender = Column(String(50), nullable=True)
    age_group = Column(String(50), nullable=True)
    skin_colour = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    wardrobe_items = relationship("WardrobeItem", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("FavoriteOutfit", back_populates="user", cascade="all, delete-orphan")


class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    category = Column(Enum(ItemCategory), nullable=False)
    name = Column(String(200), nullable=False)
    color = Column(String(100), nullable=True)
    season = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    notes = Column(String(500), nullable=True)
    
    user = relationship("User", back_populates="wardrobe_items")


class FavoriteOutfit(Base):
    __tablename__ = "favorite_outfits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title = Column(String(200), nullable=True)
    source_item = Column(String(200), nullable=True)
    vibe = Column(String(100), nullable=True)
    payload = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="favorites")


# Helper functions
def get_db():
    """Dependency for FastAPI routes to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)
    print("✓ Database initialized")


def get_or_create_guest_user(db):
    """Get or create default guest user (ID=1)."""
    user = db.query(User).filter(User.id == 1).first()
    if user:
        return user
    try:
        user = User(id=1, name="Guest", email="guest@dripmate.local", hashed_password="n/a")
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        return db.query(User).filter(User.id == 1).first()
