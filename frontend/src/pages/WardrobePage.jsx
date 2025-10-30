import { useEffect, useState } from "react";
import { listWardrobe, addWardrobeItem, deleteWardrobeItem, analyzeImage } from "../api/dripMateAPI";

export default function WardrobePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    category: "clothing",
    name: "",
    color: "",
    season: "",
    image_url: "",
    notes: "",
  });

  const fetchItems = async () => {
    const data = await listWardrobe();
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

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
      // reset the input so selecting the same file again triggers change
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await deleteWardrobeItem(id);
    await fetchItems();
  };

  return (
    <div className="p-4 pb-24 max-w-screen-md mx-auto">
      <h2 className="text-xl font-bold mb-3 text-slate-100">Your Wardrobe</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-base-900/70 p-4 border border-slate-800 rounded-xl shadow-innerGlow backdrop-blur">
        <label className="sm:col-span-2 flex items-center gap-3 text-slate-300">
          <span className="inline-block px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-700">Analyze Photo</span>
          <input type="file" accept="image/*" onChange={handleAnalyze} className="hidden" />
          <span className="text-xs text-slate-500">Use a photo to pre-fill fields</span>
        </label>
        <select name="category" value={form.category} onChange={handleChange} className="p-2 border border-slate-700 bg-slate-900/70 rounded-xl">
          <option value="clothing">Clothing</option>
          <option value="footwear">Footwear</option>
          <option value="accessory">Accessory</option>
        </select>
        <input name="name" value={form.name} onChange={handleChange} placeholder="* Name (e.g., black hoodie)" className="p-2 border border-slate-700 bg-slate-900/70 rounded-xl sm:col-span-1" required />
        <input name="color" value={form.color} onChange={handleChange} placeholder="Color (optional)" className="p-2 border border-slate-700 bg-slate-900/70 rounded-xl" />
        <input name="season" value={form.season} onChange={handleChange} placeholder="Season (e.g., all-season)" className="p-2 border border-slate-700 bg-slate-900/70 rounded-xl" />
        <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL (optional)" className="p-2 border border-slate-700 bg-slate-900/70 rounded-xl sm:col-span-2" />
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" className="p-2 border border-slate-700 bg-slate-900/70 rounded-xl sm:col-span-2" />
        <button type="submit" className="p-2 rounded-xl bg-gradient-to-r from-cyan via-neon to-fuchsia text-slate-900 font-bold sm:col-span-2">Add Item</button>
      </form>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 bg-base-900/70 border border-slate-800 rounded-xl flex items-center justify-between shadow-innerGlow">
            <div>
              <p className="font-semibold capitalize text-slate-100">{it.category}: <span className="font-normal">{it.name}</span></p>
              <p className="text-xs text-slate-400">{[it.color, it.season].filter(Boolean).join(" • ")}</p>
            </div>
            <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(it.id)}>Delete</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-400">Your wardrobe is empty. Add some items above.</p>}
      </div>
    </div>
  );
}
