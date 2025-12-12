from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, WardrobeItem, FavoriteOutfit
from app.schemas.wardrobe_schemas import UserProfileOut
from app.api.auth_router import get_current_user

router = APIRouter()


@router.get("/profile", response_model=UserProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wardrobe_count = db.query(WardrobeItem).filter(WardrobeItem.user_id == current_user.id).count()
    favorites_count = db.query(FavoriteOutfit).filter(FavoriteOutfit.user_id == current_user.id).count()
    return UserProfileOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        gender=current_user.gender,
        age_group=current_user.age_group,
        skin_colour=current_user.skin_colour,
        wardrobe_count=wardrobe_count,
        favorites_count=favorites_count
    )
