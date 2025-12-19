# DripMate API Example Requests

## Example 1: Basic Outfit Suggestion with Gemini (Default)

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "black leather jacket",
    "vibe": "streetwear",
    "gender": "unisex"
  }'
```

## Example 2: Detailed Request with Gemini Pro

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "navy blue suit",
    "vibe": "business formal",
    "gender": "male",
    "age_group": "30-40",
    "skin_colour": "fair",
    "num_ideas": 3,
    "more_details": "I have an important meeting and prefer conservative colors",
    "layering_preference": "No Layers",
    "ai_provider": "gemini",
    "model": "gemini-1.5-pro"
  }'
```

## Example 3: Using Wardrobe Items Only

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "white t-shirt",
    "vibe": "casual",
    "gender": "female",
    "use_wardrobe_only": true,
    "num_ideas": 2
  }'
```

## Example 4: Using Ollama (Local)

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "red hoodie",
    "vibe": "comfortable casual",
    "gender": "unisex",
    "ai_provider": "ollama",
    "model": "llama3:8b"
  }'
```

## Example 5: Get Available Models

```bash
curl -X GET "http://localhost:8000/api/chat/models"
```

## Example 6: Layering Suggestions

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "grey turtleneck",
    "vibe": "winter smart casual",
    "gender": "male",
    "layering_preference": "Suggest Layers",
    "num_ideas": 2
  }'
```

## Python Example

```python
import requests

url = "http://localhost:8000/api/chat"

payload = {
    "item": "floral summer dress",
    "vibe": "summer party",
    "gender": "female",
    "age_group": "25-30",
    "skin_colour": "medium",
    "num_ideas": 3,
    "more_details": "Outdoor garden party in warm weather",
    "ai_provider": "gemini",
    "model": "gemini-2.5-flash"
}

response = requests.post(url, json=payload)
outfits = response.json()

for outfit in outfits["outfits"]:
    print(f"\nOutfit {outfit['id']}:")
    print(f"  Item 1: {outfit['item1']['name']}")
    print(f"    Reason: {outfit['item1']['reason']}")
    print(f"  Item 2: {outfit['item2']['name']}")
    print(f"    Reason: {outfit['item2']['reason']}")
    print(f"  Footwear: {outfit['footwear']['name']}")
    print(f"    Reason: {outfit['footwear']['reason']}")
```

## JavaScript/Fetch Example

```javascript
const getOutfitSuggestions = async () => {
  const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item: 'denim jacket',
      vibe: 'casual weekend',
      gender: 'unisex',
      num_ideas: 2,
      ai_provider: 'gemini',
      model: 'gemini-2.5-flash'
    })
  });
  
  const data = await response.json();
  console.log('Outfit Suggestions:', data.outfits);
  return data;
};

getOutfitSuggestions();
```

## Model Comparison

```bash
# Get fastest results with Gemini Flash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "leather jacket",
    "vibe": "edgy",
    "gender": "unisex",
    "ai_provider": "gemini",
    "model": "gemini-2.5-flash"
  }'

# Get most detailed analysis with Gemini Pro
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "leather jacket",
    "vibe": "edgy",
    "gender": "unisex",
    "ai_provider": "gemini",
    "model": "gemini-1.5-pro"
  }'

# Use local processing with Ollama
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "leather jacket",
    "vibe": "edgy",
    "gender": "unisex",
    "ai_provider": "ollama"
  }'
```
