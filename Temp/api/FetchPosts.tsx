// fetchAllPosts.tsx
import axios from 'axios';
import getAuthHeaders from './getAuthHeaders.tsx';

const API_URL = 'http://192.168.1.78:8000'; // Adjust the API endpoint

const fetchAllPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/filtered-posts`, {
            headers: getAuthHeaders()

        });
        return response.data.filteredPosts;
    } catch (error) {
        throw error;
    }
};



export default fetchAllPosts;
