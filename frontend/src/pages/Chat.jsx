import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';
import { getOutfitSuggestion } from '../api/dripMateAPI.js';

const Line = ({ label, item }) => (
  item ? <li><span className="text-zinc-400">{label}:</span> {item.name}</li> : null
);

const FitCard = ({ fit, onFav }) => {
  const parts = [];
  if (fit.top) parts.push(fit.top.name);
  if (fit.bottom) parts.push(fit.bottom.name);
  if (fit.layer) parts.push(fit.layer.name);
  if (fit.footwear) parts.push(fit.footwear.name);
  const summary = parts.join(' + ');

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <p className="text-sm text-zinc-400 mb-2">Idea {fit.id}</p>
      <ul className="text-sm space-y-1">
        <Line label="Top" item={fit.top} />
        <Line label="Bottom" item={fit.bottom} />
        <Line label="Layer" item={fit.layer} />
        <Line label="Shoes" item={fit.footwear} />
      </ul>
      <button onClick={() => onFav(summary)} className="mt-3 w-full rounded-md bg-brand-600 hover:bg-brand-700 py-2 text-white text-sm">❤ Favorite</button>
    </div>
  );
};

export default function Chat() {
  const { selectedItem, setSelectedItem, setFits } = useApp();
  const [form, setForm] = useState({
    item: '', vibe: '', gender: 'Unisex', age_group: '', skin_colour: '', num_ideas: 2, more_details: '', layering_preference: 'AI Decides'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedItem && !form.item) {
      setForm((f) => ({ ...f, item: `${selectedItem.name}${selectedItem.color ? ' ('+selectedItem.color+')' : ''}` }));
    }
  }, [selectedItem]);

  const canSubmit = useMemo(()=> form.item && form.vibe && !loading, [form, loading]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    const res = await getOutfitSuggestion(form);
    setResult(res);
    setLoading(false);
  };

  const favFit = (fit) => {
    const payload = {
      id: Date.now(),
      summary: [fit.top?.name, fit.bottom?.name, fit.layer?.name, fit.footwear?.name].filter(Boolean).join(' + '),
      detail: fit,
      from: form.item,
    };
    setFits((f) => [payload, ...f]);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chat</h2>
        {selectedItem && (
          <button onClick={() => setSelectedItem(null)} className="text-xs text-zinc-400 hover:text-zinc-300">Clear selected</button>
        )}
      </div>

      {selectedItem && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          {selectedItem.image && <img src={selectedItem.image} alt="sel" className="h-14 w-14 rounded-md object-cover"/>}
          <div>
            <p className="font-medium">{selectedItem.name}</p>
            <p className="text-xs text-zinc-400">{selectedItem.type}{selectedItem.color ? ` • ${selectedItem.color}` : ''}</p>
          </div>
          <button onClick={()=>navigate('/')} className="ml-auto text-xs text-brand-500">Change</button>
        </div>
      )}

      <form onSubmit={submit} className="mt-4 space-y-3">
        <input value={form.item} onChange={(e)=>setForm(f=>({...f,item:e.target.value}))} placeholder="Clothing item (auto-filled)" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2"/>
        <input value={form.vibe} onChange={(e)=>setForm(f=>({...f,vibe:e.target.value}))} placeholder="Vibe (e.g., streetwear, date night)" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2"/>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.gender} onChange={(e)=>setForm(f=>({...f,gender:e.target.value}))} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2">
            <option>Male</option><option>Female</option><option>Unisex</option>
          </select>
          <select value={form.layering_preference} onChange={(e)=>setForm(f=>({...f,layering_preference:e.target.value}))} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2">
            <option>AI Decides</option><option>Suggest Layers</option><option>No Layers</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.age_group} onChange={(e)=>setForm(f=>({...f,age_group:e.target.value}))} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2">
            <option value="">Age group (optional)</option>
            <option>Teen (under 18)</option>
            <option>Young Adult (18-25)</option>
            <option>Adult (26-40)</option>
            <option>Mature (40+)</option>
          </select>
          <select value={form.skin_colour} onChange={(e)=>setForm(f=>({...f,skin_colour:e.target.value}))} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2">
            <option value="">Skin tone (optional)</option>
            <option>Fair/Light</option>
            <option>Tan/Medium</option>
            <option>Olive</option>
            <option>Brown</option>
            <option>Dark/Deep</option>
            <option>Cool Undertone</option>
            <option>Warm Undertone</option>
            <option>Neutral Undertone</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={form.num_ideas} min={1} max={3} onChange={(e)=>setForm(f=>({...f,num_ideas:Number(e.target.value)}))} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2"/>
          <input value={form.more_details} onChange={(e)=>setForm(f=>({...f,more_details:e.target.value}))} placeholder="More details (optional)" className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2"/>
        </div>
        <button disabled={!canSubmit} className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50">{loading ? 'Thinking…' : 'Get suggestions'}</button>
      </form>

      {result?.error && (
        <p className="mt-4 text-sm text-red-400">{result.error}</p>
      )}

      {result?.outfits && (
        <div className="mt-4 grid gap-3">
          {result.outfits.map((o) => (
            <FitCard key={o.id} fit={o} onFav={() => favFit(o)} />
          ))}
        </div>
      )}
    </div>
  );
}
