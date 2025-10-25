from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, WardrobeItem, FavoriteOutfit
from app.schemas.wardrobe_schemas import UserProfileOut
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


@router.get("/profile", response_model=UserProfileOut)
def get_profile(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    wardrobe_count = db.query(WardrobeItem).filter(WardrobeItem.user_id == user.id).count()
    favorites_count = db.query(FavoriteOutfit).filter(FavoriteOutfit.user_id == user.id).count()
    return UserProfileOut(
        id=user.id, name=user.name, email=user.email, wardrobe_count=wardrobe_count, favorites_count=favorites_count
    )
