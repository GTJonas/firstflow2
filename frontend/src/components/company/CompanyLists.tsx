import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://194.71.0.30:8000";

function CompanyLists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);

  const fetchCompanies = async (query) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/search-companies?query=${query}`
      );

      if (response.data.companies.length === 0) {
        setCompanies(null);
      } else {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const favoriteCompany = async (companyId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/favorite-company/${companyId}`,
        {},
        { headers }
      );
      // Handle the response data in the .then block
      responseHandler(response);
    } catch (error) {
      console.error("Error favoriting company:", error);
    }
  };

  const removeFavoriteCompany = async (companyId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/remove-favorite-company/${companyId}`,
        {},
        { headers }
      );
      // Handle the response data in the .then block
      responseHandler(response);
    } catch (error) {
      console.error("Error removing favorite company:", error);
    }
  };

  // Create a separate function to handle the response
  const responseHandler = (response) => {
    console.log("Response:", response);
    console.log(response.data.message);
    // Refresh the list of companies after removing from favorites
    fetchCompanies(searchQuery);
    // Refresh the list of favorite companies
    fetchFavoriteCompanies();
  };

  const fetchFavoriteCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/favorite-companies`, {
        headers,
      });
      setFavoriteCompanies(response.data.favoriteCompanies);
    } catch (error) {
      console.error("Error fetching favorite companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies(searchQuery);
  }, [searchQuery]);

  return (
    <div>
      <h1>Company Profiles</h1>
      <form>
        <input
          type="text"
          placeholder="Search for companies"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </form>

      <ul>
        {companies !== null ? (
          companies.map((companyData, index) => (
            <li key={index}>
              <img src={companyData.company.profile_picture} alt="" />
              <h2>{companyData.company.name}</h2>
              <p>{companyData.category}</p>
              <p>Location: {companyData.company.location}</p>
              <p>About: {companyData.company.about}</p>
              <p>
                Supervisor: {companyData.supervisor?.firstName || "N/A"}{" "}
                {companyData.supervisor?.lastName || ""}
              </p>
              <a href={companyData.url}>URL</a>
              <button onClick={() => favoriteCompany(companyData.company.uuid)}>
                Favorite
              </button>
              <button
                onClick={() => removeFavoriteCompany(companyData.company.uuid)}
              >
                Remove Favorite
              </button>
            </li>
          ))
        ) : (
          <li>No companies found</li>
        )}
      </ul>
    </div>
  );
}

export default CompanyLists;
