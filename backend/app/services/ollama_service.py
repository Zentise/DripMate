import requests
import json
from typing import Optional, List, Dict

OLLAMA_URL = "http://localhost:11434/api/generate"

def get_style_suggestion(
    item: str,
    vibe: str,
    gender: str,
    age_group: Optional[str] = None,
    skin_colour: Optional[str] = None,
    num_ideas: int = 1,
    more_details: Optional[str] = None,
    layering_preference: str = "AI Decides", # New parameter
    wardrobe: Optional[List[Dict]] = None,  # New: pass user's wardrobe items
    base_type: Optional[str] = None,        # New: inferred base type
) -> dict:

    # --- V3 PROMPT: Added Layering Preference Logic ---
    prompt_parts = [
        "You are 'DripMate,' a world-class AI fashion stylist.",
        "You MUST follow all rules and user constraints precisely.",
        "\n**CRITICAL RULE 1:** The user is providing ONE base item. You MUST suggest the OTHER pieces to complete the outfit. DO NOT suggest another item of the same type as the base item.",
        
        # New Layering Rule
        "\n**CRITICAL RULE 2 (LAYERING):**",
    ]
    
    if layering_preference == "Suggest Layers":
        prompt_parts.append("- The user WANTS a layering piece. At least one of your suggested items must be a jacket, coat, hoodie, sweater, or similar outerwear.")
    elif layering_preference == "No Layers":
        prompt_parts.append("- The user DOES NOT want a layering piece. You MUST NOT suggest any jackets, coats, hoodies, sweaters, or other outerwear.")
    else: # AI Decides
        prompt_parts.append("- The user is open to suggestions. Use your best judgment. Suggest a layering piece only if it is practical and enhances the outfit's vibe.")

    prompt_parts.extend([
        "\n**USER PROFILE:**", f"- Gender: {gender}"
    ])
    if age_group: prompt_parts.append(f"- Age Group: {age_group}")
    if skin_colour: prompt_parts.append(f"- Skin Tone: {skin_colour}. Strongly consider suggesting colors that complement this.")

    prompt_parts.extend([
        "\n**USER REQUEST:**",
        f"- Base Clothing Item: {item}",
        f"- Base Item Type: {base_type or 'top'}",
        f"- Desired Vibe: {vibe}"
    ])
    if more_details: prompt_parts.append(f"- Additional Details/Constraints: {more_details}")
    
    # If a wardrobe is provided, include it and constrain the AI
    if wardrobe:
        prompt_parts.extend([
            "\n**VIRTUAL WARDROBE (USE ONLY THESE ITEMS):**",
        ])
        # Format wardrobe succinctly
        for idx, w in enumerate(wardrobe, start=1):
            desc = ", ".join(filter(None, [w.get("item_type"), w.get("color"), w.get("material"), w.get("fit"), w.get("vibe_tags")]))
            prompt_parts.append(f"- {idx}. {desc}")
        prompt_parts.append("\nYou MUST build outfits using ONLY items from the VIRTUAL WARDROBE above. Do not invent items not listed.")

        # Define output contract with typed keys and category rules
        prompt_parts.extend([
                f"\n**YOUR TASK:**",
                f"You MUST generate exactly {num_ideas} distinct outfit idea(s).",
                "Return JSON matching: outfits[].id, outfits[].top?, outfits[].bottom?, outfits[].layer?, outfits[].footwear?",
                "- If Base Item Type is 'bottom' (e.g., jeans): include 'top' and 'footwear'. 'bottom' MUST be null.",
                "- If Base Item Type is 'top': include 'bottom' and 'footwear'.",
                "- If Base Item Type is 'layer': include 'top', 'bottom', and 'footwear'.",
                "- If Base Item Type is 'footwear': include 'top' and 'bottom'.",
                "- 'top' MUST only be tops (t-shirt, shirt, hoodie, blouse, etc.).",
                "- 'bottom' MUST only be bottoms (jeans, pants, trousers, skirts, shorts, cargos). NEVER put t-shirts or accessories here.",
                "- 'layer' is optional outerwear (jacket, coat, blazer, cardigan, hoodie as outer layer).",
                "Each present item must have {name, reason}.",
                "The entire response MUST be a single, valid JSON object.",
                "\n**JSON OUTPUT FORMAT EXAMPLE (if user asks for 2 ideas):**",
                """{
    "outfits": [
        {
            "id": 1,
            "top": {"name": "...", "reason": "..."},
            "bottom": null,
            "layer": {"name": "...", "reason": "..."},
            "footwear": {"name": "...", "reason": "..."}
        },
        {
            "id": 2,
            "top": {"name": "...", "reason": "..."},
            "bottom": null,
            "layer": null,
            "footwear": {"name": "...", "reason": "..."}
        }
    ]
}"""
        ])
    
    final_prompt = "\n".join(prompt_parts)

    payload = {
        "model": "llama3:8b", "prompt": final_prompt, "stream": False, "format": "json"
    }

    def _try_parse_json(text: str):
        try:
            return json.loads(text)
        except Exception:
            # attempt to extract JSON substring
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1 and end > start:
                candidate = text[start:end+1]
                try:
                    return json.loads(candidate)
                except Exception:
                    return None
            return None

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=90)
        response.raise_for_status()
        response_data = response.json()
        parsed = _try_parse_json(response_data.get('response', ''))
        if isinstance(parsed, dict):
            return parsed
        else:
            print("Failed to parse AI JSON response.")
            return {"error": "AI returned an invalid response format."}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while getting the AI suggestion."}