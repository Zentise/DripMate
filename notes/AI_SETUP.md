# AI Model Configuration

## Current Setup

DripMate now uses a **dual AI approach** for optimal performance:

### 1. Text-based Outfit Suggestions
- **Provider:** Groq
- **Model:** LLaMA 3.3 70B Versatile
- **Use Case:** Chat-based outfit suggestions (when user types requests)
- **Advantages:** 
  - Extremely fast response times
  - High-quality reasoning and fashion advice
  - Cost-effective
  - JSON mode support

### 2. Image-based Outfit Suggestions  
- **Provider:** Gemini Vision
- **Model:** Gemini 2.5 Flash
- **Use Case:** Analyzing uploaded clothing photos
- **Advantages:**
  - Advanced image understanding
  - Accurate clothing item detection
  - Multi-modal capabilities

## API Keys Required

Set these in `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## Default Configuration

The system defaults to:
- **Text suggestions:** Groq (LLaMA 3.3 70B)
- **Image suggestions:** Gemini Vision (automatic)

## Available Models

### Groq Models
- `llama-3.3-70b` (default) - LLaMA 3.3 70B Versatile
- `llama-3.1-70b` - LLaMA 3.1 70B Versatile  
- `mixtral-8x7b` - Mixtral 8x7B

### Gemini Models (fallback)
- `gemini-2.5-flash` (default)
- `gemini-2.0-flash-exp`
- `gemini-1.5-flash`
- `gemini-1.5-pro`

## How It Works

1. **User types a request** → Groq LLaMA 3.3 70B generates outfit suggestions
2. **User uploads image** → Gemini Vision analyzes the clothing item and suggests outfits

## Configuration Files Updated

- `backend/.env` - API keys
- `backend/config.py` - Configuration loader
- `backend/llm.py` - Groq integration added
- `backend/schemas.py` - Default provider changed to Groq
- `backend/main.py` - API documentation updated
- `backend/requirements.txt` - Groq package added
