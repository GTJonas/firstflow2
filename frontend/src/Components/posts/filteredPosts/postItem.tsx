import TimeDifference from "./timeDifference.tsx";
import axios from "axios";
import getAuthHeaders from "../../../../frontend/src/api/getAuthHeaders.tsx";

const API_BASE_URL = "http://194.71.0.30:8000/api"; // Change to your API URL

const PostItem = ({ post, user }) => {
  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  console.log(post);
  const headers = getAuthHeaders();

  const handleAccept = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.uuid}/accept`,
        null,
        { headers }
      );
      if (response.status === 200) {
        // Update the status in the post object
        post.status = "approved";
        // Refresh or update the state to reflect the new status
        window.location.reload();
      }
    } catch (error) {
      console.error("Error accepting post:", error);
      console.error("Server response:", error.response); // Add this line to log the response details
    }
  };

  const handleDecline = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${post.uuid}/decline`,
        null,
        { headers }
      );
      if (response.status === 200) {
        // Update the status in the post object
        post.status = "rejected";
        // Refresh or update the state to reflect the new status
        window.location.reload();
      }
    } catch (error) {
      console.error("Error accepting post:", error);
      console.error("Server response:", error.response); // Add this line to log the response details
    }
  };

  // Utility function to map enum values to human-readable names
  const mapStatusToName = (status) => {
    switch (status) {
      case "approved":
        return (
          <>
            <i className="icon-approved"></i>
            <p>Godkänd</p>
          </>
        );
      case "rejected":
        return (
          <>
            <i>!</i>
            <p>Nekad</p>
          </>
        );
      default:
        return (
          <>
            <i>!</i>
            <p>Inte behandlad</p>
          </>
        );
    }
  };

  const PostStatus = ({ status }) => {
    const statusName = mapStatusToName(status);
    return <>{statusName}</>;
  };

  return (
    <li key={post.uuid} className="post rounded">
      <div className="Post-ProfileImage">
        <img
          src={`${post.user.profile_picture}`}
          className="rounded-circle img-fluid img-md"
          alt=""
          loading="lazy"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      </div>
      <h4>
        {post.user.first_name} {post.user.last_name}
      </h4>
      <TimeDifference createdAt={post.created_at} />
      <p className="Post-Content text-break">{post.content}</p>
      <div className="Post-Image">
        <img src={post.image} alt="" className="img-fluid img-md" />
      </div>
      <PostStatus status={post.status} />
      <p>
        {formatTime(post.from)} - {formatTime(post.to)}
      </p>

      {user.user.roleId === 2 && post.status === "pending" && (
        <div className="Post-Actions">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAccept}
            style={{ marginRight: "10px" }}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      )}
    </li>
  );
};

export default PostItem;
