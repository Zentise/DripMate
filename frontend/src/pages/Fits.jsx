import { useApp } from '../state/AppContext.jsx';

const FitListItem = ({ fit, onRemove }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-md bg-gradient-to-br from-brand-600/40 to-zinc-800" />
      <div className="flex-1">
        <p className="text-sm font-medium">{fit.summary}</p>
        <p className="text-xs text-zinc-400">from {fit.from}</p>
      </div>
      <button onClick={onRemove} className="text-xs text-zinc-400 hover:text-red-400">Remove</button>
    </div>
  </div>
);

export default function Fits() {
  const { fits, setFits } = useApp();
  const remove = (id) => setFits((f) => f.filter((x) => x.id !== id));

  return (
    <div>
      <h2 className="text-xl font-semibold">Saved Fits</h2>
      {fits.length === 0 ? (
        <p className="mt-6 text-center text-zinc-400">No favorites yet. Like fits from Chat to save them.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {fits.map((fit) => (
            <FitListItem key={fit.id} fit={fit} onRemove={() => remove(fit.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
