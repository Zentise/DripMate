from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from typing import List

from app.database import get_db
from app.models import User, FavoriteOutfit as FavoriteOutfitModel
from app.schemas.wardrobe_schemas import FavoriteOutfitCreate, FavoriteOutfitOut
from sqlalchemy.exc import IntegrityError

router = APIRouter()


def get_or_create_default_user(db: Session) -> User:
    user = db.query(User).filter(User.id == 1).first()
    if user:
        return user
    try:
        user = User(id=1, name="Guest")
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        return db.query(User).filter(User.id == 1).first()


@router.get("/favorites", response_model=List[FavoriteOutfitOut])
def list_favorites(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    favs = db.query(FavoriteOutfitModel).filter(FavoriteOutfitModel.user_id == user.id).order_by(FavoriteOutfitModel.created_at.desc()).all()
    # Convert payload from text to dict in response_model via Pydantic from_attributes
    for f in favs:
        try:
            # Ensure payload is a dict when serializing
            if isinstance(f.payload, str):
                f.payload = json.loads(f.payload)
        except Exception:
            pass
    return favs


@router.post("/favorites", response_model=FavoriteOutfitOut)
def save_favorite(payload: FavoriteOutfitCreate, db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    fav = FavoriteOutfitModel(
        user_id=user.id,
        title=payload.title,
        source_item=payload.source_item,
        vibe=payload.vibe,
        payload=json.dumps(payload.payload),
    )
    db.add(fav)
    db.commit()
    db.refresh(fav)
    # Convert back to dict for response
    try:
        fav.payload = json.loads(fav.payload)
    except Exception:
        pass
    return fav


@router.delete("/favorites/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    fav = db.query(FavoriteOutfitModel).filter(FavoriteOutfitModel.id == favorite_id, FavoriteOutfitModel.user_id == user.id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"ok": True}
