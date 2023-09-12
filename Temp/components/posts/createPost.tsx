import React, { useState } from "react";
import createPost from "../../api/api";

const CreatePost = ({ user }) => {
  const [content, setContent] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [image, setImage] = useState(null); // State to hold the selected image
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate the content field
    if (!content) {
      setError("Content field is required.");
      return;
    }

    // Create a form data object to send the image along with other data
    const formData = new FormData();
    formData.append("content", content);
    formData.append("from", from);
    formData.append("to", to);

    if (image instanceof File) {
      formData.append("image", image);
    }

    // Check if the user is in the desired class or company
    const userIsInClass = user.user.class_id !== null;
    const userIsInCompany = user.user.company_uuid !== null;

    if (!userIsInClass) {
      setError("You are not in the required class.");
      return;
    }

    if (!userIsInCompany) {
      setError("You are not in the required company.");
      return;
    }

    // Set isCreatingPost to true to indicate the post creation is in progress
    setIsCreatingPost(true);

    // Send the request to create the post using the createPost function from the api.tsx file
    createPost(formData)
      .then((response) => {
        setSuccess(true);
        setContent("");
        setImage(null);
        setFrom("");
        setTo("");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error from backend:", error); // Log the error for debugging
        setError("Failed to create post. Please try again later.");
      })
      .finally(() => {
        // Set isCreatingPost to false when the request is complete
        setIsCreatingPost(false);
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
          <h1>{user.user.first_name}</h1>
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
        {isCreatingPost && <p>Creating post...</p>}
        <button className="mt-2" type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
