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