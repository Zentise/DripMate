from fastapi import FastAPI
# --- NEW: Import the CORS middleware ---
from fastapi.middleware.cors import CORSMiddleware
from .api import chat_router

app = FastAPI(title="DripMate API")

# --- NEW: Define the list of allowed origins (your frontend's address) ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# --- NEW: Add the CORS middleware to your application ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# Your existing router
app.include_router(chat_router.router, prefix="/api", tags=["chat"])

@app.get("/", tags=["root"])
def read_root():
    return {"message": "Welcome to the DripMate API!"}