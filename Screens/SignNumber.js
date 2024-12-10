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
// import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function SignNumber({ navigation }) {
//   let textInput = useRef(null);

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [focusInput, setFocusInput] = useState(true);
//   const [selected, setSelected] = useState("+91");
//   const [country, setCountry] = useState("");
//   const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

//   const onChangePhone = (number) => {
//     setPhoneNumber(number);
//     setIsValidPhoneNumber(true);
//   };

//   useEffect(() => {
//     getRegistrationProgress("PhoneNum").then((progressData) => {
//       if (progressData) {
//         // Set only the phone number (last 10 digits) in the input field
//         // setPhoneNumber(progressData.phoneNumber.slice(-10));
//         setPhoneNumber(progressData.phoneNumber);
//       }
//     });
//   }, []);

//   const onPressContinue = async () => {
//     const fullPhoneNumber = `${selected}${phoneNumber}`;

//     if (validatePhoneNumber(phoneNumber)) {
//       if (phoneNumber.trim() !== "" && phoneNumber.length === 10) {
//         try {
//           // Save the full phone number with country code in AsyncStorage
//           await saveRegistrationProgress("PhoneNum", {
//             phoneNumber: phoneNumber,
//           });
//           await saveRegistrationProgress("CountryCode", {
//             countryCode: selected, // Save the country code separately
//           });
//           navigation.navigate("SignEmail");
//         } catch (error) {
//           console.error("Error saving registration progress: ", error);
//         }
//       }
//     } else {
//       setIsValidPhoneNumber(false);
//     }
//   };

//   const validatePhoneNumber = (phone) => {
//     const phoneRegex = /^[0-9]{10}$/;
//     return phoneRegex.test(phone);
//   };

//   const onChangeFocus = () => {
//     setFocusInput(true);
//   };

//   const onChangeBlur = () => {
//     setFocusInput(false);
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

//           <Text style={styles.headTitle}>Can we get your number?</Text>
//           <Text style={styles.headTag}>
//             We only use phone number to make sure everyone on Match Matters is
//             real.
//           </Text>

//           <View
//             style={[styles.inputContainer, { borderBottomColor: "#244DB7" }]}
//           >
//             <CountryCodeDropdownPicker
//               selected={selected}
//               setSelected={setSelected}
//               setCountryDetails={setCountry}
//               phone={phoneNumber}
//               setPhone={onChangePhone}
//               countryCodeTextStyles={{ fontSize: 13 }}
//               countryCodeContainerStyles={[styles.countryCode]}
//               style={styles.countryPickerStyle}
//               searchStyles={[styles.search]}
//               dropdownStyles={[styles.dropdown]}
//             />
//           </View>

//           {!isValidPhoneNumber && (
//             <Text style={styles.errorText}>
//               Please enter a valid 10-digit phone number.
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
//     padding: 5,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1.5,
//     borderColor: "#C0C0C0",
//     borderWidth: 1,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   countryPickerStyle: {
//     flex: 1,
//   },
//   countryCode: {
//     height: 40,
//   },
//   search: {
//     height: 40,
//   },
//   dropdown: {
//     height: 178,
//   },
//   phoneInputStyle: {
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
//   errorText: {
//     color: "red",
//     marginTop: 10,
//   },
//   button: {
//     marginTop: 100,
//     marginHorizontal: 10,
//   },
//   text: {
//     fontSize: 16,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import {
  saveRegistrationProgress,
  getRegistrationProgress,
} from "../backend/registrationUtils";
import { isValidPhoneNumber } from "libphonenumber-js"; // Import from libphonenumber-js

export default function SignNumber({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selected, setSelected] = useState("+91"); // Default to India (+91)
  const [isValidPhone, setIsValidPhone] = useState(true);

  const onChangePhone = (number) => {
    setPhoneNumber(number);
    setIsValidPhone(true); // Reset the error message when changing number
  };

  useEffect(() => {
    getRegistrationProgress("PhoneNum").then((progressData) => {
      if (progressData) {
        setPhoneNumber(progressData.phoneNumber);
      }
    });
  }, []);

  const onPressContinue = async () => {
    const fullPhoneNumber = `${selected}${phoneNumber}`;

    // Validate phone number based on country code
    if (validatePhoneNumber(fullPhoneNumber)) {
      try {
        await saveRegistrationProgress("PhoneNum", {
          phoneNumber: phoneNumber, // Store only phone number
        });
        await saveRegistrationProgress("CountryCode", {
          countryCode: selected, // Store country code
        });
        console.log(fullPhoneNumber);
        navigation.navigate("SignEmail");
      } catch (error) {
        console.error("Error saving registration progress: ", error);
      }
    } else {
      setIsValidPhone(false); // Show error if the phone number is invalid
    }
  };

  // Function to validate phone number based on the country code
  const validatePhoneNumber = (fullPhoneNumber) => {
    const countryCode = selected.replace("+", ""); // Remove '+' from the country code for validation
    // Use libphonenumber-js to validate the phone number
    return isValidPhoneNumber(fullPhoneNumber, countryCode);
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
            <Text
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>Can we get your number?</Text>
          <Text style={styles.headTag}>
            We only use phone number to make sure everyone on Match Matters is
            real.
          </Text>

          <View
            style={[styles.inputContainer, { borderBottomColor: "#244DB7" }]}
          >
            <CountryCodeDropdownPicker
              selected={selected}
              setSelected={setSelected}
              phone={phoneNumber}
              setPhone={onChangePhone}
              countryCodeTextStyles={{ fontSize: 13 }}
              countryCodeContainerStyles={[styles.countryCode]}
              style={styles.countryPickerStyle}
              searchStyles={[styles.search]}
              dropdownStyles={[styles.dropdown]}
            />
          </View>

          {!isValidPhone && (
            <Text style={styles.errorText}>
              Please enter a valid phone number for the selected country.
            </Text>
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
    justifyContent: "center",
    padding: 20,
  },
  headTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  headTag: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#888",
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  countryCode: {
    marginRight: 10,
  },
  countryPickerStyle: {
    width: "50%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  btnContinue: {
    backgroundColor: "#244DB7",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  textContinue: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  viewBottom: {
    justifyContent: "center",
    alignItems: "center",
  },
});
