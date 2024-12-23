import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Video } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import icon from "../assets/splashscreen_logo.png";

export default function Login({ navigation }) {
  // Separate shared values for each button's width
  const widthCreate = useSharedValue("80%");
  const widthSign = useSharedValue("80%");
  const colorCreate = useSharedValue(0);
  const colorSign = useSharedValue(0);

  // Animated styles for dynamic width
  const animatedWidthStyleCreate = useAnimatedStyle(() => ({
    width: withSpring(widthCreate.value),
  }));

  const animatedWidthStyleSign = useAnimatedStyle(() => ({
    width: withSpring(widthSign.value),
  }));

  const animatedStyleCreate = useAnimatedStyle(() => ({
    width: withSpring(widthCreate.value),
    backgroundColor: interpolateColor(
      colorCreate.value,
      [0, 1],
      ["#880808", "#1e2169"]
    ),
  }));

  // Animated styles for Sign In button
  const animatedStyleSign = useAnimatedStyle(() => ({
    width: withSpring(widthSign.value),
    backgroundColor: interpolateColor(
      colorSign.value,
      [0, 1],
      ["#880808", "#1e2169"]
    ),
  }));

  // Handlers for Create Account button
  // Handlers for Create Account button
  const handlePressInCreate = () => {
    widthCreate.value = "50%"; // Shrink button width
    colorCreate.value = 1; // Change color
  };

  const handlePressOutCreate = () => {
    widthCreate.value = "80%"; // Restore button width
    colorCreate.value = 0; // Restore color
    navigation.navigate("SignNumber"); // Navigate to screen
  };

  // Handlers for Sign In button
  const handlePressInSign = () => {
    widthSign.value = "50%"; // Shrink button width
    colorSign.value = 1; // Change color
  };

  const handlePressOutSign = () => {
    widthSign.value = "80%"; // Restore button width
    colorSign.value = 0; // Restore color
    navigation.navigate("EmailLogin"); // Navigate to screen
  };

  return (
    <Animated.View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require("../assets/sv1.mp4")}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image source={icon} style={styles.image} />
          <Text style={styles.tagLine}>(Tagline For match matters)</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonWrapper}>
          {/* Create Account Button */}
          <TouchableWithoutFeedback
            onPressIn={handlePressInCreate}
            onPressOut={handlePressOutCreate}
          >
            <Animated.View
              style={[
                styles.button,
                animatedWidthStyleCreate,
                animatedStyleCreate,
              ]}
            >
              <Text style={styles.textButton}>Create Account</Text>
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Sign In Button */}
          <TouchableWithoutFeedback
            onPressIn={handlePressInSign}
            onPressOut={handlePressOutSign}
          >
            <Animated.View
              style={[styles.button, animatedWidthStyleSign, animatedStyleSign]}
            >
              <Text style={styles.textButton}>Sign In</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    position: "absolute",
    top: 90,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 260,
    height: 115,
    resizeMode: "cover",
  },
  tagLine: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonWrapper: {
    // flexDirection: "row",
    position: "absolute",
    bottom: 60,
    width: "80%",
    alignItems: "center",
  },
  button: {
    height: 60,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#1e2169",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
