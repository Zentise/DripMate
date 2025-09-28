import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
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