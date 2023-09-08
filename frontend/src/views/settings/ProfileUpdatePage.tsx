import React, { useState } from "react";
import axios from "axios";

const ProfileUpdatePage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    bio: "",
    profile_picture: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        profile_picture: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your actual API endpoint for updating the user profile
    const apiEndpoint = "api/update-user-profile";

    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("profile_picture", formData.profile_picture);

    try {
      const response = await axios.post(apiEndpoint, formDataToSend);

      if (response.status === 200) {
        // Handle success, e.g., display a success message
        console.log("Profile updated successfully");
      } else {
        // Handle errors, e.g., display an error message
        console.error("Profile update failed");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Bio
          </label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="profile_picture" className="form-label">
            Profile Picture
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdatePage;
