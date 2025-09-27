import axios from "axios";

// Create an Axios instance pointing to your FastAPI backend
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const getOutfitSuggestion = async (clothing_desc, vibe) => {
  try {
    const response = await apiClient.post("/chat", {
      clothing_desc,
      vibe,
    });
    // The actual suggestion is in the 'data' property of the response
    return response.data;
  } catch (error) {
    console.error("Error fetching outfit suggestion:", error);
    // Return a structured error so the UI can handle it
    return { error: "Could not get a suggestion. Is the backend running?" };
  }
};