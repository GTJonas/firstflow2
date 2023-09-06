import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";
import getAuthHeaders from "./getAuthHeaders";

// Fetch the API URLs from config.json
const fetchApiUrls = async () => {
  try {
    const response = await fetch("/config.json"); // Adjust the path if needed
    const config = await response.json();
    return config.apis.map((api) => `${config.apiBaseUrl}${api.path}`);
  } catch (error) {
    console.error("Error fetching API URLs:", error);
    throw error;
  }
};

export const useFetchData1 = (
  apiIndex,
  method,
  requestData = null,
  headers = {}
) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const apiUrls = await fetchApiUrls();
        const url = apiUrls[apiIndex];
        const response = await axios({
          method,
          url,
          data: requestData,
          headers,
        });
        setFetchedData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error as Error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [apiIndex, method, requestData, headers]);

  return { fetchedData, error, isFetching };
};

export const useLogin = (
  apiIndex: string,
  method: string, // Add the method parameter
  requestData = null,
  headers = {}
) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginUser = async () => {
    setIsLoggingIn(true);

    try {
      const apiUrls = await fetchApiUrls();
      const url = apiUrls[apiIndex];

      if (!url) {
        throw new Error(`API URL "${url}" not found`);
      }

      const response = await axios({
        method, // Use the provided HTTP method
        url: url,
        data: requestData,
        headers,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        const { success, error } = await fetchAndProcessUserData(token);

        if (success) {
          setIsLoggedIn(true);
        } else {
          setLoginError(error);
        }
      } else {
        setLoginError("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return { isLoggedIn, loginError, isLoggingIn, loginUser };
};

const fetchAndProcessUserData = async (token) => {
  try {
    const decodedToken = jwtDecode(token) as DecodedToken;
    const userUuid = decodedToken.sub;

    const apiUrls = await fetchApiUrls();
    const url = apiUrls[2];

    const userResponse = await axios.get(`${url}/${userUuid}`);

    const user = userResponse.data;
    const encryptedUserData = encryptData(JSON.stringify(user));
    localStorage.setItem("userData", encryptedUserData);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return { success: true };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { success: false, error: "An error occurred during login" };
  }
};

export const updateUserProfile = async (formData) => {
  const token = localStorage.getItem("token");
  const userUuid = jwtDecode(token).sub;

  const apiUrls = await fetchApiUrls();

  try {
    const url = apiUrls[3];
    // Update user profile on the server
    const response = await axios.post(`${url}`, formData, {
      headers: getAuthHeaders(),
    });

    if (response.status === 200) {
      const url = apiUrls[2];
      // Fetch updated user data
      const userResponse = await axios.get(`${url}/${userUuid}`);
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

const userByRoles = async () => {
  const apiUrls = await fetchApiUrls();
  const url = apiUrls[4];

  try {
    const response = await axios.get(`${url}`, {
      headers: getAuthHeaders(), // Assuming getAuthHeaders() is defined and returns the Authorization header.
    });
    return response.data; // Make sure to return the data from the response.
  } catch (error) {
    throw error; // Rethrow the error to handle it in the Dashboard component.
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
