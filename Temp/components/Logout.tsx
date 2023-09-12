import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");

    // Clear the JWT token from localStorage
    localStorage.removeItem("token");

    // Clear the user data from sessionStorage
    localStorage.removeItem("userData");

    sessionStorage.removeItem("isReloaded");

    // Redirect to the login page
    navigate("/login");
    console.log("Redirecting...");
  };

  return (
    <>
      <div className="LogoutDiv">
        <a onClick={handleLogout} className="Logout">
          <i className="icon-logout"></i>Logga ut
        </a>
      </div>
    </>
  );
};

export default Logout;
