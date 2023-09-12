import SideMenu from "../components/SideMenu";
import Dashboard from "../views/Dashboard";
import { decryptData } from "../api/api.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const DefaultLayout: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  const token = localStorage.getItem("token");
  const storedUserData = localStorage.getItem("userData");

  useEffect(() => {
    if (!token || !storedUserData) {
      handleLogout();
      return; // Return early to prevent further execution
    }

    try {
      const decodedToken = jwtDecode(token);
      const expirationTimeInSeconds = decodedToken.exp;
      const expirationTimeInMilliseconds = expirationTimeInSeconds * 1000;
      const currentTime = Date.now();

      // Check if the token has 'uuid' or 'sub' claim
      if (!decodedToken.sub) {
        handleLogout();
        return; // Return early to prevent further execution
      }

      if (expirationTimeInMilliseconds < currentTime) {
        // Token is expired, perform an auto-logout
        handleLogout();
        return; // Return early to prevent further execution
      }

      if (sessionStorage.getItem("isReloaded") === "true") {
        console.log(sessionStorage.getItem("isReloaded"));
        const decryptedUserData = decryptData(storedUserData);
        const parsedUserData = JSON.parse(decryptedUserData);
        setUser(parsedUserData);

        const interval = setInterval(() => {
          const currentTime = Date.now();
          const remainingTimeInSeconds = Math.floor(
            (expirationTimeInMilliseconds - currentTime) / 1000
          );
          setRemainingTime(remainingTimeInSeconds);
        }, 1000); // Update every 1 second

        return () => {
          clearInterval(interval); // Clear the interval when the component unmounts
        };
      } else {
        window.location.reload();
        sessionStorage.setItem("isReloaded", "true");
      }

      console.log(decodedToken);
    } catch (error) {
      console.error("Error decoding token:", error);
      handleLogout();
    }
  }, [navigate, token, storedUserData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("isReloaded");
    setUser(null);
    if (!location.pathname.startsWith("/login")) {
      navigate("/login");
    } else {
      // If something goes wrong, reload the page
      window.location.reload();
    }
  };

  if (remainingTime == 0) {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("isReloaded");
  }

  if (!token || !user) {
    return null; // Return null to prevent further rendering
  }

  const Remainingtime = () => {
    if (location.pathname.startsWith("/test")) {
      return <div>Remaining Time: {remainingTime} seconds</div>;
    } else {
      return null;
    }
  };
  const decodedToken = jwtDecode(token) as DecodedToken;

  console.log(user);

  return (
    <div className="main">
      <Remainingtime />
      <SideMenu user={user} />
      <Dashboard user={user} />
    </div>
  );
};

export default DefaultLayout;
