import { useState } from "react";
import { updateUserProfile } from "../../api/api.tsx";
import ProfileUpdateForm from "../../components/settings/ProfileUpdateForm.tsx";

const ProfileUpdatePage = () => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const handleUpdate = async (formData) => {
    const result = await updateUserProfile(formData);

    if (result.success) {
      setUpdateSuccess(true);
      setUpdateError(null);
    } else {
      setUpdateSuccess(false);
      setUpdateError(result.error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Update Profile</h1>
      {updateSuccess && (
        <div className="alert alert-success">Profile updated successfully!</div>
      )}
      {updateError && <div className="alert alert-danger">{updateError}</div>}
      <div className="row">
        <div className="col-md-6">
          <ProfileUpdateForm onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;
