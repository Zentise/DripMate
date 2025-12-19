# Quick Start - DripMate with Gemini AI

## 5-Minute Setup

### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your new API key

### Step 2: Configure Environment
Add to your `.env` file in the backend folder:
```bash
GEMINI_API_KEY=AIzaSy...your_key_here
```

### Step 3: Install Dependencies (if not already done)
```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Start the Server
```bash
# From the backend directory
uvicorn app.main:app --reload
```

### Step 5: Test It!
Open a new terminal and try:
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "item": "black leather jacket",
    "vibe": "streetwear",
    "gender": "unisex"
  }'
```

You should get outfit suggestions powered by Gemini! 🎉

## What You Get

With this setup, you now have:
- ✅ Google Gemini AI (latest models)
- ✅ Smart outfit suggestions
- ✅ Color matching & style advice
- ✅ Wardrobe integration
- ✅ Multiple model options
- ✅ Ollama fallback (optional)

## Common Issues

### "Gemini API not configured"
- Check your `.env` file has `GEMINI_API_KEY`
- Restart the server after adding the key

### Still want to use Ollama?
Add this to your requests:
```json
{
  "ai_provider": "ollama"
}
```

## Next Steps

1. **Check available models:**
   ```bash
   curl http://localhost:8000/api/chat/models
   ```

2. **Try different models:**
   ```json
   {
     "item": "your item",
     "vibe": "your vibe",
     "gender": "your gender",
     "model": "gemini-1.5-pro"
   }
   ```

3. **Read full docs:**
   - [AI Configuration Guide](./AI_CONFIGURATION.md)
   - [API Examples](./API_EXAMPLES.md)
   - [Integration Summary](./GEMINI_INTEGRATION.md)

## Frontend Integration

Update your frontend API calls to include model selection:

```javascript
const getOutfit = async (item, vibe) => {
  const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item,
      vibe,
      gender: 'unisex',
      ai_provider: 'gemini',      // Use Gemini
      model: 'gemini-2.5-flash'   // Fastest model
    })
  });
  return response.json();
};
```

## Cost Management

Gemini has a generous free tier:
- **Free tier**: 15 requests/minute, 1500/day
- **Paid tier**: Higher limits available

Monitor usage at [Google Cloud Console](https://console.cloud.google.com)

## Support

Questions? Check:
1. Documentation in `/notes` folder
2. API docs at `http://localhost:8000/docs`
3. Server logs for errors

Happy styling! 👔👗👟
