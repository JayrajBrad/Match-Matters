import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, CLOUDINARY_CLOUD_NAME } from "@env";
import * as ImagePicker from "expo-image-picker";
import PreferencesDropdown from "../components/PreferencesDropdown";
import { getUserData, getUserId } from "../backend/registrationUtils";
import GenderDropdown from "../components/GenderDropdown";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import CountryCodeDropdownPicker from "react-native-dropdown-country-picker";

const preferences = [
  "Clubbing",
  "Party",
  "Movies",
  "Travel",
  "Music",
  "Fitness",
  "Cooking",
  "Gaming",
  "Art",
  "Photography",
];

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profileImages, setProfileImages] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(null);

  const [showEditCountry, setShowEditCountry] = useState(false);
  const [showEditState, setShowEditState] = useState(false);
  const [showEditCity, setShowEditCity] = useState(false);

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");

  ///phone code///
  // const [focusInput, setFocusInput] = useState(true);
  // const [selected, setSelected] = useState("+91");
  // const [country, setCountry] = useState("");

  // Load country list initially
  useEffect(() => {
    const loadCountries = () => {
      const countryArray = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
      }));
      setCountryData(countryArray);
    };
    loadCountries();
  }, []);

  // Load state and city data based on saved country and state
  useEffect(() => {
    if (countryName) {
      const countryCode = Country.getAllCountries().find(
        (country) => country.name === countryName
      )?.isoCode;
      if (countryCode) handleState(countryCode);
    }
  }, [countryName]);

  useEffect(() => {
    if (stateName && countryName) {
      const countryCode = Country.getAllCountries().find(
        (country) => country.name === countryName
      )?.isoCode;
      const stateCode = State.getStatesOfCountry(countryCode).find(
        (state) => state.name === stateName
      )?.isoCode;
      if (stateCode) handleCity(countryCode, stateCode);
    }
  }, [stateName, countryName]);

  const handleState = useCallback((countryCode) => {
    const states = State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateData(states);
    setCityData([]); // Reset city data when state changes
  }, []);

  const handleCity = useCallback((countryCode, stateCode) => {
    const cities = City.getCitiesOfState(countryCode, stateCode).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );
    setCityData(cities);
  }, []);
  const handleCountryChange = (selectedCountry) => {
    setCountryName(selectedCountry.label);
    setShowEditCountry(false);
    // Fetch states for the newly selected country
    handleState(selectedCountry.value);
    setStateName(""); // Reset state and city when country changes
    setCityName("");
  };

  const handleStateChange = (selectedState) => {
    setStateName(selectedState.label);
    setShowEditState(false);
    // Fetch cities for the newly selected state
    const countryCode = Country.getAllCountries().find(
      (country) => country.name === countryName
    )?.isoCode;
    handleCity(countryCode, selectedState.value);
    setCityName(""); // Reset city when state changes
  };

  const handleCityChange = (selectedCity) => {
    setCityName(selectedCity.label);
    setShowEditCity(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUserId = await getUserId();
        setUserId(storedUserId);
        const response = await axios.get(`${API_URL}/user/${storedUserId}`);
        if (response.status === 200) {
          const userData = response.data;
          setUsername(userData.username || "");
          setPhoneNumber(
            userData.phoneNumber ? String(userData.phoneNumber) : ""
          );
          setGender(userData.gender || "");
          setProfileImages(userData.images || []);
          setSelectedPreferences(userData.selectedPreferences || []);

          // Set country, state, and city from userData
          setCountryName(userData.countryName || "");
          setStateName(userData.stateName || "");
          setCityName(userData.cityName || "");
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later."
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to load profile data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const changeProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImages([...profileImages, result.assets[0].uri]);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...profileImages];
    updatedImages.splice(index, 1);
    setProfileImages(updatedImages);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const uploadedImageUrls = await Promise.all(
        profileImages.map(async (imageUri) => {
          if (!imageUri.startsWith("http")) {
            const formData = new FormData();
            formData.append("file", {
              uri: imageUri,
              type: "image/png",
              name: "photo.png",
            });
            formData.append("upload_preset", "profilepic_preset");
            formData.append("folder", "profile_pictures");

            const uploadResponse = await axios.post(
              `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            return uploadResponse.data.secure_url;
          }
          return imageUri;
        })
      );

      const response = await axios.put(`${API_URL}/user/updateUserProfile`, {
        userId,
        username,
        phoneNumber,
        gender,
        selectedPreferences,
        images: uploadedImageUrls,
        countryName,
        stateName,
        cityName,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("phoneNumber", phoneNumber);
        await AsyncStorage.setItem("gender", gender);
        await AsyncStorage.setItem(
          "selectedPreferences",
          JSON.stringify(selectedPreferences)
        );
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ///phone code///
  // const onChangePhone = (number) => {
  //   setPhoneNumber(number);
  // };
  // ///phone code///
  // const onChangeFocus = () => {
  //   setFocusInput(true);
  // };
  // ///phone code///
  // const onChangeBlur = () => {
  //   setFocusInput(false);
  // };

  return (
    <TouchableWithoutFeedback onPressOut={() => setShowDeleteIcon(null)}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.card}>
            <View style={styles.imageSection}>
              {profileImages.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onLongPress={() => setShowDeleteIcon(index)}
                  onPress={() => setShowDeleteIcon(null)}
                  style={styles.profileImageWrapper}
                >
                  <Image source={{ uri }} style={styles.profileImage} />
                  {showDeleteIcon === index && (
                    <TouchableOpacity
                      style={styles.deleteIconWrapper}
                      onPress={() => handleDeleteImage(index)}
                    >
                      <Ionicons name="trash" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
              {profileImages.length < 4 && (
                <TouchableOpacity
                  onPress={changeProfileImage}
                  style={styles.addImageButtonWrapper}
                >
                  <Text style={{ fontSize: 30, color: "#fff" }}>+</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text)}
                placeholder="Enter your username"
                placeholderTextColor="#aaa"
              />

              {/* phone code */}
              <Text style={styles.label}>Phone Number</Text>
              {/* <CountryCodeDropdownPicker
                selected={selected}
                setSelected={setSelected}
                setCountryDetails={setCountry}
                phone={phoneNumber}
                setPhone={onChangePhone}
                countryCodeTextStyles={{ fontSize: 13 }}
                countryCodeContainerStyles={[styles.countryCode]}
                style={styles.countryPickerStyle}
                searchStyles={[styles.search]}
                dropdownStyles={[styles.dropdown]}
              /> */}
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                placeholderTextColor="#aaa"
              />

              <GenderDropdown gender={gender} onSelectGender={setGender} />

              <PreferencesDropdown
                preferences={preferences}
                selectedPreferences={selectedPreferences}
                onSelect={setSelectedPreferences}
              />

              {/* Country */}
              <View style={styles.locContainer}>
                <Text style={styles.label}>Country</Text>
                <View style={styles.row}>
                  <Text style={styles.infoText}>{countryName}</Text>
                  <TouchableOpacity
                    onPress={() => setShowEditCountry(!showEditCountry)}
                    style={styles.editIconWrapper}
                  >
                    <Ionicons name="pencil" size={20} color="grey" />
                  </TouchableOpacity>
                </View>
                {showEditCountry && (
                  <Dropdown
                    data={countryData}
                    valueField="value"
                    labelField="label"
                    placeholder="Select Country"
                    search
                    onChange={handleCountryChange}
                    containerStyle={styles.dropdown}
                  />
                )}

                {/* State */}
                <Text style={styles.label}>State</Text>
                <View style={styles.row}>
                  <Text style={styles.infoText}>{stateName}</Text>
                  <TouchableOpacity
                    onPress={() => setShowEditState(!showEditState)}
                    style={styles.editIconWrapper}
                  >
                    <Ionicons name="pencil" size={20} color="grey" />
                  </TouchableOpacity>
                </View>
                {showEditState && (
                  <Dropdown
                    data={stateData}
                    valueField="value"
                    labelField="label"
                    placeholder="Select State"
                    search
                    onChange={handleStateChange}
                    containerStyle={styles.dropdown}
                  />
                )}

                {/* City */}
                <Text style={styles.label}>City</Text>
                <View style={styles.row}>
                  <Text style={styles.infoText}>{cityName}</Text>
                  <TouchableOpacity
                    onPress={() => setShowEditCity(!showEditCity)}
                    style={styles.editIconWrapper}
                  >
                    <Ionicons name="pencil" size={20} color="grey" />
                  </TouchableOpacity>
                </View>
                {showEditCity && (
                  <Dropdown
                    data={cityData}
                    valueField="value"
                    labelField="label"
                    placeholder="Select City"
                    search
                    onChange={handleCityChange}
                    containerStyle={styles.dropdown}
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    // backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // for shadow effect
    marginBottom: 20,
  },
  imageSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  profileImageWrapper: {
    position: "relative",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  deleteIconWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },

  addImageButtonWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "grey",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  inputSection: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  countryStateCityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoText: {
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    flex: 1,
    marginRight: 10,
  },
  // editIconWrapper: {
  //   padding: 5,
  //   borderRadius: 5,
  //   backgroundColor: "#e0e0e0",
  //   elevation: 2,
  // },
  editIconWrapper: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: "grey",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownContainer: {
    // flex: 1,
    marginTop: 10,
  },
});

export default EditProfileScreen;
