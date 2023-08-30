import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";
import getAuthHeaders from "./getAuthHeaders";

export const useFetchData1 = (url: string, headers = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null); // Specify the type as Error | null
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, { headers });
        setData(response.data);
        console.log(data);
      } catch (error) {
        console.error("Error setting user data:", error);
        setError(error as Error); // Cast 'error' to Error type
      } finally {
        setIsFetched(true);
      }
    };

    if (!isFetched) {
      fetchData();
    }
  }, [url, headers, isFetched]);

  return { data, error };
};

export const useLogin = (
  url: string,
  credentials: { remember: boolean; password: string; email: string }
) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = async () => {
    try {
      const response = await axios.post(url, credentials);

      if (response.status === 200) {
        const token = response.data.token; // Assuming your response structure contains the token

        // Store the token in localStorage
        localStorage.setItem("token", token);

        // Define an interface to describe the structure of the decoded token
        interface DecodedToken {
          sub: string;
          // Other properties you expect in the decoded token
          // For example: iss, exp, iat, etc.
        }

        // Decode the token to access user data
        const decodedToken = jwtDecode(token) as DecodedToken;
        const userUuid = decodedToken.sub;

        // Fetch user data using the UUID
        try {
          const userResponse = await axios.get(
            `http://192.168.1.78:8000/api/get-user-by-uuid/${userUuid}`
          ); // Replace with your API endpoint
          const user = userResponse.data;
          // Encrypt and store user data in localStorage
          const encryptedUserData = encryptData(JSON.stringify(user));
          localStorage.setItem("userData", encryptedUserData);

          // Set the token in Axios headers for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoginError("An error occurred during login");
        }
      } else {
        setLoginError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login");
    }
  };

  return { isLoggedIn, loginError, login };
};

export const updateUserProfile = async (formData) => {
  const token = localStorage.getItem("token");
  const userUuid = jwtDecode(token).sub;

  try {
    // Update user profile on the server
    const response = await axios.post(
      `http://192.168.1.78:8000/api/update-user-profile`,
      formData,
      { headers: getAuthHeaders() }
    );

    if (response.status === 200) {
      // Fetch updated user data
      const userResponse = await axios.get(
        `http://192.168.1.78:8000/api/get-user-by-uuid/${userUuid}`
      );
      const updatedUser = userResponse.data;

      // Update encrypted user data in localStorage
      const encryptedUserData = encryptData(JSON.stringify(updatedUser));
      localStorage.setItem("userData", encryptedUserData);

      return { success: true, user: updatedUser };
    } else {
      return { success: false, error: "Failed to update profile" };
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "An error occurred during profile update" };
  }
};

// Encrypt data using your encryption method
const encryptData = (data: string) => {
  const secretKey = "123456"; // Replace with your secret key
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedData;
};

// Decrypt data using your decryption method
export const decryptData = (encryptedData: string) => {
  const secretKey = "123456"; // Replace with your secret key

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

export const fetchAllCompanyProfiles = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data.companies;
  } catch (error) {
    console.error("Error fetching company profiles:", error);
    throw error; // Rethrow the error to let the caller handle it
  }
};
