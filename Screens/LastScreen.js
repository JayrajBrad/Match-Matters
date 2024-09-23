import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";
import { saveToken, getToken, clearToken } from "../backend/token";
import { getUserId } from "../backend/registrationUtils";

export default function PreferenceScreen({ navigation }) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    getAllUserData();
  }, []);

  const getAllUserData = async () => {
    try {
      const screens = [
        "PhoneNum",
        "Email",
        "Password",
        "Name",
        "Age",
        "Photos",
        "Preference",
      ];

      let userData = {};

      for (const screenName of screens) {
        const screenData = await getRegistrationProgress(screenName);
        if (screenData) {
          userData = { ...userData, ...screenData };
        }
      }

      setUserData(userData);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const clearAllScreenData = async () => {
    try {
      const screens = [
        "PhoneNum",
        "Email",
        "Password",
        "Name",
        "Age",
        "Photos",
        "Preference",
      ];

      for (const screenName of screens) {
        const key = `registration_progress_${screenName}`;
        await AsyncStorage.removeItem(key);
      }

      console.log(
        "All Screen Data Was Saved And Cleared For New Users....!!!!"
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  const validateUserData = (data) => {
    const requiredFields = [
      "phoneNumber",
      "emailId",
      "password",
      "firstName",
      "lastName",
      "age",
      "birthdate",
      "gender",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        return false;
      }
    }
    return true;
  };

  const registerUser = async () => {
    console.log(
      "All The registration Details have been saved in the Async Local Storage for now!!"
    );
    console.log("data", userData);

    if (!validateUserData(userData)) {
      console.log("User data is incomplete.");
      return; // Prevent sending incomplete data
    }

    await sendData(); // Await sendData call
    await clearAllScreenData();
    navigation.navigate("HomeScreen", { userData }); // Navigate to ProfileScreen instead of HomeScreen
  };

  const sendData = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      });

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        console.log("User registered successfully!");

        // Check if the token is in the response
        const token = response.data.token;
        const user = response.data.user;

        if (token && user) {
          await AsyncStorage.setItem("token", token); // Save the token
          console.log("JWT token saved successfully!");

          // // Save user data in AsyncStorage
          // await AsyncStorage.setItem("userData", JSON.stringify(userData));
          await AsyncStorage.setItem("userData", JSON.stringify(user));

          await AsyncStorage.setItem("userId", user._id);

          const userId = await getUserId();
          console.log("New User ID:", userId);

          await sendAuthenticatedRequest();
        } else {
          console.log("No token received from the server.");
        }
      } else {
        console.log("Failed to register user. Status:", response.status);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const sendAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      // Replace with the correct route
      const fullUrl = `${API_URL}/user/getAllUsers`;
      console.log("Requesting:", fullUrl);

      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Response data:", response.data);
    } catch (error) {
      console.error("Error in authenticated request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.Back}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headTitle}>Complete Registration</Text>

        <TouchableOpacity onPress={registerUser}>
          <View style={styles.skipButton}>
            <Text style={styles.skipText}>Register</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Back: {
    alignItems: "center",
    // marginTop : 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  headTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginVertical: 20,
  },
  headTag: {
    fontSize: 16,
    marginBottom: 20,
  },

  skipButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF1013",
    marginVertical: 20,
  },
  skipText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
