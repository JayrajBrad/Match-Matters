import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { UserContext } from "../navigation/UserProvider"; // Import UserContext

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, userId } = useContext(UserContext); // Get user and userId from context
  const [activeTab, setActiveTab] = useState("Plans");

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
      <View style={styles.profileSection}>
        {user?.images && user.images.length > 0 ? (
          <Image source={{ uri: user.images[0] }} style={styles.profileImage} />
        ) : (
          <Image
            source={{ uri: "default_fallback_image_url" }} // Fallback image
            style={styles.profileImage}
          />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.username ? `${user.username}, ${user.age}` : "Loading..."}
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
    backgroundColor: "#FEF1F1",
    borderRadius: 5,
    width: 150,
    padding: 10,
    alignItems: "center",
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
    color: "#555",
    marginBottom: 10,
  },
  upgradeButton: {
    backgroundColor: "#BF1013",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    textAlign: "left",
  },
  tableHeader: {
    fontWeight: "bold",
  },
});

export default ProfileScreen;
