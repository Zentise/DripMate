# Authentication System Implementation Guide

## Overview
This document describes the authentication and user-specific features implemented in DripMate.

## Features Implemented

### 1. User Authentication
- **Signup**: Users can create accounts with email/password
- **Login**: JWT-based authentication
- **Profile Management**: Each user has their own profile with body details

### 2. User Profile Fields
- Name
- Email
- Password (hashed with bcrypt)
- Gender
- Age Group (Teen, Young Adult, Adult, Mature)
- Skin Colour (Fair/Light, Tan/Medium, Dark/Deep)

### 3. User-Specific Data
- **Wardrobe**: Each user has their own wardrobe items
- **Favorites**: Each user has their own saved outfit combinations
- **Profile Stats**: Wardrobe count and favorites count per user

### 4. Smart Chat Modes
The chat page now has two modes:

#### **For Yourself Mode** (Default)
- Automatically uses your profile's gender, age group, and skin tone
- No need to input these details repeatedly
- Shows info banner: "Using your profile: {gender}, {age_group}, {skin_colour}"
- Body detail fields are hidden in advanced options

#### **For Others Mode**
- Allows manual input of gender, age, and skin tone
- Useful for styling friends/family
- Body detail fields are visible in advanced options

## Backend Changes

### New Files
- `backend/app/api/auth_router.py`: Authentication endpoints
  - `POST /auth/signup`: Create new account
  - `POST /auth/login`: Login and get JWT token
  - `GET /auth/me`: Get current user info

### Updated Files

#### `backend/app/models.py`
- Added fields to User model:
  - `hashed_password` (required)
  - `email` (required, unique)
  - `gender` (optional)
  - `age_group` (optional)
  - `skin_colour` (optional)
  - `created_at` (timestamp)

#### `backend/app/main.py`
- Added auth_router import and include
- Auth endpoints available at `/auth/*`

#### `backend/app/api/profile_router.py`
- Now uses `get_current_user` dependency
- Returns user-specific data
- Includes gender, age_group, skin_colour in response

#### `backend/app/api/wardrobe_router.py`
- All endpoints now require authentication
- Filter by `current_user.id`
- Removed `get_or_create_default_user` function

#### `backend/app/api/favorites_router.py`
- All endpoints now require authentication
- Filter by `current_user.id`
- Removed `get_or_create_default_user` function

#### `backend/app/schemas/wardrobe_schemas.py`
- Updated `UserProfileOut` to include:
  - `gender`
  - `age_group`
  - `skin_colour`

#### `backend/requirements.txt`
- Added `python-jose[cryptography]` for JWT
- Added `passlib[bcrypt]` for password hashing
- Added `python-dotenv` for environment variables

## Frontend Changes

### New Files

#### `frontend/src/pages/HomePage.jsx`
- Landing page for unauthenticated users
- Hero section with app description
- Feature cards (AI-Powered, Personal Wardrobe, Save Favorites)
- CTA buttons for signup and login

#### `frontend/src/pages/LoginPage.jsx`
- Email/password login form
- Error handling and display
- Saves JWT token to localStorage
- Saves user data to localStorage
- Redirects to /chat on success

#### `frontend/src/pages/SignupPage.jsx`
- Registration form with fields:
  - Name
  - Email
  - Password
  - Gender (dropdown)
  - Age Group (dropdown)
  - Skin Colour (dropdown)
- Auto-login after signup
- Redirects to /chat

### Updated Files

#### `frontend/src/main.jsx`
- Added routes for `/`, `/login`, `/signup`
- HomePage doesn't show BottomNav
- LoginPage doesn't show BottomNav
- SignupPage doesn't show BottomNav

#### `frontend/src/api/dripMateAPI.js`
- Added axios interceptor to include JWT token in all requests
- New auth functions:
  - `signup(data)`: Register new user
  - `login(data)`: Login user
  - `getCurrentUser()`: Get current user details
- All API calls now include `Authorization: Bearer {token}` header

#### `frontend/src/pages/ChatPage.jsx`
- Added `chatMode` state ("yourself" or "others")
- Added mode toggle buttons
- Added profile loading on mount
- Auto-fills gender/age/skin from profile when mode = "yourself"
- Hides body detail fields in advanced options when mode = "yourself"
- Shows info banner when using profile data

#### `frontend/src/pages/ProfilePage.jsx`
- Displays gender, age_group, skin_colour fields
- Conditional rendering (only shows if data exists)

## Security Features

1. **Password Hashing**: bcrypt with automatic salt
2. **JWT Tokens**: 7-day expiration
3. **Protected Routes**: All API endpoints require valid JWT
4. **CORS Configuration**: Restricted to localhost and LAN IPs
5. **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) DEFAULT 'Guest',
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    age_group VARCHAR(50),
    skin_colour VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Wardrobe Items Table
```sql
-- user_id is foreign key to users.id
-- CASCADE delete on user deletion
```

### Favorite Outfits Table
```sql
-- user_id is foreign key to users.id
-- CASCADE delete on user deletion
```

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Update Secret Key
In `backend/app/api/auth_router.py`, change:
```python
SECRET_KEY = "your-secret-key-change-this-in-production"
```

### 3. Reset Database (if needed)
The database will be automatically created with the new schema on first run.
If you have existing data, you may need to delete `backend/wardrobe.db` to recreate it.

### 4. Run Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### 5. Run Frontend
```bash
cd frontend
npm run dev
```

## Usage Flow

1. **First Visit**: User sees HomePage at `/`
2. **Sign Up**: Click "Get Started" → Fill signup form → Auto-login → Redirect to `/chat`
3. **Profile Setup**: User's body details (gender, age, skin tone) are saved
4. **Chat Mode**: 
   - Default mode is "For Yourself"
   - Profile data is auto-filled
   - Switch to "For Others" to style someone else
5. **Wardrobe**: Add items to personal wardrobe
6. **Favorites**: Save outfit combinations
7. **Profile**: View stats and body details

## API Endpoints

### Authentication
- `POST /auth/signup`: Create account
- `POST /auth/login`: Get JWT token
- `GET /auth/me`: Get current user (requires auth)

### Protected Endpoints (require JWT)
- `GET /api/profile`: Get user profile with stats
- `GET /api/wardrobe`: List user's wardrobe
- `POST /api/wardrobe`: Add item to user's wardrobe
- `PUT /api/wardrobe/{id}`: Update user's wardrobe item
- `DELETE /api/wardrobe/{id}`: Delete user's wardrobe item
- `GET /api/favorites`: List user's favorites
- `POST /api/favorites`: Save to user's favorites
- `DELETE /api/favorites/{id}`: Delete user's favorite
- `POST /api/chat`: Get outfit suggestions (uses user context)
- `POST /api/chat/image`: Image-based suggestions (uses user context)
- `POST /api/vision/analyze`: Analyze clothing images

## Token Storage

### Frontend (localStorage)
- `token`: JWT access token
- `user`: JSON stringified user object with id, name, email

### Token Lifecycle
- Expires in 7 days
- Automatically included in all API requests via axios interceptor
- User must login again after expiration

## Error Handling

### Backend
- 401 Unauthorized: Invalid or missing token
- 404 Not Found: Resource doesn't exist or doesn't belong to user
- 400 Bad Request: Validation errors

### Frontend
- Login errors displayed below form
- Signup errors displayed below form
- API errors show in chat as error cards
- Network errors handled gracefully

## Future Enhancements

1. **Protected Routes**: Add route guards to redirect unauthenticated users
2. **Logout**: Add logout button to clear localStorage and redirect
3. **Password Reset**: Email-based password recovery
4. **Profile Editing**: Allow users to update their body details
5. **Email Verification**: Verify email addresses on signup
6. **Refresh Tokens**: Implement refresh token rotation
7. **Social Login**: Google/Facebook OAuth integration
8. **Remember Me**: Optional longer token expiration
9. **Session Management**: View and revoke active sessions
10. **Two-Factor Auth**: Optional 2FA for enhanced security

## Notes

- The SECRET_KEY in auth_router.py should be changed in production
- Use environment variables for sensitive config in production
- Consider using Alembic for database migrations in production
- Add rate limiting to prevent brute force attacks
- Add HTTPS in production
- Consider adding email verification before allowing full access
