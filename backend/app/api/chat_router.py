from fastapi import APIRouter, HTTPException
# The changes are on the next two lines
from ..schemas.chat_schemas import ChatRequest, ChatResponse
from ..services.ollama_service import get_style_suggestion

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def handle_chat_request(request: ChatRequest):
    print(f"Received request for: {request.clothing_desc} with vibe {request.vibe}")
    
    suggestion = get_style_suggestion(
        clothing_desc=request.clothing_desc, 
        vibe=request.vibe
    )
    
    if suggestion.get("error"):
        raise HTTPException(status_code=500, detail=suggestion["error"])
        
    return suggestion