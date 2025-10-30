


<div align="center">

# 👔 DripMate

### Your AI-Powered Personal Stylist

*Get instant, personalized outfit suggestions based on your actual wardrobe*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Contributing](#-contributing)

</div>

---

## 🎯 What is DripMate?

DripMate is a **full-stack web application** that solves the everyday problem of choosing what to wear. Unlike generic fashion apps that suggest clothes you don't own, DripMate builds outfit recommendations using **only the items in your personal wardrobe**.

Think of it as having a **personal stylist in your pocket** that knows your closet inside out.

### 💡 The Problem We Solve

- 👗 **Decision Fatigue**: Staring at your closet every morning not knowing what to wear
- 🔄 **Underutilized Wardrobe**: Forgetting about clothes you own and wearing the same few outfits
- 🎨 **Style Uncertainty**: Unsure which items pair well together
- ⏰ **Time Wasting**: Spending too much time planning outfits for different occasions

### ✨ The DripMate Solution

- 🤖 **AI-Powered Styling**: Intelligent outfit combinations using Llama 3 8B
- 👕 **Virtual Wardrobe**: Digital catalog of your actual clothes
- 📸 **Image Recognition** (Stage III): Upload photos to instantly add items to your wardrobe
- 🎭 **Vibe-Based Suggestions**: Get outfits tailored to specific occasions and moods
- 📱 **Mobile-First Design**: Optimized for on-the-go styling decisions

---

## ⚡ Features

### ✅ Current Features (Stage I & II - Complete)

#### 🗨️ Freestyle Chat Mode
- Describe any clothing item and desired vibe
- Get instant AI-generated outfit suggestions
- Supports multiple outfit ideas per request
- Customizable preferences (gender, age group, layering, etc.)

#### 👚 Virtual Wardrobe Management
- Add, edit, and delete clothing items
- Organize by category (clothing, footwear, accessories)
- Tag items with color, season, and notes
- **Wardrobe-Aware AI**: Suggestions use ONLY your saved items

#### ⭐ Favorite Outfits
- Save outfit combinations you love
- Quick access to go-to looks
- Organized by vibe and source item

#### 👤 User Profile
- Track wardrobe size and favorite count
- Personalized styling experience

### 🚧 Upcoming Features (Stage III - In Progress)

#### 📸 Image-Based Wardrobe Building
- **Upload photos** of your clothes
- **AI analyzes images** to extract:
  - Category (top/bottom/dress/shoes/jacket/accessory)
  - Primary colors
  - Style/vibe (casual/formal/sporty)
  - Pattern (solid/striped/printed)
  - Suggested item name
- **One-click add** to wardrobe with editable fields
- **Computer Vision**: YOLOv5 + ResNet for offline processing

#### 🖼️ Multimodal Chat
- Upload outfit inspiration images
- Get AI analysis and styling suggestions
- "Does this work?" validation for outfit ideas

---

## 🎬 Demo

### Chat Interface
```

You: "I have a black hoodie. Give me a streetwear vibe outfit."
DripMate:
✨ Idea 1
👕 Black hoodie (base)
👖 Light blue denim jeans (contrast, casual)
👟 White low-top sneakers (clean, versatile)
Rating: 9/10

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
- **AI Engine**: Ollama (running Llama 3 8B locally)
- **Computer Vision**: YOLOv5 + ResNet (Stage III)
- **Image Processing**: OpenCV, Pillow

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
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat Page    │  │ Wardrobe     │  │ Favorites    │      │
│  │              │  │ Management   │  │ Page         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                          │ Axios API Client                  │
└──────────────────────────┼───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat Router  │  │ Wardrobe     │  │ Vision       │      │
│  │              │  │ Router       │  │ Router       │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Ollama       │  │ Database     │  │ Vision       │      │
│  │ Service      │  │ (SQLAlchemy) │  │ Service      │      │
│  │ (Llama 3)    │  │              │  │ (YOLOv5)     │      │
│  └──────────────┘  └──────┬───────┘  └──────────────┘      │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
│
▼
┌─────────────────┐
│  SQLite DB      │
│  (dripmate.db)  │
└─────────────────┘

```

### Database Schema

```

users
├── id (PK)
├── name
└── email

wardrobe_items
├── id (PK)
├── user_id (FK → users.id)
├── category (ENUM: clothing/footwear/accessory)
├── name
├── color
├── season
├── image_url
└── notes

favorite_outfits
├── id (PK)
├── user_id (FK → users.id)
├── title
├── source_item
├── vibe
├── payload (JSON)
└── created_at

```

---

## 🚀 Installation

### Prerequisites

- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Ollama** ([Download](https://ollama.ai/download))
- **Git**

### Step 1: Clone the Repository

```

git clone https://github.com/Zentise/DripMate.git
cd DripMate

```

### Step 2: Backend Setup

```

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

# Optional: Seed sample wardrobe data

python -m app.seed_wardrobe

```

### Step 3: Install Ollama & Llama 3 Model

```


# Download and install Ollama from https://ollama.ai/download

# Pull Llama 3 model (8B parameter version)

ollama pull llama3

# Verify installation

ollama list

```

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
```

cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

```

**Terminal 2 - Ollama (if not running as service):**
```

ollama serve

```

**Terminal 3 - Frontend:**
```

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

#### Chat & Styling
- `POST /api/chat` - Get outfit suggestions

#### Wardrobe Management
- `GET /api/wardrobe` - List all wardrobe items
- `POST /api/wardrobe` - Add new item
- `PUT /api/wardrobe/{id}` - Update item
- `DELETE /api/wardrobe/{id}` - Delete item

#### Favorites
- `GET /api/favorites` - List saved outfits
- `POST /api/favorites` - Save outfit
- `DELETE /api/favorites/{id}` - Remove favorite

#### Profile
- `GET /api/profile` - Get user profile

#### Computer Vision (Stage III)
- `POST /api/wardrobe/analyze-photo` - Analyze clothing image

---

## 🗺️ Roadmap

### ✅ Phase 1: Text-Based MVP (Complete)
- [x] Freestyle chat with AI styling
- [x] Basic outfit generation
- [x] Multiple outfit ideas per request

### ✅ Phase 2: Wardrobe Integration (Complete)
- [x] Virtual wardrobe database
- [x] Wardrobe CRUD operations
- [x] Wardrobe-aware AI suggestions
- [x] Favorites system
- [x] User profile

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

- [ ] Ollama may consume significant RAM (8GB+ recommended)
- [ ] First AI request takes ~5-10 seconds (model loading)
- [ ] Image analysis (Stage III) requires GPU for optimal speed
- [ ] Mobile browser camera access requires HTTPS in production

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Shrijith S Menon** - [@ShrijithSM](https://github.com/ShrijithSM)

Project Link: [https://github.com/Zentise/DripMate](https://github.com/Zentise/DripMate)

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) - Local LLM inference
- [Meta Llama 3](https://ai.meta.com/llama/) - AI model
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend framework
- [Ultralytics YOLOv5](https://github.com/ultralytics/yolov5) - Object detection
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
