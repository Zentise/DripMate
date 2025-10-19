from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chat_router

from app.database import models
from app.database.database import engine

models.Base.metadata.create_all(bind=engine)

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

# Your existing router
app.include_router(chat_router.router, prefix="/api", tags=["chat"])

@app.get("/", tags=["root"])
def read_root():
    return {"message": "Welcome to the DripMate API!"}