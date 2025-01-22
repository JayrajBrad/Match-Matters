// import React, { useState, useContext, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
// } from "react-native";
// import axios from "axios";
// import { UserContext } from "../../navigation/UserProvider"; // Adjust the import based on your project structure
// import { API_URL } from "@env";

// export default function EmailLogin({ navigation }) {
//   const { loginUser } = useContext(UserContext); // Get loginUser from context
//   const [emailId, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const fadeAnimation = useRef(new Animated.Value(0)).current;

//   const handleLogin = async () => {
//     console.log("API URL:", API_URL);
//     if (!emailId || !password) {
//       alert("Please enter both email and password.");
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_URL}/user/login`, {
//         emailId: emailId,
//         password: password,
//       });

//       console.log("Login Response:", response.data);

//       if (response.data.success) {
//         const { token, user } = response.data; // Capture token and user data

//         if (token && user) {
//           // Use the loginUser function from context to save token and user data
//           loginUser({ token, user }); // This will save token, user, and userId in the context

//           console.log("Login successful!");

//           // Redirect to the home screen after successful login
//           // navigation.navigate("Feedscreen");
//           navigation.navigate("MainTabs", { screen: "FeedScreen" });
//           // navigation.navigate("MainDrawer", {
//           //   screen: "FeedScreen",
//           // });
//           // navigation.navigate("AppStack");
//         } else {
//           alert("No token or user data received from the server.");
//         }
//       } else {
//         alert("Login failed. Please check your email or password.");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       if (error.response) {
//         alert(`Error: ${error.response.data.message || error.message}`);
//       } else {
//         alert("An error occurred. Please try again later.");
//       }
//     }
//   };

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 1500,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email ID"
//         value={emailId}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry={true}
//       />
//       <TouchableOpacity onPress={handleLogin} style={styles.button}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => navigation.navigate("ForgotPasswordScreen")}
//         style={{ marginTop: 40 }}
//       >
//         <Text style={{ color: "#BF1013" }}>Forgot Password?</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: "80%",
//     height: 50,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   button: {
//     width: "80%",
//     height: 50,
//     backgroundColor: "#BF1013",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
// });

import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { UserContext } from "../../navigation/UserProvider"; // Adjust the import based on your project structure
import { API_URL } from "@env";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function EmailLogin({ navigation }) {
  const insets = useSafeAreaInsets();

  const { loginUser } = useContext(UserContext); // Get loginUser from context
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CenturyGothic: require("../../assets/fonts/CenturyGothic.ttf"),
          CenturyGothicBold: require("../../assets/fonts/GOTHICB0.ttf"),
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

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const handleLogin = async () => {
    console.log("API URL:", API_URL);
    if (!emailId || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        emailId: emailId,
        password: password,
      });

      console.log("Login Response:", response.data);

      if (response.data.success) {
        const { token, user } = response.data; // Capture token and user data

        if (token && user) {
          // Use the loginUser function from context to save token and user data
          loginUser({ token, user }); // This will save token, user, and userId in the context

          console.log("Login successful!");
          navigation.navigate("MainTabs", { screen: "FeedScreen" });
        } else {
          alert("No token or user data received from the server.");
        }
      } else {
        alert("Login failed. Please check your email or password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || error.message}`);
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  if (!fontsLoaded) {
    return null; // Optionally, show a loading indicator here
  }

  return (
    <SafeAreaView style={styles.area}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity>
            <Text
              style={styles.backTextButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
          <KeyboardAvoidingView
            keyboardVerticalOffset={50}
            behavior={"padding"}
            style={styles.containerAvoidingView}
          >
            <Animated.View
              style={[styles.innerContainer, { opacity: fadeAnimation }]}
            >
              <Text style={styles.headTitle}>Login</Text>
              <Text style={styles.headTag}>
                Please enter your email and password to access your account.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email ID"
                placeholderTextColor="#fff"
                value={emailId}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={handleLogin}
                style={styles.btnContinue}
              >
                <Text style={styles.textContinue}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPasswordScreen")}
                style={styles.forgotPasswordText}
              >
                <Text
                  style={{
                    color: "#BF1013",
                    fontFamily: "CenturyGothic",
                    textDecorationLine: "underline",
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#290F4C",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  containerAvoidingView: {
    flex: 1,
  },
  backTextButton: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "CenturyGothic",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headTitle: {
    fontSize: 32,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    marginBottom: 10,
  },
  headTag: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 30,
    fontFamily: "CenturyGothic",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    color: "#fff",
    fontFamily: "CenturyGothic",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    marginBottom: 20,
    fontWeight: "bold",
  },
  btnContinue: {
    width: "50%",
    height: 50,
    backgroundColor: "#814C68",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 20,
    fontFamily: "CenturyGothic",
  },
  textContinue: {
    color: "#fff",
    fontSize: 16,
    // fontWeight: "bold",
    fontFamily: "CenturyGothic",
  },
  forgotPasswordText: {
    marginTop: 40,
    fontFamily: "CenturyGothic",
  },
});
