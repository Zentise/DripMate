# 👔 DripMate — AI Outfit Stylist App

## **Overview**

DripMate is an **AI-powered personal stylist** that helps users put together outfits effortlessly.  
By analyzing pictures of individual clothing items (shirts, pants, jackets, etc.), DripMate suggests the **best complementary pieces** to complete the look.  
It focuses on **color harmony, vibe, and occasion** to make sure users always look confident and stylish.

---

## **Core Feature (MVP)**

- **Outfit Suggestion from Single Item**
    - User uploads a picture of a shirt/pant.
    - AI analyzes its **color, style, and category**.
    - Suggests matching **pants, shirts, and layering options**.
---
## **Additional Features (Future Enhancements)**

1. **Personal Closet (Wardrobe Management)**
    - Users can upload photos of their clothes.
    - DripMate builds a **virtual wardrobe**.
    - Suggestions are **only from the user’s own clothes**.
    
2. **Accessories Recommendation**
    - Suggests matching shoes, watches, or bags.
    - Example: “Brown leather shoes go well with this fit.”
    
3. **Layer Suggestions**
    - Suggest jackets, hoodies, or blazers to complete the vibe.
    - Seasonal recommendations (e.g., light jacket for autumn).
    
4. **Theme-Based Outfits**
    - Suggest outfits for **events/occasions**:
        - “Casual college day”
        - “Formal presentation”
        - “Date night”
        - “Party wear”
    
5. **Fit Rating System**
    - Each suggested outfit gets a score (1–10).
    - Explanations: “Colors are complementary,” “This gives a clean formal vibe.”
    
6. **Style Insights (AI Fashion Assistant)**
    - Chat-like fashion assistant powered by LLM.
    - Example: “Does this shirt work for an interview?”
    - AI responds with advice.
    
7. **Daily Outfit Inspiration (OOTD)**
    - App generates outfit ideas from wardrobe each day.
    - Push notification: “Today’s vibe suggestion: White tee + blue jeans + sneakers.”

---
## **Unique Selling Point (USP)**

- **AI-powered stylist in your pocket** → Unlike generic shopping apps, DripMate works with your **actual wardrobe** and gives **personalized outfit suggestions**.
- **Real photos, not just catalogs** → User uploads their clothes, DripMate adapts.
- **Occasion-aware** → Fits the vibe (college, party, formal, etc.).
- **Accessories + layering** → Goes beyond shirt/pant matching to full styling.

---

## **Minimum Viable Quality (MVQ)**

For the first working version (MVP):
- User uploads shirt/pant → AI suggests the matching counterpart (from a small database).
- Basic UI with upload + result screen.
- Color-based + rule-based outfit matching.
- Simple scoring system (e.g., “Good Match / Average / Not Recommended”).

This ensures you can **demo the core idea** quickly while keeping expansion open.

---

## **Long-Term Vision**

- Community features: share outfits, rate others’ fits.
- E-commerce integration: recommend missing items and link to stores.
- Virtual try-on (overlay clothes on a model or the user).
- Cross-platform app (Android, iOS, Web).

---

⚡ In short:  
**DripMate = AI fashion buddy that suggests complete outfits based on what you already own, your vibe, and your occasion.**

---

## **How to Run the Project**

### **Prerequisites**
- **Python 3.8+** installed on your system
- **Node.js 16+** and **npm** installed
- **Ollama** installed and running (for AI chat functionality)

### **Backend Setup**

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows (PowerShell):
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   The backend API will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`

### **Frontend Setup**

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

### **Running Both Services**

To run the full application:
1. Open **two terminal windows**
2. In the first terminal, start the backend (follow Backend Setup steps)
3. In the second terminal, start the frontend (follow Frontend Setup steps)
4. Access the application at `http://localhost:5173`

### **Ollama Setup (for AI Chat)**

1. **Install Ollama** from [https://ollama.ai](https://ollama.ai)
2. **Pull a model** (e.g., llama2):
   ```bash
   ollama pull llama2
   ```
3. **Ensure Ollama is running** in the background before using the chat feature

### **Troubleshooting**

- **CORS Issues**: The backend is configured to accept requests from `localhost:5173`. If you change the frontend port, update the CORS settings in `backend/app/main.py`.
- **Database**: The app uses SQLite by default. The database file will be created automatically on first run.
- **Port Conflicts**: If ports 8000 or 5173 are already in use, you can specify different ports:
  - Backend: `uvicorn app.main:app --reload --port <YOUR_PORT>`
  - Frontend: Update `vite.config.js` or use `npm run dev -- --port <YOUR_PORT>`

---

Do you want me to also draft a **tagline + elevator pitch** (like 2–3 killer lines you can use in portfolio, resume, or pitch deck) for DripMate?