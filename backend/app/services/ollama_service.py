import requests
import json

# The URL where your Ollama server is running.
# This is the default. Change it if yours is different.
OLLAMA_URL = "http://localhost:11434/api/generate"

def get_style_suggestion(clothing_desc: str, vibe: str) -> dict:

    prompt = f"""
    You are "DripMate," an expert fashion stylist with a modern, clean aesthetic.
    Your task is to build a complete, stylish outfit around a single piece of clothing the user provides.

    RULES:
    1.  You MUST suggest three items: one for 'item1', one for 'item2', and one for 'footwear'.
    2.  For each item, provide a 'name' and a 'reason' why it complements the user's piece.
    3.  The reasoning should be short, stylish, and encouraging.
    4.  The entire response must be a single, valid JSON object and nothing else.

    USER'S CLOTHING: "{clothing_desc}"
    DESIRED VIBE: "{vibe}"

    JSON_OUTPUT:
    """

    # The data payload to send to the Ollama API
    payload = {
        "model": "llama3:8b", # Our chosen model
        "prompt": prompt,
        "stream": False,      # We want the full response at once
        "format": "json"      # IMPORTANT: This forces the model's output to be valid JSON
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

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


# This block allows you to test the function directly by running this file
if __name__ == '__main__':
    print("--- Testing DripMate Service ---")
    
    # Example 1
    print("\n[Test Case 1: Black Hoodie for Streetwear]")
    test_clothing = "a black oversized hoodie"
    test_vibe = "streetwear"
    suggestion = get_style_suggestion(test_clothing, test_vibe)
    print(json.dumps(suggestion, indent=2))

    # Example 2
    print("\n[Test Case 2: Blue Jeans for Casual Vibe]")
    test_clothing_2 = "classic blue straight-leg jeans"
    test_vibe_2 = "smart casual"
    suggestion_2 = get_style_suggestion(test_clothing_2, test_vibe_2)
    print(json.dumps(suggestion_2, indent=2))