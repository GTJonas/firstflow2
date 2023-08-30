import axios from 'axios';
import getAuthHeaders from './getAuthHeaders.tsx';

const API_URL = 'http://192.168.1.78:8000';

const fetchProtectedResource = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/user-by-roles`, {
            headers: getAuthHeaders(), // Assuming getAuthHeaders() is defined and returns the Authorization header.
        });
        return response.data; // Make sure to return the data from the response.
    } catch (error) {
        throw error; // Rethrow the error to handle it in the Dashboard component.
    }
};

export default fetchProtectedResource;