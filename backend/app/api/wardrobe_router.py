from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.database import models
from app.schemas.wardrobe_schemas import ClothCreate, ClothOut

router = APIRouter()

def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()

@router.post("/wardrobe/add", response_model=ClothOut)
def add_cloth(payload: ClothCreate, db: Session = Depends(get_db)):
	cloth = models.Cloth(
		item_type=payload.item_type,
		color=payload.color,
		material=payload.material,
		fit=payload.fit,
		vibe_tags=payload.vibe_tags,
	)
	db.add(cloth)
	db.commit()
	db.refresh(cloth)
	return cloth

@router.get("/wardrobe/all", response_model=list[ClothOut])
def list_clothes(db: Session = Depends(get_db)):
	items = db.query(models.Cloth).order_by(models.Cloth.id.desc()).all()
	return items
