import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOutfitSuggestion, saveFavorite, getOutfitFromImage, getProfile } from "../api/dripMateAPI.js";

const BotResponse = ({ content, onSave }) => {
  if (content.error) {
    return (
      <div className="card" style={{ background: 'var(--bg-tertiary)', borderColor: '#ff4444' }}>
        <p className="font-bold mb-2">⚠️ An Error Occurred</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{content.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {content.outfits.map((outfit, idx) => (
        <div key={outfit.id} className="card hover-lift" style={{ animationDelay: `${idx * 0.1}s` }}>
          <p className="font-bold text-lg md:text-xl mb-4">✨ Outfit Idea {outfit.id}</p>
          <div className="space-y-3 mb-4">
            <div className="pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <p className="font-semibold text-base md:text-lg mb-1">{outfit.item1.name}</p>
              {outfit.item1.reason && (
                <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                  {outfit.item1.reason}
                </p>
              )}
            </div>
            <div className="pb-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <p className="font-semibold text-base md:text-lg mb-1">{outfit.item2.name}</p>
              {outfit.item2.reason && (
                <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                  {outfit.item2.reason}
                </p>
              )}
            </div>
            <div className="pt-1">
              <p className="font-semibold text-base md:text-lg mb-1">{outfit.footwear.name}</p>
              {outfit.footwear.reason && (
                <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                  {outfit.footwear.reason}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onSave(outfit)}
            className="w-full mt-4 py-3 font-bold text-black"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)',
              border: '1px solid var(--border-primary)'
            }}
          >
            💾 Save to Favorites
          </button>
        </div>
      ))}
    </div>
  );
};

function ChatPage() {
  const navigate = useNavigate();
  const [chatMode, setChatMode] = useState("yourself"); // "yourself" or "others"
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    item: "", vibe: "", gender: "Male",
    age_group: "", skin_colour: "", num_ideas: 1, more_details: "",
    layering_preference: "AI Decides", use_wardrobe_only: false,
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [simpleInput, setSimpleInput] = useState("");
  const [isInputMinimized, setIsInputMinimized] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
        // Auto-fill from profile if in "yourself" mode
        if (chatMode === "yourself") {
          setFormData(prev => ({
            ...prev,
            gender: profile.gender || prev.gender,
            age_group: profile.age_group || prev.age_group,
            skin_colour: profile.skin_colour || prev.skin_colour,
          }));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };
    loadProfile();
  }, [chatMode, navigate]);

  // Update form when mode changes
  const handleModeChange = (mode) => {
    setChatMode(mode);
    if (mode === "yourself" && userProfile) {
      setFormData(prev => ({
        ...prev,
        gender: userProfile.gender || "",
        age_group: userProfile.age_group || "",
        skin_colour: userProfile.skin_colour || "",
      }));
    } else if (mode === "others") {
      setFormData(prev => ({
        ...prev,
        gender: "Male",
        age_group: "",
        skin_colour: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    // Image-based flow
    if (selectedImage) {
      if (isLoading) return;
      
      const userMessage = { 
        sender: "user", 
        text: simpleInput || "Analyzing clothing item from image...",
        image: imagePreview 
      };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      const botResponse = await getOutfitFromImage(
        selectedImage, 
        simpleInput || formData.more_details, 
        formData.use_wardrobe_only
      );
      
      // Transform Gemini response to match existing UI format
      let transformedResponse;
      if (botResponse.error) {
        transformedResponse = { error: botResponse.error };
      } else {
        transformedResponse = {
          outfits: botResponse.outfits?.map((outfit, idx) => ({
            id: idx + 1,
            item1: { 
              name: outfit.item1?.name || "Top", 
              reason: "" 
            },
            item2: { 
              name: outfit.item2?.name || "Bottom", 
              reason: "" 
            },
            footwear: { 
              name: outfit.footwear?.name || "Shoes", 
              reason: outfit.reason || "" 
            },
          })) || []
        };
      }

      const botMessage = { sender: "bot", content: transformedResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setSimpleInput("");
      setIsInputMinimized(true);
      return;
    }

    // Simple mode - parse the input
    if (!showAdvanced && simpleInput.trim()) {
      const userMessage = { sender: "user", text: simpleInput };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Parse simple input to extract item and vibe
      const words = simpleInput.toLowerCase().split(' ');
      const vibeKeywords = ['casual', 'formal', 'streetwear', 'sporty', 'elegant', 'vintage', 'minimalist', 'edgy'];
      const detectedVibe = words.find(w => vibeKeywords.includes(w)) || 'casual';
      
      const requestData = {
        ...formData,
        item: simpleInput,
        vibe: detectedVibe,
        more_details: simpleInput
      };

      const botResponse = await getOutfitSuggestion(requestData);
      const botMessage = { sender: "bot", content: botResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setSimpleInput("");
      setIsInputMinimized(true);
      return;
    }

    // Advanced mode - use form data
    if (showAdvanced && (!formData.item || !formData.vibe)) return;
    if (showAdvanced) {
      const userMessage = { sender: "user", text: `Getting suggestions for: ${formData.item}` };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      const botResponse = await getOutfitSuggestion(formData);
      const botMessage = { sender: "bot", content: botResponse };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setIsInputMinimized(true);
    }
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
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header - Only show when no messages */}
      {messages.length === 0 && (
        <header className="py-12 md:py-20 text-center fade-in">
          <h1 className="font-bold tracking-tight mb-3 text-5xl md:text-7xl">
            DripMate
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Your AI Personal Stylist
          </p>
          <div className="max-w-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <span className="block mb-2">💬</span>
              <p style={{ color: 'var(--text-secondary)' }}>Ask for outfit suggestions</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <span className="block mb-2">📸</span>
              <p style={{ color: 'var(--text-secondary)' }}>Upload clothing photos</p>
            </div>
          </div>
        </header>
      )}

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 pb-32 max-w-4xl w-full mx-auto">
        <div className="space-y-6 md:space-y-8 py-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className={`chat-bubble p-4 md:p-5 rounded-2xl transition-all duration-300 ${
                  msg.sender === 'user' 
                    ? 'max-w-[85%] md:max-w-[70%]' 
                    : 'max-w-[95%] md:max-w-[90%]'
                }`}
                style={{
                  background: msg.sender === 'user' ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  border: `1px solid ${msg.sender === 'user' ? 'var(--border-primary)' : 'var(--border-secondary)'}`
                }}
              >
                {msg.sender === 'user' ? (
                  <div>
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="uploaded" 
                        className="mb-3 rounded-xl max-w-[200px] border"
                        style={{ borderColor: 'var(--border-primary)' }}
                      />
                    )}
                    <p className="text-base md:text-lg">{msg.text}</p>
                  </div>
                ) : (
                  <BotResponse content={msg.content} onSave={handleSaveFavorite} />
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start fade-in">
              <div 
                className="p-4 md:p-5 rounded-2xl loading-shimmer max-w-[200px]"
                style={{ border: '1px solid var(--border-secondary)' }}
              >
                <p className="text-base pulse">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Input Footer - ChatGPT Style */}
      <footer 
        className="fixed bottom-0 left-0 right-0 pb-20 md:pb-24 backdrop-blur-xl"
        style={{ 
          background: 'rgba(0, 0, 0, 0.8)',
          borderTop: '1px solid var(--border-primary)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          {isInputMinimized ? (
            /* Minimized Input - Show button to expand */
            <button
              onClick={() => setIsInputMinimized(false)}
              className="w-full py-3 px-6 rounded-2xl font-semibold text-base transition-all hover:scale-[1.02]"
              style={{ 
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)'
              }}
            >
              ✨ Ask for a new outfit suggestion
            </button>
          ) : (
            /* Expanded Input */
            <form onSubmit={handleSend} className="space-y-3">
            {/* Mode Toggle */}
            <div className="flex gap-2 fade-in">
              <button
                type="button"
                onClick={() => handleModeChange("yourself")}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                  chatMode === "yourself" ? 'scale-105' : ''
                }`}
                style={{
                  background: chatMode === "yourself" 
                    ? 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)'
                    : 'var(--bg-tertiary)',
                  color: chatMode === "yourself" ? '#000000' : 'var(--text-secondary)',
                  border: `1px solid ${chatMode === "yourself" ? '#ffffff' : 'var(--border-secondary)'}`
                }}
              >
                👤 For Yourself
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("others")}
                className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
                  chatMode === "others" ? 'scale-105' : ''
                }`}
                style={{
                  background: chatMode === "others" 
                    ? 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)'
                    : 'var(--bg-tertiary)',
                  color: chatMode === "others" ? '#000000' : 'var(--text-secondary)',
                  border: `1px solid ${chatMode === "others" ? '#ffffff' : 'var(--border-secondary)'}`
                }}
              >
                👥 For Others
              </button>
            </div>
            
            {chatMode === "yourself" && userProfile && (
              <div className="px-3 py-2 rounded-lg text-xs fade-in" 
                   style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                ℹ️ Using your profile: {userProfile.gender}, {userProfile.age_group}, {userProfile.skin_colour}
              </div>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="flex items-center gap-3 fade-in">
                <img 
                  src={imagePreview} 
                  alt="preview" 
                  className="h-16 rounded-lg border"
                  style={{ borderColor: 'var(--border-primary)' }}
                />
                <button 
                  type="button"
                  onClick={handleClearImage}
                  className="px-3 py-1 text-sm rounded-lg transition-all"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Main Input Container */}
            <div 
              className="rounded-2xl overflow-hidden"
              style={{ 
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)'
              }}
            >
              {/* Simple Text Input */}
              <div className="flex items-end gap-2 p-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('imageInput').click()}
                  className="p-2 rounded-lg transition-all hover:scale-110"
                  style={{ background: 'var(--bg-tertiary)' }}
                  title="Upload image"
                >
                  <span className="text-xl">📎</span>
                </button>
                <input 
                  type="file" 
                  id="imageInput"
                  accept="image/*" 
                  capture="environment"
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
                
                <textarea
                  value={simpleInput}
                  onChange={(e) => setSimpleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder={selectedImage ? "Add details (optional)..." : "Ask for outfit suggestions... (e.g., 'black hoodie streetwear')"}
                  rows={1}
                  className="flex-1 bg-transparent border-0 resize-none outline-none text-base md:text-lg py-2"
                  style={{ 
                    maxHeight: '120px',
                    color: 'var(--text-primary)'
                  }}
                />
                
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="p-2 rounded-lg transition-all"
                  style={{ 
                    background: showAdvanced ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)'
                  }}
                  title="Advanced options"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || (!simpleInput.trim() && !selectedImage && (!showAdvanced || !formData.item || !formData.vibe))}
                  className="p-2 rounded-lg transition-all font-bold text-black disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #ffffff 0%, #d0d0d0 100%)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>

              {/* Advanced Options - Collapsible */}
              {showAdvanced && (
                <div 
                  className="px-3 pb-3 pt-2 border-t slide-up space-y-3"
                  style={{ borderColor: 'var(--border-secondary)' }}
                >
                  {/* Item and Vibe inputs for advanced mode */}
                  <div className="grid grid-cols-1 gap-2">
                    <input 
                      type="text"
                      name="item" 
                      value={formData.item} 
                      onChange={handleInputChange}
                      placeholder="* Clothing item (e.g., black hoodie)"
                      className="text-sm p-2"
                      required
                    />
                    <input 
                      type="text"
                      name="vibe" 
                      value={formData.vibe} 
                      onChange={handleInputChange}
                      placeholder="* Vibe/Theme (e.g., streetwear, casual, formal)"
                      className="text-sm p-2"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {chatMode === "others" && (
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className="text-sm p-2"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    )}
                    
                    <select 
                      name="layering_preference" 
                      value={formData.layering_preference} 
                      onChange={handleInputChange}
                      className="text-sm p-2"
                    >
                      <option value="AI Decides">AI Decides Layers</option>
                      <option value="Suggest Layers">With Layers</option>
                      <option value="No Layers">No Layers</option>
                    </select>
                    
                    <select 
                      name="num_ideas" 
                      value={formData.num_ideas} 
                      onChange={handleInputChange}
                      className="text-sm p-2"
                    >
                      <option value="1">1 Idea</option>
                      <option value="2">2 Ideas</option>
                      <option value="3">3 Ideas</option>
                    </select>
                    
                    {chatMode === "others" && (
                      <>
                        <select 
                          name="age_group" 
                          value={formData.age_group} 
                          onChange={handleInputChange}
                          className="text-sm p-2"
                        >
                          <option value="">Age (optional)</option>
                          <option value="Teen (under 18)">Teen</option>
                          <option value="Young Adult (18-25)">Young Adult</option>
                          <option value="Adult (26-40)">Adult</option>
                          <option value="Mature (40+)">Mature</option>
                        </select>
                        
                        <select 
                          name="skin_colour" 
                          value={formData.skin_colour} 
                          onChange={handleInputChange}
                          className="text-sm p-2 md:col-span-2"
                        >
                          <option value="">Skin tone (optional)</option>
                          <option value="Fair/Light">Fair/Light</option>
                          <option value="Tan/Medium">Tan/Medium</option>
                          <option value="Dark/Deep">Dark/Deep</option>
                        </select>
                      </>
                    )}
                  </div>
                  
                  <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="checkbox" 
                      name="use_wardrobe_only" 
                      checked={formData.use_wardrobe_only} 
                      onChange={handleInputChange}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: '#ffffff' }}
                    />
                    <span>Use only my wardrobe items</span>
                  </label>
                </div>
              )}
            </div>
            
            <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
          )}
        </div>
      </footer>
    </div>
  );
}

export default ChatPage;
