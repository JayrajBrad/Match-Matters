// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
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

// export default function LocationPage({ navigation }) {
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
//       const progressData = await getRegistrationProgress("Location");
//       if (progressData) {
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
//     if (country && state && city) {
//       try {
//         const locationDetails = {
//           countryName,
//           stateName,
//           cityName,
//         };

//         await saveRegistrationProgress("Location", locationDetails);
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

//             <Text style={styles.headTitle}>Select Your Location</Text>

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
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function LocationPage({ navigation }) {
  const insets = useSafeAreaInsets();

  if (insets.top === 0) {
    return null; // Optionally render a loading state or placeholder here
  }

  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
    CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
  });

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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.headTitle}>Select Your Location</Text>
              <Text style={styles.headTag}>
                Please provide your Home Town so that we can reach you faster
              </Text>

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
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
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
    paddingBottom: 20,
  },
  container: {
    flex: 1, // Ensure the container takes full height
    paddingHorizontal: 10,
  },
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   paddingHorizontal: 20,
  // },
  backText: {
    color: "#0F3460",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "CenturyGothicBold",
  },
  headTitle: {
    fontSize: 32,
    // fontWeight: "800",
    color: "#333",
    marginBottom: 20,
    fontFamily: "CenturyGothicBold",
    // textAlign: "center",
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
    fontFamily: "CenturyGothic",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "CenturyGothic",
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
  headTag: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    fontFamily: "CenturyGothic",
  },
  textContinue: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
  },
});