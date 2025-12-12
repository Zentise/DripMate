from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from typing import List

from app.database import get_db
from app.models import User, FavoriteOutfit as FavoriteOutfitModel
from app.schemas.wardrobe_schemas import FavoriteOutfitCreate, FavoriteOutfitOut
from app.api.auth_router import get_current_user

router = APIRouter()


@router.get("/favorites", response_model=List[FavoriteOutfitOut])
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favs = db.query(FavoriteOutfitModel).filter(FavoriteOutfitModel.user_id == current_user.id).order_by(FavoriteOutfitModel.created_at.desc()).all()
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
def save_favorite(
    payload: FavoriteOutfitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fav = FavoriteOutfitModel(
        user_id=current_user.id,
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
def delete_favorite(
    favorite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fav = db.query(FavoriteOutfitModel).filter(FavoriteOutfitModel.id == favorite_id, FavoriteOutfitModel.user_id == current_user.id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(fav)
    db.commit()
    return {"ok": True}
