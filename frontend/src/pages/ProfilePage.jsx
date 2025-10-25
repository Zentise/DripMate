import { useEffect, useState } from "react";
import { getProfile } from "../api/dripMateAPI";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setProfile(data);
    })();
  }, []);

  if (!profile) return <div className="p-4 pb-24 max-w-screen-md mx-auto text-slate-400">Loading...</div>;

  return (
    <div className="p-4 pb-24 max-w-screen-md mx-auto">
      <h2 className="text-xl font-bold mb-3 text-slate-100">Profile</h2>
      <div className="p-4 bg-base-900/70 border border-slate-800 rounded-xl shadow-innerGlow">
        <p className="font-semibold text-slate-300">Name: <span className="font-normal text-slate-100">{profile.name}</span></p>
        {profile.email && <p className="font-semibold text-slate-300">Email: <span className="font-normal text-slate-100">{profile.email}</span></p>}
        <p className="font-semibold text-slate-300">Wardrobe items: <span className="font-normal text-slate-100">{profile.wardrobe_count}</span></p>
        <p className="font-semibold text-slate-300">Saved outfits: <span className="font-normal text-slate-100">{profile.favorites_count}</span></p>
      </div>
    </div>
  );
}
