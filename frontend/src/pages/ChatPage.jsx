import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare, Image as ImageIcon, Settings, Send, Paperclip,
  User, Sparkles, Menu, X, LogOut, Home, Heart, Shirt,
  ChevronRight, ArrowUpRight, Loader2, Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getOutfitSuggestion, saveFavorite, getOutfitFromImage, getProfile } from "../api/dripMateAPI.js";

// Utility for merging tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const NavItem = ({ icon: Icon, label, path, isActive, onClick, isMobile = false }) => (
  <button
    onClick={() => onClick(path)}
    className={cn(
      "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
      isActive
        ? "bg-zinc-800 text-white shadow-lg shadow-zinc-900/20"
        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
      isMobile ? "flex-col gap-1 p-2 text-xs" : ""
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isMobile ? "w-6 h-6" : "")} />
    {!isMobile && <span className="font-medium">{label}</span>}
    {isMobile && <span className="font-medium scale-90">{label}</span>}
  </button>
);

const UserAvatar = ({ className }) => (
  <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md", className)}>
    YOU
  </div>
);

const BotAvatar = ({ className }) => (
  <div className={cn("w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-md", className)}>
    <Sparkles className="w-4 h-4 text-indigo-400" />
  </div>
);

const MessageBubble = ({ message, onSave }) => {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex max-w-[85%] md:max-w-[70%] gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? <UserAvatar /> : <BotAvatar />}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed break-words",
              isUser
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm"
            )}
          >
            {message.image && (
              <img
                src={message.image}
                alt="Uploaded"
                className="mb-3 rounded-xl max-w-full h-auto object-cover border border-white/20"
              />
            )}

            {message.content ? (
              <ChatContent content={message.content} onSave={onSave} />
            ) : (
              <p>{message.text}</p>
            )}
          </div>

          {/* Timestamp (Mock) */}
          <span className={cn("text-xs text-zinc-400", isUser ? "text-right" : "text-left")}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ChatContent = ({ content, onSave }) => {
  if (content.error) {
    return (
      <div className="text-red-300 flex items-center gap-2">
        <span className="text-lg">⚠️</span> {content.error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {content.detectedText && (
        <div className="text-xs font-mono bg-zinc-900/50 p-2 rounded border border-zinc-700/50 text-indigo-300">
          {content.detectedText}
        </div>
      )}

      {content.outfits.map((outfit, i) => (
        <div key={outfit.id} className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-700/50">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-700/50 pb-2">
            <h4 className="font-bold text-indigo-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">#{outfit.id}</span>
              Outfit Idea
            </h4>
            <button
              onClick={() => onSave(outfit)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Heart className="w-3 h-3" /> Save
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {[outfit.item1, outfit.item2, outfit.footwear].map((item, idx) => (
              <div key={idx} className="relative pl-3 border-l-2 border-indigo-500/30">
                <p className="font-medium text-zinc-200">{item.name}</p>
                {item.reason && <p className="text-xs text-zinc-500 mt-0.5">{item.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Page Component ---

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputFocused, setInputFocused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  // Advanced State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Data State
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    item: "", vibe: "", gender: "Male",
    age_group: "", skin_colour: "", num_ideas: 1, more_details: "",
    layering_preference: "AI Decides", use_wardrobe_only: false
  });

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const activeTab = location.pathname;

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Load Profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    getProfile().then(setUserProfile).catch(() => { });
  }, [navigate]);

  // Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
    setShowAdvanced(true); // Auto open advanced for image context
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage && !formData.item) || isLoading) return;

    setIsLoading(true);

    // Prepare Request Logic (reusing existing logic structure)
    try {
      if (selectedImage) {
        // Image Flow
        setMessages(prev => [...prev, {
          sender: "user",
          text: input || "Analyzing this look...",
          image: imagePreview
        }]);

        const response = await getOutfitFromImage(selectedImage, input || formData.more_details, formData.use_wardrobe_only);

        // Adapt response
        const detectedText = response.detected_item?.name
          ? `📸 Detected: ${response.detected_item.name}`
          : "";

        const adaptedResponse = {
          detectedText,
          outfits: response.outfits?.map((o, i) => ({
            id: i + 1,
            item1: { name: o.item1?.name || "Top", reason: "" },
            item2: { name: o.item2?.name || "Bottom", reason: "" },
            footwear: { name: o.footwear?.name || "Shoes", reason: o.reason || "" }
          })) || []
        };

        setMessages(prev => [...prev, { sender: "bot", content: adaptedResponse }]);

      } else {
        // Text Flow
        setMessages(prev => [...prev, { sender: "user", text: input || `Suggestion for: ${formData.item}` }]);

        // Simple/Advanced Parse
        let requestData = { ...formData };
        if (!showAdvanced) {
          if (input) {
            const words = input.toLowerCase().split(' ');
            const vibe = ['casual', 'formal', 'streetwear', 'sporty'].find(v => words.includes(v)) || 'casual';
            requestData = { ...formData, item: input, vibe, more_details: input };
          }
        } else {
          if (!requestData.item && input) requestData.item = input;
        }

        const response = await getOutfitSuggestion(requestData);
        setMessages(prev => [...prev, { sender: "bot", content: response }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "bot", content: { error: "Failed to get suggestions. Try again?" } }]);
    } finally {
      setIsLoading(false);
      setInput("");
      setImagePreview(null);
      setSelectedImage(null);
    }
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/chat', icon: MessageSquare, label: 'Assistant' },
    { path: '/wardrobe', icon: Shirt, label: 'Wardrobe' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden selection:bg-indigo-500/30">

      {/* --- Left Sidebar (Desktop) --- */}
      <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 flex-shrink-0" />
          <h1 className="font-bold text-xl tracking-tight hidden lg:block">DripMate</h1>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map(item => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={activeTab === item.path}
              onClick={handleNav}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="flex items-center gap-3 text-zinc-500 hover:text-red-400 transition-colors p-2 rounded-lg w-full">
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:inline text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Chat Area --- */}
      <main
        className="flex-1 flex flex-col relative"
        onDragEnter={handleDrag}
      >
        {/* Header (Mobile) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-600 to-violet-600" />
            <span className="font-bold">DripMate</span>
          </div>
          <UserAvatar className="w-7 h-7" />
        </header>

        {/* Drag Overlay */}
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-indigo-900/80 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-indigo-500 m-4 rounded-3xl border-dashed"
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <ImageIcon className="w-16 h-16 text-white mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">Drop your fit check here</h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 rotate-3">
                <Sparkles className="w-10 h-10 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-200 mb-2">How's the fit today?</h2>
              <p className="max-w-md text-zinc-500">
                Upload a photo or describe your vibe. DripMate is ready to style you.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                message={msg}
                onSave={(outfit) => saveFavorite({ payload: outfit, vibe: formData.vibe, source_item: formData.item })}
              />
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-3 text-zinc-500 pl-4">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}
        </div>

        {/* Floating Input Zone */}
        <div className="p-4 md:p-6 pb-24 md:pb-8">
          <div className={cn(
            "max-w-4xl mx-auto rounded-3xl bg-zinc-900/80 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden",
            inputFocused ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/20" : "border-zinc-800 shadow-xl"
          )}>

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pt-4">
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="h-20 rounded-xl border border-zinc-700" />
                    <button onClick={() => { setImagePreview(null); setSelectedImage(null); }} className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 text-zinc-400 hover:text-white border border-zinc-700">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSend} className="flex items-end gap-2 p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800/50 rounded-xl transition-colors"
                title="Upload Image"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  placeholder="Need a fit check? Type or drop image..."
                  className="w-full bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 resize-none py-3 max-h-32 min-h-[48px]"
                  style={{ fieldSizing: "content" }}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn("p-3 rounded-xl transition-colors", showAdvanced ? "text-indigo-400 bg-indigo-400/10" : "text-zinc-400 hover:text-zinc-300")}
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={isLoading || (!input.trim() && !imagePreview)}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>

            {/* Advanced Panel */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-zinc-800/50 overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900/30">
                    <select
                      value={formData.vibe}
                      onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                      className="bg-zinc-800 border-none rounded-lg text-sm text-zinc-300 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select Vibe</option>
                      <option value="streetwear">Streetwear</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                      <option value="avant-garde">Avant-Garde</option>
                    </select>

                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="bg-zinc-800 border-none rounded-lg text-sm text-zinc-300 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unisex">Unisex</option>
                    </select>

                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer col-span-2 md:col-span-1">
                      <input
                        type="checkbox"
                        checked={formData.use_wardrobe_only}
                        onChange={(e) => setFormData({ ...formData, use_wardrobe_only: e.target.checked })}
                        className="rounded bg-zinc-700 border-zinc-600 text-indigo-500 focus:ring-indigo-500/50"
                      />
                      Use Wardrobe Only
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        </div>
      </main>

      {/* --- Right Sidebar (Details) --- */}
      <aside className="hidden xl:flex w-80 flex-col border-l border-zinc-900 bg-zinc-950/50 backdrop-blur-xl p-6">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-indigo-500" />
          Details
        </h3>

        <div className="flex-1 space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Current Vibe</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                {formData.vibe || "Undecided"}
              </span>
              {formData.gender && (
                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs border border-zinc-700">
                  {formData.gender}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Style Tips</h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Upload a photo to get specific advice on color matching and proportions. DripMate works best with full-body shots.
            </p>
          </div>
        </div>
      </aside>

      {/* --- Mobile Tab Bar --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-900 z-40 bg-opacity-95 pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="flex justify-around p-2">
          {menuItems.map(item => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={activeTab === item.path}
              onClick={handleNav}
              isMobile
            />
          ))}
        </div>
      </nav>

    </div>
  );
}
