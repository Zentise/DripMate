from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db, Base, engine
from app.models import User, WardrobeItem as WardrobeItemModel, ItemCategory as ItemCategoryModel
from app.schemas.wardrobe_schemas import WardrobeItemCreate, WardrobeItemUpdate, WardrobeItemOut
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
        # Another request created it concurrently; fetch again
        return db.query(User).filter(User.id == 1).first()


@router.get("/wardrobe", response_model=List[WardrobeItemOut])
def list_wardrobe(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    items = db.query(WardrobeItemModel).filter(WardrobeItemModel.user_id == user.id).order_by(WardrobeItemModel.id.desc()).all()
    return items


@router.post("/wardrobe", response_model=WardrobeItemOut)
def add_wardrobe_item(payload: WardrobeItemCreate, db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    item = WardrobeItemModel(
        user_id=user.id,
        category=ItemCategoryModel(payload.category.value),
        name=payload.name,
        color=payload.color,
        season=payload.season,
        image_url=payload.image_url,
        notes=payload.notes,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/wardrobe/{item_id}", response_model=WardrobeItemOut)
def update_wardrobe_item(item_id: int, payload: WardrobeItemUpdate, db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    item = db.query(WardrobeItemModel).filter(WardrobeItemModel.id == item_id, WardrobeItemModel.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if payload.category is not None:
        item.category = ItemCategoryModel(payload.category.value)
    if payload.name is not None:
        item.name = payload.name
    if payload.color is not None:
        item.color = payload.color
    if payload.season is not None:
        item.season = payload.season
    if payload.image_url is not None:
        item.image_url = payload.image_url
    if payload.notes is not None:
        item.notes = payload.notes

    db.commit()
    db.refresh(item)
    return item


@router.delete("/wardrobe/{item_id}")
def delete_wardrobe_item(item_id: int, db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    item = db.query(WardrobeItemModel).filter(WardrobeItemModel.id == item_id, WardrobeItemModel.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
