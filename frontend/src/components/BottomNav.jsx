import { NavLink } from "react-router-dom";

const Tab = ({ to, end, icon, label }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors
       ${isActive ? 'text-neon' : 'text-slate-400 hover:text-slate-200'}`
    }
  >
    <span className="w-6 h-6 mb-0.5" aria-hidden>
      {icon}
    </span>
    <span>{label}</span>
  </NavLink>
);

const iconChat = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
    <path d="M20 12a8 8 0 10-3.1 6.3L21 21l-1.7-4.2A7.96 7.96 0 0020 12z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const iconWardrobe = (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M10 10h4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const iconSaved = (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20l-6-4V6a2 2 0 012-2h8a2 2 0 012 2v10l-6 4z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const iconProfile = (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 19a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur bg-base-900/70 border-t border-slate-800 shadow-innerGlow"
         style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.25rem)' }}>
      <div className="mx-auto max-w-screen-md flex">
        <Tab to="/wardrobe" icon={iconWardrobe} label="Wardrobe" />
        <Tab to="/" end icon={iconChat} label="Chat" />
        <Tab to="/saved" icon={iconSaved} label="Saved" />
        <Tab to="/profile" icon={iconProfile} label="Profile" />
      </div>
    </nav>
  );
};

export default BottomNav;
