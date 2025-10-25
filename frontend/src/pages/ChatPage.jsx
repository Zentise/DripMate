import { useState } from "react";
import { getOutfitSuggestion, saveFavorite } from "../api/dripMateAPI.js";

const BotResponse = ({ content, onSave }) => {
  if (content.error) {
    return (
      <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/30">
        <p className="font-bold text-red-300">⚠️ An Error Occurred</p>
        <p className="text-sm text-red-200">{content.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {content.outfits.map((outfit) => (
        <div key={outfit.id} className="p-4 bg-base-900/70 border border-slate-800 rounded-2xl shadow-innerGlow">
          <p className="font-bold text-slate-100 mb-3">✨ Idea {outfit.id}</p>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-slate-100">{outfit.item1.name}</p>
              <p className="text-sm text-slate-400">{outfit.item1.reason}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-100">{outfit.item2.name}</p>
              <p className="text-sm text-slate-400">{outfit.item2.reason}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-100">{outfit.footwear.name}</p>
              <p className="text-sm text-slate-400">{outfit.footwear.reason}</p>
            </div>
          </div>
          <button
            onClick={() => onSave(outfit)}
            className="mt-3 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan via-neon to-fuchsia text-slate-900 font-bold"
          >
            Save to Favorites
          </button>
        </div>
      ))}
    </div>
  );
};

function ChatPage() {
  const [formData, setFormData] = useState({
    item: "", vibe: "", gender: "Male",
    age_group: "", skin_colour: "", num_ideas: 1, more_details: "",
    layering_preference: "AI Decides", use_wardrobe_only: false,
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(true);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.item || !formData.vibe || !formData.gender || isLoading) return;

    const userMessage = { sender: "user", text: `Getting suggestions for: ${formData.item}` };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const botResponse = await getOutfitSuggestion(formData);
    const botMessage = { sender: "bot", content: botResponse };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
    setIsInputVisible(false);
  };

  const handleSaveFavorite = async (outfit) => {
    const payload = {
      title: `${formData.vibe || 'Outfit'} idea`,
      source_item: formData.item,
      vibe: formData.vibe,
      payload: outfit,
    };
    try {
      await saveFavorite(payload);
      alert("Saved to favorites");
    } catch (e) {
      alert("Failed to save favorite");
    }
  };

  return (
    <div className="min-h-screen w-full font-display pb-24">
      <div className="container-responsive mx-auto w-full max-w-screen-md flex flex-col min-h-screen">
        <header className="py-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            <span className="bg-gradient-to-r from-neon via-cyan to-fuchsia bg-clip-text text-transparent drop-shadow">DripMate</span>
          </h1>
          <p className="text-slate-400 text-sm">AI Personal Stylist</p>
        </header>

        <main className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`chat-bubble p-3 rounded-2xl border ${msg.sender === 'user' ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-base-900/70 border-slate-800 text-slate-100 shadow-innerGlow'}`}>
                {msg.sender === 'user' ? msg.text : <BotResponse content={msg.content} onSave={handleSaveFavorite} />}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-base-900/70 border border-slate-800 p-3 rounded-2xl shadow-innerGlow">
                <p className="text-slate-400 animate-pulse">DripMate is thinking...</p>
              </div>
            </div>
          )}
        </main>

        <footer className="p-4 bg-base-900/60 border-t border-slate-800 backdrop-blur">
          {isInputVisible ? (
            <form onSubmit={handleSend} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" name="item" value={formData.item} onChange={handleInputChange} placeholder="* Your clothing item" required className="col-span-1 sm:col-span-2 p-3 rounded-xl border border-slate-700 bg-slate-900/70 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan"/>
              <input type="text" name="vibe" value={formData.vibe} onChange={handleInputChange} placeholder="* Desired vibe (e.g. streetwear)" required className="col-span-1 sm:col-span-2 p-3 rounded-xl border border-slate-700 bg-slate-900/70 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan"/>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="p-3 rounded-xl border border-slate-700 bg-slate-900/70 focus:outline-none">
                <option value="Male">Male</option><option value="Female">Female</option><option value="Unisex">Unisex</option>
              </select>
              <select name="layering_preference" value={formData.layering_preference} onChange={handleInputChange} className="p-3 rounded-xl border border-slate-700 bg-slate-900/70 focus:outline-none">
                <option value="AI Decides">Let AI Decide Layers</option>
                <option value="Suggest Layers">Suggest Layers</option>
                <option value="No Layers">No Layers</option>
              </select>
              <select name="age_group" value={formData.age_group} onChange={handleInputChange} className="p-3 rounded-xl border border-slate-700 bg-slate-900/70 focus:outline-none">
                <option value="">Age group (optional)</option><option value="Teen (under 18)">Teen (&lt;18)</option><option value="Young Adult (18-25)">Young Adult (18-25)</option><option value="Adult (26-40)">Adult (26-40)</option><option value="Mature (40+)">Mature (40+)</option>
              </select>
              <select name="skin_colour" value={formData.skin_colour} onChange={handleInputChange} className="p-3 rounded-xl border border-slate-700 bg-slate-900/70 focus:outline-none">
                <option value="">Skin tone (optional)</option><option value="Fair/Light">Fair/Light</option><option value="Tan/Medium">Tan/Medium</option><option value="Dark/Deep">Dark/Deep</option>
              </select>
              <input type="number" name="num_ideas" value={formData.num_ideas} onChange={handleInputChange} min="1" max="3" className="p-3 rounded-xl border border-slate-700 bg-slate-900/70 focus:outline-none"/>
              <textarea name="more_details" value={formData.more_details} onChange={handleInputChange} placeholder="More details? (e.g., 'no logos')" className="col-span-1 sm:col-span-2 p-3 rounded-xl border border-slate-700 bg-slate-900/70 placeholder:text-slate-500 focus:outline-none" rows={2}/>
              <label className="col-span-1 sm:col-span-2 inline-flex items-center gap-2 text-slate-300">
                <input type="checkbox" name="use_wardrobe_only" checked={formData.use_wardrobe_only} onChange={handleInputChange} className="accent-cyan"/>
                <span>Use only items in my wardrobe</span>
              </label>
              <button type="submit" disabled={isLoading} className="col-span-1 sm:col-span-2 p-3 rounded-xl bg-gradient-to-r from-cyan via-neon to-fuchsia text-slate-900 font-bold hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed transition">
                {isLoading ? "Generating..." : "Get Suggestion"}
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsInputVisible(true)}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan via-neon to-fuchsia text-slate-900 font-bold hover:shadow-glow transition"
            >
              ✨ Get a New Suggestion
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

export default ChatPage;
