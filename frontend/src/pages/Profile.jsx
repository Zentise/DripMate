import { useApp } from '../state/AppContext.jsx';

export default function Profile() {
  const { theme, setTheme, wardrobe, fits } = useApp();

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const clearAll = () => {
    if (!confirm('Clear wardrobe and saved fits?')) return;
    localStorage.removeItem('dripmate_wardrobe');
    localStorage.removeItem('dripmate_fits');
    location.reload();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="mt-4 space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-xs text-zinc-400">Dark mode gives that midnight drip. Toggle if needed.</p>
            </div>
            <button onClick={toggleTheme} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="font-medium">Storage</p>
          <p className="text-xs text-zinc-400 mt-1">Wardrobe items: {wardrobe.length} • Saved fits: {fits.length}</p>
          <button onClick={clearAll} className="mt-3 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700">Clear all</button>
        </div>

        <div className="text-xs text-zinc-500 text-center">DripMate • v0.1 • Gen Z dark vibes</div>
      </div>
    </div>
  );
}
