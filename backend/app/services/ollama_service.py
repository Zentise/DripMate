import requests
import json
import re
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
    wardrobe: Optional[Dict[str, List[str]]] = None,  # Optional categorized wardrobe items
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
    
    # If wardrobe provided, restrict selections to provided lists
    if wardrobe:
        prompt_parts.extend([
            "\n**WARDROBE CONSTRAINT:**",
            "You MUST ONLY use items from the user's wardrobe lists below.",
            "- The user's wardrobe is categorized; choose from these exact names.",
            f"- CLOTHING OPTIONS: {', '.join(wardrobe.get('clothing', []) or ['(none)'])}",
            f"- ACCESSORIES OPTIONS: {', '.join(wardrobe.get('accessory', []) or ['(none)'])}",
            f"- FOOTWEAR OPTIONS: {', '.join(wardrobe.get('footwear', []) or ['(none)'])}",
            "If a category is empty, do your best with available categories but do NOT invent items outside the lists.",
        ])
    
    prompt_parts.extend([
        f"\n**YOUR TASK:**",
        f"You MUST generate exactly {num_ideas} distinct outfit idea(s).",
        "For each idea, suggest three complementary items: 'item1', 'item2', and 'footwear'.",
        "For each item, provide a 'name' and a 'reason' for your choice.",
        "The entire response MUST be a single, valid JSON object.",
        "Use DOUBLE QUOTES for all property names and string values.",
        "NO markdown, NO code fences, NO comments, and NO trailing commas.",
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
        raw = response_data.get('response', '') if isinstance(response_data, dict) else ''

        # Try strict parse first
        try:
            return json.loads(raw)
        except Exception:
            pass

        # Attempt to extract JSON from code fences or surrounding text and sanitize
        cleaned = _sanitize_llm_json(raw)
        return json.loads(cleaned)
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while getting the AI suggestion."}


def _sanitize_llm_json(text: str) -> str:
    """Best-effort cleanup when LLM returns JSON wrapped in markdown or with minor issues.
    - Remove code fences ```json ... ```
    - Strip JS/markdown-style comments
    - Remove trailing commas before } or ]
    - Extract the largest {...} block if extra prose surrounds it
    """
    if not isinstance(text, str):
        return '{}'

    s = text.strip()

    # Remove code fences
    if '```' in s:
        parts = s.split('```')
        # Look for a block that likely contains JSON
        for i in range(len(parts)):
            block = parts[i].strip()
            if block.lower().startswith('json'):
                block = block[4:].strip()
            if block.startswith('{') and block.endswith('}'):
                s = block
                break

    # If still has prose, try to take the largest balanced JSON object substring
    if not (s.startswith('{') and s.endswith('}')):
        first = s.find('{')
        last = s.rfind('}')
        if first != -1 and last != -1 and last > first:
            s = s[first:last+1]

    # Remove // line comments
    s = re.sub(r"^\s*//.*$", "", s, flags=re.MULTILINE)
    # Remove /* ... */ comments
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.DOTALL)
    # Remove trailing commas before } or ]
    s = re.sub(r",(\s*[}\]])", r"\1", s)

    return s