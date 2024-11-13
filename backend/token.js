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
    const token = await AsyncStorage.getItem("token");
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

// export const getRefreshToken = async () => {
//   try {
//     const token = await AsyncStorage.getItem("refresh_token");
//     return token !== null ? token : null; // Ensure you're returning the token correctly
//   } catch (error) {
//     console.log("Error retrieving the refresh token", error);
//     return null; // Indicate failure
//   }
// };

// export const saveRefreshToken = async (token) => {
//   try {
//     await AsyncStorage.setItem("refresh_token", token);
//     console.log("Refresh token saved successfully.");
//   } catch (error) {
//     console.log("Error saving the refresh token", error);
//   }
// };
