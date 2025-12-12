from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import tempfile
import shutil
import os
from typing import Optional

from ..services.vision_service import get_outfit_from_image
from ..database import get_db
from ..models import User, WardrobeItem
from sqlalchemy.exc import IntegrityError


router = APIRouter()

ALLOWED_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


def _get_or_create_default_user(db: Session) -> User:
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


@router.post("/chat/image")
async def analyze_and_suggest(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
    use_wardrobe: bool = Form(False),
    db: Session = Depends(get_db)
):
    """
    Accept a clothing item image and return outfit suggestions.
    Optionally use user's wardrobe items if use_wardrobe=True.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    suffix = ALLOWED_TYPES[file.content_type]
    tmpdir = tempfile.mkdtemp(prefix="dripmate_chat_")
    try:
        tmp_path = os.path.join(tmpdir, f"upload{suffix}")
        with open(tmp_path, "wb") as out:
            shutil.copyfileobj(file.file, out)

        # Fetch wardrobe if requested
        wardrobe_list = None
        if use_wardrobe:
            user = _get_or_create_default_user(db)
            items = db.query(WardrobeItem).filter(WardrobeItem.user_id == user.id).all()
            wardrobe_list = [
                {
                    "id": item.id,
                    "category": item.category.value,
                    "name": item.name,
                    "color": item.color,
                    "season": item.season,
                }
                for item in items
            ]

        result = get_outfit_from_image(tmp_path, user_prompt=prompt, wardrobe_items=wardrobe_list)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")
    finally:
        try:
            shutil.rmtree(tmpdir)
        except Exception:
            pass
