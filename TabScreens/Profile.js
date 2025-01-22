import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { UserContext } from "../navigation/UserProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
          CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status

  const navigation = useNavigation();
  const { user, userId, logoutUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Plans");

  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const handleLogout = () => {
    logoutUser(); // Call logoutUser from context
    // props.navigation.navigate("Login"); // Navigate to the Login screen
    navigation.navigate("AuthStack", { screen: "Login" });
  };

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await fetchBookedEvents(); // Fetch events again
    setRefreshing(false); // Set refreshing to false after fetching
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
      }
    >
      <View style={styles.itemContainer}>
        {/* Membership Section */}
        <View style={styles.profileSection}>
          {user?.images && user.images.length > 0 ? (
            <Image
              source={{
                uri: `${user.images[0]}?timestamp=${new Date().getTime()}`, // Add a unique timestamp
              }}
              style={styles.profileImage}
            />
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
                <Text style={styles.editProfileText}>Enhance your profile</Text>
                <Icon name="arrow-forward-ios" size={15} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("MyEvents")}
            >
              <Icon name="shopping-bag" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>My Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("MyBookingsScreen")}
            >
              <Icon name="favorite" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>My Bookings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.boxTitle}>Activity</Text>

          {/* <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("AllEvents")}
          >
            <Text style={styles.buttonText}>All Events</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("CouponScreen")}
          >
            <Text style={styles.buttonText}>My Coupons</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("HelpScreen")}
          >
            <Text style={styles.buttonText}>Help</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("PrivacyCenterScreen")}
          >
            <Text style={styles.buttonText}>Privacy</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("ContactUsScreen")}
          >
            <Text style={styles.buttonText}>Contact Us</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activityButton}
            onPress={() => navigation.navigate("FAQScreen")}
          >
            <Text style={styles.buttonText}>FAQ</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.ordersSection}>
          <View style={styles.orderLine}>
            {/* <Text style={styles.sectionTitle}>Logout</Text> */}
          </View>
          <View style={styles.orderBorder}>
            <Text style={styles.noOrdersText}>Leaving us?</Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={handleLogout}
            >
              <Text style={styles.shopButtonText}>Logout</Text>
              <Icon name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#f44336", // Red color for logout button
    marginTop: "auto", // Push the button to the bottom
    marginBottom: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "CenturyGothic",
  },
  profileImage: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    borderRadius: 15, // For circular images
    resizeMode: "cover", // Ensures the image is scaled to fill
    backgroundColor: "#f0f0f0",
    marginRight: 20,
    marginHorizontal: 40,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontFamily: "CenturyGothicBold",
    color: "#290F4C",
  },
  // editProfile: {
  //   flexDirection: "row",
  // },
  editProfileButton: {
    marginTop: 10,
    backgroundColor: "#FEF1F1",
    borderRadius: 5,
    width: 180,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editProfileText: {
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  itemContainer: {
    marginTop: 30,
  },
  membershipSection: {
    padding: 20,
    alignItems: "center",
  },
  membershipButton: {
    backgroundColor: "#814C68",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
  },
  buttonText: {
    color: "#814C68",
    fontSize: 16,
    fontFamily: "CenturyGothic",
  },
  quickActions: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 20,
  },
  quickActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "#814C68",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontFamily: "CenturyGothic",
  },
  ordersSection: {
    padding: 20,
    marginBottom: 60,
  },
  orderLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  orderBorder: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderColor: "#ddd",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "CenturyGothic",
  },
  seeAllText: {
    color: "#000",
    textDecorationLine: "underline",
    fontFamily: "CenturyGothic",
  },
  noOrdersText: {
    marginBottom: 10,
    color: "#814C68",
    fontSize: 18,
    fontFamily: "CenturyGothic",
  },
  shopNowButton: {
    backgroundColor: "#814C68",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  shopButtonText: {
    color: "#fff",
    marginRight: 5,
    fontFamily: "CenturyGothic",
  },
  accountSection: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#814C68",
    borderRadius: 10,
    margin: 10,
  },
  accountButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#290F4C",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activitySection: {
    padding: 20,
    backgroundColor: "#fff",

    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    // marginBottom: 100,
  },
  activityButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#290F4C",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxTitle: {
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
    color: "#814C68",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ProfileScreen;
