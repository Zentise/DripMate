# Stage III: Image-Based Outfit Suggestions - Setup Guide

## Overview
Stage III adds the ability to upload or capture photos of clothing items and get AI-powered outfit suggestions using Google Gemini Vision API.

## New Features
- 📸 **Image Upload in Chat**: Take a photo or upload an image of any clothing item
- 🤖 **Gemini Vision Analysis**: AI automatically detects clothing type, color, style, and pattern
- 👗 **Smart Outfit Suggestions**: Get 3 complete outfit ideas based on the detected item
- 🏠 **Wardrobe Integration**: Optionally use only items from your personal wardrobe

## Setup Instructions

### Backend Setup

1. **Install new dependencies** (if not already installed):
```powershell
cd backend
pip install google-generativeai python-multipart
```

2. **Verify .env file**:
The Gemini API key should be in `.env` at the project root:
```
GEMINI_API_KEY=AIzaSyAnsOLtBF8LuHmTPT6TvzCt8Kd246nYNw0
```

3. **Start the backend**:
```powershell
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Install dependencies** (if not already done):
```powershell
cd frontend
npm install
```

2. **Start the dev server**:
```powershell
npm run dev
```

## How to Use

### Image-Based Outfit Suggestions

1. Navigate to the **Chat** page
2. Click **"📸 Upload Clothing Item Photo"**
3. Choose to:
   - Upload an existing photo, OR
   - Take a new photo with your camera (on mobile)
4. (Optional) Add extra preferences in the "Extra preferences" text area
5. (Optional) Check "Use only items in my wardrobe" to get suggestions from your wardrobe
6. Click **"🪄 Analyze & Suggest"**
7. Wait for AI to:
   - Detect the clothing item
   - Analyze its attributes (color, style, pattern)
   - Generate 3 complete outfit combinations
8. Save your favorite suggestions!

### Text-Based (Original Flow)

If you don't upload an image, the original text-based flow still works:
1. Enter your clothing item manually
2. Specify vibe, gender, and other preferences
3. Get suggestions as before

## API Endpoints

### New Endpoints

#### POST `/api/chat/image`
Upload a clothing image and get outfit suggestions.

**Form Data:**
- `file`: Image file (JPEG, PNG, WebP)
- `prompt` (optional): Extra context or preferences
- `use_wardrobe` (optional): Boolean, use only wardrobe items

**Response:**
```json
{
  "detected_item": {
    "category": "clothing",
    "name": "black hoodie",
    "color": "black",
    "pattern": "plain",
    "style": "casual",
    "season": "winter",
    "description": "A black pullover hoodie..."
  },
  "outfits": [
    {
      "name": "Streetwear Casual",
      "item1": {"name": "Black Hoodie", "id": null},
      "item2": {"name": "Blue Jeans", "id": null},
      "footwear": {"name": "White Sneakers", "id": null},
      "accessories": {"name": "Baseball Cap", "id": null},
      "reason": "Classic streetwear combo..."
    }
  ]
}
```

## Technical Details

### Backend Changes
- **vision_service.py**: Added `analyze_clothing_with_gemini()` and `get_outfit_from_image()`
- **image_chat_router.py**: New router for `/chat/image` endpoint
- **requirements.txt**: Added `google-generativeai` and `python-multipart`
- **load_env.py**: Automatic .env loading for API keys

### Frontend Changes
- **ChatPage.jsx**: 
  - Image upload/camera capture UI
  - Image preview with clear button
  - Conditional form rendering (image vs text mode)
  - Image display in chat messages
- **dripMateAPI.js**: Added `getOutfitFromImage()` function

## Testing

### Quick Backend Test
```powershell
# Test the image endpoint with curl
curl.exe -X POST "http://localhost:8000/api/chat/image" `
  -F "file=@path\to\your\image.jpg;type=image/jpeg" `
  -F "prompt=casual vibe" `
  -F "use_wardrobe=false"
```

### Frontend Test
1. Open http://localhost:5173
2. Go to Chat page
3. Upload a clothing image (hoodie, jeans, sneakers, etc.)
4. Verify the AI detects the item correctly
5. Check that 3 outfit suggestions appear
6. Try saving a favorite

## Troubleshooting

### "Gemini API not configured"
- Check `.env` file has `GEMINI_API_KEY=your_key`
- Restart the backend server after adding the key

### "Analysis failed" or timeout
- Verify your internet connection (Gemini API requires internet)
- Check API key is valid and has quota remaining
- Try with a clearer/simpler clothing photo

### Image not uploading
- Ensure file is JPEG, PNG, or WebP format
- Check file size (keep under 10MB)
- Try a different browser if on mobile

### No outfit suggestions
- The image should clearly show a single clothing item
- Avoid photos with multiple items or complex backgrounds
- Try better lighting and focus

## Notes
- Gemini Vision API requires an active internet connection
- First request may take longer as models initialize
- Image processing typically takes 3-5 seconds
- Works best with clear, well-lit photos of single clothing items

## Next Steps
- Add detected item details display before suggestions
- Show color swatches in UI
- Add ability to edit detected attributes before getting suggestions
- Implement image-based wardrobe item addition with one click
