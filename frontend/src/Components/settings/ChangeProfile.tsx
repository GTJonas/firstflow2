import React, { useState, useEffect } from "react";
import {
  encryptData,
  decryptData,
  updateProfile,
} from "../../../frontend/src/api/api"; // Import your updateProfile function

const ChangeProfile = ({ user }) => {
  const [uuid, setUuid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [companyUuid, setCompanyUuid] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); // State to hold the selected image
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  console.log(user.user.profilePicture);

  // Fetch user's current profile data from localStorage and populate the form fields
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        // Attempt to decrypt the stored data
        const decryptedData = decryptData(storedUserData);

        // Check if the decrypted data is a valid JSON string
        if (isValidJSON(decryptedData)) {
          const userData = JSON.parse(decryptedData);
          setUuid(user.user.uuid);
          setFirstName(userData.user.first_name);
          setLastName(userData.user.last_name);
          setEmail(user.user.email);
          setRoleId(user.user.roleId);
          setSchoolId(user.user.schoolId);
          setClassId(user.user.classId);
          setCompanyUuid(user.user.companyUuid);
        } else {
          setError("Invalid user data format");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Error parsing user data");
      }
    }
  }, []);

  function isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate form inputs
    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return;
    }

    // Create a form data object to send the updated profile data
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);

    // Check if a new profile picture file was selected
    if (profilePicture instanceof File) {
      formData.append("profilePicture", profilePicture);
    } else {
      // No new profile picture selected, so use the existing one from user data
      formData.append("profilePicture", user.user.profilePicture);
    }

    try {
      // Send the request to update the user's profile using the API module
      const response = await updateProfile(formData);
      console.log("Response:", response);

      if (response.status === 200) {
        setSuccess(true);

        // Merge the updated fields with the existing data
        const updatedUserData = {
          user: {
            uuid: uuid,
            first_name: firstName,
            last_name: lastName,
            email: email,
            roleId: roleId,
            profilePicture: profilePicture || user.user.profilePicture,
            schoolId: schoolId,
            classId: classId,
            companyUuid: companyUuid,
          },
          // Add other profile data if needed
        };

        // Save the merged user data back to localStorage
        localStorage.setItem(
          "userData",
          encryptData(JSON.stringify(updatedUserData))
        );
        sessionStorage.removeItem("isReloaded");
      } else {
        setError("Failed to update profile. Please try again later.");
        console.error("Profile update failed. Status code:", response.status);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
    }
  };

  const handleImageChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <div className="profile-form rounded bg-white p-4 rounded">
      <h2>Change Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mt-1">
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <p style={{ color: "green" }}>Profile updated successfully!</p>
        )}
        <button className="mt-2" type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ChangeProfile;
