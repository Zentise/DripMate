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
    more_details: Optional[str] = None
) -> dict:

    # --- Dynamically build the prompt based on user input ---
    prompt_parts = [
        "You are 'DripMate,' a world-class AI fashion stylist. Your goal is to create stylish, practical, and personalized outfit suggestions.",
        "You must follow all rules and user constraints precisely.",
        "\n**USER PROFILE:**",
        f"- Gender: {gender}"
    ]
    if age_group:
        prompt_parts.append(f"- Age Group: {age_group}")
    if skin_colour:
        prompt_parts.append(f"- Skin Tone: {skin_colour}. Consider suggesting colors that complement this skin tone.")

    prompt_parts.extend([
        "\n**USER REQUEST:**",
        f"- Base Clothing Item: {item}",
        f"- Desired Vibe: {vibe}"
    ])
    if more_details:
        prompt_parts.append(f"- Additional Details/Constraints: {more_details}")
    
    prompt_parts.extend([
        f"\n**YOUR TASK:**",
        f"Generate {num_ideas} distinct outfit idea(s) based on all the information provided.",
        "For each idea, suggest three complementary items: 'item1', 'item2', and 'footwear'.",
        "For each item, provide a 'name' and a 'reason' for your choice.",
        "The entire response MUST be a single, valid JSON object and nothing else.",
        "\n**JSON OUTPUT FORMAT:**",
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
    
    final_prompt = "\n".join(prompt_parts)
    # --- End of prompt building ---

    payload = {
        "model": "llama3:8b",
        "prompt": final_prompt,
        "stream": False,
        "format": "json"
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60) # Increased timeout for more ideas
        response.raise_for_status()
        response_data = response.json()
        suggestion_json = json.loads(response_data['response'])
        return suggestion_json
    except requests.exceptions.RequestException as e:
        print(f"Error: Could not connect to Ollama API. {e}")
        return {"error": "Could not connect to the Ollama service."}
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON from the model's response.")
        return {"error": "The model provided an invalid response format."}
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"error": "An unexpected error occurred."}