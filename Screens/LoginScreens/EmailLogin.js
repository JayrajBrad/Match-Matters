import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function EmailLogin({ navigation }) {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = async () => {
  //   console.log("API URL:", API_URL);
  //   if (!emailId || !password) {
  //     alert("Please enter both email and password.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${API_URL}/user/login`, {
  //       emailId: emailId,
  //       password: password,
  //     });

  //     if (response.data.success) {
  //       const { token, user } = response.data; // Assuming the token and user are in response.data
  //       if (token && user) {
  //         await AsyncStorage.setItem("userData", JSON.stringify(user));
  //         await AsyncStorage.setItem("userId", user._id);
  //         await AsyncStorage.setItem("token", token); // Save the token
  //         console.log("JWT token and user data saved successfully!");
  //         navigation.navigate("HomeScreen");
  //       } else {
  //         alert("No token or user data received from the server.");
  //       }
  //     } else {
  //       alert("Login failed. Please check your email or password.");
  //     }
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     alert("An error occurred. Please try again later.");
  //   }
  // };

  const handleLogin = async () => {
    console.log("API URL:", API_URL);
    if (!emailId || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        emailId: emailId,
        password: password,
      });

      console.log("Login Response:", response.data);

      if (response.data.success) {
        const { token, refreshToken, user } = response.data; // Capture the refresh token if it exists

        if (token && user) {
          // Optional: Clear previous data
          await AsyncStorage.removeItem("userData");
          await AsyncStorage.removeItem("userId");
          await AsyncStorage.removeItem("token");
          // await AsyncStorage.removeItem("refresh_token"); // Clear previous refresh token if needed

          // Store user data and tokens
          await AsyncStorage.setItem("userData", JSON.stringify(user));
          await AsyncStorage.setItem("userId", user._id);
          await AsyncStorage.setItem("token", token); // Save the access token
          // if (refreshToken) {
          //   await AsyncStorage.setItem("refresh_token", refreshToken); // Save the refresh token
          // }

          console.log("Tokens and user data saved successfully!");
          navigation.navigate("HomeScreen");
        } else {
          alert("No token or user data received from the server.");
        }
      } else {
        alert("Login failed. Please check your email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Display more detailed error messages based on response
      if (error.response) {
        alert(`Error: ${error.response.data.message || error.message}`);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email ID"
        value={emailId}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#BF1013",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
