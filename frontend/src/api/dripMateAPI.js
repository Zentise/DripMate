import axios from "axios";

// Build baseURL dynamically based on the current hostname so it works on localhost and LAN
const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const apiBase = `http://${host}:8000/api`;

const apiClient = axios.create({
  baseURL: apiBase,
});

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

// Wardrobe APIs
export const listWardrobe = async () => {
  const res = await apiClient.get("/wardrobe");
  return res.data;
};

export const addWardrobeItem = async (item) => {
  const res = await apiClient.post("/wardrobe", item);
  return res.data;
};

export const updateWardrobeItem = async (id, item) => {
  const res = await apiClient.put(`/wardrobe/${id}`, item);
  return res.data;
};

export const deleteWardrobeItem = async (id) => {
  const res = await apiClient.delete(`/wardrobe/${id}`);
  return res.data;
};

// Favorites APIs
export const listFavorites = async () => {
  const res = await apiClient.get("/favorites");
  return res.data;
};

export const saveFavorite = async (payload) => {
  const res = await apiClient.post("/favorites", payload);
  return res.data;
};

export const deleteFavorite = async (id) => {
  const res = await apiClient.delete(`/favorites/${id}`);
  return res.data;
};

// Profile API
export const getProfile = async () => {
  const res = await apiClient.get("/profile");
  return res.data;
};

// Vision API
export const analyzeImage = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post("/vision/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};