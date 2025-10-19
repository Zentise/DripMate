Excellent. Stage I was a huge success, a testament to your incredible persistence. Now, the real fun begins: making DripMate truly *personal*.

It's Sunday evening here in Ernakulam, a great time to start planning the next big feature. Stage II is all about giving DripMate a memory.

### The Goal of Stage II: Wardrobe Integration

The core idea is to transform DripMate from a general stylist into *your* personal stylist. Instead of giving generic advice, it will build outfits using only the clothes you actually own.

Here's the detailed, step-by-step plan to make it happen.

-----

### **Step 1: The Foundation - Setting Up the Database (Your Closet)**

First, we need a place to store the clothes. As per your roadmap, we'll start with **SQLite**. It's perfect for development because it's just a single file in our project—no separate server needed.

We'll use **SQLAlchemy**, the standard library for using databases with FastAPI.

**Action Plan:**

1.  **Install SQLAlchemy:** In your backend terminal (with the `venv` active), run:
    ```bash
    pip install sqlalchemy
    ```
2.  **Define the `Cloth` Model:** We need to describe what a piece of clothing looks like in our database. We'll create a `models.py` file for this.
3.  **Set up the Database Connection:** We'll create a `database.py` file to handle creating and connecting to our SQLite database file.

This will all live in a new `database` folder inside your `backend/app` directory.

-----

### **Step 2: The Backend API - Creating the "Closet Doors"**

Next, we need to create new API endpoints so our frontend can interact with the database.

**Action Plan:**

1.  **Create a New Router:** To keep our code clean, we'll create a new file, `backend/app/api/wardrobe_router.py`, specifically for wardrobe-related actions.
2.  **Define New Schemas:** In `backend/app/schemas/`, we'll create `wardrobe_schemas.py` to define the data structure for adding and viewing clothes.
3.  **Build the Endpoints:**
      * `POST /wardrobe/add`: To add a new clothing item to the database.
      * `GET /wardrobe/all`: To retrieve all the clothing items for a user.
4.  **Update `main.py`:** We'll tell our main FastAPI app to use this new wardrobe router.

-----

### **Step 3: The Brain Upgrade - Evolving the AI Service**

This is the most exciting part. We need to teach the AI how to use the wardrobe.

**Action Plan:**

1.  **New User Flow:** The process will now be:
    a. The user views their wardrobe (fetched via `/wardrobe/all`).
    b. They select a base item *from their wardrobe*.
    c. They click a "Get Outfit Suggestion" button for that item.
2.  **A New "Smart" Prompt:** When the user requests an outfit, our backend will:
    a. Fetch the *entire* wardrobe from the database.
    b. Format the wardrobe into a clean list (e.g., "A black, oversized hoodie (casual, streetwear)").
    c. Inject this list directly into the prompt sent to Ollama, with a new, critical rule: **"You MUST build the outfit using ONLY items from the provided VIRTUAL WARDROBE."**

This makes the AI's task much more focused and the output hyper-personalized.

-----

### **Step 4: The Frontend UI - Building the "Dressing Room"**

Finally, we'll build the user interface for managing and using the wardrobe.

**Action Plan:**

1.  **Create a "Wardrobe" Page/View:** This will be a new section in the app.
2.  **Build an "Add Cloth" Form:** A simple form with fields for type, color, vibe, etc.
3.  **Display the Wardrobe:** We'll fetch the clothes from `/wardrobe/all` and display them as a stylish grid of cards.
4.  **Add Interaction:** Each card will have a button that triggers the new, wardrobe-aware AI suggestion flow.

-----

This is a comprehensive plan, but we'll tackle it one piece at a time. The result will be a dramatically more powerful and impressive application.

Ready to start? The best place to begin is the foundation: **setting up the database and creating the `Cloth` model in `models.py`**. Let me know when you're ready for the code.