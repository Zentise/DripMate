from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, WardrobeItem as WardrobeItemModel, ItemCategory as ItemCategoryModel
from app.schemas.wardrobe_schemas import WardrobeItemCreate, WardrobeItemUpdate, WardrobeItemOut
from app.api.auth_router import get_current_user

router = APIRouter()


@router.get("/wardrobe", response_model=List[WardrobeItemOut])
def list_wardrobe(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(WardrobeItemModel).filter(WardrobeItemModel.user_id == current_user.id).order_by(WardrobeItemModel.id.desc()).all()
    return items


@router.post("/wardrobe", response_model=WardrobeItemOut)
def add_wardrobe_item(
    payload: WardrobeItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = WardrobeItemModel(
        user_id=current_user.id,
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
def update_wardrobe_item(
    item_id: int,
    payload: WardrobeItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(WardrobeItemModel).filter(WardrobeItemModel.id == item_id, WardrobeItemModel.user_id == current_user.id).first()
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
def delete_wardrobe_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(WardrobeItemModel).filter(WardrobeItemModel.id == item_id, WardrobeItemModel.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
