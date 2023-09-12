import React, { useEffect, useState } from "react";
import Logout from "../components/Logout.tsx";
import { useLogin } from "../api/api.tsx";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ user }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { isLoggedIn, loginError, isLoggingIn, loginUser } = useLogin(
    1,
    "POST", // Specify the HTTP method
    {
      email,
      password,
      remember: rememberMe,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(); // Call the login function from the useLogin hook
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token || isLoggedIn) {
      navigate("/"); // Redirect to the login page if token or user data is missing
    }
  }, [navigate, token, isLoggedIn]);

  if (token || isLoggedIn) {
    return null; // Return null to prevent further rendering
  }

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </div>
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
      </form>
      <Logout />
      {loginError && <p>{loginError}</p>}
      {isLoggedIn && <p>Login successful!</p>}
    </div>
  );
};

export default LoginPage;
