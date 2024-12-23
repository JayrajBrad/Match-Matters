import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native"; //
import Constants from "expo-constants";
import {API_URL} from "@env";
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const registerForPushNotificationsAsync = async (userId) => {
    try {
      let pushToken = await AsyncStorage.getItem("pushToken");
  
      if (!pushToken) {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }
  
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
  
          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
  
          if (finalStatus !== "granted") {
            console.error("Failed to get push token for push notification!");
            return null;
          }
  
          pushToken = (await Notifications.getExpoPushTokenAsync()).data;
          console.log("Generated new Expo push token:", pushToken , userId);
  
          // Save the new token to AsyncStorage
          await AsyncStorage.setItem("pushToken", pushToken);
        } else {
          console.error("Must use physical device for Push Notifications      ");
          return null;
        }
      }
  
      // Send the push token to the backend
      await fetch(`${API_URL}/api/registerPushToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pushToken }),
      });
  
      console.log("Push token registered with backend:", pushToken);
      return pushToken;
    } catch (error) {
      console.error("Error registering push notifications from authcontext:", error);
      return null;
    }
  };











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

  useEffect(() => {
    if (userId) {
      registerForPushNotificationsAsync(userId);
    }
  }, [userId]);

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
      await registerForPushNotificationsAsync(decodedToken.userId);
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
      if (token) {
        const pushToken = await AsyncStorage.getItem("pushToken");
        if (pushToken) {
          await fetch(`${API_URL}/api/removePushToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pushToken }),
          });
          await AsyncStorage.removeItem("pushToken");
      }
      }
    
      

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
