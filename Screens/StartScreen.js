import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useContext } from "react";
import { Video } from "expo-av";
import Swiper from "react-native-swiper";
import icon from "../assets/updated-logo.png";
import arrow from "../assets/curve-arrow.png"; // Import your arrow image
import { UserContext } from "../navigation/UserProvider";

const StartScreen = ({ navigation }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const swipeAnimation = useRef(new Animated.Value(0)).current;
  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    if (token) {
      navigation.replace("StackNavigator", { screen: "FeedScreen" });
    }
  }, [token, navigation]);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(swipeAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(swipeAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnimation, swipeAnimation]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <Swiper style={styles.wrapper} loop={false}>
        <View style={styles.slide}>
          <Video
            source={require("../assets/mixkit-group-of-friends-making-a-toast-with-wine-42718-4k.mp4")}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay}>
            <View style={styles.logoWrapper}>
              <Image source={icon} style={styles.image} />
            </View>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.bottomText}>
              <Text style={[styles.text, { bottom: 60 }]}>
                Party & Connect Safely
              </Text>
              <Text style={[styles.text, { fontSize: 13, bottom: 35 }]}>
                Experience fun and engaging events while making meaningful
                connections. Enjoy your journey with peace of mind in our
                friendly space.
              </Text>
            </View>
            <Animated.View
              style={[styles.arrowContainer, { opacity: swipeAnimation }]}
            >
              <Image source={arrow} style={styles.arrowImage} />
              <Text style={styles.swipeText}>Swipe to move next</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.slide}>
          <Video
            source={require("../assets/onscreen2.mp4")}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay}>
            <View style={styles.logoWrapper}>
              <Image source={icon} style={styles.image} />
            </View>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.bottomText}>
              <Text style={[styles.text, { bottom: 60 }]}>
                Meet Friendly Faces
              </Text>
              <Text style={[styles.text, { fontSize: 13, bottom: 35 }]}>
                Connect with genuine, friendly individuals in a welcoming
                environment. Respect and kindness are at the heart of our
                community.
              </Text>
            </View>
            <Animated.View
              style={[styles.arrowContainer, { opacity: swipeAnimation }]}
            >
              <Image source={arrow} style={styles.arrowImage} />
              <Text style={styles.swipeText}>Swipe to move next</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.slide}>
          <Video
            source={require("../assets/onscreen3.mp4")}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay}>
            <View style={styles.logoWrapper}>
              <Image source={icon} style={styles.image} />
            </View>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <View style={[styles.bottomText, { top: 300 }]}>
              <Text style={[styles.text, { bottom: 60 }]}>
                Secure & Safe Connections
              </Text>
              <Text style={[styles.text, { fontSize: 13, bottom: 60 }]}>
                Join our community with confidence. We prioritize your safety
                with verified profiles and robust security measures.
              </Text>
            </View>
            <Animated.View
              style={[styles.arrowContainer, { opacity: swipeAnimation }]}
            >
              <Image source={arrow} style={styles.arrowImage} />
              <Text style={styles.swipeText}>Click "Get Started"</Text>
            </Animated.View>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swiper>
    </Animated.View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    width: 350,
    height: 110,
    resizeMode: "cover",
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  bottomText: {
    top: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#BF1013",
    height: 50,
    width: 300,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 10,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  skipButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  swipeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  arrowContainer: {
    position: "absolute",
    top: 450,
    alignItems: "center",
  },
  arrowImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  getStartedButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#BF1013",
    height: 50,
    width: 300,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedButtonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
});
