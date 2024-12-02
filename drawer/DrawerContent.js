import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../navigation/UserProvider";
const DrawerContent = (props) => {
  const { logoutUser } = useContext(UserContext);

  const renderDrawerItem = (label, navigateTo, iconName) => (
    <TouchableOpacity
      key={label}
      style={styles.drawerItemContainer}
      onPress={() => props.navigation.navigate(navigateTo)}
    >
      <View style={styles.drawerItemButton}>
        <MaterialCommunityIcons name={iconName} color="white" size={24} />
        <Text style={styles.drawerLabel}>{label}</Text>
      </View>
      <FontAwesome
        name="chevron-right"
        size={16}
        color="rgba(255, 255, 255, 0.5)"
        style={styles.chevronIcon}
      />
      <View style={styles.divider} />
    </TouchableOpacity>
  );

  const handleLogout = () => {
    logoutUser(); // Call logoutUser from context
    props.navigation.navigate("Login"); // Navigate to the Login screen
    // props.navigation.navigate("AuthStack", { screen: "EmailLogin" });
  };
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Home")}>
          <Text style={styles.headerTitle}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {renderDrawerItem("My Events", "MyEvents", "calendar")}
      {renderDrawerItem("Notifications", "Notifications", "bell")}
      {renderDrawerItem("AllEvents", "AllEvents", "account")}
      {renderDrawerItem("My Bookings", "MyBookings", "ticket")}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>More info and support</Text>
      </View>
      {renderDrawerItem("Help", "Help", "help-circle")}
      {renderDrawerItem("Privacy Center", "PrivacyCenter", "shield")}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>About Us</Text>
      </View>
      {renderDrawerItem("Contact Us", "ContactUs", "phone")}
      {renderDrawerItem("FAQs", "FAQs", "information-outline")}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: "#111",
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#111",
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  drawerLabel: {
    color: "white",
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  drawerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  drawerItemButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 16,
  },
  chevronIcon: {
    position: "absolute",
    right: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 16,
    marginVertical: 4,
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
  },
});

export default DrawerContent;
