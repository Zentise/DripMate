"""
DripMate - AI-Powered Fashion Assistant
Backend with auth, wardrobe, and favorites.
"""
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import tempfile
import shutil
import os
import json
from typing import Optional, List
from datetime import timedelta

from db import get_db, init_db, User, WardrobeItem, FavoriteOutfit
from schemas import (
    ChatRequest, ChatResponse, UserSignup, UserLogin, UserProfile, Token,
    WardrobeItemCreate, WardrobeItemOut, FavoriteCreate, FavoriteOut
)
from llm import get_style_suggestion, get_available_models
from vision import get_outfit_from_image
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Initialize FastAPI
app = FastAPI(
    title="DripMate API",
    description="AI-Powered Fashion Assistant with Gemini",
    version="2.0.0"
)

# CORS - Allow local network access for mobile devices
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local network access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()


@app.get("/")
def root():
    """API info."""
    return {
        "message": "Welcome to DripMate API!",
        "ai_engine": "Google Gemini",
        "version": "2.0.0",
        "features": ["Auth", "Wardrobe", "Favorites", "AI Outfit Suggestions"]
    }


# === AUTH ===

@app.post("/signup", response_model=Token)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """Register new user."""
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        gender=user_data.gender,
        age_group=user_data.age_group,
        skin_colour=user_data.skin_colour
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": new_user.email}, expires_delta=token_expires)
    
    return {"access_token": token, "token_type": "bearer"}


@app.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user."""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": user.email}, expires_delta=token_expires)
    
    return {"access_token": token, "token_type": "bearer"}


@app.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get user profile."""
    return current_user


# === CHAT ===

@app.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI outfit suggestions using user profile."""
    # Use user profile as defaults
    gender = request.gender or current_user.gender
    age_group = request.age_group or current_user.age_group
    skin_colour = request.skin_colour or current_user.skin_colour
    
    # Get wardrobe if requested
    wardrobe = None
    if request.use_wardrobe_only:
        items = db.query(WardrobeItem).filter(WardrobeItem.user_id == current_user.id).all()
        wardrobe = {
            "clothing": [i.name for i in items if i.category.value == "clothing"],
            "accessory": [i.name for i in items if i.category.value == "accessory"],
            "footwear": [i.name for i in items if i.category.value == "footwear"],
        }
    
    result = get_style_suggestion(
        item=request.item,
        vibe=request.vibe,
        gender=gender,
        age_group=age_group,
        skin_colour=skin_colour,
        num_ideas=request.num_ideas,
        more_details=request.more_details,
        layering_preference=request.layering_preference,
        wardrobe=wardrobe,
        provider=request.ai_provider,
        model_name=request.model,
    )
    
    if not result.get("outfits"):
        raise HTTPException(status_code=500, detail=result.get("error", "Failed to generate outfits"))
    
    return result


@app.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
    use_wardrobe: bool = Form(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload image for outfit suggestions."""
    ALLOWED = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    tmpdir = tempfile.mkdtemp(prefix="dripmate_")
    try:
        ext = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp"
        }[file.content_type]
        
        tmp_path = os.path.join(tmpdir, f"upload{ext}")
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        wardrobe_items = None
        if use_wardrobe:
            items = db.query(WardrobeItem).filter(WardrobeItem.user_id == current_user.id).all()
            wardrobe_items = [
                {"id": i.id, "category": i.category.value, "name": i.name, "color": i.color}
                for i in items
            ]
        
        result = get_outfit_from_image(tmp_path, user_prompt=prompt, wardrobe_items=wardrobe_items)
        return result
    finally:
        try:
            shutil.rmtree(tmpdir)
        except:
            pass


@app.get("/models")
def models():
    """Get available AI models."""
    available = get_available_models()
    return {
        "default_provider": "gemini",
        "providers": {
            "gemini": {
                "name": "Google Gemini",
                "available": available["gemini"]["available"],
                "models": available["gemini"]["models"],
                "default": available["gemini"]["default"],
            },
            "ollama": {
                "name": "Ollama (Local)",
                "available": available["ollama"]["available"],
                "models": available["ollama"]["models"],
                "default": available["ollama"]["default"],
            }
        }
    }


# === WARDROBE ===

@app.get("/wardrobe", response_model=List[WardrobeItemOut])
def get_wardrobe(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all wardrobe items."""
    return db.query(WardrobeItem).filter(WardrobeItem.user_id == current_user.id).all()


@app.post("/wardrobe", response_model=WardrobeItemOut, status_code=201)
def add_wardrobe_item(
    item: WardrobeItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add wardrobe item."""
    new_item = WardrobeItem(
        user_id=current_user.id,
        category=item.category,
        name=item.name,
        color=item.color,
        season=item.season,
        image_url=item.image_url,
        notes=item.notes
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@app.delete("/wardrobe/{item_id}", status_code=204)
def delete_wardrobe_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete wardrobe item."""
    item = db.query(WardrobeItem).filter(
        WardrobeItem.id == item_id,
        WardrobeItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()


# === FAVORITES ===

@app.get("/favorites", response_model=List[FavoriteOut])
def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all favorites."""
    return db.query(FavoriteOutfit).filter(
        FavoriteOutfit.user_id == current_user.id
    ).order_by(FavoriteOutfit.created_at.desc()).all()


@app.post("/favorites", response_model=FavoriteOut, status_code=201)
def add_favorite(
    favorite: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save favorite outfit."""
    new_fav = FavoriteOutfit(
        user_id=current_user.id,
        title=favorite.title,
        source_item=favorite.source_item,
        vibe=favorite.vibe,
        payload=json.dumps(favorite.payload)
    )
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav


@app.delete("/favorites/{favorite_id}", status_code=204)
def delete_favorite(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete favorite."""
    fav = db.query(FavoriteOutfit).filter(
        FavoriteOutfit.id == favorite_id,
        FavoriteOutfit.user_id == current_user.id
    ).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
