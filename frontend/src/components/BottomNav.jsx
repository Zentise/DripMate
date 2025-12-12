import { NavLink } from "react-router-dom";

const Tab = ({ to, end, icon, label }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex-1 flex flex-col items-center justify-center py-3 md:py-4 text-xs md:text-sm font-medium transition-all duration-300
       ${isActive 
         ? 'text-white scale-105' 
         : 'text-gray-500 hover:text-gray-300'
       }`
    }
  >
    {({ isActive }) => (
      <>
        <span 
          className={`w-6 h-6 md:w-7 md:h-7 mb-1 transition-transform duration-300 ${
            isActive ? 'scale-110' : ''
          }`} 
          aria-hidden
        >
          {icon}
        </span>
        <span>{label}</span>
        {isActive && (
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 rounded-t-full"
            style={{ background: 'linear-gradient(90deg, #ffffff 0%, #d0d0d0 100%)' }}
          />
        )}
      </>
    )}
  </NavLink>
);

const iconChat = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M20 12a8 8 0 10-3.1 6.3L21 21l-1.7-4.2A7.96 7.96 0 0020 12z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const iconWardrobe = (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6h16M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M10 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const iconSaved = (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const iconProfile = (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M5 19a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const BottomNav = () => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t shadow-2xl"
      style={{ 
        background: 'rgba(0, 0, 0, 0.95)',
        borderColor: 'var(--border-primary)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)'
      }}
    >
      <div className="mx-auto max-w-screen-lg flex relative">
        <Tab to="/wardrobe" icon={iconWardrobe} label="Wardrobe" />
        <Tab to="/" end icon={iconChat} label="Chat" />
        <Tab to="/saved" icon={iconSaved} label="Saved" />
        <Tab to="/profile" icon={iconProfile} label="Profile" />
      </div>
    </nav>
  );
};

export default BottomNav;

