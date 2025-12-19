"""
Configuration and environment variable loading for DripMate.
"""
import os
from pathlib import Path


def load_env():
    """Load environment variables from .env file."""
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
        print(f"✓ Loaded .env from {env_path}")
    else:
        print(f"⚠ .env not found at {env_path}")


# Load environment variables on import
load_env()

# Database configuration
DB_URL = os.getenv("DRIPMATE_DB_URL", "sqlite:///./dripmate.db")

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")

# Model selection
DEFAULT_LLM = os.getenv("DEFAULT_LLM", "groq")  # "groq", "gemini" or "ollama"

# JWT Authentication
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
