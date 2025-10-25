import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ChatPage from './pages/ChatPage.jsx'
import WardrobePage from './pages/WardrobePage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import BottomNav from './components/BottomNav.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  </StrictMode>,
)
