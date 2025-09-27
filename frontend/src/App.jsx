import { useState } from "react";
import { getOutfitSuggestion } from "./api/dripMateAPI.js"; 

// A component to render the Bot's special response
const BotResponse = ({ content }) => {
  // Handle the case where the API returns an error
  if (content.error) {
    return (
      <div className="space-y-3 p-4 bg-red-100 rounded-lg">
        <div className="font-semibold text-red-800">
          ⚠️ An Error Occurred
        </div>
        <p className="text-sm text-red-600">{content.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-slate-200 rounded-lg">
      <div className="font-semibold text-slate-800">
        ✨ Here's a vibe...
      </div>
      <div>
        <p className="font-bold">{content.item1.name}</p>
        <p className="text-sm text-slate-600">{content.item1.reason}</p>
      </div>
      <div>
        <p className="font-bold">{content.item2.name}</p>
        <p className="text-sm text-slate-600">{content.item2.reason}</p>
      </div>
      <div>
        <p className="font-bold">{content.footwear.name}</p>
        <p className="text-sm text-slate-600">{content.footwear.reason}</p>
      </div>
    </div>
  );
};

function App() {
  const [clothingDesc, setClothingDesc] = useState("");
  const [vibe, setVibe] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!clothingDesc || !vibe || isLoading) return;

    const userMessage = {
      sender: "user",
      text: `Item: ${clothingDesc}, Vibe: ${vibe}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setClothingDesc("");
    setVibe("");

    const botResponse = await getOutfitSuggestion(clothingDesc, vibe);

    const botMessage = {
      sender: "bot",
      content: botResponse,
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl flex flex-col h-screen p-4">
        <header className="p-4 text-center">
          <h1 className="text-3xl font-bold text-slate-800">DripMate</h1>
          <p className="text-slate-500">Your AI-Powered Personal Stylist</p>
        </header>

        {/* Message Display Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md p-3 rounded-lg shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <BotResponse content={msg.content} />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-slate-500 animate-pulse">DripMate is thinking...</p>
              </div>
            </div>
          )}
        </main>

        {/* Input Form */}
        <footer className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="space-y-4">
            <textarea
              value={clothingDesc}
              onChange={(e) => setClothingDesc(e.target.value)}
              placeholder="Describe your clothing item..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              disabled={isLoading}
            />
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="What's the vibe? (e.g., streetwear, casual)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-slate-400"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Get Suggestion"}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default App;