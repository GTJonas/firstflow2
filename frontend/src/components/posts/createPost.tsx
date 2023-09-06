import React, { useState } from "react";
import axios from "axios";
import getAuthHeaders from "../../api/getAuthHeaders.tsx";
import { useUser } from "../../functions/contexts/userContext.tsx";

const CreatePost = () => {
  const user = useUser(); // Access the user data from the context
  const [content, setContent] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [image, setImage] = useState(null); // State to hold the selected image
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate the content field
    if (!content) {
      setError("Content field is required.");
      return;
    }

    // Get the authentication headers
    const authHeaders = getAuthHeaders();

    // Create a form data object to send the image along with other data
    const formData = new FormData();
    formData.append("content", content);
    formData.append("from", from);
    formData.append("to", to);

    if (image instanceof File) {
      formData.append("image", image);
    }

    // Check if the user is in the desired class or company
    const userIsInClass = user.class_id !== null;
    const userIsInCompany = user.company_uuid !== null;

    if (!userIsInClass) {
      setError("You are not in the required class.");
      return;
    }

    if (!userIsInCompany) {
      setError("You are not in the required company.");
      return;
    }

    // Send the request to create the post with authentication headers
    axios
      .post("http://194.71.0.30:8000/api/store-post", formData, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data", // Important for image upload
        },
      })
      .then((response) => {
        setSuccess(true);
        setContent("");
        setImage(null);
        setFrom("");
        setTo("");
        window.location.reload();
      })
      .catch((error) => {
        setError("Failed to create post. Please try again later.");
      });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="post rounded">
      <h2>Skapa nytt inlägg</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h1>{user.first_name}</h1>
          <label>Content:</label>
          <textarea
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-1">
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <label>From:</label>
          <input
            type="time"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label>To:</label>
          <input
            type="time"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <p style={{ color: "green" }}>Post created successfully!</p>
        )}
        <button className="mt-2" type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
