// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Picker } from "@react-native-picker/picker";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function AgeScreen({ navigation }) {
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");

//   useEffect(() => {
//     getRegistrationProgress("Age").then((progressData) => {
//       if (progressData) {
//         setAge(progressData.age || "");
//         setGender(progressData.gender || "");
//       }
//     });
//   });

//   const onPressContinue = () => {
//     if (age && gender) {
//       if (age.trim() !== "" && gender.trim() !== "") {
//         saveRegistrationProgress("Age", { age, gender });
//       }
//       navigation.navigate("ProfilePicScreen");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.container}>
//           <KeyboardAvoidingView
//             keyboardVerticalOffset={50}
//             behavior="padding"
//             style={styles.containerAvoidingView}
//           >
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.goBack();
//               }}
//             >
//               <Text>Back</Text>
//             </TouchableOpacity>

//             <Text style={styles.headTitle}>What's Your Age?</Text>
//             <Text style={styles.headTag}>
//               We only use Email to make sure everyone on Match Matters is real.
//             </Text>

//             <View style={styles.ageContainer}>
//               <Text style={styles.label}>Age</Text>
//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={styles.inputStyle}
//                   placeholder="Your Age"
//                   keyboardType="numeric"
//                   value={age}
//                   onChangeText={setAge}
//                 />
//               </View>
//             </View>

//             <View style={styles.pickerContainer}>
//               <Text style={styles.label}>Gender</Text>
//               <Picker
//                 selectedValue={gender}
//                 style={styles.pickerStyle}
//                 onValueChange={(itemValue) => setGender(itemValue)}
//               >
//                 <Picker.Item label="Select Gender" value="" />
//                 <Picker.Item label="Male" value="male" />
//                 <Picker.Item label="Female" value="female" />
//               </Picker>
//             </View>

//             <View style={styles.viewBottom}>
//               <TouchableOpacity
//                 onPress={onPressContinue}
//                 disabled={!age || !gender}
//               >
//                 <View
//                   style={[
//                     styles.btnContinue,
//                     (!age || !gender) && styles.btnDisabled,
//                   ]}
//                 >
//                   <Text style={styles.textContinue}>Continue</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </View>
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
//   containerAvoidingView: {
//     marginLeft: 20,
//     flex: 1,
//     // justifyContent: 'space-between',
//     // width: '100%',
//   },
//   headTitle: {
//     fontSize: 40,
//     fontWeight: "800",
//     marginRight: 100,
//   },
//   headTag: {
//     fontSize: 16,
//     marginTop: 50,
//     marginRight: 30,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#BF1013",
//     marginBottom: 5,
//     marginLeft: 5,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     marginRight: 30,
//     marginBottom: 20,
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#BF1013",
//   },
//   ageContainer: {
//     marginTop: 20,
//   },
//   pickerContainer: {
//     marginTop: 5,
//     marginRight: 30,
//     marginBottom: 150,
//     // borderBottomWidth: 1.5,
//     borderBottomColor: "#244DB7",
//   },
//   inputStyle: {
//     flex: 1,
//     height: 50,
//     marginLeft: 5,
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
// // });

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function AgeScreen({ navigation }) {
//   const [birthdate, setBirthdate] = useState(new Date());
//   const [gender, setGender] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [age, setAge] = useState("");

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

//   const onChangeDate = (event, selectedDate) => {
//     if (selectedDate) {
//       const currentDate = selectedDate || birthdate;
//       setBirthdate(currentDate);
//       setAge(calculateAge(currentDate));
//     }
//     setShowDatePicker(false);
//   };

//   const onPressContinue = () => {
//     if (birthdate && gender) {
//       saveRegistrationProgress("Age", { birthdate, gender, age });
//       navigation.navigate("ProfilePicScreen");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Text>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.headTitle}>When's your birthday?</Text>
//         <Text style={styles.headTag}>
//           Building your profile will increase visibility and recommendations.
//         </Text>

//         <View style={styles.ageContainer}>
//           <Text style={styles.label}>Birthdate</Text>
//           <TouchableOpacity
//             style={styles.dateInput}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text style={styles.dateText}>{birthdate.toDateString()}</Text>
//           </TouchableOpacity>

//           {showDatePicker && (
//             <View style={styles.pickerWrapper}>
//               <DateTimePicker
//                 value={birthdate}
//                 mode="date"
//                 display="spinner"
//                 onChange={onChangeDate}
//                 maximumDate={new Date()}
//               />
//             </View>
//           )}
//         </View>

//         <View style={styles.pickerContainer}>
//           <Text style={styles.label}>Gender</Text>
//           <Picker
//             selectedValue={gender}
//             style={styles.pickerStyle}
//             onValueChange={(itemValue) => setGender(itemValue)}
//           >
//             <Picker.Item label="Select Gender" value="" />
//             <Picker.Item label="Male" value="male" />
//             <Picker.Item label="Female" value="female" />
//           </Picker>
//         </View>

//         <View style={styles.viewBottom}>
//           <TouchableOpacity
//             onPress={onPressContinue}
//             disabled={!birthdate || !gender}
//           >
//             <View
//               style={[
//                 styles.btnContinue,
//                 (!birthdate || !gender) && styles.btnDisabled,
//               ]}
//             >
//               <Text style={styles.textContinue}>Continue</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
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
//     alignSelf: "flex-start", // Align the back button to the left
//     padding: 10,
//     marginLeft: 20,
//   },
//   headTitle: {
//     fontSize: 40,
//     fontWeight: "800",
//     // marginRight: 100,
//     alignSelf: "flex-start",
//     marginLeft: 30,
//   },
//   headTag: {
//     fontSize: 16,
//     marginTop: 50,
//     // marginRight: 30,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";

export default function AgeScreen({ navigation }) {
  const [birthdate, setBirthdate] = useState(new Date());
  const [gender, setGender] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState("");

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

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate || birthdate;
      setBirthdate(currentDate);
      setAge(calculateAge(currentDate));
    }
    setShowDatePicker(false);
  };

  const onPressContinue = () => {
    if (birthdate && gender) {
      saveRegistrationProgress("Age", { birthdate, gender, age });
      navigation.navigate("ProfilePicScreen");
    }
  };

  const hideDatePicker = () => {
    if (showDatePicker) {
      setShowDatePicker(false);
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <TouchableWithoutFeedback onPress={hideDatePicker}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>When's your birthday?</Text>
          <Text style={styles.headTag}>
            Building your profile will increase visibility and recommendations.
          </Text>

          <View style={styles.ageContainer}>
            <Text style={styles.label}>Birthdate</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{birthdate.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={birthdate}
                  mode="date"
                  display="spinner"
                  onChange={onChangeDate}
                  maximumDate={new Date()}
                />
              </View>
            )}
          </View>

          <View style={styles.pickerContainer}>
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
              disabled={!birthdate || !gender}
            >
              <View
                style={[
                  styles.btnContinue,
                  (!birthdate || !gender) && styles.btnDisabled,
                ]}
              >
                <Text style={styles.textContinue}>Continue</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    marginTop: 50,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    marginLeft: 20,
  },
  headTitle: {
    fontSize: 40,
    fontWeight: "800",
    alignSelf: "flex-start",
    marginLeft: 30,
  },
  headTag: {
    fontSize: 16,
    marginTop: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#BF1013",
    marginBottom: 5,
    marginLeft: 5,
  },
  ageContainer: {
    marginTop: 20,
    width: "85%",
  },
  dateInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#BF1013",
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  pickerContainer: {
    marginTop: 5,
    marginRight: 30,
    marginBottom: 150,
    borderBottomColor: "#244DB7",
    width: "80%",
  },
  pickerStyle: {
    height: 50,
    width: "100%",
  },
  viewBottom: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
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
  },
  btnDisabled: {
    backgroundColor: "#cccccc",
  },
  pickerWrapper: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 1,
  },
});

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
//   FlatList,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import Autocomplete from "react-native-autocomplete-input";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// const citiesList = [
//   "New York",
//   "Los Angeles",
//   "Chicago",
//   "Houston",
//   "Phoenix",
//   "Philadelphia",
//   "San Antonio",
//   "San Diego",
//   "Dallas",
//   "San Jose",
// ];

// export default function AgeScreen({ navigation }) {
//   const [birthdate, setBirthdate] = useState(new Date());
//   const [gender, setGender] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [age, setAge] = useState("");
//   const [preferredCity, setPreferredCity] = useState("");
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [showCitiesList, setShowCitiesList] = useState(false);

//   useEffect(() => {
//     getRegistrationProgress("Age").then((progressData) => {
//       if (progressData) {
//         const savedBirthdate = progressData.birthdate
//           ? new Date(progressData.birthdate)
//           : new Date();
//         setBirthdate(savedBirthdate);
//         setGender(progressData.gender || "");
//         setAge(calculateAge(savedBirthdate));
//         setPreferredCity(progressData.preferredCity || "");
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

//   const onChangeDate = (event, selectedDate) => {
//     if (selectedDate) {
//       const currentDate = selectedDate || birthdate;
//       setBirthdate(currentDate);
//       setAge(calculateAge(currentDate));
//     }
//     setShowDatePicker(false);
//   };

//   const onPressContinue = () => {
//     if (birthdate && gender && preferredCity) {
//       saveRegistrationProgress("Age", {
//         birthdate,
//         gender,
//         age,
//         preferredCity,
//       });
//       navigation.navigate("ProfilePicScreen");
//     }
//   };

//   const hideDatePicker = () => {
//     if (showDatePicker) {
//       setShowDatePicker(false);
//     }
//   };

//   const findCity = (query) => {
//     if (query) {
//       const filtered = citiesList.filter((city) =>
//         city.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//   };

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
//             <TouchableOpacity
//               style={styles.dateInput}
//               onPress={() => setShowDatePicker(true)}
//             >
//               <Text style={styles.dateText}>{birthdate.toDateString()}</Text>
//             </TouchableOpacity>

//             {showDatePicker && (
//               <View style={styles.pickerWrapper}>
//                 <DateTimePicker
//                   value={birthdate}
//                   mode="date"
//                   display="spinner"
//                   onChange={onChangeDate}
//                   maximumDate={new Date()}
//                 />
//               </View>
//             )}
//           </View>

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

//           <View style={styles.autoCompleteContainer}>
//             <Text style={styles.label}>Preferred City</Text>
//             <Autocomplete
//               data={filteredCities}
//               defaultValue={preferredCity}
//               onChangeText={(text) => {
//                 setPreferredCity(text);
//                 findCity(text);
//               }}
//               flatListProps={{
//                 keyExtractor: (item) => item,
//                 renderItem: ({ item }) => (
//                   <TouchableOpacity
//                     onPress={() => {
//                       setPreferredCity(item);
//                       setFilteredCities([]);
//                     }}
//                   >
//                     <Text style={styles.itemText}>{item}</Text>
//                   </TouchableOpacity>
//                 ),
//               }}
//             />
//           </View>

//           <View style={styles.viewBottom}>
//             <TouchableOpacity
//               onPress={onPressContinue}
//               disabled={!birthdate || !gender || !preferredCity}
//             >
//               <View
//                 style={[
//                   styles.btnContinue,
//                   (!birthdate || !gender || !preferredCity) &&
//                     styles.btnDisabled,
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
//     marginBottom: 20,
//     borderBottomColor: "#244DB7",
//     width: "80%",
//   },
//   pickerStyle: {
//     height: 50,
//     width: "100%",
//   },
//   autoCompleteContainer: {
//     width: "85%",
//     marginTop: 120,
//   },
//   itemText: {
//     fontSize: 16,
//     padding: 10,
//   },
//   viewBottom: {
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 30,
//     marginTop: 40,
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
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     zIndex: 999,
//   },
// });

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
//   ScrollView,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import Autocomplete from "react-native-autocomplete-input";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// const citiesList = [
//   "New York",
//   "Los Angeles",
//   "Chicago",
//   "Houston",
//   "Phoenix",
//   "Philadelphia",
//   "San Antonio",
//   "San Diego",
//   "Dallas",
//   "San Jose",
// ];

// export default function AgeScreen({ navigation }) {
//   const [birthdate, setBirthdate] = useState(new Date());
//   const [gender, setGender] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [age, setAge] = useState("");
//   const [preferredCity, setPreferredCity] = useState("");
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [showCitiesList, setShowCitiesList] = useState(false);

//   useEffect(() => {
//     getRegistrationProgress("Age").then((progressData) => {
//       if (progressData) {
//         const savedBirthdate = progressData.birthdate
//           ? new Date(progressData.birthdate)
//           : new Date();
//         setBirthdate(savedBirthdate);
//         setGender(progressData.gender || "");
//         setAge(calculateAge(savedBirthdate));
//         setPreferredCity(progressData.preferredCity || "");
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

//   const onChangeDate = (event, selectedDate) => {
//     if (selectedDate) {
//       const currentDate = selectedDate || birthdate;
//       setBirthdate(currentDate);
//       setAge(calculateAge(currentDate));
//     }
//     setShowDatePicker(false);
//   };

//   const onPressContinue = () => {
//     if (birthdate && gender && preferredCity) {
//       saveRegistrationProgress("Age", {
//         birthdate,
//         gender,
//         age,
//         preferredCity,
//       });
//       navigation.navigate("ProfilePicScreen");
//     }
//   };

//   const hideDatePicker = () => {
//     if (showDatePicker) {
//       setShowDatePicker(false);
//     }
//   };

//   const findCity = (query) => {
//     if (query) {
//       const filtered = citiesList.filter((city) =>
//         city.toLowerCase().includes(query.toLowerCase())
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={hideDatePicker}>
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//           <ScrollView contentContainerStyle={styles.scrollViewContent}>
//             <TouchableOpacity
//               onPress={() => navigation.goBack()}
//               style={styles.backButton}
//             >
//               <Text>Back</Text>
//             </TouchableOpacity>

//             <Text style={styles.headTitle}>When's your birthday?</Text>
//             <Text style={styles.headTag}>
//               Building your profile will increase visibility and
//               recommendations.
//             </Text>

//             <View style={styles.ageContainer}>
//               <Text style={styles.label}>Birthdate</Text>
//               <TouchableOpacity
//                 style={styles.dateInput}
//                 onPress={() => setShowDatePicker(true)}
//               >
//                 <Text style={styles.dateText}>{birthdate.toDateString()}</Text>
//               </TouchableOpacity>

//               {showDatePicker && (
//                 <View style={styles.pickerWrapper}>
//                   <DateTimePicker
//                     value={birthdate}
//                     mode="date"
//                     display="spinner"
//                     onChange={onChangeDate}
//                     maximumDate={new Date()}
//                   />
//                 </View>
//               )}
//             </View>

//             <View style={styles.pickerContainer}>
//               <Text style={styles.label}>Gender</Text>
//               <Picker
//                 selectedValue={gender}
//                 style={styles.pickerStyle}
//                 onValueChange={(itemValue) => setGender(itemValue)}
//               >
//                 <Picker.Item label="Select Gender" value="" />
//                 <Picker.Item label="Male" value="male" />
//                 <Picker.Item label="Female" value="female" />
//               </Picker>
//             </View>

//             <View style={styles.autoCompleteContainer}>
//               <Text style={styles.label}>Preferred City</Text>
//               <Autocomplete
//                 data={filteredCities}
//                 defaultValue={preferredCity}
//                 onChangeText={(text) => {
//                   setPreferredCity(text);
//                   findCity(text);
//                 }}
//                 flatListProps={{
//                   keyExtractor: (item) => item,
//                   renderItem: ({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => {
//                         setPreferredCity(item);
//                         setFilteredCities([]);
//                       }}
//                     >
//                       <Text style={styles.itemText}>{item}</Text>
//                     </TouchableOpacity>
//                   ),
//                 }}
//               />
//             </View>

//             <View style={styles.viewBottom}>
//               <TouchableOpacity
//                 onPress={onPressContinue}
//                 disabled={!birthdate || !gender || !preferredCity}
//               >
//                 <View
//                   style={[
//                     styles.btnContinue,
//                     (!birthdate || !gender || !preferredCity) &&
//                       styles.btnDisabled,
//                   ]}
//                 >
//                   <Text style={styles.textContinue}>Continue</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
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
//   },
//   scrollViewContent: {
//     flexGrow: 1,
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
//     marginBottom: 20,
//     borderBottomColor: "#244DB7",
//     width: "80%",
//   },
//   pickerStyle: {
//     height: 50,
//     width: "100%",
//   },
//   autoCompleteContainer: {
//     width: "85%",
//     marginTop: 120,
//   },
//   itemText: {
//     fontSize: 16,
//     padding: 10,
//   },
//   viewBottom: {
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 30,
//     marginTop: 60,
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
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     zIndex: 999,
//   },
// });
