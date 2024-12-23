// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Picker } from "@react-native-picker/picker";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function AgeScreen({ navigation }) {
//   const [birthdate, setBirthdate] = useState(new Date());
//   const [gender, setGender] = useState("");
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [age, setAge] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     getRegistrationProgress("Age").then((progressData) => {
//       if (progressData) {
//         const savedBirthdate = progressData.birthdate
//           ? new Date(progressData.birthdate)
//           : new Date();
//         setBirthdate(savedBirthdate);
//         setGender(progressData.gender || "");
//         setAge(calculateAge(savedBirthdate));
//       }
//     });
//   }, []);

//   const calculateAge = (birthDate) => {
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }
//     return age;
//   };

//   // const handleConfirmDate = (date) => {
//   //   setBirthdate(date);
//   //   setAge(calculateAge(date));
//   //   hideDatePicker(); // Hide DatePicker after selecting date
//   // };

//   const handleConfirmDate = (date) => {
//     setBirthdate(date);
//     const calculatedAge = calculateAge(date);
//     setAge(calculatedAge);

//     // Check if the user is 18 or older
//     if (calculatedAge < 18) {
//       setErrorMessage(
//         "You must be at least 18 years old to create an account."
//       );
//     } else {
//       setErrorMessage(""); // Clear error message if age is valid
//     }

//     hideDatePicker(); // Hide DatePicker after selecting date
//   };

//   const showDatePicker = () => setDatePickerVisibility(true); // Function to show the date picker
//   const hideDatePicker = () => setDatePickerVisibility(false); // Function to hide the date picker

//   const onPressContinue = () => {
//     if (birthdate && gender && age >= 18) {
//       saveRegistrationProgress("Age", { birthdate, gender, age });
//       navigation.navigate("ProfilePicScreen");
//     }
//   };

//   const today = new Date();

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={hideDatePicker}>
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Text>Back</Text>
//           </TouchableOpacity>

//           <Text style={styles.headTitle}>When's your birthday?</Text>
//           <Text style={styles.headTag}>
//             Building your profile will increase visibility and recommendations.
//           </Text>

//           <View style={styles.ageContainer}>
//             <Text style={styles.label}>Birthdate</Text>
//             <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
//               <Text style={styles.dateText}>{birthdate.toDateString()}</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Date Picker Modal */}
//           <DateTimePickerModal
//             isVisible={isDatePickerVisible} // Controlled by visibility state
//             mode="date"
//             onConfirm={handleConfirmDate}
//             onCancel={hideDatePicker}
//             textColor="#000"
//             maximumDate={today}
//           />

//           {errorMessage ? (
//             <Text style={styles.errorMessage}>{errorMessage}</Text>
//           ) : null}

//           <View style={styles.pickerContainer}>
//             <Text style={styles.label}>Gender</Text>
//             <Picker
//               selectedValue={gender}
//               style={styles.pickerStyle}
//               onValueChange={(itemValue) => setGender(itemValue)}
//             >
//               <Picker.Item label="Select Gender" value="" />
//               <Picker.Item label="Male" value="male" />
//               <Picker.Item label="Female" value="female" />
//             </Picker>
//           </View>

//           <View style={styles.viewBottom}>
//             <TouchableOpacity
//               onPress={onPressContinue}
//               disabled={!birthdate || !gender || age < 18} // Disable continue if under 18
//             >
//               <View
//                 style={[
//                   styles.btnContinue,
//                   (!birthdate || !gender || age < 18) && styles.btnDisabled,
//                 ]}
//               >
//                 <Text style={styles.textContinue}>Continue</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </TouchableWithoutFeedback>
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
//     marginTop: 50,
//     alignItems: "center",
//   },
//   backButton: {
//     alignSelf: "flex-start",
//     padding: 10,
//     marginLeft: 20,
//   },
//   headTitle: {
//     fontSize: 40,
//     fontWeight: "800",
//     alignSelf: "flex-start",
//     marginLeft: 30,
//   },
//   headTag: {
//     fontSize: 16,
//     marginTop: 50,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#BF1013",
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   ageContainer: {
//     marginTop: 20,
//     width: "85%",
//   },
//   dateInput: {
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#BF1013",
//     paddingVertical: 10,
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   pickerContainer: {
//     marginTop: 5,
//     marginRight: 30,
//     marginBottom: 150,
//     borderBottomColor: "#244DB7",
//     width: "80%",
//   },
//   pickerStyle: {
//     height: 50,
//     width: "100%",
//   },
//   viewBottom: {
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 30,
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
//   btnDisabled: {
//     backgroundColor: "#cccccc",
//   },
//   pickerWrapper: {
//     // position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     zIndex: 1,
//   },
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function AgeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  if (insets.top === 0) {
    return null; // Optionally render a loading state or placeholder here
  }

  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
    CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
  });

  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [age, setAge] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getRegistrationProgress("Age").then((progressData) => {
      if (progressData) {
        const savedBirthdate = progressData.birthdate
          ? new Date(progressData.birthdate)
          : new Date();
        setBirthdate(savedBirthdate);
        setGender(progressData.gender || "");
        setAge(calculateAge(savedBirthdate));
      }
    });
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleConfirmDate = (date) => {
    setBirthdate(date);
    const calculatedAge = calculateAge(date);
    setAge(calculatedAge);

    if (calculatedAge < 18) {
      setErrorMessage(
        "You must be at least 18 years old to create an account."
      );
    } else {
      setErrorMessage("");
    }

    hideDatePicker();
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const onPressContinue = () => {
    if (birthdate && gender && age >= 18) {
      saveRegistrationProgress("Age", { birthdate, gender, age });
      navigation.navigate("ProfilePicScreen");
    }
  };

  const today = new Date();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.area}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingTop: insets.top + 20 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headTitle}>When's your birthday?</Text>
        <Text style={styles.headTag}>
          Building your profile will increase visibility and recommendations.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthdate</Text>
          <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
            <Text style={styles.dateText}>{birthdate.toDateString()}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          textColor="#000"
          maximumDate={today}
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <Picker
            selectedValue={gender}
            style={styles.pickerStyle}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>

        <View style={styles.viewBottom}>
          <TouchableOpacity
            onPress={onPressContinue}
            disabled={!birthdate || !gender || age < 18}
          >
            <View
              style={[
                styles.btnContinue,
                (!birthdate || !gender || age < 18) && styles.btnDisabled,
              ]}
            >
              <Text style={styles.textContinue}>Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1, // Ensure the container takes full height
    paddingHorizontal: 20,
  },
  // container: {
  //   flex: 1,
  //   paddingHorizontal: 20,
  //   paddingVertical: 50,
  // },
  backText: {
    color: "#0F3460",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "CenturyGothicBold",
  },
  headTitle: {
    fontSize: 32,
    color: "#0F3460",
    marginBottom: 10,
    fontFamily: "CenturyGothicBold",
  },
  headTag: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    fontFamily: "CenturyGothic",
  },
  inputContainer: {
    marginBottom: 50,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F3460",
    marginBottom: 5,
    fontFamily: "CenturyGothicBold",
  },
  dateInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#244DB7",
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "CenturyGothic",
  },
  pickerStyle: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#244DB7",
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 25,
    fontFamily: "CenturyGothic",
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
    fontFamily: "CenturyGothic",
  },
  btnDisabled: {
    backgroundColor: "#cccccc",
  },
});


