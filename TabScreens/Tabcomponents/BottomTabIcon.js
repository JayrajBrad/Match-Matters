import React from "react";
import { View, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BottomTabIcon = ({ route, isFocused }) => {
  const renderIcon = (route, isFocused) => {
    const color = isFocused ? "#0067FF" : "#ffffff";
    const size = 24;

    switch (route) {
      case "Home":
        return <MaterialCommunityIcons name="home" size={size} color={color} />;
      case "Vibed":
        return (
          <MaterialCommunityIcons name="heart" size={size} color={color} />
        );
      case "Event":
        return (
          <MaterialCommunityIcons
            name="plus-circle"
            size={size}
            color={color}
          />
        );
      case "Chat":
        return <MaterialCommunityIcons name="chat" size={size} color={color} />;
      case "Profile":
        return (
          <MaterialCommunityIcons
            name="account-circle"
            size={size}
            color={color}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.iconContainer}>{renderIcon(route, isFocused)}</View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    justifyContent: "center", // Centers icons vertically
    alignItems: "center", // Centers icons horizontally
    marginTop: 15,
  },
});

export default BottomTabIcon;
