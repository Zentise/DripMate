import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import WardrobePage from './pages/WardrobePage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import BottomNav from './components/BottomNav.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<><ChatPage /><BottomNav /></>} />
        <Route path="/wardrobe" element={<><WardrobePage /><BottomNav /></>} />
        <Route path="/saved" element={<><SavedPage /><BottomNav /></>} />
        <Route path="/profile" element={<><ProfilePage /><BottomNav /></>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
