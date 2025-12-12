"""
Load environment variables from .env file in parent directory
"""
import os
from pathlib import Path

def load_env():
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
        print(f"[env] Loaded environment variables from {env_path}")
    else:
        print(f"[env] Warning: .env file not found at {env_path}")

load_env()
