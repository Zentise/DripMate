import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/dripMateAPI";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Profile error:', err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setError('Failed to load profile');
        }
      }
    })();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24">
        <div className="card" style={{ maxWidth: '400px' }}>
          <p className="text-lg mb-4">⚠️ {error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3 font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-24">
        <div className="loading-shimmer px-8 py-4 rounded-xl">
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-10">
        {/* Header Section */}
        <div className="fade-in mb-8 md:mb-12 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-white to-gray-600 flex items-center justify-center mb-4 hover-lift">
              <span className="text-4xl md:text-5xl font-bold text-black">
                {profile.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
            {profile.name || 'User'}
          </h1>
          {profile.email && (
            <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              {profile.email}
            </p>
          )}
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 slide-up">
          {/* Wardrobe Stats Card */}
          <div className="card hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M10 10h4" />
                </svg>
              </div>
              <span className="text-4xl md:text-5xl font-bold">{profile.wardrobe_count}</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Wardrobe Items</h3>
            <p style={{ color: 'var(--text-tertiary)' }} className="text-sm md:text-base">
              Your clothing collection
            </p>
          </div>

          {/* Saved Outfits Card */}
          <div className="card hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <span className="text-4xl md:text-5xl font-bold">{profile.favorites_count}</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Saved Outfits</h3>
            <p style={{ color: 'var(--text-tertiary)' }} className="text-sm md:text-base">
              Your favorite combinations
            </p>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="card scale-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Profile Details</h2>
          <div className="space-y-4">
            <div className="pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Full Name
              </p>
              <p className="text-lg md:text-xl font-semibold">{profile.name || 'Not set'}</p>
            </div>
            
            {profile.email && (
              <div className="pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Email Address
                </p>
                <p className="text-lg md:text-xl font-semibold">{profile.email}</p>
              </div>
            )}
            
            {profile.gender && (
              <div className="pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Gender
                </p>
                <p className="text-lg md:text-xl font-semibold">{profile.gender}</p>
              </div>
            )}
            
            {profile.age_group && (
              <div className="pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Age Group
                </p>
                <p className="text-lg md:text-xl font-semibold">{profile.age_group}</p>
              </div>
            )}
            
            {profile.skin_colour && (
              <div className="pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  Skin Tone
                </p>
                <p className="text-lg md:text-xl font-semibold">{profile.skin_colour}</p>
              </div>
            )}
            
            <div className="pb-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Member Since
              </p>
              <p className="text-lg md:text-xl font-semibold">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <div className="pt-2">
              <p className="text-sm md:text-base mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Account Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                <p className="text-lg md:text-xl font-semibold">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Mobile Responsive */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in">
          <button className="w-full py-3 md:py-4 px-6 text-base md:text-lg font-semibold">
            Edit Profile
          </button>
          <button className="w-full py-3 md:py-4 px-6 text-base md:text-lg font-semibold" style={{ background: 'var(--bg-tertiary)' }}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

