import axios from "axios";
import getAuthHeaders from "./getAuthHeaders.tsx";

const API_URL = "http://194.71.0.30:8000";

const createClass = async (classData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/create-class`,
      classData,
      {
        headers: {
          ...getAuthHeaders(), // Assuming getAuthHeaders() returns the Authorization header.
        },
      }
    );
    return response.data; // Make sure to return the data from the response.
  } catch (error) {
    throw error; // Rethrow the error to handle it in the Dashboard component.
  }
};

export default createClass;
