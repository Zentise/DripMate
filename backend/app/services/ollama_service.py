import requests
import json
from typing import Optional

OLLAMA_URL = "http://localhost:11434/api/generate"

def get_style_suggestion(
    item: str,
    vibe: str,
    gender: str,
    age_group: Optional[str] = None,
    skin_colour: Optional[str] = None,
    num_ideas: int = 1,
    more_details: Optional[str] = None,
    layering_preference: str = "AI Decides" # New parameter
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
        "\n**USER REQUEST:**", f"- Base Clothing Item: {item}", f"- Desired Vibe: {vibe}"
    ])
    if more_details: prompt_parts.append(f"- Additional Details/Constraints: {more_details}")
    
    prompt_parts.extend([
        f"\n**YOUR TASK:**",
        f"You MUST generate exactly {num_ideas} distinct outfit idea(s).",
        "For each idea, suggest three complementary items: 'item1', 'item2', and 'footwear'.",
        "For each item, provide a 'name' and a 'reason' for your choice.",
        "The entire response MUST be a single, valid JSON object.",
        "\n**JSON OUTPUT FORMAT EXAMPLE (if user asks for 2 ideas):**",
        """{
  "outfits": [
    {
      "id": 1,
      "item1": {"name": "...", "reason": "..."},
      "item2": {"name": "...", "reason": "..."},
      "footwear": {"name": "...", "reason": "..."}
    },
    {
      "id": 2,
      "item1": {"name": "...", "reason": "..."},
      "item2": {"name": "...", "reason": "..."},
      "footwear": {"name": "...", "reason": "..."}
    }
  ]
}"""
    ])
    
    final_prompt = "\n".join(prompt_parts)

    payload = {
        "model": "llama3:8b", "prompt": final_prompt, "stream": False, "format": "json"
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=90)
        response.raise_for_status()
        response_data = response.json()
        return json.loads(response_data['response'])
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while getting the AI suggestion."}