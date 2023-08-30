import React, { useState } from "react";

const ProfileUpdateForm = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    bio: "",
    profile_picture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile_picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  console.log(formData);

  return (
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
      {/* Add similar div elements for other input fields */}
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
  );
};

export default ProfileUpdateForm;
