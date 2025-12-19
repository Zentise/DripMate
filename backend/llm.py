"""
LLM abstraction layer for DripMate.
Supports Gemini (primary) and Ollama (fallback).
"""
import json
import re
import requests
from typing import Optional, List, Dict

from config import GEMINI_API_KEY, OLLAMA_URL


# --- Gemini Setup ---
try:
    import google.generativeai as genai
    
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        GEMINI_AVAILABLE = True
    else:
        GEMINI_AVAILABLE = False
        print("⚠ GEMINI_API_KEY not set")
except Exception as e:
    print(f"⚠ Gemini not available: {e}")
    GEMINI_AVAILABLE = False
    genai = None


# Available models
GEMINI_MODELS = {
    "gemini-2.0-flash-exp": "gemini-2.0-flash-exp",
    "gemini-1.5-flash": "gemini-1.5-flash",
    "gemini-1.5-pro": "gemini-1.5-pro",
    "gemini-2.5-flash": "gemini-2.5-flash",
}
DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
DEFAULT_OLLAMA_MODEL = "llama3:8b"


def get_style_suggestion(
    item: str,
    vibe: str,
    gender: str,
    age_group: Optional[str] = None,
    skin_colour: Optional[str] = None,
    num_ideas: int = 1,
    more_details: Optional[str] = None,
    layering_preference: str = "AI Decides",
    wardrobe: Optional[Dict[str, List[str]]] = None,
    provider: str = "gemini",
    model_name: str = None,
) -> dict:
    """
    Get outfit suggestions using AI (Gemini or Ollama).
    
    Args:
        item: Base clothing item
        vibe: Desired outfit vibe
        gender: User gender
        age_group: Optional age group
        skin_colour: Optional skin tone
        num_ideas: Number of outfit ideas (1-3)
        more_details: Additional constraints
        layering_preference: "Suggest Layers", "No Layers", or "AI Decides"
        wardrobe: Optional user wardrobe items
        provider: "gemini" or "ollama"
        model_name: Specific model name
    
    Returns:
        Dict with 'outfits' list or 'error' message
    """
    if provider == "gemini":
        return _gemini_suggestion(
            item, vibe, gender, age_group, skin_colour,
            num_ideas, more_details, layering_preference, wardrobe, model_name
        )
    elif provider == "ollama":
        return _ollama_suggestion(
            item, vibe, gender, age_group, skin_colour,
            num_ideas, more_details, layering_preference, wardrobe
        )
    else:
        return {"error": f"Unknown provider: {provider}", "outfits": []}


def _gemini_suggestion(
    item: str, vibe: str, gender: str,
    age_group: Optional[str], skin_colour: Optional[str],
    num_ideas: int, more_details: Optional[str],
    layering_preference: str, wardrobe: Optional[Dict],
    model_name: Optional[str]
) -> dict:
    """Get outfit suggestions from Gemini."""
    if not GEMINI_AVAILABLE:
        return {
            "error": "Gemini not configured. Set GEMINI_API_KEY.",
            "outfits": []
        }
    
    # Select model
    if not model_name or model_name not in GEMINI_MODELS:
        model_name = DEFAULT_GEMINI_MODEL
    
    try:
        model = genai.GenerativeModel(GEMINI_MODELS[model_name])
    except Exception as e:
        return {"error": f"Failed to load model: {e}", "outfits": []}
    
    # Build prompt
    prompt = _build_prompt(
        item, vibe, gender, age_group, skin_colour,
        num_ideas, more_details, layering_preference, wardrobe
    )
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.9,
                top_p=0.95,
                top_k=40,
            )
        )
        
        raw = response.text.strip()
        
        # Parse JSON
        try:
            data = json.loads(raw)
        except:
            cleaned = _clean_json(raw)
            data = json.loads(cleaned)
        
        return _normalize_outfits(data)
        
    except Exception as e:
        return {"error": f"Gemini error: {e}", "outfits": []}


def _ollama_suggestion(
    item: str, vibe: str, gender: str,
    age_group: Optional[str], skin_colour: Optional[str],
    num_ideas: int, more_details: Optional[str],
    layering_preference: str, wardrobe: Optional[Dict]
) -> dict:
    """Get outfit suggestions from Ollama."""
    prompt = _build_prompt(
        item, vibe, gender, age_group, skin_colour,
        num_ideas, more_details, layering_preference, wardrobe
    )
    
    payload = {
        "model": DEFAULT_OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=90)
        response.raise_for_status()
        data = response.json()
        raw = data.get('response', '') if isinstance(data, dict) else ''
        
        # Parse JSON
        try:
            result = json.loads(raw)
        except:
            cleaned = _clean_json(raw)
            result = json.loads(cleaned)
        
        return _normalize_outfits(result)
        
    except Exception as e:
        return {"error": f"Ollama error: {e}", "outfits": []}


def _build_prompt(
    item: str, vibe: str, gender: str,
    age_group: Optional[str], skin_colour: Optional[str],
    num_ideas: int, more_details: Optional[str],
    layering_preference: str, wardrobe: Optional[Dict]
) -> str:
    """Build the AI prompt for outfit suggestions."""
    parts = [
        "You are 'DripMate,' a world-class AI fashion stylist.",
        "You MUST follow all rules and user constraints precisely.",
        "\n**CRITICAL RULE 1:** The user provides ONE base item. You suggest OTHER pieces to complete the outfit.",
        "DO NOT suggest another item of the same type as the base item.",
        "\n**CRITICAL RULE 2 (LAYERING):**",
    ]
    
    # Layering preference
    if layering_preference == "Suggest Layers":
        parts.append("- The user WANTS a layering piece (jacket, coat, hoodie, sweater, etc.).")
    elif layering_preference == "No Layers":
        parts.append("- The user DOES NOT want any layering pieces. NO jackets, coats, hoodies, or sweaters.")
    else:
        parts.append("- Use your judgment. Suggest layers only if practical and enhances the vibe.")
    
    # User profile
    parts.extend([
        "\n**USER PROFILE:**",
        f"- Gender: {gender}"
    ])
    if age_group:
        parts.append(f"- Age Group: {age_group}")
    if skin_colour:
        parts.append(f"- Skin Tone: {skin_colour}. Suggest complementary colors.")
    
    # Request
    parts.extend([
        "\n**USER REQUEST:**",
        f"- Base Item: {item}",
        f"- Desired Vibe: {vibe}"
    ])
    if more_details:
        parts.append(f"- Additional Details: {more_details}")
    
    # Wardrobe constraint
    if wardrobe:
        parts.extend([
            "\n**WARDROBE CONSTRAINT:**",
            "You MUST ONLY use items from these lists:",
            f"- CLOTHING: {', '.join(wardrobe.get('clothing', []) or ['(none)'])}",
            f"- ACCESSORIES: {', '.join(wardrobe.get('accessory', []) or ['(none)'])}",
            f"- FOOTWEAR: {', '.join(wardrobe.get('footwear', []) or ['(none)'])}",
            "If empty, do your best with available categories.",
        ])
    
    # Output format
    parts.extend([
        f"\n**YOUR TASK:**",
        f"Generate exactly {num_ideas} distinct outfit idea(s).",
        "For each outfit, suggest: 'item1', 'item2', and 'footwear'.",
        "Each item needs 'name' and 'reason'.",
        "Return ONLY valid JSON. NO markdown, NO code fences, NO comments.",
        "\n**JSON FORMAT:**",
        """{
  "outfits": [
    {
      "id": 1,
      "item1": {"name": "...", "reason": "..."},
      "item2": {"name": "...", "reason": "..."},
      "footwear": {"name": "...", "reason": "..."}
    }
  ]
}"""
    ])
    
    return "\n".join(parts)


def _clean_json(text: str) -> str:
    """Clean LLM JSON output (remove markdown, comments, trailing commas)."""
    if not isinstance(text, str):
        return '{}'
    
    s = text.strip()
    
    # Remove code fences
    if '```' in s:
        parts = s.split('```')
        for block in parts:
            block = block.strip()
            if block.lower().startswith('json'):
                block = block[4:].strip()
            if block.startswith('{') and block.endswith('}'):
                s = block
                break
    
    # Extract JSON object if surrounded by text
    if not (s.startswith('{') and s.endswith('}')):
        first = s.find('{')
        last = s.rfind('}')
        if first != -1 and last != -1 and last > first:
            s = s[first:last+1]
    
    # Remove comments
    s = re.sub(r"^\s*//.*$", "", s, flags=re.MULTILINE)
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.DOTALL)
    
    # Remove trailing commas
    s = re.sub(r",(\s*[}\]])", r"\1", s)
    
    return s


def _normalize_outfits(data: dict) -> dict:
    """Normalize outfit data to ensure consistent structure."""
    result = {"outfits": []}
    if not isinstance(data, dict):
        return result
    
    outfits = data.get("outfits")
    if not isinstance(outfits, list):
        return result
    
    def _coerce_item(d):
        if not isinstance(d, dict):
            return {"name": "", "reason": ""}
        name = d.get("name")
        reason = d.get("reason")
        return {
            "name": "" if name is None else str(name),
            "reason": "" if reason is None else str(reason)
        }
    
    for idx, outfit in enumerate(outfits, start=1):
        if not isinstance(outfit, dict):
            continue
        
        item1 = _coerce_item(outfit.get("item1"))
        item2 = _coerce_item(outfit.get("item2"))
        footwear = _coerce_item(outfit.get("footwear"))
        
        outfit_id = outfit.get("id", idx)
        try:
            outfit_id = int(outfit_id)
        except:
            outfit_id = idx
        
        result["outfits"].append({
            "id": outfit_id,
            "item1": item1,
            "item2": item2,
            "footwear": footwear,
        })
    
    return result


def get_available_models() -> dict:
    """Get available models for each provider."""
    return {
        "gemini": {
            "available": GEMINI_AVAILABLE,
            "models": list(GEMINI_MODELS.keys()),
            "default": DEFAULT_GEMINI_MODEL
        },
        "ollama": {
            "available": True,
            "models": [DEFAULT_OLLAMA_MODEL],
            "default": DEFAULT_OLLAMA_MODEL
        }
    }
