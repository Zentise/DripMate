


<div align="center">

# 👔 DripMate

### Your AI-Powered Personal Stylist

*Get instant, personalized outfit suggestions powered by Groq LLaMA 3.3 70B + Gemini Vision*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-FF6B00.svg)](https://groq.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_Vision-4285F4.svg)](https://ai.google.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Contributing](#-contributing)

</div>

---

## 🎯 What is DripMate?

DripMate is a **full-stack web application** that solves the everyday problem of choosing what to wear. Powered by **Groq's LLaMA 3.3 70B** for lightning-fast text suggestions and **Google Gemini Vision** for intelligent image analysis, it provides personalized outfit recommendations tailored to your style and wardrobe.

Think of it as having a **personal stylist in your pocket** that understands fashion like a pro, responds in milliseconds, and can even analyze clothing photos to build your digital wardrobe.

### 💡 The Problem We Solve

- 👗 **Decision Fatigue**: Staring at your closet every morning not knowing what to wear
- 🔄 **Underutilized Wardrobe**: Forgetting about clothes you own and wearing the same few outfits
- 🎨 **Style Uncertainty**: Unsure which items pair well together
- ⏰ **Time Wasting**: Spending too much time planning outfits for different occasions

### ✨ The DripMate Solution

- ⚡ **Lightning-Fast AI**: Groq LLaMA 3.3 70B delivers suggestions in under 2 seconds
- 🔐 **Secure Authentication**: Personal accounts with JWT-based security
- 👕 **Virtual Wardrobe**: Digital catalog of your actual clothes
- 📸 **Image Recognition**: Gemini Vision analyzes clothing photos instantly
- 🎭 **Vibe-Based Suggestions**: Get outfits tailored to specific occasions and moods
- 🎨 **Dual AI Approach**: Text (Groq) + Vision (Gemini) for comprehensive styling
- 📱 **Mobile-First Design**: Optimized for on-the-go styling decisions
- 👤 **Personalized Profiles**: Save preferences for age, gender, and skin tone

---

## ⚡ Features

### ✅ Current Features (Stage I & II - Complete)

#### � Authentication & User Management
- Secure signup/login with JWT tokens
- Personalized user profiles
- Store preferences (gender, age group, skin tone)
- Session management across devices

#### 🗨️ Intelligent Chat Mode
- Describe any clothing item and desired vibe
- Get instant AI-generated outfit suggestions (< 2 seconds with Groq)
- Supports 1-3 outfit ideas per request
- Customizable preferences:
  - Layering options (AI decides, with layers, no layers)
  - Gender-specific styling
  - Age-appropriate recommendations
  - Skin tone complementary colors
- **Two modes**: "For Yourself" (uses your profile) or "For Others"

#### 👚 Virtual Wardrobe Management
- Add, edit, and delete clothing items
- Organize by category (clothing, footwear, accessories)
- Tag items with color, season, and notes
- **Wardrobe-Only Mode**: AI suggests outfits using ONLY your saved items
- Quick item search and filtering

#### ⭐ Favorite Outfits
- Save outfit combinations you love
- Quick access to go-to looks
- Organized by vibe and source item
- One-click recreation of saved outfits

#### 👤 User Profile Dashboard
- Track wardrobe size and favorite count
- Personalized styling based on saved preferences
- Auto-fill profile data in suggestions

### 🚧 Upcoming Features (Stage III - In Progress)

#### 📸 Image-Based Outfit Suggestions (Implemented with Gemini Vision)
- **Upload clothing photos** directly in chat
- **AI analyzes images** using Gemini Vision to detect:
  - Clothing item type and category
  - Primary colors and patterns
  - Style and season suitability
  - Detailed descriptions
- Get instant outfit suggestions based on the detected item
- Supports wardrobe-only mode for image-based requests

#### 🖼️ Enhanced Image Features (Coming Soon)
- Add clothing items directly to wardrobe from photos
- Bulk photo uploads
- Background removal for cleaner item storage
- Multiple items detection in single photo
- Outfit validation: "Does this combination work?"
- Style inspiration from fashion photos

---

## 🎬 Demo

### Chat Interface
```
You: "I have a black hoodie. Give me a streetwear vibe outfit."

DripMate: [Response in < 2 seconds]
✨ Outfit Idea 1
━━━━━━━━━━━━━━━━━━━━━━━
👕 Oversized white graphic tee
   → Layers under the hoodie for depth and style

👖 Light-wash distressed jeans
   → Creates contrast with dark hoodie, classic streetwear

👟 White Air Force 1s
   → Clean, iconic sneaker that completes the look

💾 Save to Favorites
```

### Image Analysis
```
You: [Upload photo of clothing item]

DripMate: [Gemini Vision analyzes]
📸 Detected: Black leather jacket - Biker style with silver zippers

✨ Outfit Idea 1
━━━━━━━━━━━━━━━━━━━━━━━
👕 White crew neck t-shirt
   → Classic combo, lets the jacket shine

👖 Black skinny jeans
   → Sleek silhouette, edgy aesthetic

👟 Black Chelsea boots
   → Elevates the rock-inspired look
```

### Wardrobe Dashboard
- 📦 **Organized Categories**: Clothing, Footwear, Accessories
- 🔍 **Quick Search**: Find items instantly
- ✏️ **Easy Management**: Add/edit/delete with clean UI
- 🎨 **Visual Tags**: Color-coded seasons and categories

---

## 🏗️ Architecture

### Tech Stack

#### **Backend**
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLite with SQLAlchemy ORM
- **AI Engines**: 
  - **Groq** (LLaMA 3.3 70B) - Text-based outfit suggestions
  - **Google Gemini Vision** - Image analysis and detection
- **Authentication**: JWT tokens with python-jose
- **Password Security**: Bcrypt hashing
- **Image Processing**: Pillow, base64 encoding

#### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Routing**: React Router v6

#### **Deployment**
- **Backend**: Uvicorn ASGI server
- **Frontend**: Vite dev server / Static build
- **Database**: Local SQLite file

### System Architecture

```

┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ Login/    │ │ Chat      │ │ Wardrobe  │ │ Favorites │   │
│  │ Signup    │ │ Page      │ │ Page      │ │ Page      │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                          │                                   │
│                          │ Axios + JWT Auth                  │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth     │  │ Chat     │  │ Wardrobe │  │ Vision   │   │
│  │ Routes   │  │ Routes   │  │ Routes   │  │ Routes   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │               │             │         │
│       │             ▼               ▼             ▼         │
│       │      ┌─────────────┐ ┌──────────┐ ┌──────────┐    │
│       │      │ Groq LLM    │ │ Database │ │ Gemini   │    │
│       │      │ Service     │ │ Layer    │ │ Vision   │    │
│       │      │ (LLaMA 3.3) │ │          │ │ Service  │    │
│       │      └─────────────┘ └────┬─────┘ └──────────┘    │
│       │                           │                        │
│       └───────────────────────────┼────────────────────────┘
│                                   │
│                                   ▼
│            ┌────────────────────────────────┐
│            │   SQLite Database              │
│            ├────────────────────────────────┤
│            │ • users                        │
│            │ • wardrobe_items               │
│            │ • favorite_outfits             │
│            └────────────────────────────────┘
│                                   │
└───────────────────────────────────┼─────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            ┌───────────────┐             ┌──────────────┐
            │ Groq API      │             │ Google AI    │
            │ (Cloud)       │             │ Gemini API   │
            │ LLaMA 3.3 70B │             │ (Cloud)      │
            └───────────────┘             └──────────────┘
### Database Schema

```sql

users
├── id (PK)
├── name
├── email (UNIQUE)
├── hashed_password
├── gender
├── age_group
└── skin_colour

wardrobe_items
├── id (PK)
├── user_id (FK → users.id)
├── category (ENUM: clothing/footwear/accessory)
├── name
├── color
├── season (ENUM: summer/winter/spring/fall/all-season)
└── notes

favorite_outfits
├── id (PK)
├── user_id (FK → users.id)
├── title
├── source_item
├── vibe
├── payload (JSON)
└── created_at (TIMESTAMP)

```

---

## 🚀 Installation

### Prerequisites

- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Groq API Key** ([Get Free Key](https://console.groq.com/))
- **Google Gemini API Key** ([Get Free Key](https://makersuite.google.com/app/apikey))
- **Git**

### Step 1: Clone the Repository

```

git clone https://github.com/Zentise/DripMate.git
cd DripMate

```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env

# Initialize database (runs automatically on first start)
```

### Step 3: Get API Keys

**Groq API Key (Free):**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create new API key
5. Copy and paste into `.env` file

**Gemini API Key (Free):**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy and paste into `.env` file

### Step 4: Frontend Setup

```

cd ../frontend

# Install dependencies

npm install

# Or using yarn

yarn install

```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the App

Open your browser and navigate to:
```

http://localhost:5173

```

The backend API will be running at:
```

http://localhost:8000

```

API documentation available at:
```

http://localhost:8000/docs

```

---

## 📖 Usage

### 1. Building Your Virtual Wardrobe

1. Navigate to the **Wardrobe** tab
2. Click **"Add Item"**
3. Fill in the details:
   - **Category**: Clothing, Footwear, or Accessory
   - **Name**: e.g., "Black hoodie", "Blue denim jeans"
   - **Color**: Primary color
   - **Season**: Summer, Winter, Spring, Fall, or All-season
   - **Notes** (optional): Any additional details
4. Click **"Add Item"** to save

**💡 Pro Tip**: Use the seed script to populate sample items:
```

python -m app.seed_wardrobe

```

### 2. Getting Outfit Suggestions

#### Option A: Freestyle Mode
1. Go to the **Chat** tab
2. Uncheck **"Use Wardrobe Only"**
3. Enter:
   - **Item**: The base clothing piece (e.g., "black leather jacket")
   - **Vibe**: Desired style (e.g., "edgy streetwear", "smart casual")
4. Optional: Set gender, age group, layering preference
5. Click **"Get Suggestion"**

#### Option B: Wardrobe-Aware Mode ⭐ (Recommended)
1. Go to the **Chat** tab
2. Check **"Use Wardrobe Only"**
3. Enter:
   - **Item**: Select from YOUR wardrobe (e.g., "White oversized tee")
   - **Vibe**: Occasion or mood (e.g., "casual college day", "date night")
4. Get outfits built **exclusively from your closet**

### 3. Saving Favorite Outfits

1. After receiving suggestions, click the **heart icon** on any outfit
2. Access saved outfits in the **Favorites** tab
3. View, delete, or recreate your go-to looks

---

## 🛠️ Development

### Project Structure

```

DripMate/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat_router.py       \# AI outfit suggestions
│   │   │   ├── wardrobe_router.py   \# Wardrobe CRUD
│   │   │   ├── favorites_router.py  \# Saved outfits
│   │   │   ├── profile_router.py    \# User profile
│   │   │   └── vision_router.py     \# Image analysis (Stage III)
│   │   ├── services/
│   │   │   ├── ollama_service.py    \# Llama 3 integration
│   │   │   └── vision_service.py    \# Computer vision (Stage III)
│   │   ├── schemas/
│   │   │   ├── chat_schemas.py      \# Request/response models
│   │   │   └── wardrobe_schemas.py  \# Wardrobe models
│   │   ├── models.py                \# Database models
│   │   ├── database.py              \# DB connection
│   │   ├── main.py                  \# FastAPI app
│   │   └── seed_wardrobe.py         \# Sample data script
│   ├── requirements.txt
│   └── dripmate.db                  \# SQLite database
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx         \# Main chat interface
│   │   │   ├── WardrobePage.jsx     \# Wardrobe management
│   │   │   ├── SavedPage.jsx        \# Favorites view
│   │   │   └── ProfilePage.jsx      \# User profile
│   │   ├── components/
│   │   │   └── PhotoUpload.jsx      \# Image upload (Stage III)
│   │   ├── api/
│   │   │   └── dripMateAPI.js       \# Axios API client
│   │   ├── App.jsx                  \# Main app component
│   │   └── main.jsx                 \# Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md

```

### API Endpoints

#### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login and get JWT token
- `GET /profile` - Get current user profile (requires auth)

#### Chat & Styling
- `POST /chat` - Get AI outfit suggestions (requires auth)
  - Supports text-based requests (Groq)
  - Customizable with user preferences
- `POST /upload-image` - Analyze clothing image and get suggestions (requires auth)
  - Uses Gemini Vision
  - Returns detected item + outfit ideas

#### Wardrobe Management
- `GET /wardrobe` - List all wardrobe items (requires auth)
- `POST /wardrobe` - Add new item (requires auth)
- `PUT /wardrobe/{id}` - Update item (requires auth)
- `DELETE /wardrobe/{id}` - Delete item (requires auth)

#### Favorites
- `GET /favorites` - List saved outfits (requires auth)
- `POST /favorites` - Save outfit (requires auth)
- `DELETE /favorites/{id}` - Remove favorite (requires auth)

#### System
- `GET /` - API information and health check
- `GET /models` - List available AI models and providers

---

## 🗺️ Roadmap

### ✅ Phase 1: Text-Based MVP (Complete)
- [x] Freestyle chat with AI styling
- [x] Groq LLaMA 3.3 70B integration
- [x] Multiple outfit ideas per request
- [x] Customizable styling preferences

### ✅ Phase 2: Wardrobe Integration (Complete)
- [x] User authentication system (JWT)
- [x] Personalized user profiles
- [x] Virtual wardrobe database
- [x] Wardrobe CRUD operations
- [x] Wardrobe-aware AI suggestions
- [x] Favorites system
- [x] "For Yourself" vs "For Others" mode

### 🚧 Phase 3: Image-Based System (In Progress)
- [ ] Photo upload for wardrobe items
- [ ] YOLOv5 clothing detection
- [ ] Color & attribute extraction
- [ ] Multimodal chat (image + text)
- [ ] Background removal

### 🔮 Phase 4: Advanced Features (Future)
- [ ] **Style Profile**: Personalized style quiz
- [ ] **Weather Integration**: Weather-appropriate suggestions
- [ ] **Calendar Integration**: Plan outfits for upcoming events
- [ ] **Wear Tracking**: Track most/least worn items
- [ ] **Cost-Per-Wear**: Calculate clothing value
- [ ] **Sustainability Insights**: Encourage closet utilization
- [ ] **Social Features**: Share outfits, community voting
- [ ] **AR Try-On**: Virtual outfit visualization
- [ ] **E-commerce Integration**: Shop missing pieces
- [ ] **Mobile Apps**: Native iOS/Android versions

---

## 🎨 Design Philosophy

### Mobile-First
DripMate is designed primarily for mobile devices because that's where fashion decisions happen—in front of the mirror, on the go, planning for the day ahead.

### Privacy-Conscious
- No cloud storage of personal images without consent
- Local-first data (SQLite)
- Images deleted immediately after processing
- Optional features (location, camera) respect user choice

### Wardrobe-Centric
Unlike generic fashion apps, DripMate works with what you **already own**. Every suggestion is practical and immediately actionable.

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
```

git checkout -b feature/AmazingFeature

```
3. **Commit your Changes**
```

git commit -m 'Add some AmazingFeature'

```
4. **Push to the Branch**
```

git push origin feature/AmazingFeature

```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Write clear, commented code
- Update documentation for new features
- Test thoroughly before submitting PRs
- Use meaningful commit messages

### Areas We Need Help With

- 🧪 **Testing**: Write unit/integration tests
- 🎨 **UI/UX**: Improve design and user experience
- 🤖 **AI Prompts**: Enhance styling suggestions quality
- 🖼️ **Computer Vision**: Improve image analysis accuracy
- 📱 **Mobile**: Build native mobile apps
- 🌐 **Internationalization**: Add language support
- 📚 **Documentation**: Expand guides and tutorials

---

## 🐛 Known Issues

- [ ] First Gemini Vision request may take 3-5 seconds (API cold start)
- [ ] Rate limits apply to free API tiers (Groq: 30 req/min, Gemini: 60 req/min)
- [ ] Large images (>4MB) may need compression before upload
- [ ] Mobile browser camera access requires HTTPS in production
- [ ] Session expires after 7 days, requiring re-login

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Shrijith S Menon** - [@ShrijithSM](https://github.com/ShrijithSM)

Project Link: [https://github.com/Zentise/DripMate](https://github.com/Zentise/DripMate)

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) - Lightning-fast LLM inference
- [Meta LLaMA 3.3](https://ai.meta.com/llama/) - AI model
- [Google Gemini](https://ai.google.dev/) - Vision AI
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Frontend build tool
- [TailwindCSS](https://tailwindcss.com/) - UI styling

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Zentise/DripMate?style=social)
![GitHub forks](https://img.shields.io/github/forks/Zentise/DripMate?style=social)
![GitHub issues](https://img.shields.io/github/issues/Zentise/DripMate)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Zentise/DripMate)
![GitHub last commit](https://img.shields.io/github/last-commit/Zentise/DripMate)

---

## 💬 Support

- 📧 Email: [shrijithsmenon@gmail.com](mailto:shrijithsmenon@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/Zentise/DripMate/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/Zentise/DripMate/discussions)

---
