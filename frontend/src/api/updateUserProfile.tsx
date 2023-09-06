import axios from "axios";
import getAuthHeaders from "./getAuthHeaders.tsx";

const API_URL = "http://194.71.0.30:8000";

export const updateUserProfileData = async (updatedData) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/api/update-user-profile`,
      updatedData,
      {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.user;
  } catch (error) {
    throw error;
  }
};
