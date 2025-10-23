import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Wardrobe from './pages/Wardrobe.jsx';
import Chat from './pages/Chat.jsx';
import Fits from './pages/Fits.jsx';
import Profile from './pages/Profile.jsx';
import { AppProvider } from './state/AppContext.jsx';

const TabIcon = ({ name, active }) => {
  const base = 'w-6 h-6';
  const activeCls = active ? 'text-brand-500' : 'text-zinc-400';
  switch (name) {
    case 'wardrobe':
      return (<svg className={`${base} ${activeCls}`} viewBox="0 0 24 24" fill="currentColor"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4 2h8v8H8V8z"/></svg>);
    case 'chat':
      return (<svg className={`${base} ${activeCls}`} viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v10H7l-3 3V4z"/></svg>);
    case 'fits':
      return (<svg className={`${base} ${activeCls}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21l-1.45-1.32C6.4 15.36 4 13.28 4 10.5 4 8.5 5.5 7 7.5 7c1.54 0 3.04.99 3.57 2.36h1.87C13.46 7.99 14.96 7 16.5 7 18.5 7 20 8.5 20 10.5c0 2.78-2.4 4.86-6.55 9.18L12 21z"/></svg>);
    default:
      return (<svg className={`${base} ${activeCls}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/></svg>);
  }
};

const BottomNav = () => {
  const location = useLocation();
  const tabs = [
    { to: '/', label: 'Wardrobe', key: 'wardrobe' },
    { to: '/chat', label: 'Chat', key: 'chat' },
    { to: '/fits', label: 'Fits', key: 'fits' },
    { to: '/profile', label: 'Profile', key: 'profile' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 dark:bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          return (
            <NavLink key={t.key} to={t.to} className="flex flex-col items-center py-2">
              <TabIcon name={t.key} active={active} />
              <span className={`text-xs mt-1 ${active ? 'text-brand-500' : 'text-zinc-400'}`}>{t.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
        <header className="sticky top-0 z-40 bg-zinc-950/70 backdrop-blur border-b border-zinc-800">
          <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-tight">DripMate</h1>
            <span className="text-xs text-zinc-400">AI Stylist</span>
          </div>
        </header>

        <main className="mx-auto max-w-md px-4 pt-4 pb-6">
          <Routes>
            <Route path="/" element={<Wardrobe />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/fits" element={<Fits />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </AppProvider>
  );
}

export default App;