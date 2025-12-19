"""
Image analysis using Gemini Vision API.
Analyzes clothing items and suggests outfits.
"""
import json
from typing import Dict, Optional, List
from PIL import Image

from config import GEMINI_API_KEY


# Gemini Vision setup
try:
    import google.generativeai as genai
    
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel('gemini-2.5-flash')
    else:
        _gemini_model = None
except Exception as e:
    print(f"⚠ Gemini Vision not available: {e}")
    _gemini_model = None


def analyze_clothing_image(image_path: str) -> Dict[str, Optional[str]]:
    """
    Analyze a clothing item image using Gemini Vision.
    
    Returns:
        Dict with: category, name, color, pattern, style, season, description
    """
    if not _gemini_model:
        return {
            "category": None,
            "name": None,
            "color": None,
            "pattern": None,
            "style": None,
            "season": None,
            "description": "Gemini API not configured"
        }
    
    try:
        img = Image.open(image_path)
        
        prompt = """Analyze this clothing item and provide a JSON response:
{
  "category": "clothing|footwear|accessory",
  "name": "specific item name (e.g., 'black hoodie', 'blue jeans')",
  "color": "dominant color (e.g., 'black', 'blue', 'white')",
  "pattern": "pattern type (e.g., 'striped', 'plain', 'floral') or null",
  "style": "style (e.g., 'casual', 'formal', 'streetwear') or null",
  "season": "best season (e.g., 'summer', 'winter', 'all-season') or null",
  "description": "brief 1-2 sentence description"
}

Return ONLY valid JSON, no markdown."""
        
        response = _gemini_model.generate_content([prompt, img])
        text = response.text.strip()
        
        # Clean markdown code blocks
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        return json.loads(text)
        
    except Exception as e:
        print(f"⚠ Gemini analysis error: {e}")
        return {
            "category": None,
            "name": None,
            "color": None,
            "pattern": None,
            "style": None,
            "season": None,
            "description": f"Analysis failed: {e}"
        }


def get_outfit_from_image(
    image_path: str,
    user_prompt: Optional[str] = None,
    wardrobe_items: Optional[List[Dict]] = None
) -> Dict:
    """
    Analyze clothing image and suggest complete outfits.
    
    Args:
        image_path: Path to clothing image
        user_prompt: Optional user instructions
        wardrobe_items: Optional list of user's wardrobe items
    
    Returns:
        Dict with: detected_item, outfits (list), error (optional)
    """
    if not _gemini_model:
        return {
            "error": "Gemini not configured. Set GEMINI_API_KEY.",
            "detected_item": None,
            "outfits": []
        }
    
    try:
        img = Image.open(image_path)
        
        # Analyze the item first
        detected = analyze_clothing_image(image_path)
        
        # Build wardrobe context
        wardrobe_context = ""
        if wardrobe_items:
            items_list = "\n".join([
                f"- {item.get('category', 'item')}: {item.get('name', 'unknown')} ({item.get('color', 'unknown color')})"
                for item in wardrobe_items
            ])
            wardrobe_context = f"\n\nUser's wardrobe:\n{items_list}\n\nSuggest outfits using these items when possible."
        
        # Build prompt
        user_context = f" {user_prompt}" if user_prompt else ""
        prompt = f"""Based on this clothing item, suggest 3 complete outfit combinations.{user_context}

Detected: {detected.get('name', 'unknown')} - {detected.get('description', '')}{wardrobe_context}

Provide JSON format:
{{
  "outfits": [
    {{
      "name": "outfit name",
      "item1": {{"name": "top/shirt", "id": null}},
      "item2": {{"name": "bottom/pants", "id": null}},
      "footwear": {{"name": "shoes", "id": null}},
      "accessories": {{"name": "accessory or 'none'", "id": null}},
      "reason": "why this works"
    }}
  ]
}}

Rules:
1. Include detected item in EVERY outfit
2. Make suggestions practical and stylish
3. Return ONLY valid JSON, no markdown"""
        
        response = _gemini_model.generate_content([prompt, img])
        text = response.text.strip()
        
        # Clean markdown
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        result = json.loads(text)
        
        return {
            "detected_item": detected,
            "outfits": result.get("outfits", [])
        }
        
    except Exception as e:
        print(f"⚠ Outfit suggestion error: {e}")
        return {
            "error": f"Failed to generate outfits: {e}",
            "detected_item": None,
            "outfits": []
        }
