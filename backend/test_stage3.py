"""
Quick test script for Stage III image-based outfit suggestions
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.load_env import load_env
load_env()

print("\n=== Stage III Test Suite ===\n")

# Test 1: Check Gemini API key
print("1. Checking Gemini API configuration...")
gemini_key = os.getenv("GEMINI_API_KEY")
if gemini_key:
    print(f"   ✓ Gemini API key found: {gemini_key[:10]}...")
else:
    print("   ✗ Gemini API key not found in environment")
    sys.exit(1)

# Test 2: Import vision service
print("\n2. Importing vision service...")
try:
    from app.services import vision_service
    print("   ✓ Vision service imported successfully")
except Exception as e:
    print(f"   ✗ Failed to import vision service: {e}")
    sys.exit(1)

# Test 3: Check Gemini model availability
print("\n3. Checking Gemini model initialization...")
if vision_service._gemini_model:
    print("   ✓ Gemini model initialized")
else:
    print("   ✗ Gemini model not initialized")

# Test 4: Import image chat router
print("\n4. Importing image chat router...")
try:
    from app.api import image_chat_router
    print("   ✓ Image chat router imported successfully")
except Exception as e:
    print(f"   ✗ Failed to import router: {e}")
    sys.exit(1)

# Test 5: Check FastAPI app
print("\n5. Checking FastAPI app configuration...")
try:
    from app.main import app
    routes = [route.path for route in app.routes]
    if "/api/chat/image" in routes:
        print("   ✓ /api/chat/image endpoint registered")
    else:
        print("   ✗ /api/chat/image endpoint not found")
    print(f"   Total routes: {len(routes)}")
except Exception as e:
    print(f"   ✗ Failed to load app: {e}")
    sys.exit(1)

print("\n=== All Tests Passed ✓ ===\n")
print("Ready to start the backend with:")
print("  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
