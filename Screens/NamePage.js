// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function NamePage({ navigation }) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");

//   // useEffect(() => {
//   //     getRegistrationProgress('Name').then(progressData => {
//   //       if(progressData){
//   //         setFirstName(progressData.firstName || '');
//   //         setLastName(progressData.lastName || '' );
//   //       }
//   //     })
//   //   });

//   // Use an empty dependency array to ensure this effect runs only once.
//   useEffect(() => {
//     const fetchProgress = async () => {
//       const progressData = await getRegistrationProgress("Name");
//       if (progressData) {
//         setFirstName(progressData.firstName || "");
//         setLastName(progressData.lastName || "");
//       }
//     };
//     fetchProgress();
//   }, []);

//   // const onPressContinue = () => {
//   //     if (firstName && lastName) {
//   //         if(firstName.trim() !== '' && lastName.trim() !== ''){
//   //             saveRegistrationProgress('Name', {firstName,lastName})
//   //         }
//   //         navigation.navigate('AgeScreen');
//   //     }
//   // };

//   const onPressContinue = async () => {
//     if (firstName && lastName) {
//       if (firstName.trim() !== "" && lastName.trim() !== "") {
//         try {
//           await saveRegistrationProgress("Name", { firstName, lastName });
//           // Clear the input fields
//           // setFirstName('');
//           // setLastName('');
//           // Navigate to the next screen
//           navigation.navigate("AgeScreen");
//         } catch (error) {
//           console.error("Error saving registration progress: ", error);
//         }
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView contentContainerStyle={styles.container}>
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

//             <Text style={styles.headTitle}>Hey X, What's Your Name?</Text>
//             <Text style={styles.headTag}>
//               We only use Email to make sure everyone on Match Matters is real.
//             </Text>

//             <View
//               style={[styles.inputContainer, { borderBottomColor: "#244DB7" }]}
//             >
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your First Name"
//                 keyboardType="default"
//                 value={firstName}
//                 onChangeText={setFirstName}
//               />
//             </View>

//             <View
//               style={[styles.inputContainer, { borderBottomColor: "#244DB7" }]}
//             >
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your Last Name"
//                 keyboardType="default"
//                 value={lastName}
//                 onChangeText={setLastName}
//               />
//             </View>

//             <View style={styles.viewBottom}>
//               <TouchableOpacity
//                 onPress={onPressContinue}
//                 disabled={!firstName || !lastName}
//               >
//                 <View
//                   style={[
//                     styles.btnContinue,
//                     (!firstName || !lastName) && styles.btnDisabled,
//                   ]}
//                 >
//                   <Text style={styles.textContinue}>Continue</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </ScrollView>
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
//     marginLeft: 30,
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
//   inputContainer: {
//     flexDirection: "row",
//     marginRight: 30,
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   inputStyle: {
//     marginLeft: 5,
//     flex: 1,
//     height: 50,
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#BF1013",
//   },
//   openDialogView: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   viewBottom: {
//     flex: 1,
//     justifyContent: "flex-end",
//     marginBottom: 90,
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
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
// } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import axios from "axios";
// import { BASE_URL, API_KEY } from "@env";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function NamePage({ navigation }) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [countryData, setCountryData] = useState([]);
//   const [stateData, setStateData] = useState([]);
//   const [cityData, setCityData] = useState([]);
//   const [country, setCountry] = useState(null);
//   const [state, setState] = useState(null);
//   const [city, setCity] = useState(null);
//   const [countryName, setCountryName] = useState(null);
//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   // Fetch country data on component load
//   useEffect(() => {
//     const fetchCountryData = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/countries`, {
//           headers: { "X-CSCAPI-KEY": API_KEY },
//         });
//         const countries = response.data.map((country) => ({
//           value: country.iso2,
//           label: country.name,
//         }));
//         setCountryData(countries);
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//       }
//     };
//     fetchCountryData();
//   }, []);

//   // Handle state fetching
//   const handleState = async (countryCode) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/countries/${countryCode}/states`,
//         { headers: { "X-CSCAPI-KEY": API_KEY } }
//       );
//       const states = response.data.map((state) => ({
//         value: state.iso2,
//         label: state.name,
//       }));
//       setStateData(states);
//     } catch (error) {
//       console.error("Error fetching states:", error);
//     }
//   };

//   // Handle city fetching
//   const handleCity = async (countryCode, stateCode) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
//         { headers: { "X-CSCAPI-KEY": API_KEY } }
//       );
//       const cities = response.data.map((city) => ({
//         value: city.id,
//         label: city.name,
//       }));
//       setCityData(cities);
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//     }
//   };

//   const onPressContinue = async () => {
//     if (firstName && lastName && countryName && stateName && cityName) {
//       if (
//         firstName.trim() !== "" &&
//         lastName.trim() !== "" &&
//         countryName &&
//         stateName &&
//         cityName
//       ) {
//         try {
//           await saveRegistrationProgress("Name", { firstName, lastName });
//           navigation.navigate("AgeScreen");
//         } catch (error) {
//           console.error("Error saving registration progress:", error);
//         }
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView contentContainerStyle={styles.container}>
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

//             <Text style={styles.headTitle}>Hey X, What's Your Name?</Text>
//             <Text style={styles.headTag}>
//               We only use Email to make sure everyone on Match Matters is real.
//             </Text>

//             <View
//               style={[styles.inputContainer, { borderBottomColor: "#244DB7" }]}
//             >
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your First Name"
//                 keyboardType="default"
//                 value={firstName}
//                 onChangeText={setFirstName}
//               />
//             </View>

//             <View
//               style={[styles.inputContainer, { borderBottomColor: "#244DB7" }]}
//             >
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your Last Name"
//                 keyboardType="default"
//                 value={lastName}
//                 onChangeText={setLastName}
//               />
//             </View>

//             {/* Country, State, and City Dropdowns */}
//             <Dropdown
//               style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               data={countryData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder={!isFocus ? "Select country" : "..."}
//               searchPlaceholder="Search..."
//               value={country}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCountry(item.value);
//                 handleState(item.value);
//                 setCountryName(item.label);
//                 setIsFocus(false);
//               }}
//             />

//             <Dropdown
//               style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               data={stateData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder={!isFocus ? "Select state" : "..."}
//               searchPlaceholder="Search..."
//               value={state}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setState(item.value);
//                 handleCity(country, item.value);
//                 setStateName(item.label);
//                 setIsFocus(false);
//               }}
//             />

//             <Dropdown
//               style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               data={cityData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder={!isFocus ? "Select city" : "..."}
//               searchPlaceholder="Search..."
//               value={city}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCity(item.value);
//                 setCityName(item.label);
//                 setIsFocus(false);
//               }}
//             />

//             <View style={styles.viewBottom}>
//               <TouchableOpacity
//                 onPress={onPressContinue}
//                 disabled={
//                   !firstName || !lastName || !country || !state || !city
//                 }
//               >
//                 <View
//                   style={[
//                     styles.btnContinue,
//                     (!firstName || !lastName || !country || !state || !city) &&
//                       styles.btnDisabled,
//                   ]}
//                 >
//                   <Text style={styles.textContinue}>Continue</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // previous styles remain unchanged...
//   dropdown: {
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     marginBottom: 10,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   viewBottom: {
//     flex: 1,
//     justifyContent: "flex-end",
//     marginBottom: 90,
//     alignItems: "center",
//   },
//   btnContinue: {
//     width: 250,
//     height: 50,
//     backgroundColor: "#0F3460",
//     borderRadius: 25,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btnDisabled: {
//     backgroundColor: "gray",
//   },
//   textContinue: {
//     color: "#fff",
//     fontWeight: "600",
//     textTransform: "uppercase",
//   },
// });

/////////////country-state-city/////////////

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
// } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import { Country, State, City } from "country-state-city";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function NamePage({ navigation }) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [countryData, setCountryData] = useState([]);
//   const [stateData, setStateData] = useState([]);
//   const [cityData, setCityData] = useState([]);
//   const [country, setCountry] = useState(null);
//   const [state, setState] = useState(null);
//   const [city, setCity] = useState(null);
//   const [countryName, setCountryName] = useState(null);
//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   useEffect(() => {
//     const fetchProgress = async () => {
//       const progressData = await getRegistrationProgress("Name");
//       if (progressData) {
//         setFirstName(progressData.firstName || "");
//         setLastName(progressData.lastName || "");
//       }
//     };
//     fetchProgress();

//     // Fetch countries for dropdown
//     const countryArray = Country.getAllCountries().map((country) => ({
//       value: country.isoCode,
//       label: country.name,
//     }));
//     setCountryData(countryArray);
//   }, []);

//   const handleState = (countryCode) => {
//     const states = State.getStatesOfCountry(countryCode).map((state) => ({
//       value: state.isoCode,
//       label: state.name,
//     }));
//     setStateData(states);
//     setState(null); // Reset state and city when a new country is selected
//     setCity(null);
//     setCityData([]);
//   };

//   const handleCity = (countryCode, stateCode) => {
//     const cities = City.getCitiesOfState(countryCode, stateCode).map(
//       (city) => ({
//         value: city.name,
//         label: city.name,
//       })
//     );
//     setCityData(cities);
//     setCity(null); // Reset city when a new state is selected
//   };

//   const onPressContinue = async () => {
//     if (firstName && lastName && country && state && city) {
//       try {
//         await saveRegistrationProgress("Name", { firstName, lastName });
//         navigation.navigate("AgeScreen");
//       } catch (error) {
//         console.error("Error saving registration progress: ", error);
//       }
//     } else {
//       Alert.alert("Please complete all fields.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
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
//               <Text style={styles.backButton}>Back</Text>
//             </TouchableOpacity>

//             <Text style={styles.headTitle}>Hey X, What's Your Name?</Text>
//             <Text style={styles.headTag}>
//               We only use Email to make sure everyone on Match Matters is real.
//             </Text>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your First Name"
//                 keyboardType="default"
//                 value={firstName}
//                 onChangeText={setFirstName}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your Last Name"
//                 keyboardType="default"
//                 value={lastName}
//                 onChangeText={setLastName}
//               />
//             </View>

//             {/* Country Dropdown */}
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={countryData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select Country"
//               searchPlaceholder="Search..."
//               value={country}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCountry(item.value);
//                 setCountryName(item.label);
//                 handleState(item.value);
//               }}
//             />

//             {/* State Dropdown */}
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={stateData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select State"
//               searchPlaceholder="Search..."
//               value={state}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setState(item.value);
//                 setStateName(item.label);
//                 handleCity(country, item.value);
//               }}
//             />

//             {/* City Dropdown */}
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={cityData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select City"
//               searchPlaceholder="Search..."
//               value={city}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCity(item.value);
//                 setCityName(item.label);
//               }}
//             />

//             <View style={styles.viewBottom}>
//               <TouchableOpacity onPress={onPressContinue}>
//                 <View style={styles.btnContinue}>
//                   <Text style={styles.textContinue}>Continue</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingBottom: 20,
//     paddingHorizontal: 40,
//   },
//   containerAvoidingView: {
//     flex: 1,
//   },
//   backButton: {
//     color: "#0F3460",
//     fontSize: 16,
//     marginBottom: 20,
//     fontWeight: "bold",
//   },
//   headTitle: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#333",
//     marginBottom: 10,
//   },
//   headTag: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 30,
//   },
//   inputContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#d3d3d3",
//     marginBottom: 25,
//   },
//   inputStyle: {
//     fontSize: 16,
//     padding: 10,
//   },
//   dropdown: {
//     height: 50,
//     backgroundColor: "#F0F0F0",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: "#666",
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: "#333",
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
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
//     fontWeight: "bold",
//     textTransform: "uppercase",
//   },
// });

//////////best code//////////////////
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TextInput,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
// } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import { Country, State, City } from "country-state-city";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function NamePage({ navigation }) {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [countryData, setCountryData] = useState([]);
//   const [stateData, setStateData] = useState([]);
//   const [cityData, setCityData] = useState([]);
//   const [country, setCountry] = useState(null);
//   const [state, setState] = useState(null);
//   const [city, setCity] = useState(null);
//   const [countryName, setCountryName] = useState(null);
//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   useEffect(() => {
//     const fetchProgress = async () => {
//       const progressData = await getRegistrationProgress("Name");
//       if (progressData) {
//         setFirstName(progressData.firstName || "");
//         setLastName(progressData.lastName || "");
//         setCountryName(progressData.countryName || null);
//         setStateName(progressData.stateName || null);
//         setCityName(progressData.cityName || null);
//       }
//     };

//     const loadCountries = () => {
//       const countryArray = Country.getAllCountries().map((country) => ({
//         value: country.isoCode,
//         label: country.name,
//       }));
//       setCountryData(countryArray);
//     };

//     fetchProgress();
//     loadCountries();
//   }, []);

//   const handleState = useCallback((countryCode) => {
//     const states = State.getStatesOfCountry(countryCode).map((state) => ({
//       value: state.isoCode,
//       label: state.name,
//     }));
//     setStateData(states);
//     setState(null);
//     setCity(null);
//     setCityData([]);
//   }, []);

//   const handleCity = useCallback((countryCode, stateCode) => {
//     const cities = City.getCitiesOfState(countryCode, stateCode).map(
//       (city) => ({
//         value: city.name,
//         label: city.name,
//       })
//     );
//     setCityData(cities);
//     setCity(null);
//   }, []);

//   const onPressContinue = async () => {
//     if (firstName && lastName && country && state && city) {
//       try {
//         const userDetails = {
//           firstName,
//           lastName,
//           countryName,
//           stateName,
//           cityName,
//         };

//         await saveRegistrationProgress("Name", userDetails);
//         navigation.navigate("AgeScreen");
//       } catch (error) {
//         console.error("Error saving registration progress: ", error);
//       }
//     } else {
//       Alert.alert("Please complete all fields.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <KeyboardAvoidingView
//             keyboardVerticalOffset={50}
//             behavior="padding"
//             style={styles.containerAvoidingView}
//           >
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Text style={styles.backButton}>Back</Text>
//             </TouchableOpacity>

//             <Text style={styles.headTitle}>Hey X, What's Your Name?</Text>
//             <Text style={styles.headTag}>
//               We only use Email to make sure everyone on Match Matters is real.
//             </Text>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your First Name"
//                 keyboardType="default"
//                 value={firstName}
//                 onChangeText={setFirstName}
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.inputStyle}
//                 placeholder="Enter Your Last Name"
//                 keyboardType="default"
//                 value={lastName}
//                 onChangeText={setLastName}
//               />
//             </View>

//             {/* Country Dropdown */}
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={countryData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select Country"
//               searchPlaceholder="Search..."
//               value={country}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCountry(item.value);
//                 setCountryName(item.label);
//                 handleState(item.value);
//               }}
//             />

//             {/* State Dropdown */}
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={stateData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select State"
//               searchPlaceholder="Search..."
//               value={state}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setState(item.value);
//                 setStateName(item.label);
//                 handleCity(country, item.value);
//               }}
//             />

//             {/* City Dropdown */}
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={cityData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select City"
//               searchPlaceholder="Search..."
//               value={city}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCity(item.value);
//                 setCityName(item.label);
//               }}
//             />

//             <View style={styles.viewBottom}>
//               <TouchableOpacity onPress={onPressContinue}>
//                 <View style={styles.btnContinue}>
//                   <Text style={styles.textContinue}>Continue</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingBottom: 20,
//     paddingHorizontal: 40,
//   },
//   containerAvoidingView: {
//     flex: 1,
//   },
//   backButton: {
//     color: "#0F3460",
//     fontSize: 16,
//     marginBottom: 20,
//     fontWeight: "bold",
//   },
//   headTitle: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#333",
//     marginBottom: 10,
//   },
//   headTag: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 30,
//   },
//   inputContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#d3d3d3",
//     marginBottom: 25,
//   },
//   inputStyle: {
//     fontSize: 16,
//     padding: 10,
//   },
//   dropdown: {
//     height: 50,
//     backgroundColor: "#F0F0F0",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: "#666",
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: "#333",
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
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
//     fontWeight: "bold",
//   },
// });

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";

export default function LocationPage({ navigation }) {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getRegistrationProgress("Location");
      if (progressData) {
        setCountryName(progressData.countryName || null);
        setStateName(progressData.stateName || null);
        setCityName(progressData.cityName || null);
      }
    };

    const loadCountries = () => {
      const countryArray = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
      }));
      setCountryData(countryArray);
    };

    fetchProgress();
    loadCountries();
  }, []);

  const handleState = useCallback((countryCode) => {
    const states = State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateData(states);
    setState(null);
    setCity(null);
    setCityData([]);
  }, []);

  const handleCity = useCallback((countryCode, stateCode) => {
    const cities = City.getCitiesOfState(countryCode, stateCode).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );
    setCityData(cities);
    setCity(null);
  }, []);

  const onPressContinue = async () => {
    if (country && state && city) {
      try {
        const locationDetails = {
          countryName,
          stateName,
          cityName,
        };

        await saveRegistrationProgress("Location", locationDetails);
        navigation.navigate("AgeScreen");
      } catch (error) {
        console.error("Error saving registration progress: ", error);
      }
    } else {
      Alert.alert("Please complete all fields.");
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={50}
            behavior="padding"
            style={styles.containerAvoidingView}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.headTitle}>Select Your Location</Text>

            {/* Country Dropdown */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countryData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Country"
              searchPlaceholder="Search..."
              value={country}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCountry(item.value);
                setCountryName(item.label);
                handleState(item.value);
              }}
            />

            {/* State Dropdown */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={stateData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select State"
              searchPlaceholder="Search..."
              value={state}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setState(item.value);
                setStateName(item.label);
                handleCity(country, item.value);
              }}
            />

            {/* City Dropdown */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={cityData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select City"
              searchPlaceholder="Search..."
              value={city}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setCity(item.value);
                setCityName(item.label);
              }}
            />

            <View style={styles.viewBottom}>
              <TouchableOpacity onPress={onPressContinue}>
                <View style={styles.btnContinue}>
                  <Text style={styles.textContinue}>Continue</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  containerAvoidingView: {
    flex: 1,
  },
  backButton: {
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
  dropdown: {
    height: 50,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#666",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
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
