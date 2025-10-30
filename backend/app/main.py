from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat_router
from .api import wardrobe_router, favorites_router, profile_router
from .api import vision_router
from .database import Base, engine
from . import models  # noqa: F401 - ensure models are imported so metadata includes them

app = FastAPI(title="DripMate API")

# Allow localhost and typical private network ranges on any port
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=(
        r"^https?://(localhost|127\.0\.0\.1|"
        r"192\.168\.[0-9]{1,3}\.[0-9]{1,3}|"
        r"10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|"
        r"172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3})(:\d+)?$"
    ),
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Create tables at startup (simple approach; for production, use migrations)
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(chat_router.router, prefix="/api", tags=["chat"])
app.include_router(wardrobe_router.router, prefix="/api", tags=["wardrobe"])
app.include_router(favorites_router.router, prefix="/api", tags=["favorites"])
app.include_router(profile_router.router, prefix="/api", tags=["profile"])
app.include_router(vision_router.router, prefix="/api", tags=["vision"])

@app.get("/", tags=["root"])
def read_root():
    return {"message": "Welcome to the DripMate API!"}