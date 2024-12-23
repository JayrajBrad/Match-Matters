
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  TextInput,
} from "react-native";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";
import {
  saveRegistrationProgress,
  getRegistrationProgress,
} from "../backend/registrationUtils";
import { isValidPhoneNumber } from "libphonenumber-js"; // Import from libphonenumber-js
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function SignNumber({ navigation }) {
  const insets = useSafeAreaInsets();

  if (insets.top === 0) {
    return null; // Optionally render a loading state or placeholder here
  }

  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
    CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
  });

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

  const validatePhoneNumber = (fullPhoneNumber) => {
    const countryCode = selected.replace("+", ""); // Remove '+' from the country code for validation
    // Use libphonenumber-js to validate the phone number
    return isValidPhoneNumber(fullPhoneNumber, countryCode);
  };

  // const validatePhoneNumber = (fullPhoneNumber) => {
  //   try {
  //     const phoneNumber = parsePhoneNumberFromString(fullPhoneNumber); // Parse the phone number
  //     if (!phoneNumber) {
  //       return false; // Invalid phone number format
  //     }

  //     const isValidLength = phoneNumber.isPossible(); // Check if the length is valid
  //     const isValidFormat = phoneNumber.isValid(); // Check if the number is valid for the selected country

  //     return isValidLength && isValidFormat; // Ensure both conditions are met
  //   } catch (error) {
  //     console.error("Error validating phone number:", error);
  //     return false; // Return false in case of error
  //   }
  // };

  if (!fontsLoaded) {
    return <AppLoading />;
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
            <Text
              style={styles.backText}
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>Can we get your number ?</Text>
          <Text style={styles.headTag}>
            We only use your phone number to make sure everyone on Match Matters
            is real.
          </Text>

          <View style={styles.inputContainer}>
            <CountryCodeDropdownPicker
              selected={selected}
              setSelected={setSelected}
              phone={phoneNumber}
              setPhone={onChangePhone}
              countryCodeTextStyles={{
                fontSize: 16,
                color: "#333",
                fontFamily: "CenturyGothic",
              }}
              countryCodeContainerStyles={styles.countryCode}
              style={styles.countryPickerStyle}
              searchStyles={styles.search}
              phoneStyles={styles.phoneStyles}
              dropdownStyles={styles.dropdown}
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
    flex: 1, // Ensure the container takes full height
    paddingHorizontal: 20,
  },
  containerAvoidingView: {
    flex: 1,
  },
  backText: {
    color: "#0F3460",
    fontSize: 16,
    marginBottom: 20,
    // fontWeight: "bold",
    fontFamily: "CenturyGothicBold",
  },
  headTitle: {
    fontSize: 32,
    // fontWeight: "800",
    color: "#333",
    marginBottom: 10,
    fontFamily: "CenturyGothicBold",
  },
  headTag: {
    fontSize: 14,
    color: "#666",
    fontFamily: "CenturyGothic",
    marginBottom: 30,
  },
  inputContainer: {
    // borderBottomWidth: 1,
    marginBottom: 15,
    // height: 50,
  },
  dropdown: {
    // height: 40,
  },
  countryCode: {
    marginRight: 10,
    height: 50,
  },
  countryPickerStyle: {
    width: "50%",
  },
  search: {
    height: 50,
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
  phoneStyles: {
    height: 50,
    fontFamily: "CenturyGothic",
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
    // fontWeight: "bold",
    fontFamily: "CenturyGothic",
  },
});