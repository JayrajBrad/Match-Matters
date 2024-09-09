// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/FontAwesome";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function SignPassword({ navigation }) {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isPasswordValid, setIsPasswordValid] = useState(true);
//   const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

//   const onChangePassword = (text) => {
//     setPassword(text);
//     setIsPasswordValid(true); // Reset error message on change
//   };

//   const onChangeConfirmPassword = (text) => {
//     setConfirmPassword(text);
//     setIsConfirmPasswordValid(true); // Reset error message on change
//   };

//   const onPressContinue = async () => {
//     if (validatePassword(password) && confirmPassword === password) {
//       try {
//         // Save the password in AsyncStorage
//         await saveRegistrationProgress("Password", { password });

//         // Navigate to the next screen or complete registration
//         navigation.navigate("NextScreen"); // Change to the next screen in the flow
//       } catch (error) {
//         console.error("Error saving password: ", error);
//       }
//     } else {
//       // Set error states
//       setIsPasswordValid(validatePassword(password));
//       setIsConfirmPasswordValid(confirmPassword === password);
//     }
//   };

//   const validatePassword = (password) => {
//     // Define password requirements, e.g., at least 6 characters
//     return password.length >= 6;
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <View style={styles.container}>
//         <KeyboardAvoidingView
//           keyboardVerticalOffset={50}
//           behavior={"padding"}
//           style={styles.containerAvoidingView}
//         >
//           <TouchableOpacity>
//             <Text
//               onPress={() => {
//                 navigation.goBack();
//               }}
//             >
//               Back
//             </Text>
//           </TouchableOpacity>

//           <Text style={styles.headTitle}>Set Your Password</Text>
//           <Text style={styles.headTag}>
//             Your password will be used for logging into your account.
//           </Text>

//           {/* Password Input */}
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isPasswordValid ? "#244DB7" : "red" },
//             ]}
//           >
//             <TextInput
//               style={styles.passwordInputStyle}
//               placeholder="Enter Password"
//               secureTextEntry={true}
//               value={password}
//               onChangeText={onChangePassword}
//             />
//           </View>
//           {!isPasswordValid && (
//             <Text style={styles.errorText}>
//               Password must be at least 6 characters long.
//             </Text>
//           )}

//           {/* Confirm Password Input */}
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isConfirmPasswordValid ? "#244DB7" : "red" },
//             ]}
//           >
//             <TextInput
//               style={styles.passwordInputStyle}
//               placeholder="Confirm Password"
//               secureTextEntry={true}
//               value={confirmPassword}
//               onChangeText={onChangeConfirmPassword}
//             />
//           </View>
//           {!isConfirmPasswordValid && (
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
//     flex: 1,
//     backgroundColor: "#fff",
//     marginTop: 100,
//     alignItems: "center",
//   },
//   containerAvoidingView: {
//     marginLeft: 30,
//   },
//   headTitle: {
//     fontSize: 40,
//     fontWeight: "800",
//     marginRight: 100,
//   },
//   headTag: {
//     fontSize: 16,
//     marginTop: 5,
//     marginRight: 30,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     marginRight: 30,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1.5,
//     borderColor: "#C0C0C0",
//     borderWidth: 1,
//     marginTop: 20,
//   },
//   passwordInputStyle: {
//     marginLeft: 5,
//     flex: 1,
//     height: 50,
//   },
//   viewBottom: {
//     flex: 1,
//     justifyContent: "flex-end",
//     marginBottom: 115,
//     alignItems: "center",
//   },
//   btnContinue: {
//     width: 250,
//     height: 50,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#BF1013",
//   },
//   textContinue: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#ffffff",
//     alignItems: "center",
//   },
//   errorText: { color: "red", marginTop: 10 },
// });

/////////////////////////////
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";

export default function SignPassword({ navigation }) {
  let passwordInput = useRef(null);
  let rePasswordInput = useRef(null);

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);

  // Fetch saved progress for password
  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getRegistrationProgress("Password");
      if (progressData) {
        setPassword(progressData.password || "");
        setRePassword(progressData.rePassword || "");
      }
    };
    fetchProgress();
  }, []);

  const onChangePassword = (value) => {
    setPassword(value);
    setIsValidPassword(true);
  };

  const onChangeRePassword = (value) => {
    setRePassword(value);
    setIsPasswordMatched(true);
  };

  const validatePassword = (password, rePassword) => {
    return password === rePassword && password.length >= 4;
  };

  const onPressContinue = async () => {
    if (validatePassword(password, rePassword)) {
      // Save password to AsyncStorage (or wherever you're saving registration progress)
      try {
        await saveRegistrationProgress("Password", { password, rePassword });
        navigation.navigate("NamePage"); // Replace with your next screen
      } catch (error) {
        console.error("Error saving password progress: ", error);
      }
    } else {
      setIsValidPassword(password.length >= 4);
      setIsPasswordMatched(password === rePassword);
    }
  };

  useEffect(() => {
    if (passwordInput.current) {
      passwordInput.current.focus();
    }
  }, []);

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior={"padding"}
          style={styles.containerAvoidingView}
        >
          <TouchableOpacity>
            <Text
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>Set Your Password</Text>
          <Text style={styles.headTag}>Please create a secure password.</Text>

          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isValidPassword ? "#244DB7" : "red" },
            ]}
          >
            <TextInput
              ref={(input) => (passwordInput = input)}
              style={styles.inputStyle}
              placeholder="Enter Your Password"
              secureTextEntry={true}
              value={password}
              onChangeText={onChangePassword}
            />
          </View>
          {!isValidPassword && (
            <Text style={styles.errorText}>
              Password must be at least 6 characters long.
            </Text>
          )}

          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isPasswordMatched ? "#244DB7" : "red" },
            ]}
          >
            <TextInput
              ref={(input) => (rePasswordInput = input)}
              style={styles.inputStyle}
              placeholder="Re-enter Your Password"
              secureTextEntry={true}
              value={rePassword}
              onChangeText={onChangeRePassword}
            />
          </View>
          {!isPasswordMatched && (
            <Text style={styles.errorText}>Passwords do not match.</Text>
          )}

          <View style={styles.viewBottom}>
            <TouchableOpacity onPress={onPressContinue}>
              <View style={styles.btnContinue}>
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 100,
    alignItems: "center",
  },
  containerAvoidingView: {
    marginLeft: 30,
  },
  headTitle: {
    fontSize: 40,
    fontWeight: "800",
    marginRight: 100,
  },
  headTag: {
    fontSize: 16,
    marginTop: 5,
    marginRight: 30,
  },
  inputContainer: {
    flexDirection: "row",
    marginRight: 30,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1.5,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    marginTop: 20,
  },
  inputStyle: {
    marginLeft: 5,
    flex: 1,
    height: 50,
  },
  errorText: { color: "red", marginTop: 10 },
  viewBottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 115,
    alignItems: "center",
  },
  btnContinue: {
    width: 250,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF1013",
  },
  textContinue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    alignItems: "center",
  },
});
