import { useEffect, useState } from "react";
import { listFavorites, deleteFavorite } from "../api/dripMateAPI";

export default function SavedPage() {
  const [favs, setFavs] = useState([]);

  const fetchFavs = async () => {
    const data = await listFavorites();
    setFavs(data);
  };

  useEffect(() => { fetchFavs(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this saved outfit?")) return;
    await deleteFavorite(id);
    await fetchFavs();
  };

  return (
    <div className="p-4 pb-24 max-w-screen-md mx-auto">
      <h2 className="text-xl font-bold mb-3 text-slate-100">Saved Outfits</h2>
      <div className="space-y-3">
        {favs.map((f) => (
          <div key={f.id} className="p-3 bg-base-900/70 border border-slate-800 rounded-xl shadow-innerGlow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">{f.title || 'Saved outfit'}</p>
                <p className="text-xs text-slate-400">{f.vibe || ''} {f.source_item ? `• base: ${f.source_item}` : ''}</p>
              </div>
              <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(f.id)}>Delete</button>
            </div>
            {f.payload && (
              <div className="mt-2 text-sm text-slate-200 space-y-1">
                <p><span className="font-semibold text-slate-100">{f.payload.item1?.name}</span> – {f.payload.item1?.reason}</p>
                <p><span className="font-semibold text-slate-100">{f.payload.item2?.name}</span> – {f.payload.item2?.reason}</p>
                <p><span className="font-semibold text-slate-100">{f.payload.footwear?.name}</span> – {f.payload.footwear?.reason}</p>
              </div>
            )}
          </div>
        ))}
        {favs.length === 0 && <p className="text-slate-400">No favorites yet. Save an outfit from the Chat.</p>}
      </div>
    </div>
  );
}
