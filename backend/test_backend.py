#!/usr/bin/env python
"""
Quick test script for the refactored DripMate backend.
Run this to verify everything works.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_root():
    """Test root endpoint."""
    print("1️⃣  Testing GET / ...")
    response = requests.get(f"{BASE_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Message: {response.json()['message']}")
    print()

def test_models():
    """Test models endpoint."""
    print("2️⃣  Testing GET /models ...")
    response = requests.get(f"{BASE_URL}/models")
    data = response.json()
    print(f"   Status: {response.status_code}")
    print(f"   Default provider: {data['default_provider']}")
    print(f"   Gemini available: {data['providers']['gemini']['available']}")
    print()

def test_chat():
    """Test chat endpoint."""
    print("3️⃣  Testing POST /chat ...")
    payload = {
        "item": "black hoodie",
        "vibe": "streetwear",
        "gender": "male",
        "num_ideas": 1,
        "ai_provider": "gemini",
        "model": "gemini-2.5-flash"
    }
    response = requests.post(f"{BASE_URL}/chat", json=payload)
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        outfits = data.get('outfits', [])
        print(f"   Outfits returned: {len(outfits)}")
        if outfits:
            outfit = outfits[0]
            print(f"   Item 1: {outfit['item1']['name']}")
            print(f"   Item 2: {outfit['item2']['name']}")
            print(f"   Footwear: {outfit['footwear']['name']}")
    else:
        print(f"   Error: {response.text}")
    print()

def main():
    """Run all tests."""
    print("=" * 60)
    print("🧪 DripMate Backend Test Suite")
    print("=" * 60)
    print()
    
    try:
        test_root()
        test_models()
        test_chat()
        
        print("=" * 60)
        print("✅ All tests completed!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Cannot connect to backend.")
        print("   Make sure the server is running:")
        print("   python main.py")
        print()
    except Exception as e:
        print(f"❌ Error: {e}")
        print()

if __name__ == "__main__":
    main()
