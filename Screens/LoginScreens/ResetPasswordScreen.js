import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";

const ResetPasswordScreen = ({ route, navigation }) => {
  const resetToken = route.params?.token;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  console.log("Reset password token:", token);

  useEffect(() => {
    if (!resetToken) {
      alert("Invalid or missing reset token.");
      navigation.goBack();
    }
  }, [resetToken]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, {
        token: resetToken,
        newPassword,
      });

      if (response.data.message) {
        alert(response.data.message);
        navigation.navigate("EmailLogin");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
  buttonText: { color: "#fff", fontSize: 18 },
});

export default ResetPasswordScreen;
