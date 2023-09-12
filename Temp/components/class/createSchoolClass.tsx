import React, { useState } from "react";
import createClass from "../../api/createClass.tsx";

const CreateClassPage = () => {
  const [className, setClassName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const classData = { class_name: className };
      const response = await createClass(classData);
      setSuccessMessage(response.message);
      setClassName(""); // Clear the input
      window.location.reload();
    } catch (error) {
      setErrorMessage("An error occurred while creating the class.");
      console.error(error);
    }
  };
  return (
    <div className="post ">
      <h1>Create a Class</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name"
        />
        <button type="submit">Create Class</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default CreateClassPage;
