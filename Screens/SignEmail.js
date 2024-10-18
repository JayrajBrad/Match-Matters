// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import Icon from "react-native-vector-icons/FontAwesome";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function SignEmail({ navigation }) {
//   let textInput = useRef(null);

//   const [emailId, setEmailId] = useState("");
//   const [focusInput, setFocusInput] = useState(true);
//   const [isValidEmail, setIsValidEmail] = useState(true);

//   const onChangeEmail = (email) => {
//     setEmailId(email);
//     setIsValidEmail(true);
//   };

//   // useEffect(() => {
//   //   getRegistrationProgress('Email').then(progressData => {
//   //     if(progressData){
//   //       setEmailId(progressData.emailId || '');
//   //     }
//   //   })
//   // });

//   useEffect(() => {
//     const fetchProgress = async () => {
//       const progressData = await getRegistrationProgress("Email");
//       if (progressData) {
//         setEmailId(progressData.emailId || "");
//       }
//     };
//     fetchProgress();
//   }, []);

//   // const onPressContinue = () => {
//   //     if (emailId && validateEmail(emailId)) {
//   //       if(emailId.trim() !== ''){
//   //         saveRegistrationProgress('Email',{emailId});
//   //       }

//   //         navigation.navigate('EmailOTPScreen');
//   //     } else {
//   //         setIsValidEmail(false);
//   //     }
//   // };

//   const onPressContinue = async () => {
//     if (emailId && validateEmail(emailId)) {
//       if (emailId.trim() !== "") {
//         try {
//           await saveRegistrationProgress("Email", { emailId });
//           // Clear the input fields
//           // setEmailId('');
//           // Navigate to the next screen
//           navigation.navigate("SignPassword");
//         } catch (error) {
//           console.error("Error saving registration progress: ", error);
//         }
//       }
//     } else {
//       setIsValidEmail(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const onChangeFocus = () => {
//     setFocusInput(true);
//   };

//   const onChangeBlur = () => {
//     setFocusInput(false);
//   };

//   useEffect(() => {
//     textInput.focus();
//   }, []);

//   // useEffect(() => {
//   //   if (textInput.current) {
//   //       textInput.current.focus();
//   //   }
//   // }, []);

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

//           <Text style={styles.headTitle}>Can we get your Email?</Text>
//           <Text style={styles.headTag}>
//             We only use Email to make sure everyone on Match Matters is real.
//           </Text>
//           <View
//             style={[
//               styles.inputContainer,
//               { borderBottomColor: isValidEmail ? "#244DB7" : "red" },
//             ]}
//           >
//             <View style={styles.openDialogView}></View>
//             <TextInput
//               ref={(input) => (textInput = input)}
//               style={styles.emailInputStyle}
//               placeholder="Enter Your Email Id"
//               keyboardType="email-address"
//               value={emailId}
//               autoCapitalize="none"
//               onChangeText={onChangeEmail}
//               secureTextEntry={false}
//               onFocus={onChangeFocus}
//               onBlur={onChangeBlur}
//             />
//           </View>
//           {!isValidEmail && (
//             <Text style={styles.errorText}>
//               Please enter a valid email address.
//             </Text>
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
//   emailInputStyle: {
//     marginLeft: 5,
//     flex: 1,
//     height: 50,
//   },
//   openDialogView: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
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
//   button: {
//     marginTop: 100,
//     marginHorizontal: 10,
//   },
// });

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
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function SignEmail({ navigation }) {
//   let emailInput = useRef(null);
//   let passwordInput = useRef(null);
//   let rePasswordInput = useRef(null);

//   const [emailId, setEmailId] = useState("");
//   const [password, setPassword] = useState("");
//   const [rePassword, setRePassword] = useState("");
//   const [focusInput, setFocusInput] = useState(true);
//   const [isValidEmail, setIsValidEmail] = useState(true);
//   const [isValidPassword, setIsValidPassword] = useState(true);
//   const [isPasswordMatched, setIsPasswordMatched] = useState(true);

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

//   useEffect(() => {
//     const fetchProgress = async () => {
//       const progressData = await getRegistrationProgress("Email");
//       if (progressData) {
//         setEmailId(progressData.emailId || "");
//       }
//     };
//     fetchProgress();
//     emailInput.current.focus();
//   }, []);

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePassword = (password, rePassword) => {
//     return password === rePassword && password.length >= 6;
//   };

//   const onPressContinue = async () => {
//     if (emailId && validateEmail(emailId)) {
//       if (validatePassword(password, rePassword)) {
//         if (emailId.trim() !== "") {
//           try {
//             await saveRegistrationProgress("Email", { emailId });
//             await saveRegistrationProgress("Password", {
//               password,
//               rePassword,
//             });
//             // Navigate to the next screen
//             navigation.navigate("NamePage");
//           } catch (error) {
//             console.error("Error saving registration progress: ", error);
//           }
//         }
//       } else {
//         setIsValidPassword(password.length >= 6);
//         setIsPasswordMatched(password === rePassword);
//       }
//     } else {
//       setIsValidEmail(false);
//     }
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
//             <Text onPress={() => navigation.goBack()} style={styles.backText}>
//               Back
//             </Text>
//           </TouchableOpacity>

//           <Text style={styles.headTitle}>Create Your Account</Text>
//           <Text style={styles.headTag}>
//             Please provide your email and set a secure password.
//           </Text>

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
//               placeholder="Enter Your Email Id"
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
//               secureTextEntry={true}
//               value={password}
//               onChangeText={onChangePassword}
//             />
//           </View>
//           {!isValidPassword && (
//             <Text style={styles.errorText}>
//               Password must be at least 6 characters long.
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
//               placeholder="Re-enter Your Password"
//               secureTextEntry={true}
//               value={rePassword}
//               onChangeText={onChangeRePassword}
//             />
//           </View>
//           {!isPasswordMatched && (
//             <Text style={styles.errorText}>Passwords do not match.</Text>
//           )}

//           {/* Continue Button */}
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
//     fontSize: 34,
//     fontWeight: "700",
//     marginBottom: 15,
//   },
//   headTag: {
//     fontSize: 16,
//     marginTop: 5,
//     marginBottom: 20,
//     textAlign: "center",
//     paddingHorizontal: 20,
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
//     width: "85%",
//   },
//   inputStyle: {
//     flex: 1,
//     height: 50,
//     paddingHorizontal: 10,
//   },
//   errorText: {
//     color: "red",
//     marginTop: 10,
//     textAlign: "center",
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
//   },
//   backText: {
//     fontSize: 16,
//     color: "#BF1013",
//     marginBottom: 20,
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
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";

export default function SignEmail({ navigation }) {
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
    emailInput.current.focus();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password, rePassword) => {
    return password === rePassword && password.length >= 4;
  };

  const validateUsername = (username) => {
    return username.trim().length > 3; // Username must be at least 4 characters
  };

  const onPressContinue = async () => {
    if (
      validateEmail(emailId) &&
      validatePassword(password, rePassword) &&
      validateUsername(username)
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

        // Navigate to the next screen
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

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
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

          {/* Username Input */}
          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isValidUsername ? "#244DB7" : "red" },
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

          {/* Email Input */}
          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isValidEmail ? "#244DB7" : "red" },
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

          {/* Password Input */}
          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isValidPassword ? "#244DB7" : "red" },
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

          {/* Re-Password Input */}
          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isPasswordMatched ? "#244DB7" : "red" },
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
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  containerAvoidingView: {
    flex: 1,
  },
  backText: {
    color: "#0F3460",
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
  },
  headTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginBottom: 10,
  },
  headTag: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    borderBottomWidth: 1,
    marginBottom: 25,
  },
  inputStyle: {
    fontSize: 16,
    paddingVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
  },
  viewBottom: {
    marginTop: 30,
    alignItems: "center",
  },
  btnContinue: {
    backgroundColor: "#0F3460",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
  },
  textContinue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
