import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listWardrobe, addWardrobeItem, deleteWardrobeItem, analyzeImage } from "../api/dripMateAPI";

export default function WardrobePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    category: "clothing",
    name: "",
    color: "",
    season: "",
    image_url: "",
    notes: "",
  });
  const [isFormMinimized, setIsFormMinimized] = useState(true);

  const fetchItems = async () => {
    try {
      const data = await listWardrobe();
      setItems(data);
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
    fetchItems();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    await addWardrobeItem(form);
    setForm({ category: "clothing", name: "", color: "", season: "", image_url: "", notes: "" });
    await fetchItems();
    setIsFormMinimized(true);
  };

  const handleAnalyze = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const attrs = await analyzeImage(file);
      setForm(prev => ({
        ...prev,
        category: attrs.category || prev.category,
        name: attrs.name || prev.name,
        color: attrs.color || prev.color,
        season: attrs.season || prev.season,
        notes: [attrs.pattern, attrs.style].filter(Boolean).join(", ") || prev.notes,
      }));
    } catch (err) {
      console.error("Image analysis failed", err);
    } finally {
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await deleteWardrobeItem(id);
    await fetchItems();
  };

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 fade-in">Your Wardrobe</h2>
        
        {/* Add Item Form - Collapsible */}
        {isFormMinimized ? (
          /* Minimized - Show expand button */
          <button
            onClick={() => setIsFormMinimized(false)}
            className="w-full mb-8 py-4 px-6 rounded-2xl font-semibold text-lg transition-all hover:scale-[1.02] fade-in"
            style={{ 
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)'
            }}
          >
            ➕ Add New Item to Wardrobe
          </button>
        ) : (
          /* Expanded Form */
          <div className="mb-8 slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-2xl font-semibold">Add New Item</h3>
              <button
                type="button"
                onClick={() => setIsFormMinimized(true)}
                className="px-4 py-2 rounded-lg text-sm transition-all"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                ✕ Minimize
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="card" style={{ background: 'var(--bg-card)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Analyzer */}
                <label className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-tertiary)' }}>
                  <span className="text-2xl">📷</span>
                  <div className="flex-1">
                    <span className="font-medium block">Analyze Photo</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Use a photo to pre-fill fields
                    </span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleAnalyze} className="hidden" />
                </label>
                
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="clothing">Clothing</option>
                  <option value="footwear">Footwear</option>
                  <option value="accessory">Accessory</option>
                </select>
                
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="* Name (e.g., black hoodie)" 
                  required 
                />
                
                <input 
                  name="color" 
                  value={form.color} 
                  onChange={handleChange} 
                  placeholder="Color (optional)" 
                />
                
                <input 
                  name="season" 
                  value={form.season} 
                  onChange={handleChange} 
                  placeholder="Season (e.g., all-season)" 
                />
                
                <input 
                  name="image_url" 
                  value={form.image_url} 
                  onChange={handleChange} 
                  placeholder="Image URL (optional)" 
                  className="md:col-span-2"
                />
                
                <input 
                  name="notes" 
                  value={form.notes} 
                  onChange={handleChange} 
                  placeholder="Notes (optional)" 
                  className="md:col-span-2"
                />
                
                <button 
                  type="submit" 
                  className="md:col-span-2 py-3 font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
                >
                  ➕ Add Item
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Wardrobe Items List */}
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </h3>
          
          {items.map((it, idx) => (
            <div 
              key={it.id} 
              className="card hover-lift flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex-1">
                <p className="font-semibold capitalize text-lg md:text-xl mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>{it.category}:</span> {it.name}
                </p>
                <div className="flex flex-wrap gap-2 text-sm md:text-base" style={{ color: 'var(--text-tertiary)' }}>
                  {it.color && <span className="px-2 py-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>{it.color}</span>}
                  {it.season && <span className="px-2 py-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>{it.season}</span>}
                </div>
              </div>
              
              <button 
                onClick={() => handleDelete(it.id)}
                className="px-4 py-2 text-sm font-semibold transition-all hover:scale-105"
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  color: '#ff4444',
                  border: '1px solid var(--border-primary)'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="card text-center py-12" style={{ background: 'var(--bg-tertiary)' }}>
              <p className="text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
                Your wardrobe is empty
              </p>
              <p style={{ color: 'var(--text-tertiary)' }}>
                Add some items above to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

