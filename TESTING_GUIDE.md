# Quick Start Guide - Testing Authentication System

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- pip and npm available

## Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: The new dependencies include:
- `python-jose[cryptography]` - JWT token handling
- `passlib[bcrypt]` - Password hashing
- `python-dotenv` - Environment variables

## Step 2: Start Backend Server

```bash
cd backend
python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

The backend will automatically create the database with the new schema.

## Step 3: Install Frontend Dependencies (if not already done)

```bash
cd frontend
npm install
```

## Step 4: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

## Step 5: Test the System

### 1. Visit the Homepage
1. Open browser to `http://localhost:5173/`
2. You should see the DripMate landing page
3. Features displayed: AI-Powered Suggestions, Personal Wardrobe, Save Favorites

### 2. Create an Account
1. Click "Get Started" or "Sign Up"
2. Fill in the signup form:
   - **Name**: Your name
   - **Email**: test@example.com
   - **Password**: password123
   - **Gender**: Select from dropdown
   - **Age Group**: Select from dropdown (Teen/Young Adult/Adult/Mature)
   - **Skin Tone**: Select from dropdown (Fair/Light/Tan/Medium/Dark/Deep)
3. Click "Sign Up"
4. You should be automatically logged in and redirected to `/chat`

### 3. Test Chat - "For Yourself" Mode
1. The chat should default to "For Yourself" mode
2. You should see a banner: "ℹ️ Using your profile: {your gender}, {your age}, {your skin tone}"
3. Try asking for an outfit:
   - Simple: "black hoodie streetwear"
   - Or click Advanced (⚙️) and fill in details
4. Notice that gender/age/skin fields are NOT shown in advanced options (they're auto-filled from your profile)
5. After sending, the input minimizes to show the AI response clearly

### 4. Test Chat - "For Others" Mode
1. Click the "👥 For Others" button
2. The info banner should disappear
3. Click Advanced options (⚙️)
4. Now you SHOULD see gender/age/skin fields
5. Fill them in manually
6. Ask for an outfit suggestion
7. The AI will use the manually entered details instead of your profile

### 5. Test Wardrobe
1. Click the Wardrobe tab in the bottom navigation
2. Add a clothing item:
   - Category: clothing/footwear/accessory
   - Name: "Black Nike Hoodie"
   - Color: "Black"
   - Season: "all-season"
3. Your item should appear in the list
4. Try adding a few more items

### 6. Test Favorites
1. Go back to Chat
2. Ask for an outfit suggestion
3. When you get results, click "💾 Save to Favorites" on one of the outfit ideas
4. You should see "Saved to favorites" alert
5. Navigate to the Saved tab
6. Your saved outfit should appear there
7. Try deleting it with the delete button

### 7. Test Profile
1. Click the Profile tab
2. You should see:
   - Your avatar (first letter of your name)
   - Your full name and email
   - Stats: Wardrobe count and Favorites count
   - Profile Details:
     - Full Name
     - Email Address
     - **Gender** (should show what you selected during signup)
     - **Age Group** (should show what you selected)
     - **Skin Tone** (should show what you selected)
     - Member Since
     - Account Status: Active

### 8. Test Logout and Login
1. Close the browser or open a new incognito window
2. Go to `http://localhost:5173/`
3. Click "Sign In"
4. Enter the same credentials:
   - Email: test@example.com
   - Password: password123
5. Click "Sign In"
6. You should be logged in and redirected to `/chat`
7. Your wardrobe items and favorites should still be there
8. The chat mode should remember your profile data

### 9. Test Multiple Users
1. Logout or open a new incognito window
2. Go to `http://localhost:5173/`
3. Click "Sign Up"
4. Create a different account:
   - Email: user2@example.com
   - Different name, gender, age, skin tone
5. Add some wardrobe items
6. Save some outfits to favorites
7. Go to Profile - you should see ZERO wardrobe and favorites (separate from first user)
8. Add items to this user's wardrobe
9. The counts should update

### 10. Test Data Isolation
1. Login as first user
2. Note down wardrobe count
3. Logout and login as second user
4. The wardrobe should be different
5. Each user has completely separate:
   - Wardrobe items
   - Saved favorites
   - Profile data
   - Stats

## Troubleshooting

### Backend won't start
- Make sure you installed all dependencies: `pip install -r requirements.txt`
- Check if port 8000 is already in use
- Look for error messages in the console

### Frontend won't connect
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify you're accessing `http://localhost:5173` (not a different port)

### Can't login after signup
- Check browser console for errors
- Verify the email you're using
- Try creating a new account with a different email
- Check if localStorage has the token: Open DevTools → Application → Local Storage

### Profile data not showing
- Make sure you filled in all fields during signup
- Check the Network tab in DevTools to see the API response
- Verify the token is being sent in the Authorization header

### Chat mode not working
- Try refreshing the page
- Check if profile loaded (open DevTools → Console)
- Verify you're logged in (check localStorage for token)

### Database errors
- Delete `backend/wardrobe.db` to reset the database
- Restart the backend server
- Create a new account

## What's Next?

After testing, you can:
1. Customize the SECRET_KEY in `backend/app/api/auth_router.py`
2. Add more user profile fields
3. Implement logout functionality
4. Add profile editing
5. Implement password reset
6. Add email verification
7. Add protected route guards in frontend
8. Deploy to production

## API Testing with cURL

### Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "gender": "Male",
    "age_group": "Young Adult (18-25)",
    "skin_colour": "Tan/Medium"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (replace TOKEN with actual token)
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Get User Profile with Stats
```bash
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer TOKEN"
```

## Success Indicators

✅ Homepage loads with hero section and feature cards
✅ Can create account with body details
✅ Automatically logged in after signup
✅ Chat has two modes: "For Yourself" and "For Others"
✅ Profile data auto-fills in "For Yourself" mode
✅ Manual inputs visible in "For Others" mode
✅ Profile page shows gender, age, and skin tone
✅ Each user has isolated wardrobe and favorites
✅ Token persists across page refreshes
✅ Can login with same credentials after logout

Enjoy your new authentication system! 🎉
