import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import getAuthHeaders from "../../../api/getAuthHeaders.tsx";
import "../../../assets/Icons/Icons.css";
import PostItem from "./PostItem"; // Import your PostItem component here
import { useLocation } from "react-router-dom";

const API_BASE_URL = "http://194.71.0.30:8000/api"; // Change to your API URL

const FilteredPosts = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(5); // Default per page
  const [totalPosts, setTotalPosts] = useState(0);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const location = useLocation(); // Get the URL location
  const searchParams = new URLSearchParams(location.search);
  const classParam = searchParams.get("class"); // Get the 'class' query parameter
  const userParam = searchParams.get("user"); // Get the 'user' query parameter

  useEffect(() => {
    // Fetch data based on the 'class' and 'user' query parameters
    fetchAndSetData(classParam, userParam);
  }, [currentPage, perPage, classParam, userParam]); // Include classParam and userParam in the dependency array

  const fetchAndSetData = async (classParam, userParam) => {
    try {
      const params = {
        per_page: perPage,
        page: currentPage,
        class: classParam, // Include the class parameter
        user: userParam, // Include the user parameter
      };

      // Make the API request to fetch posts for the specified class and user
      const postsResponse = await axios.get(`${API_BASE_URL}/filtered-posts`, {
        params: params,
        headers: {
          ...getAuthHeaders(),
        },
      });

      setFilteredPosts(postsResponse.data.filteredPosts);
      setLastPage(postsResponse.data.pagination.last_page);
      setPerPage(postsResponse.data.pagination.per_page);
      setTotalPosts(postsResponse.data.pagination.total);

      setLoading(false); // Remove loading state
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {filteredPosts.map((post) => (
            // Render each post using the PostItem component
            <PostItem key={post.uuid} post={post} user={user} />
          ))}

          {totalPosts > 5 && (
            <div className="d-flex justify-content-between align-items-center">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-primary"
              >
                Previous Page
              </button>
              <span>
                {currentPage} / {lastPage}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="btn btn-primary"
              >
                Next Page
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilteredPosts;
