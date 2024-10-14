import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

// Save JWT Token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("user_token", token);
    console.log("Token saved successfully.");
  } catch (error) {
    console.log("Error saving the token", error);
  }
};

// Get JWT Token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("user_token");
    return token !== null ? token : null;
  } catch (error) {
    console.log("Error retrieving the token", error);
    return null; // Indicate failure
  }
};

// Clear JWT Token (e.g., on logout)
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem("user_token");
    console.log("Token cleared successfully.");
  } catch (error) {
    console.log("Error clearing the token", error);
  }
};

// Get Refresh Token
// export const getRefreshToken = async () => {
//   try {
//     const refreshToken = await AsyncStorage.getItem("refresh_token");
//     return refreshToken !== null ? refreshToken : null;
//   } catch (error) {
//     console.log("Error retrieving the refresh token", error);
//     return null; // Indicate failure
//   }
// };

export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem("refresh_token");
    return token !== null ? token : null; // Ensure you're returning the token correctly
  } catch (error) {
    console.log("Error retrieving the refresh token", error);
    return null; // Indicate failure
  }
  // const refreshToken = await AsyncStorage.getItem("refresh_token"); // Ensure you save the refresh token on login/registration
  // try {
  //   const response = await axios.post(`${API_URL}/user/refresh-token`, {
  //     token: refreshToken,
  //   });
  //   const newAccessToken = response.data.token;
  //   await AsyncStorage.setItem("token", newAccessToken); // Update the access token in storage
  // } catch (error) {
  //   console.error("Error refreshing token:", error);
  //   // Handle token refresh error (e.g., redirect to login)
  // }
};

export const saveRefreshToken = async (token) => {
  try {
    await AsyncStorage.setItem("refresh_token", token);
    console.log("Refresh token saved successfully.");
  } catch (error) {
    console.log("Error saving the refresh token", error);
  }
};

// // Save Refresh Token
// export const setRefreshToken = async (refreshToken) => {
//   try {
//     await AsyncStorage.setItem("refresh_token", refreshToken);
//     console.log("Refresh token saved successfully.");
//   } catch (error) {
//     console.log("Error saving the refresh token", error);
//   }
// };
