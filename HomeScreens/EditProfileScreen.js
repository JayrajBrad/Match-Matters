import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import PreferencesDropdown from "../components/PreferencesDropdown";
import { getUserData, getUserId } from "../backend/registrationUtils"; // Adjust path as needed
import GenderDropdown from "../components/GenderDropdown";

const preferences = [
  "Clubbing",
  "Party",
  "Movies",
  "Travel",
  "Music",
  "Fitness",
  "Cooking",
  "Gaming",
  "Art",
  "Photography",
];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await getUserId(); // Assuming getUserId retrieves the user ID from AsyncStorage
        setUserId(storedUserId);

        const response = await axios.get(`${API_URL}/user/${storedUserId}`);

        if (response.status === 200) {
          const userData = response.data; // Adjust according to your API response structure
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setPhoneNumber(
            userData.phoneNumber ? String(userData.phoneNumber) : ""
          );
          setGender(userData.gender || "");
          setProfileImage(userData.profileImage || null);
          setSelectedPreferences(userData.selectedPreferences || []);
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later."
          );
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        Alert.alert(
          "Error",
          "Failed to load profile data. Please try again later."
        );
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(`${API_URL}/user/updateUserProfile`, {
        userId,
        firstName,
        lastName,
        phoneNumber,
        gender,
        selectedPreferences,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("firstName", firstName);
        await AsyncStorage.setItem("lastName", lastName);
        await AsyncStorage.setItem("phoneNumber", phoneNumber);
        await AsyncStorage.setItem("gender", gender);
        await AsyncStorage.setItem(
          "selectedPreferences",
          JSON.stringify(selectedPreferences)
        );

        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image
            source={require("../assets/updated-logo.png")}
            style={styles.profileImage}
          />
        )}
        <View style={styles.profileInfo}>
          {/* Label for First Name */}
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          {/* Label for Last Name */}
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          {/* Label for Phone Number */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />

          {/* Label for Gender */}
          <Text style={styles.label}>Gender</Text>
          <GenderDropdown gender={gender} onSelectGender={setGender} />

          {/* Label for Preferences */}
          <Text style={styles.label}>Preferences</Text>
          <PreferencesDropdown
            preferences={preferences}
            selectedPreferences={selectedPreferences}
            onSelect={setSelectedPreferences}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleUpdateProfile}
        style={styles.updateButton}
      >
        <Text style={styles.updateButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileInfo: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  updateButton: {
    backgroundColor: "#BF1013",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 16,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
