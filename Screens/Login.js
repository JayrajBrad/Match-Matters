// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Image,
// } from "react-native";
// import { Video } from "expo-av";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   interpolateColor,
// } from "react-native-reanimated";
// import icon from "../assets/splashscreen_logo.png";

// export default function Login({ navigation }) {
//   // Separate shared values for each button's width
//   const widthCreate = useSharedValue("80%");
//   const widthSign = useSharedValue("80%");
//   const colorCreate = useSharedValue(0);
//   const colorSign = useSharedValue(0);

//   // Animated styles for dynamic width
//   const animatedWidthStyleCreate = useAnimatedStyle(() => ({
//     width: withSpring(widthCreate.value),
//   }));

//   const animatedWidthStyleSign = useAnimatedStyle(() => ({
//     width: withSpring(widthSign.value),
//   }));

//   const animatedStyleCreate = useAnimatedStyle(() => ({
//     width: withSpring(widthCreate.value),
//     backgroundColor: interpolateColor(
//       colorCreate.value,
//       [0, 1],
//       ["#880808", "#1e2169"]
//     ),
//   }));

//   // Animated styles for Sign In button
//   const animatedStyleSign = useAnimatedStyle(() => ({
//     width: withSpring(widthSign.value),
//     backgroundColor: interpolateColor(
//       colorSign.value,
//       [0, 1],
//       ["#880808", "#1e2169"]
//     ),
//   }));

//   // Handlers for Create Account button
//   // Handlers for Create Account button
//   const handlePressInCreate = () => {
//     widthCreate.value = "50%"; // Shrink button width
//     colorCreate.value = 1; // Change color
//   };

//   const handlePressOutCreate = () => {
//     widthCreate.value = "80%"; // Restore button width
//     colorCreate.value = 0; // Restore color
//     navigation.navigate("SignNumber"); // Navigate to screen
//   };

//   // Handlers for Sign In button
//   const handlePressInSign = () => {
//     widthSign.value = "50%"; // Shrink button width
//     colorSign.value = 1; // Change color
//   };

//   const handlePressOutSign = () => {
//     widthSign.value = "80%"; // Restore button width
//     colorSign.value = 0; // Restore color
//     navigation.navigate("EmailLogin"); // Navigate to screen
//   };

//   return (
//     <Animated.View style={styles.container}>
//       {/* Background Video */}
//       <Video
//         source={require("../assets/sv1.mp4")}
//         rate={1.0}
//         volume={1.0}
//         isMuted={false}
//         resizeMode="cover"
//         shouldPlay
//         isLooping
//         style={StyleSheet.absoluteFill}
//       />

//       {/* Overlay */}
//       <View style={styles.overlay}>
//         {/* Logo */}
//         <View style={styles.logoWrapper}>
//           <Image source={icon} style={styles.image} />
//           <Text style={styles.tagLine}>(Tagline For match matters)</Text>
//         </View>

//         {/* Buttons */}
//         <View style={styles.buttonWrapper}>
//           {/* Create Account Button */}
//           <TouchableWithoutFeedback
//             onPressIn={handlePressInCreate}
//             onPressOut={handlePressOutCreate}
//           >
//             <Animated.View
//               style={[
//                 styles.button,
//                 animatedWidthStyleCreate,
//                 animatedStyleCreate,
//               ]}
//             >
//               <Text style={styles.textButton}>Create Account</Text>
//             </Animated.View>
//           </TouchableWithoutFeedback>

//           {/* Sign In Button */}
//           <TouchableWithoutFeedback
//             onPressIn={handlePressInSign}
//             onPressOut={handlePressOutSign}
//           >
//             <Animated.View
//               style={[styles.button, animatedWidthStyleSign, animatedStyleSign]}
//             >
//               <Text style={styles.textButton}>Sign In</Text>
//             </Animated.View>
//           </TouchableWithoutFeedback>
//         </View>
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoWrapper: {
//     position: "absolute",
//     top: 90,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: 260,
//     height: 115,
//     resizeMode: "cover",
//   },
//   tagLine: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   buttonWrapper: {
//     // flexDirection: "row",
//     position: "absolute",
//     bottom: 60,
//     width: "80%",
//     alignItems: "center",
//   },
//   button: {
//     height: 60,
//     marginVertical: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 25,
//     backgroundColor: "#1e2169",
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   textButton: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Image,
// } from "react-native";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   interpolateColor,
// } from "react-native-reanimated";
// import LottieView from "lottie-react-native";
// import icon from "../assets/splashscreen_logo.png";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// SplashScreen.preventAutoHideAsync();

// export default function Login({ navigation }) {
//   const insets = useSafeAreaInsets();

//   useEffect(() => {
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
//           CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
//         });
//         setFontsLoaded(true);
//       } catch (error) {
//         console.error("Error loading fonts:", error);
//       } finally {
//         SplashScreen.hideAsync();
//       }
//     }
//     loadFonts();
//   }, []);

//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   const widthCreate = useSharedValue("80%");
//   const colorCreate = useSharedValue(0);

//   const animatedStyleCreate = useAnimatedStyle(() => ({
//     width: withSpring(widthCreate.value),
//     backgroundColor: interpolateColor(
//       colorCreate.value,
//       [0, 1],
//       ["#0F3460", "#1e2169"]
//     ),
//   }));

//   const handlePressInCreate = () => {
//     widthCreate.value = "50%";
//     colorCreate.value = 1;
//   };

//   const handlePressOutCreate = () => {
//     widthCreate.value = "80%";
//     colorCreate.value = 0;
//     navigation.navigate("SignNumber");
//   };

//   const handleLoginPress = () => {
//     navigation.navigate("EmailLogin");
//   };

//   return (
//     <Animated.View style={styles.container}>
//       {/* Lottie Animation */}
//       <LottieView
//         source={require("../assets/login.json")}
//         autoPlay
//         loop
//         style={styles.lottie}
//       />

//       {/* Overlay */}
//       <View style={styles.overlay}>
//         {/* Logo */}
//         <View style={styles.logoWrapper}>
//           <Image source={icon} style={styles.image} />
//           {/* <Text style={styles.tagLine}>(Tagline For match matters)</Text> */}
//         </View>

//         {/* Create Account Button */}
//         <View style={styles.buttonWrapper}>
//           <TouchableWithoutFeedback
//             onPressIn={handlePressInCreate}
//             onPressOut={handlePressOutCreate}
//           >
//             <Animated.View style={[styles.button, animatedStyleCreate]}>
//               <Text style={styles.textButton}>Create Account</Text>
//             </Animated.View>
//           </TouchableWithoutFeedback>

//           {/* Login Text */}
//           <TouchableWithoutFeedback onPress={handleLoginPress}>
//             <View style={styles.loginTextWrapper}>
//               <Text style={styles.loginText}>Already a user? </Text>
//               <Text style={styles.loginLink}> Login here</Text>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#00ddb2",
//   },
//   lottie: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoWrapper: {
//     position: "absolute",
//     top: 90,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: 260,
//     height: 115,
//     resizeMode: "cover",
//   },
//   tagLine: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     // marginTop: 10,
//   },
//   buttonWrapper: {
//     position: "absolute",
//     bottom: 60,
//     width: "80%",
//     alignItems: "center",
//   },
//   button: {
//     height: 50,
//     marginVertical: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 15,
//     backgroundColor: "#0F3460",
//     // shadowColor: "#000",
//     // shadowOpacity: 0.3,
//     // shadowOffset: { width: 0, height: 4 },
//     // shadowRadius: 4,
//     // elevation: 5,
//   },
//   textButton: {
//     color: "white",
//     fontSize: 16,
//     fontFamily: "CenturyGothicBold",
//   },
//   loginTextWrapper: {
//     flexDirection: "row",
//     marginTop: 20,
//   },
//   loginText: {
//     color: "#fff",
//     fontSize: 14,
//     textDecorationLine: "underline",
//     fontFamily: "CenturyGothic",
//   },
//   loginLink: {
//     color: "#0F3460",
//     fontSize: 14,
//     textDecorationLine: "underline",
//     fontFamily: "CenturyGothic",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function Login({ navigation }) {
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

  const handleLoginPress = () => {
    navigation.navigate("EmailLogin");
  };

  const handleSignUpPress = () => {
    navigation.navigate("SignNumber");
  };

  return (
    <ImageBackground
      source={require("../assets/signup - img.jpg")} // Replace with the path to your background image
      style={styles.background}
    >
      <View style={styles.overlay} />

      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/Match profile.png")}
          style={styles.logo}
        />
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeWrapper}>
        <Text style={styles.welcomeText}>Welcome to Match Matters,</Text>
        <Text style={styles.tagline}>where new friendships await!</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.LogbuttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignUpPress}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay
  },
  logoWrapper: {
    position: "absolute",
    top: 60, // Adjust as needed
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    // If needed, adjust width/height for the logo image
    width: 240,
    height: 240,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
  },
  logoTextSub: {
    fontSize: 48,
    fontFamily: "CenturyGothicBold",
    color: "#000",
  },
  welcomeWrapper: {
    position: "absolute",
    bottom: 200,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    fontFamily: "CenturyGothic",
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 60,
    width: "80%",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#814C68",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 15,
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#290F4C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  LogbuttonText: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
  },
});
