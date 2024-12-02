import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          const decodedToken = jwtDecode(storedToken);
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setUserId(decodedToken.userId); // Assuing the token contains `userId`
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const loginUser = async (response) => {
    const { token, user } = response;
    console.log("TOKEN & USER_DATA :", token, user);

    try {
      const decodedToken = jwtDecode(token); // Decode the token to extract user ID
      console.log("DECODE_TOKEN : ", decodedToken);

      setToken(token);
      setUser(user);
      setUserId(decodedToken.userId); // Assuming the token contains `userId`

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.error("Error during login process:", error);
    }
  };

  const logoutUser = async () => {
    try {
      setToken(null);
      setUser(null);
      setUserId(null);

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      console.error("Error during logout process:", error);
    }
  };

  const contextValue = {
    token,
    user,
    userId,
    loginUser,
    logoutUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
