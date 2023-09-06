import React, { useEffect, useState } from "react";
import axios from "axios";
import "./changeCompanyProfilePopup.css";
import { useParams } from "react-router-dom";

const ChangeCompanyProfilePopup = ({ onClose }) => {
  const [updateName, setUpdateName] = useState(""); // State for company name
  const [updateCategory, setUpdateCategory] = useState(""); // State for category
  const [updateLocation, setUpdateLocation] = useState(""); // State for company name
  const [updateAbout, setUpdateAbout] = useState(""); // State for category
  const [updateProfilePicture, setUpdateProfilePicture] = useState("");
  const [updateBanner, setUpdateBanner] = useState("");
  const { uuid } = useParams();

  useEffect(() => {
    // Fetch the company data and set the initial values of updateName and updateCategory
    axios
      .get(`http://5.152.153.222:8000/api/company/show/${uuid}`)
      .then((response) => {
        const { company } = response.data;
        setUpdateName(company.name);
        setUpdateCategory(company.category || ""); // Set to empty string if null
        setUpdateLocation(company.location || ""); // Set to empty string if null
        setUpdateAbout(company.about || ""); // Set to empty string if null
        setUpdateProfilePicture(company.profile_picture || ""); // Set to empty string if null
        setUpdateBanner(company.banner || ""); // Set to empty string if null
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
        console.log(error.response);
      });
  }, [uuid]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedData = new FormData();

      updatedData.append("name", updateName);
      updatedData.append("category", updateCategory);
      updatedData.append("location", updateLocation || ""); // Set to empty string if null
      updatedData.append("about", updateAbout || ""); // Set to empty string if null

      if (updateProfilePicture instanceof File) {
        updatedData.append("profile_picture", updateProfilePicture);
      }

      if (updateBanner instanceof File) {
        updatedData.append("banner", updateBanner);
      }

      const response = await axios.post(
        `http://5.152.153.222:8000/api/company/edit/${uuid}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      console.log(response.data); // Display success message
      onClose(); // Close the popup after submitting
      window.location.reload();
    } catch (error) {
      console.error("Error updating company profile:", error);
      console.log(error.response);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Change Company Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <label htmlFor="name">Företagsnamn:</label>
          <input
            type="text"
            id="name"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
          />
          <label htmlFor="category">Kategori:</label>
          <input
            type="text"
            id="category"
            value={updateCategory}
            onChange={(e) => setUpdateCategory(e.target.value)}
          />
          <label htmlFor="location">Ort:</label>
          <input
            type="text"
            id="location"
            value={updateLocation}
            onChange={(e) => setUpdateLocation(e.target.value)}
          />
          <label htmlFor="about">Om:</label>
          <input
            type="text"
            id="about"
            value={updateAbout}
            onChange={(e) => setUpdateAbout(e.target.value)}
          />
          <label htmlFor="profile_picture">Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            id="profile_picture"
            onChange={(e) => setUpdateProfilePicture(e.target.files[0])}
          />

          <label htmlFor="banner">Banner:</label>
          <input
            type="file"
            accept="image/*"
            id="banner"
            onChange={(e) => setUpdateBanner(e.target.files[0])}
          />
          <button type="submit">Update Profile</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChangeCompanyProfilePopup;
