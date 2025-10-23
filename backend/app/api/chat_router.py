from fastapi import APIRouter, HTTPException, Depends
from app.schemas.chat_schemas import ChatRequest, ChatResponse
from app.services.ollama_service import get_style_suggestion
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.database import models

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/chat", response_model=ChatResponse)
async def handle_chat_request(request: ChatRequest, db: Session = Depends(get_db)):
    print(f"Received request for item: {request.item}")
    # Fetch user's wardrobe. For Stage II MVP we use a single global wardrobe table.
    wardrobe_items = db.query(models.Cloth).all()
    
    def infer_base_type(text: str) -> str:
        t = (text or "").lower()
        if any(k in t for k in ["jean", "pant", "trouser", "short", "skirt", "cargo"]):
            return "bottom"
        if any(k in t for k in ["shoe", "sneaker", "boot", "heel", "loafer", "converse"]):
            return "footwear"
        if any(k in t for k in ["jacket", "coat", "blazer", "hoodie", "cardigan", "sweater", "bomber"]):
            return "layer"
        if any(k in t for k in ["shirt", "tee", "t-shirt", "top", "blouse", "polo"]):
            return "top"
        # default to top if unknown
        return "top"
    base_type = infer_base_type(request.item)
    
    suggestion = get_style_suggestion(
        item=request.item,
        vibe=request.vibe,
        gender=request.gender,
        age_group=request.age_group,
        skin_colour=request.skin_colour,
        num_ideas=request.num_ideas,
        more_details=request.more_details,
        layering_preference=request.layering_preference, # Pass new field
        base_type=base_type,
        wardrobe=[{
            "item_type": w.item_type,
            "color": w.color,
            "material": w.material,
            "fit": w.fit,
            "vibe_tags": w.vibe_tags,
        } for w in wardrobe_items]
    )

    # Post-process and sanitize AI output to enforce categories
    def guess_type(name: str) -> str:
        n = (name or "").lower()
        if any(k in n for k in ["shoe", "sneaker", "boot", "loafer", "heel", "converse", "trainer"]):
            return "footwear"
        if any(k in n for k in ["jacket", "coat", "blazer", "hoodie", "cardigan", "sweater", "bomber", "overshirt", "parka", "trench"]):
            return "layer"
        if any(k in n for k in ["jean", "pant", "trouser", "short", "skirt", "cargo", "chino", "sweatpant"]):
            return "bottom"
        if any(k in n for k in ["tee", "t-shirt", "shirt", "blouse", "polo", "top", "tank", "crewneck", "henley"]):
            return "top"
        # default to top
        return "top"

    outfits = suggestion.get("outfits", []) or []
    fixed_outfits = []
    for idx, o in enumerate(outfits, start=1):
        top = o.get("top")
        bottom = o.get("bottom")
        layer = o.get("layer")
        footwear = o.get("footwear")
        # Fallback for older keys
        for key in ["item1", "item2"]:
            it = o.get(key)
            if it and isinstance(it, dict) and "name" in it:
                t = guess_type(it["name"])
                if t == "footwear" and not footwear:
                    footwear = it
                elif t == "layer" and not layer:
                    layer = it
                elif t == "bottom" and not bottom:
                    bottom = it
                elif t == "top" and not top:
                    top = it

        # Enforce base_type rules
        if base_type == "bottom":
            bottom = None

        fixed_outfits.append({
            "id": o.get("id", idx),
            "top": top,
            "bottom": bottom,
            "layer": layer,
            "footwear": footwear,
        })
    suggestion["outfits"] = fixed_outfits
    
    if not suggestion.get("outfits"):
        error_detail = suggestion.get("error", "An unknown error occurred in the AI service.")
        raise HTTPException(status_code=500, detail=error_detail)
        
    return suggestion