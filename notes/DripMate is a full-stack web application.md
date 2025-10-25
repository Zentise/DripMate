DripMate is a full-stack web application designed to solve the common, everyday problem of choosing what to wear. It functions as an AI-powered personal stylist that provides users with complete, personalized outfit recommendations.

The primary innovation of DripMate is its "virtual wardrobe" feature. Unlike generic fashion apps that suggest clothes the user may not own, DripMate builds outfits using only the items a user has saved in their personal, persistent database. This ensures every suggestion is practical, accessible, and tailored directly to the user's own closet.

The application is built with a mobile-first design, featuring a clean, app-like interface that is responsive and adapts to device orientation for a seamless user experience.

2. Core Technology Stack
The project leverages a modern, modular technology stack:

Backend: Python, FastAPI, SQLAlchemy
AI Engine: Ollama (running Llama 3 8B locally)
Frontend: React (Vite), TailwindCSS, Axio
Database: SQLite

3. Project Development Stages
The development of DripMate was planned in three distinct stages to ensure a logical and manageable workflow.

Stage I: Text-Based MVP (Completed)
Goal: To prove the core concept of AI-powered outfit generation.
Status: 100% Complete.
Summary: This initial phase involved building a "freestyle" chat interface. A user could provide a text description of a single clothing item (e.g., "black hoodie") and a desired vibe (e.g., "streetwear"). The backend, powered by a local Llama 3 model, would then generate a complete outfit suggestion in real-time. This stage validated the AI's ability to provide creative and relevant fashion advice.

the project has successfully finished stage 1.

Now we have to do the stage 2.

In this stage there will be a feature to add cloth, footwear accessories to the user wardrobe and it will store in the database.
when the user asks for fit ideas, there will be a option to make fit using only items in wardrobe or any items. 
and the fit ideas can be saved if the user likes it and it will be stored in favoutries.

Ui:
main page will be the chat window and in bottom there will a footer of [wardrobe, chat, saved, profile]
in profile page the user can see basic datas of the user.
