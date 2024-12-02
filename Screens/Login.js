// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Animated,
//   TouchableOpacity,
// } from "react-native";

// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Video } from "expo-av";
// import icon from "../assets/Match matters logo.png";
// // import icon from "../assets/Match matters logo (1).png";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { UserContext } from "../navigation/UserProvider";

// export default function Login({ navigation }) {
//   const [showSignInOptions, setShowSignInOptions] = useState(false);
//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const { token, setToken } = useContext(UserContext);

//   useEffect(() => {
//     if (token) {
//       navigation.replace("StackNavigator", { screen: "FeedScreen" });
//     }
//   }, [token, navigation]);

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   // return (
//   //   <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//   //     <Video
//   //       source={require("../assets/sv1.mp4")}
//   //       rate={1.0}
//   //       volume={1.0}
//   //       isMuted={false}
//   //       resizeMode="cover"
//   //       shouldPlay
//   //       isLooping
//   //       style={StyleSheet.absoluteFill}
//   //     />
//   //     <View style={styles.overlay}>
//   //       <View style={styles.logoWrapper}>
//   //         <Image source={icon} style={styles.image} />
//   //         <Text style={styles.tagLine}>(Tagline For match matters)</Text>
//   //       </View>

//   //       {!showSignInOptions ? (
//   //         <View style={styles.buttonWrapper}>
//   //           <TouchableOpacity onPress={() => navigation.navigate("LastScreen")}>
//   //             <View style={styles.button}>
//   //               <Text style={styles.buttonText}>Trial</Text>
//   //             </View>
//   //           </TouchableOpacity>
//   //           <TouchableOpacity onPress={() => navigation.navigate("SignNumber")}>
//   //             <View style={styles.button1}>
//   //               <Text style={styles.buttonText1}>Create Account</Text>
//   //             </View>
//   //           </TouchableOpacity>
//   //           <TouchableOpacity onPress={() => setShowSignInOptions(true)}>
//   //             <View style={{ ...styles.button, backgroundColor: "#BF1013" }}>
//   //               <Text style={styles.buttonText}>Sign in</Text>
//   //             </View>
//   //           </TouchableOpacity>
//   //         </View>
//   //       ) : (
//   //         <View style={styles.buttonWrapper}>
//   //           <TouchableOpacity onPress={() => navigation.navigate("EmailLogin")}>
//   //             <View style={styles.googleButton}>
//   //               <Icon name="google" size={20} color="#000" />
//   //               <Text style={{ ...styles.buttonText, color: "#000" }}>
//   //                 Sign in with Google
//   //               </Text>
//   //             </View>
//   //           </TouchableOpacity>

//   //           <TouchableOpacity onPress={() => navigation.navigate("SignNumber")}>
//   //             <View style={styles.phoneButton}>
//   //               <Text style={styles.buttonText}>Sign in with Phone Number</Text>
//   //             </View>
//   //           </TouchableOpacity>
//   //           <TouchableOpacity onPress={() => setShowSignInOptions(false)}>
//   //             <View style={styles.backButton}>
//   //               <Text style={{ ...styles.buttonText, color: "black" }}>
//   //                 Back
//   //               </Text>
//   //             </View>
//   //           </TouchableOpacity>
//   //         </View>
//   //       )}
//   //     </View>
//   //   </Animated.View>
//   // );

//   const navigateToEmailLogin = () => {
//     navigation.navigate("EmailLogin");
//   };

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
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
//       <View style={styles.overlay}>
//         <View style={styles.logoWrapper}>
//           <Image source={icon} style={styles.image} />
//           <Text style={styles.tagLine}>(Tagline For match matters)</Text>
//         </View>

//         {!showSignInOptions ? (
//           <View style={styles.buttonWrapper}>
//             <TouchableOpacity onPress={() => navigation.navigate("LastScreen")}>
//               <View style={styles.button}>
//                 <Text style={styles.buttonText}>Trial</Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate("SignNumber")}>
//               <View style={styles.button1}>
//                 <Text style={styles.buttonText1}>Create Account</Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowSignInOptions(true)}>
//               <View style={{ ...styles.button, backgroundColor: "#BF1013" }}>
//                 <Text style={styles.buttonText}>Sign in</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={styles.buttonWrapper}>
//             <TouchableOpacity onPress={navigateToEmailLogin}>
//               <View style={styles.googleButton}>
//                 <Icon name="google" size={20} color="#000" />
//                 <Text style={{ ...styles.buttonText, color: "#000" }}>
//                   Sign in with Google
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => navigation.navigate("SignNumber")}>
//               <View style={styles.phoneButton}>
//                 <Text style={styles.buttonText}>Sign in with Phone Number</Text>
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setShowSignInOptions(false)}>
//               <View style={styles.backButton}>
//                 <Text style={{ ...styles.buttonText, color: "black" }}>
//                   Back
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
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
//   },
//   buttonWrapper: {
//     position: "absolute",
//     bottom: 60,
//     width: "100%",
//   },
//   button: {
//     flexDirection: "row",
//     backgroundColor: "#BF1013",
//     height: 50,
//     marginHorizontal: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 5,
//   },
//   button1: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     height: 50,
//     marginHorizontal: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 5,
//   },
//   appleButton: {
//     flexDirection: "row",
//     backgroundColor: "#1e1e1e",
//     height: 50,
//     marginHorizontal: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 5,
//   },
//   googleButton: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderColor: "#C0C0C0",
//     borderWidth: 1,
//     height: 50,
//     marginHorizontal: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 5,
//   },
//   phoneButton: {
//     flexDirection: "row",
//     backgroundColor: "#702963",
//     height: 50,
//     marginHorizontal: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 5,
//   },
//   backButton: {
//     backgroundColor: "#fff",
//     height: 50,
//     marginHorizontal: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 5,
//   },
//   buttonText: {
//     fontSize: 20,
//     fontWeight: "500",
//     color: "white",
//     marginLeft: 10,
//   },
//   buttonText1: {
//     fontSize: 20,
//     fontWeight: "500",
//     color: "#BF1013",
//     marginLeft: 10,
//   },
// });

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
import icon from "../assets/Match matters logo.png";

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
