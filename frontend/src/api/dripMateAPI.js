import axios from "axios";

// Build baseURL dynamically based on the current hostname so it works on localhost and LAN
const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const apiBase = `http://${host}:8000`;

const apiClient = axios.create({
  baseURL: apiBase,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === AUTH APIs ===
export const signup = async (userData) => {
  try {
    const res = await apiClient.post("/signup", userData);
    if (res.data.access_token) {
      localStorage.setItem('token', res.data.access_token);
    }
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Signup failed" };
  }
};

export const login = async (credentials) => {
  try {
    const res = await apiClient.post("/login", credentials);
    if (res.data.access_token) {
      localStorage.setItem('token', res.data.access_token);
    }
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Login failed" };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  try {
    const res = await apiClient.get("/profile");
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to get profile" };
  }
};

// Chat API - Outfit Suggestions
export const getOutfitSuggestion = async (formData) => {
  try {
    // Pass the entire formData object as the request body
    const response = await apiClient.post("/chat", formData);
    return response.data;
  } catch (error) {
    console.error("Error fetching outfit suggestion:", error);
    // Try to get the detailed error from the backend response
    const detail = error.response?.data?.detail || "Is the backend running?";
    return { error: `Could not get a suggestion. ${detail}` };
  }
};

// === IMAGE UPLOAD API ===
export const getOutfitFromImage = async (file, prompt = "", useWardrobe = false) => {
  try {
    const form = new FormData();
    form.append("file", file);
    if (prompt) form.append("prompt", prompt);
    form.append("use_wardrobe", useWardrobe.toString());
    
    const response = await apiClient.post("/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting outfit from image:", error);
    const detail = error.response?.data?.detail || "Is the backend running?";
    return { error: `Could not analyze image. ${detail}` };
  }
};

// === WARDROBE APIs ===
export const getWardrobe = async () => {
  try {
    const res = await apiClient.get("/wardrobe");
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to get wardrobe" };
  }
};

export const addWardrobeItem = async (item) => {
  try {
    const res = await apiClient.post("/wardrobe", item);
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to add item" };
  }
};

export const deleteWardrobeItem = async (id) => {
  try {
    await apiClient.delete(`/wardrobe/${id}`);
    return { success: true };
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to delete item" };
  }
};

// === FAVORITES APIs ===
export const getFavorites = async () => {
  try {
    const res = await apiClient.get("/favorites");
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to get favorites" };
  }
};

export const addFavorite = async (favorite) => {
  try {
    const res = await apiClient.post("/favorites", favorite);
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to save favorite" };
  }
};

export const deleteFavorite = async (id) => {
  try {
    await apiClient.delete(`/favorites/${id}`);
    return { success: true };
  } catch (error) {
    return { error: error.response?.data?.detail || "Failed to delete favorite" };
  }
};

// === MODELS API ===
export const getAvailableModels = async () => {
  try {
    const response = await apiClient.get("/models");
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    return { error: "Could not fetch models" };
  }
};

// === ALIAS EXPORTS (for compatibility) ===
export const listWardrobe = getWardrobe;
export const listFavorites = getFavorites;
export const saveFavorite = addFavorite;

// Analyze image endpoint
export const analyzeImage = async (file) => {
  try {
    const form = new FormData();
    form.append("file", file);
    const response = await apiClient.post("/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { error: error.response?.data?.detail || "Failed to analyze image" };
  }
};