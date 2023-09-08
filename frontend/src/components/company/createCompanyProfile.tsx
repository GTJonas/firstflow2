import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getAuthHeaders from "../../api/getAuthHeaders.tsx";

const CreateCompanyProfile = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://194.71.0.30:8000/api/store-company",
        {
          name: companyName,
          // Include other fields as needed for the company profile creation
        },
        { headers: getAuthHeaders() } // Include the authentication headers
      );

      console.log(response.data); // Display success message

      // Redirect to the newly created company profile
      navigate(`/company/${response.data.uuid}`);
    } catch (error) {
      console.error("Error creating company profile:", error);
    }
  };

  return (
    <div className="create-company-profile">
      <h2>Create Company Profile</h2>
      <form onSubmit={handleProfileSubmit}>
        <label htmlFor="name">Company Name:</label>
        <input
          type="text"
          id="name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        {/* Add more input fields and labels for other fields */}
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateCompanyProfile;
