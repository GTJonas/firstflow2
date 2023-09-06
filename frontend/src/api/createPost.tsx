import axios from "axios";
import getAuthHeaders from "./getAuthHeaders.tsx";

const API_URL = "http://5.152.153.222:8000";

const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/api/store-post`, postData, {
      headers: {
        ...getAuthHeaders(), // Assuming getAuthHeaders() returns the Authorization header.
        "Content-Type": "multipart/form-data", // Set the content type for file upload.
      },
    });
    return response.data; // Make sure to return the data from the response.
  } catch (error) {
    throw error; // Rethrow the error to handle it in the Dashboard component.
  }
};

export default createPost;
