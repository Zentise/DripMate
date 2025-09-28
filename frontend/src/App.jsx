import { useState } from "react";
import { getOutfitSuggestion } from "./api/dripMateAPI.js"; // Ensure .js is here

// A component to render the Bot's special response
const BotResponse = ({ content }) => {
  if (content.error) {
    return (
      <div className="p-4 bg-red-100 rounded-lg">
        <p className="font-bold text-red-800">⚠️ An Error Occurred</p>
        <p className="text-sm text-red-600">{content.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {content.outfits.map((outfit) => (
        <div key={outfit.id} className="p-4 bg-slate-200 rounded-lg">
          <p className="font-bold text-slate-800 mb-3">✨ Idea {outfit.id}</p>
          <div className="space-y-2">
            <div>
              <p className="font-semibold">{outfit.item1.name}</p>
              <p className="text-sm text-slate-600">{outfit.item1.reason}</p>
            </div>
            <div>
              <p className="font-semibold">{outfit.item2.name}</p>
              <p className="text-sm text-slate-600">{outfit.item2.reason}</p>
            </div>
            <div>
              <p className="font-semibold">{outfit.footwear.name}</p>
              <p className="text-sm text-slate-600">{outfit.footwear.reason}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    item: "", vibe: "", gender: "Male", // Default gender
    age_group: "", skin_colour: "", num_ideas: 1, more_details: ""
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl flex flex-col h-screen p-4">
        <header className="py-4 text-center">
          <h1 className="text-4xl font-bold text-slate-800">DripMate</h1>
          <p className="text-slate-500">Your Evolved AI Personal Stylist</p>
        </header>

        {/* --- Message Display --- */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                {msg.sender === 'user' ? msg.text : <BotResponse content={msg.content} />}
              </div>
            </div>
          ))}
          {isLoading && <div className="flex justify-start"><div className="bg-white p-3 rounded-lg shadow-sm"><p className="text-slate-500 animate-pulse">DripMate is thinking...</p></div></div>}
        </main>
        
        {/* --- New Input Form --- */}
        <footer className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="grid grid-cols-2 gap-4">
            {/* Required Fields */}
            <input type="text" name="item" value={formData.item} onChange={handleInputChange} placeholder="* Your clothing item" required className="col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
            <input type="text" name="vibe" value={formData.vibe} onChange={handleInputChange} placeholder="* Desired vibe (e.g. streetwear)" required className="col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
            <select name="gender" value={formData.gender} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="Male">Male</option><option value="Female">Female</option><option value="Unisex">Unisex</option>
            </select>
            
            {/* Optional Fields */}
            <select name="age_group" value={formData.age_group} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Age group (optional)</option><option value="Teen (under 18)">Teen (&lt;18)</option><option value="Young Adult (18-25)">Young Adult (18-25)</option><option value="Adult (26-40)">Adult (26-40)</option><option value="Mature (40+)">Mature (40+)</option>
            </select>
            <select name="skin_colour" value={formData.skin_colour} onChange={handleInputChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Skin tone (optional)</option><option value="Fair/Light">Fair/Light</option><option value="Tan/Medium">Tan/Medium</option><option value="Dark/Deep">Dark/Deep</option>
            </select>
            <input type="number" name="num_ideas" value={formData.num_ideas} onChange={handleInputChange} min="1" max="3" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
            <textarea name="more_details" value={formData.more_details} onChange={handleInputChange} placeholder="More details? (e.g., 'no shorts', 'make it colorful')" className="col-span-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={2}/>

            <button type="submit" disabled={isLoading} className="col-span-2 p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-slate-400">
              {isLoading ? "Generating..." : "Get Suggestion"}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default App;