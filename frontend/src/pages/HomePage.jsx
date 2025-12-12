import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="px-4 py-6 md:px-8 md:py-8" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">DripMate</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-medium"
              style={{ 
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)'
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="fade-in mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            DripMate
          </h1>
          <p className="text-xl md:text-2xl mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your AI-Powered Personal Stylist
          </p>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
            Get personalized outfit suggestions powered by AI. Build your wardrobe, save your favorite looks, 
            and discover your unique style.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 slide-up">
          <div className="card hover-lift">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Advanced AI analyzes your style and suggests perfect outfit combinations
            </p>
          </div>
          
          <div className="card hover-lift">
            <div className="text-4xl mb-4">👔</div>
            <h3 className="text-xl font-semibold mb-2">Personal Wardrobe</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Organize your clothing items and get suggestions based on what you own
            </p>
          </div>
          
          <div className="card hover-lift">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Keep track of your best outfit ideas for any occasion
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center scale-in">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 text-lg font-bold text-black rounded-2xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
          >
            Get Started Free
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 text-lg font-semibold rounded-2xl transition-all hover:scale-105"
            style={{ 
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)'
            }}
          >
            Sign In
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
