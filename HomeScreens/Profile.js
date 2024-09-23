import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import Icon from "react-native-vector-icons/MaterialIcons";
import { getUserData, getUserId } from "../backend/registrationUtils"; // Adjust the path to your authUtils
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("Plans");

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const userId = await getUserId();
      console.log("Fetched user ID:", userId); // Debug log
      if (userId) {
        const userData = await getUserData(userId);
        if (userData) {
          console.log("User data from API", userData);
          setData(userData);
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later."
          );
        }
      } else {
        Alert.alert("Error", "Failed to load user ID. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      Alert.alert(
        "Error",
        "Failed to load profile data. Please try again later."
      );
    }
  };

  // Fetch profile image
  const fetchProfileImage = async () => {
    try {
      const profileImageUri = await AsyncStorage.getItem("profile_image");
      console.log("Fetched profile image URI:", profileImageUri); // Debug logging
      if (profileImageUri) {
        setProfileImage(profileImageUri);
      }
    } catch (error) {
      console.log("Error fetching profile image:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData(); // Fetch user data when screen is focused
      fetchProfileImage(); // Fetch profile image as well
    }, [])
  );

  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const handleVerifyAccount = () => {
    navigation.navigate("VerifyAccountScreen");
  };

  const handleUpgradePlan = () => {
    navigation.navigate("UpgradePlanScreen");
  };

  const openDrawer = () => {
    navigation.toggleDrawer();
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
        <TouchableOpacity onPress={openDrawer} style={styles.drawerButton}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image
            source={{
              uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/4463d451-9312-44b7-b408-3de49a387dac.jpeg",
            }}
            style={styles.profileImage}
          />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {data.firstName
              ? `${data.firstName} ${data.lastName}, ${data.age}`
              : "Loading...."}
          </Text>
          <View style={styles.editProfile}>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={styles.editProfileButton}
            >
              <Text style={styles.editProfileText}>Edit your profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.verificationBox}>
        <Text style={styles.verificationText}>
          Verification adds an extra layer of authenticity and trust to your
          profile.
        </Text>
        <TouchableOpacity
          onPress={handleVerifyAccount}
          style={styles.verifyButton}
        >
          <Text style={styles.verifyButtonText}>Verify your account now!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab("Plans")}
            style={[
              styles.tabButton,
              activeTab === "Plans" && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "Plans" && styles.activeTabButtonText,
              ]}
            >
              Plans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Safety")}
            style={[
              styles.tabButton,
              activeTab === "Safety" && styles.activeTabButton,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "Safety" && styles.activeTabButtonText,
              ]}
            >
              Safety
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Plans" ? (
          <View style={styles.planBox}>
            <Text style={styles.planText}>HeartSync Premium</Text>
            <Text style={styles.planTextinside}>
              Unlock exclusive features and enhance your experience of
              connecting with friends.
            </Text>
            <TouchableOpacity
              onPress={handleUpgradePlan}
              style={styles.upgradeButton}
            >
              <Text style={styles.upgradeButtonText}>Upgrade from just 5$</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.planBox}>
            <Text style={styles.planText}>
              Learn more about safety measures and tips.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>
            What's Included
          </Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Free</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Premium</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Unlimited Likes</Text>
          <Text style={styles.tableCell}>
            <Icon name="check" size={24} color="#BF1013" />
          </Text>
          <Text style={styles.tableCell}>
            <Icon name="check" size={24} color="#BF1013" />
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Advanced Filters</Text>
          <Text style={styles.tableCell}>
            <Icon name="check" size={24} color="#BF1013" />
          </Text>
          <Text style={styles.tableCell}>
            <Icon name="check" size={24} color="#BF1013" />
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Remove ads</Text>
          <Text style={styles.tableCell}>
            <Icon name="" size={24} color="#BF1013" />
          </Text>
          <Text style={styles.tableCell}>
            <Icon name="check" size={24} color="#BF1013" />
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  drawerButton: {
    padding: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editProfileButton: {
    marginTop: 10,
    backgroundColor: "#FEF1F1", // Add background color here
    borderRadius: 5,
    width: 150,
    padding: 10, // Add padding for better touch area
    alignItems: "center", // Center text in button
  },

  editProfileText: {
    color: "#BF1013",
  },
  verificationBox: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 20,
  },
  verificationText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  verifyButton: {
    backgroundColor: "#BF1013",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#BF1013",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#000",
  },
  // editProfile: {
  //   backgroundColor: "#FEF1F1",
  //   borderRadius: 5,
  // },
  activeTabButtonText: {
    color: "#BF1013",
  },
  planBox: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  planText: {
    fontSize: 16,
    marginBottom: 8,
  },
  planTextinside: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  upgradeButton: {
    backgroundColor: "#BF1013",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f1f1f1",
  },
});

export default ProfileScreen;
