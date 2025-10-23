import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext.jsx';

const Empty = ({ onAdd }) => (
  <div className="text-center py-16 text-zinc-400">
    <p className="mb-4">Your wardrobe is empty. Start adding pieces.</p>
    <button onClick={onAdd} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white">Add item</button>
  </div>
);

const ItemCard = ({ item, onSelect, onDelete }) => (
  <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
    {item.image && (
      <img src={item.image} alt={item.name} className="w-full h-36 object-cover" />
    )}
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-zinc-100">{item.name}</p>
          <p className="text-xs text-zinc-400">{item.type}{item.color ? ` • ${item.color}` : ''}</p>
        </div>
        <button onClick={() => onDelete(item.id)} className="text-xs text-zinc-400 hover:text-red-400">Delete</button>
      </div>
      <button onClick={() => onSelect(item)} className="mt-3 w-full py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm">Use in Chat</button>
    </div>
  </div>
);

export default function Wardrobe() {
  const { wardrobe, setWardrobe, setSelectedItem } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Top', color: '', image: null });
  const fileRef = useRef();
  const navigate = useNavigate();

  const onAdd = () => setOpen(true);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveItem = () => {
    if (!form.name) return;
    const item = { id: Date.now(), ...form };
    setWardrobe((w) => [item, ...w]);
    setOpen(false);
    setForm({ name: '', type: 'Top', color: '', image: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  const onDelete = (id) => setWardrobe((w) => w.filter((i) => i.id !== id));
  const onSelect = (it) => { setSelectedItem(it); navigate('/chat'); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Wardrobe</h2>
        <button onClick={onAdd} className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm">+ Add</button>
      </div>

      {wardrobe.length === 0 ? (
        <Empty onAdd={onAdd} />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {wardrobe.map((item) => (
            <ItemCard key={item.id} item={item} onSelect={onSelect} onDelete={onDelete} />
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <div className="w-full sm:w-[28rem] bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Add clothing item</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-400">✕</button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} placeholder="Name (e.g., White tee)" className="w-full rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none"/>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={(e)=>setForm(f=>({...f,type:e.target.value}))} className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2">
                  <option>Top</option>
                  <option>Bottom</option>
                  <option>Outerwear</option>
                  <option>Footwear</option>
                  <option>Accessory</option>
                </select>
                <input value={form.color} onChange={(e)=>setForm(f=>({...f,color:e.target.value}))} placeholder="Color (optional)" className="rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2"/>
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-zinc-100 hover:file:bg-zinc-700"/>
                {form.image && <img src={form.image} alt="preview" className="mt-3 h-40 w-full object-cover rounded-md border border-zinc-800" />}
              </div>
              <button onClick={saveItem} className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white">Save item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
