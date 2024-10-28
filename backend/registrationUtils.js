import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import axios from "axios";

export const saveRegistrationProgress = async (screenName, data) => {
  try {
    const key = `registration_progress_${screenName}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`Progress saved for the screen : ${screenName}`);
  } catch (error) {
    console.log("Error Saving The Progress", error);
  }
};

export const getRegistrationProgress = async (screenName) => {
  try {
    const key = `registration_progress_${screenName}`;
    const data = await AsyncStorage.getItem(key);
    return data !== null ? JSON.parse(data) : null;
  } catch (error) {
    console.log("Error retrieving the progress", error);
  }
};

// Fetch user data by user ID
export const getUserData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    console.log("User data response:", response.data);
    return response.data; // Assuming the API returns user data in response.data
  } catch (error) {
    console.error("Failed to retrieve user data:", error);
    return null;
  }
};

export const getUserId = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    // console.log(userData);
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      console.log("Parsed user data:", parsedUserData);
      return parsedUserData._id; // Assuming userData has the user ID
    }
    return null; // No user ID found
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    return null;
  }
};
