import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listFavorites, deleteFavorite } from "../api/dripMateAPI";

export default function SavedPage() {
  const navigate = useNavigate();
  const [favs, setFavs] = useState([]);

  const fetchFavs = async () => {
    try {
      const data = await listFavorites();
      setFavs(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFavs();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!confirm("Remove this saved outfit?")) return;
    await deleteFavorite(id);
    await fetchFavs();
  };

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 fade-in">Saved Outfits</h2>
        
        <div className="space-y-4 md:space-y-6">
          {favs.map((f, idx) => (
            <div 
              key={f.id} 
              className="card hover-lift fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Header with title and delete button */}
              <div className="flex items-start justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">
                    {f.title || 'Saved Outfit'}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {f.vibe && (
                      <span className="px-3 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        {f.vibe}
                      </span>
                    )}
                    {f.source_item && (
                      <span className="px-3 py-1 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                        Base: {f.source_item}
                      </span>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(f.id)}
                  className="ml-4 px-4 py-2 text-sm font-semibold transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--bg-tertiary)', 
                    color: '#ff4444',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '10px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
              
              {/* Outfit Details */}
              {f.payload && (
                <div className="space-y-3">
                  <div className="pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <p className="font-semibold text-base md:text-lg mb-1">
                      {f.payload.item1?.name || 'Item 1'}
                    </p>
                    {f.payload.item1?.reason && (
                      <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                        {f.payload.item1.reason}
                      </p>
                    )}
                  </div>
                  
                  <div className="pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                    <p className="font-semibold text-base md:text-lg mb-1">
                      {f.payload.item2?.name || 'Item 2'}
                    </p>
                    {f.payload.item2?.reason && (
                      <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                        {f.payload.item2.reason}
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-1">
                    <p className="font-semibold text-base md:text-lg mb-1">
                      {f.payload.footwear?.name || 'Footwear'}
                    </p>
                    {f.payload.footwear?.reason && (
                      <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                        {f.payload.footwear.reason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {favs.length === 0 && (
            <div className="card text-center py-16" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="text-6xl mb-4">💾</div>
              <p className="text-2xl mb-2" style={{ color: 'var(--text-secondary)' }}>
                No favorites yet
              </p>
              <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                Save an outfit from the Chat page to see it here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

