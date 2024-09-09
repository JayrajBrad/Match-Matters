import AsyncStorage from "@react-native-async-storage/async-storage";

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
