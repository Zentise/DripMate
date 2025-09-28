from fastapi import APIRouter, HTTPException
from app.schemas.chat_schemas import ChatRequest, ChatResponse
from app.services.ollama_service import get_style_suggestion

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def handle_chat_request(request: ChatRequest):
    print(f"Received request for item: {request.item}")
    
    suggestion = get_style_suggestion(
        item=request.item,
        vibe=request.vibe,
        gender=request.gender,
        age_group=request.age_group,
        skin_colour=request.skin_colour,
        num_ideas=request.num_ideas,
        more_details=request.more_details
    )
    
    # The Pydantic response_model will automatically handle validation.
    # If 'outfits' key is missing or format is wrong, FastAPI will raise an error.
    if not suggestion.get("outfits"):
        # This handles errors from our service, like connection issues
        error_detail = suggestion.get("error", "An unknown error occurred in the AI service.")
        raise HTTPException(status_code=500, detail=error_detail)
        
    return suggestion