# DripMate AI Configuration Guide

## Overview
DripMate now uses **Google Gemini** as its core AI engine for intelligent outfit suggestions, with Ollama as an alternative local option.

## AI Provider Options

### 1. Google Gemini (Default & Recommended)
Google Gemini provides state-of-the-art AI-powered fashion recommendations with superior understanding of style, color theory, and fashion trends.

**Available Models:**
- `gemini-2.5-flash` (Default) - Latest and fastest model
- `gemini-2.0-flash-exp` - Experimental features
- `gemini-1.5-flash` - Fast and efficient
- `gemini-1.5-pro` - Most capable, deeper analysis

**Setup:**
1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### 2. Ollama (Local Alternative)
Run AI models locally on your machine for privacy and offline usage.

**Available Models:**
- `llama3:8b` (Default)

**Setup:**
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the model: `ollama pull llama3:8b`
3. Run Ollama service: `ollama serve`

## API Usage

### Get Outfit Suggestions

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "item": "black leather jacket",
  "vibe": "streetwear",
  "gender": "unisex",
  "age_group": "18-25",
  "skin_colour": "medium",
  "num_ideas": 3,
  "more_details": "I prefer darker colors",
  "layering_preference": "AI Decides",
  "use_wardrobe_only": false,
  "ai_provider": "gemini",
  "model": "gemini-2.5-flash"
}
```

**Parameters:**
- `item` (required): Base clothing item to style around
- `vibe` (required): Desired aesthetic (e.g., "casual", "formal", "streetwear")
- `gender` (required): Gender for styling
- `age_group` (optional): Age range for appropriate styling
- `skin_colour` (optional): Skin tone for color recommendations
- `num_ideas` (optional): Number of outfit ideas (1-3, default: 1)
- `more_details` (optional): Additional styling preferences
- `layering_preference` (optional): "AI Decides", "Suggest Layers", or "No Layers"
- `use_wardrobe_only` (optional): Use only items from user's wardrobe
- `ai_provider` (optional): "gemini" (default) or "ollama"
- `model` (optional): Specific model name (default: "gemini-2.5-flash")

**Response:**
```json
{
  "outfits": [
    {
      "id": 1,
      "item1": {
        "name": "white graphic t-shirt",
        "reason": "Creates contrast with the black jacket"
      },
      "item2": {
        "name": "dark blue jeans",
        "reason": "Classic streetwear staple that complements the jacket"
      },
      "footwear": {
        "name": "high-top sneakers",
        "reason": "Completes the streetwear aesthetic"
      }
    }
  ]
}
```

### Get Available Models

**Endpoint:** `GET /api/chat/models`

**Response:**
```json
{
  "default_provider": "gemini",
  "providers": {
    "gemini": {
      "name": "Google Gemini",
      "description": "Advanced AI models from Google (recommended)",
      "available": true,
      "models": [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-2.5-flash"
      ],
      "default_model": "gemini-2.5-flash"
    },
    "ollama": {
      "name": "Ollama (Local)",
      "description": "Local AI models running on your machine",
      "available": true,
      "models": ["llama3:8b"],
      "default_model": "llama3:8b"
    }
  }
}
```

## Switching Between Models

### Use Gemini with a specific model:
```json
{
  "item": "blue dress shirt",
  "vibe": "business casual",
  "gender": "male",
  "ai_provider": "gemini",
  "model": "gemini-1.5-pro"
}
```

### Use Ollama:
```json
{
  "item": "blue dress shirt",
  "vibe": "business casual",
  "gender": "male",
  "ai_provider": "ollama",
  "model": "llama3:8b"
}
```

## Model Selection Guidelines

**Choose Gemini when:**
- You want the best quality recommendations
- You need advanced understanding of fashion trends
- You have internet connection
- You want faster response times

**Choose Ollama when:**
- You need offline functionality
- You prefer local/private processing
- You're in development/testing without API costs

## Vision-Based Features

DripMate also uses Gemini Vision for analyzing clothing images and generating outfit suggestions from photos.

**Endpoint:** `POST /api/chat/image`

Upload an image of a clothing item to get outfit suggestions based on visual analysis.

## Best Practices

1. **Use Gemini as default** for production and best results
2. **Keep your API key secure** - never commit it to version control
3. **Monitor API usage** on Google Cloud Console
4. **Use Ollama for development** to save API costs during testing
5. **Specify the model** when you need specific capabilities (e.g., use gemini-1.5-pro for complex styling requests)

## Troubleshooting

### Gemini Not Available
- Check that `GEMINI_API_KEY` is set in your `.env` file
- Verify your API key is valid at Google AI Studio
- Ensure you have an active internet connection

### Ollama Not Working
- Confirm Ollama service is running: `ollama list`
- Pull the required model: `ollama pull llama3:8b`
- Check Ollama is accessible at `http://localhost:11434`

## Migration from Previous Version

If you were using only Ollama before:
1. Add `GEMINI_API_KEY` to your `.env` file
2. Your existing API calls will now use Gemini by default
3. To continue using Ollama, add `"ai_provider": "ollama"` to your requests
4. No other changes needed - the API is backward compatible
