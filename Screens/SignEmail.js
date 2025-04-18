// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
//   Alert,
// } from "react-native";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useFonts } from "expo-font";
// // import AppLoading from "expo-app-loading";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// SplashScreen.preventAutoHideAsync();

// export default function SignEmail({ navigation }) {
//   const insets = useSafeAreaInsets();

//   const emailInput = useRef(null);
//   const passwordInput = useRef(null);
//   const rePasswordInput = useRef(null);
//   const usernameInput = useRef(null);

//   const [emailId, setEmailId] = useState("");
//   const [password, setPassword] = useState("");
//   const [rePassword, setRePassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [isValidEmail, setIsValidEmail] = useState(true);
//   const [isValidPassword, setIsValidPassword] = useState(true);
//   const [isPasswordMatched, setIsPasswordMatched] = useState(true);
//   const [isValidUsername, setIsValidUsername] = useState(true);
//   const [fontsLoaded, setFontsLoaded] = useState(false);

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

//   const onChangeEmail = (email) => {
//     setEmailId(email);
//     setIsValidEmail(true);
//   };

//   const onChangePassword = (value) => {
//     setPassword(value);
//     setIsValidPassword(true);
//   };

//   const onChangeRePassword = (value) => {
//     setRePassword(value);
//     setIsPasswordMatched(true);
//   };

//   const onChangeUsername = (value) => {
//     setUsername(value);
//     setIsValidUsername(true);
//   };

//   useEffect(() => {
//     const fetchProgress = async () => {
//       const progressData = await getRegistrationProgress("Email");
//       if (progressData) {
//         setEmailId(progressData.emailId || "");
//         setUsername(progressData.username || "");
//       }
//     };

//     fetchProgress();

//     if (fontsLoaded && emailInput.current) {
//       // Delay to ensure the component is rendered
//       setTimeout(() => {
//         emailInput.current.focus();
//       }, 0);
//     }
//   }, [fontsLoaded]);

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePassword = (password, rePassword) => {
//     return password === rePassword && password.length >= 4;
//   };

//   const validateUsername = (username) => {
//     return username.trim().length > 3; // Username must be at least 4 characters
//   };

//   const onPressContinue = async () => {
//     if (
//       validateEmail(emailId) &&
//       validatePassword(password, rePassword) &&
//       validateUsername(username)
//     ) {
//       try {
//         const registrationData = {
//           emailId,
//           password,
//           username,
//         };

//         await saveRegistrationProgress("Email", { emailId });
//         await saveRegistrationProgress("Password", { password });
//         await saveRegistrationProgress("Username", { username });

//         // Navigate to the next screen
//         navigation.navigate("NamePage");
//       } catch (error) {
//         console.error("Error saving registration progress: ", error);
//       }
//     } else {
//       if (!validateEmail(emailId)) {
//         setIsValidEmail(false);
//       }
//       if (!validatePassword(password, rePassword)) {
//         setIsValidPassword(password.length >= 4);
//         setIsPasswordMatched(password === rePassword);
//       }
//       if (!validateUsername(username)) {
//         setIsValidUsername(false);
//       }
//     }
//   };

//   if (!fontsLoaded) {
//     return null; // Render nothing while the splash screen is shown
//   }

//   return (
//     <SafeAreaView style={styles.area}>
//       <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
//         <KeyboardAvoidingView
//           keyboardVerticalOffset={50}
//           behavior={"padding"}
//           style={styles.containerAvoidingView}
//         >
//           <TouchableOpacity>
//             <Text onPress={() => navigation.goBack()} style={styles.backText}>
//               Back
//             </Text>
//           </TouchableOpacity>

//           <Text style={styles.headTitle}>Create Your Account</Text>
//           <Text style={styles.headTag}>
//             Please provide your email, username, and set a secure password.
//           </Text>

//           {/* Username Input */}
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isValidUsername ? "#244DB7" : "red" },
//             ]}
//           >
//             <TextInput
//               ref={usernameInput}
//               style={styles.inputStyle}
//               placeholder="Enter Your Username"
//               keyboardType="default"
//               value={username}
//               autoCapitalize="none"
//               onChangeText={onChangeUsername}
//             />
//           </View>
//           {!isValidUsername && (
//             <Text style={styles.errorText}>
//               Username must be at least 4 characters.
//             </Text>
//           )}

//           {/* Email Input */}
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isValidEmail ? "#244DB7" : "red" },
//             ]}
//           >
//             <TextInput
//               ref={emailInput}
//               style={styles.inputStyle}
//               placeholder="Enter Your Email"
//               keyboardType="email-address"
//               value={emailId}
//               autoCapitalize="none"
//               onChangeText={onChangeEmail}
//             />
//           </View>
//           {!isValidEmail && (
//             <Text style={styles.errorText}>
//               Please enter a valid email address.
//             </Text>
//           )}

//           {/* Password Input */}
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isValidPassword ? "#244DB7" : "red" },
//             ]}
//           >
//             <TextInput
//               ref={passwordInput}
//               style={styles.inputStyle}
//               placeholder="Enter Your Password"
//               secureTextEntry
//               value={password}
//               autoCapitalize="none"
//               onChangeText={onChangePassword}
//             />
//           </View>
//           {!isValidPassword && (
//             <Text style={styles.errorText}>
//               Password must be at least 4 characters.
//             </Text>
//           )}

//           {/* Re-Password Input */}
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isPasswordMatched ? "#244DB7" : "red" },
//             ]}
//           >
//             <TextInput
//               ref={rePasswordInput}
//               style={styles.inputStyle}
//               placeholder="Re-Enter Your Password"
//               secureTextEntry
//               value={rePassword}
//               autoCapitalize="none"
//               onChangeText={onChangeRePassword}
//             />
//           </View>
//           {!isPasswordMatched && (
//             <Text style={styles.errorText}>Passwords do not match.</Text>
//           )}

//           <View style={styles.viewBottom}>
//             <TouchableOpacity onPress={onPressContinue}>
//               <View style={styles.btnContinue}>
//                 <Text style={styles.textContinue}>Continue</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   container: {
//     flex: 1, // Ensure the container takes full height
//     paddingHorizontal: 20,
//   },
//   // container: {
//   //   flex: 1,
//   //   paddingHorizontal: 20,
//   //   paddingVertical: 50,
//   // },
//   containerAvoidingView: {
//     flex: 1,
//   },
//   backText: {
//     color: "#0F3460",
//     fontSize: 16,
//     marginBottom: 20,
//     fontFamily: "CenturyGothicBold",
//   },
//   headTitle: {
//     fontSize: 32,
//     // fontWeight: "800",
//     color: "#333",
//     marginBottom: 10,
//     fontFamily: "CenturyGothicBold",
//   },
//   headTag: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 30,
//     fontFamily: "CenturyGothic",
//   },
//   inputContainer: {
//     borderBottomWidth: 1,
//     marginBottom: 25,
//   },
//   inputStyle: {
//     fontSize: 16,
//     paddingVertical: 10,
//     fontFamily: "CenturyGothic",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//     marginTop: -15,
//     marginBottom: 15,
//   },
//   viewBottom: {
//     marginTop: 30,
//     alignItems: "center",
//   },
//   btnContinue: {
//     backgroundColor: "#0F3460",
//     paddingVertical: 15,
//     paddingHorizontal: 80,
//     borderRadius: 25,
//   },
//   textContinue: {
//     color: "#fff",
//     fontSize: 16,
//     fontFamily: "CenturyGothicBold",
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function SignEmail({ navigation }) {
  const insets = useSafeAreaInsets();

  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const rePasswordInput = useRef(null);
  const usernameInput = useRef(null);

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [username, setUsername] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  const onChangeEmail = (email) => {
    setEmailId(email);
    setIsValidEmail(true);
  };

  const onChangePassword = (value) => {
    setPassword(value);
    setIsValidPassword(true);
  };

  const onChangeRePassword = (value) => {
    setRePassword(value);
    setIsPasswordMatched(true);
  };

  const onChangeUsername = (value) => {
    setUsername(value);
    setIsValidUsername(true);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getRegistrationProgress("Email");
      if (progressData) {
        setEmailId(progressData.emailId || "");
        setUsername(progressData.username || "");
      }
    };

    fetchProgress();

    if (fontsLoaded && emailInput.current) {
      setTimeout(() => {
        emailInput.current.focus();
      }, 0);
    }
  }, [fontsLoaded]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password, rePassword) => {
    return password === rePassword && password.length >= 4;
  };

  const validateUsername = (username) => {
    return username.trim().length > 3;
  };

  const onPressContinue = async () => {
    if (
      validateEmail(emailId) &&
      validatePassword(password, rePassword) &&
      validateUsername(username) &&
      isCheckboxChecked
    ) {
      try {
        const registrationData = {
          emailId,
          password,
          username,
        };

        await saveRegistrationProgress("Email", { emailId });
        await saveRegistrationProgress("Password", { password });
        await saveRegistrationProgress("Username", { username });

        navigation.navigate("NamePage");
      } catch (error) {
        console.error("Error saving registration progress: ", error);
      }
    } else {
      if (!validateEmail(emailId)) {
        setIsValidEmail(false);
      }
      if (!validatePassword(password, rePassword)) {
        setIsValidPassword(password.length >= 4);
        setIsPasswordMatched(password === rePassword);
      }
      if (!validateUsername(username)) {
        setIsValidUsername(false);
      }
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior={"padding"}
          style={styles.containerAvoidingView}
        >
          <TouchableOpacity>
            <Text onPress={() => navigation.goBack()} style={styles.backText}>
              Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>Create Your Account</Text>
          <Text style={styles.headTag}>
            Please provide your email, username, and set a secure password.
          </Text>

          <View
            style={[
              styles.inputContainer,
              { borderColor: isValidUsername ? "#244DB7" : "red" },
            ]}
          >
            <TextInput
              ref={usernameInput}
              style={styles.inputStyle}
              placeholder="Enter Your Username"
              keyboardType="default"
              value={username}
              autoCapitalize="none"
              onChangeText={onChangeUsername}
            />
          </View>
          {!isValidUsername && (
            <Text style={styles.errorText}>
              Username must be at least 4 characters.
            </Text>
          )}

          <View
            style={[
              styles.inputContainer,
              { borderColor: isValidEmail ? "#244DB7" : "red" },
            ]}
          >
            <TextInput
              ref={emailInput}
              style={styles.inputStyle}
              placeholder="Enter Your Email"
              keyboardType="email-address"
              value={emailId}
              autoCapitalize="none"
              onChangeText={onChangeEmail}
            />
          </View>
          {!isValidEmail && (
            <Text style={styles.errorText}>
              Please enter a valid email address.
            </Text>
          )}

          <View
            style={[
              styles.inputContainer,
              { borderColor: isValidPassword ? "#244DB7" : "red" },
            ]}
          >
            <TextInput
              ref={passwordInput}
              style={styles.inputStyle}
              placeholder="Enter Your Password"
              secureTextEntry
              value={password}
              autoCapitalize="none"
              onChangeText={onChangePassword}
            />
          </View>
          {!isValidPassword && (
            <Text style={styles.errorText}>
              Password must be at least 4 characters.
            </Text>
          )}

          <View
            style={[
              styles.inputContainer,
              { borderColor: isPasswordMatched ? "#244DB7" : "red" },
            ]}
          >
            <TextInput
              ref={rePasswordInput}
              style={styles.inputStyle}
              placeholder="Re-Enter Your Password"
              secureTextEntry
              value={rePassword}
              autoCapitalize="none"
              onChangeText={onChangeRePassword}
            />
          </View>
          {!isPasswordMatched && (
            <Text style={styles.errorText}>Passwords do not match.</Text>
          )}

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isCheckboxChecked}
              onValueChange={setIsCheckboxChecked}
              color={isCheckboxChecked ? "#814C68" : undefined}
            />
            <Text style={styles.checkboxText}>
              I agree with terms and policy
            </Text>
          </View>

          <View style={styles.viewBottom}>
            <TouchableOpacity
              onPress={onPressContinue}
              disabled={!isCheckboxChecked}
            >
              <View
                style={[
                  styles.btnContinue,
                  {
                    backgroundColor: isCheckboxChecked ? "#814C68" : "#CCC",
                  },
                ]}
              >
                <Text style={styles.textContinue}>Continue</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
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
  backText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "CenturyGothicBold",
  },
  headTitle: {
    fontSize: 32,
    color: "#FFF",
    marginBottom: 10,
    fontFamily: "CenturyGothicBold",
  },
  headTag: {
    fontSize: 14,
    color: "#DDD",
    marginBottom: 30,
    fontFamily: "CenturyGothic",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: "CenturyGothic",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    color: "#FFF",
    fontFamily: "CenturyGothic",
  },
  viewBottom: {
    marginTop: 30,
    alignItems: "center",
  },
  btnContinue: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
  },
  textContinue: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "CenturyGothic",
  },
});
