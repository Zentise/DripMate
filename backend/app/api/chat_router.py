from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.chat_schemas import ChatRequest, ChatResponse
from app.services.ollama_service import get_style_suggestion
from app.database import get_db
from app.models import User, WardrobeItem
from sqlalchemy.exc import IntegrityError

router = APIRouter()

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


@router.post("/chat", response_model=ChatResponse)
async def handle_chat_request(request: ChatRequest, db: Session = Depends(get_db)):
    print(f"Received request for item: {request.item}")
    wardrobe_payload = None
    if request.use_wardrobe_only:
        user = _get_or_create_default_user(db)
        items = db.query(WardrobeItem).filter(WardrobeItem.user_id == user.id).all()
        wardrobe_payload = {
            "clothing": [i.name for i in items if i.category.value == "clothing"],
            "accessory": [i.name for i in items if i.category.value == "accessory"],
            "footwear": [i.name for i in items if i.category.value == "footwear"],
        }
    
    suggestion = get_style_suggestion(
        item=request.item,
        vibe=request.vibe,
        gender=request.gender,
        age_group=request.age_group,
        skin_colour=request.skin_colour,
        num_ideas=request.num_ideas,
        more_details=request.more_details,
        layering_preference=request.layering_preference, # Pass new field
        wardrobe=wardrobe_payload,
    )
    
    if not suggestion.get("outfits"):
        error_detail = suggestion.get("error", "An unknown error occurred in the AI service.")
        raise HTTPException(status_code=500, detail=error_detail)
        
    return suggestion