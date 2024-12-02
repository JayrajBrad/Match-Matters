import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
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
  Switch,
  FlatList,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
import { UserContext } from "../navigation/UserProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetMethods,
} from "../components/EditProfile/BottomSheet";
import BottomSheetFlatList from "../components/EditProfile/BottomSheetFlatList";

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
  const { user, userId } = useContext(UserContext);
  // const [userId, setUserId] = useState("");
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

  const [userheight, setUserHeight] = useState("");
  const [work, setWork] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [smokes, setSmokes] = useState("");
  const [drinks, setDrinks] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [religion, setReligion] = useState("");
  const [languages, setLanguages] = useState([]);

  const [userData, setUserData] = useState({
    height: "",
    work: "",
    educationLevel: "",
    smokes: false,
    drinks: false,
    zodiac: "",
    religion: "",
    languages: [],
  });

  const { height } = Dimensions.get("screen");

  const bottomSheetRef = useRef(null);
  const bottomSheetRef2 = useRef(null);

  const [currentField, setCurrentField] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [options, setOptions] = useState([]);

  const predefinedOptions = {
    // gender: ["Male", "Female"],
    zodiac: [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ],
    religion: [
      "Christianity",
      "Islam",
      "Hinduism",
      "Buddhism",
      "Sikhism",
      "Judaism",
    ],
    work: [],

    educationLevel: [
      "High School",
      "In College",
      "Undergraduate College",
      "Graduate Degree",
    ],
    drinks: ["Yes, I drink", "I rarely drink", "No, I don’t drink"],
    smokes: ["Yes, I smoke", "I rarely smoke", "No, I don’t smoke"],
    languages: [
      "English",
      "Hindi",
      "Bengali",
      "Marathi",
      "Telugu",
      "Tamil",
      "Gujarati",
      "Urdu",
      "Kannada",
      "Odia",
      "Malayalam",
    ],
  };

  const handleEditField = (field) => {
    setCurrentField(field);
    setOptions(predefinedOptions[field]);
    bottomSheetRef.current?.expand();
  };

  const handleSelectOption = (option) => {
    setUserData((prevData) => ({
      ...prevData,
      [currentField]: option,
    }));
    bottomSheetRef.current?.close();
  };

  const renderFieldWithOptions = (label, fieldKey) => (
    <TouchableOpacity
      style={styles.fieldContainer}
      onPress={() => handleEditField(fieldKey)}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{userData[fieldKey]}</Text>
    </TouchableOpacity>
  );

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

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoading(true);
  //     try {
  //       // const storedUserId = userId;
  //       // setUserId(storedUserId);
  //       const response = await axios.get(`${API_URL}/user/${userId}`);
  //       if (response.status === 200) {
  //         const userData = response.data;
  //         setUsername(userData.username || "");
  //         setPhoneNumber(
  //           userData.phoneNumber ? String(userData.phoneNumber) : ""
  //         );
  //         setGender(userData.gender || "");
  //         setProfileImages(userData.images || []);
  //         setSelectedPreferences(userData.selectedPreferences || []);

  //         // Set country, state, and city from userData
  //         setCountryName(userData.countryName || "");
  //         setStateName(userData.stateName || "");
  //         setCityName(userData.cityName || "");

  //         const aboutYou = userData.aboutYou || {};
  //         setUserHeight(aboutYou.height || ""); // Assuming setHeight is defined
  //         setWork(aboutYou.work || ""); // Assuming setWork is defined
  //         setEducationLevel(aboutYou.educationLevel || ""); // Assuming setEducationLevel is defined
  //         setSmokes(aboutYou.smokes || "");
  //         setDrinks(aboutYou.drinks || "");
  //         setZodiac(aboutYou.zodiac || "");
  //         setReligion(aboutYou.religion || "");
  //         setLanguages(aboutYou.languages || []);

  //       } else {
  //         Alert.alert(
  //           "Error",
  //           "Failed to load profile data. Please try again later."
  //         );
  //       }
  //     } catch (error) {
  //       Alert.alert(
  //         "Error",
  //         "Failed to load profile data. Please try again later."
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        if (response.status === 200) {
          const userDataFromDB = response.data;

          setUserData({
            height: userDataFromDB.aboutYou?.height || "Not specified",
            work: userDataFromDB.aboutYou?.work || "Not specified",
            educationLevel:
              userDataFromDB.aboutYou?.educationLevel || "Not specified",
            smokes: userDataFromDB.aboutYou?.smokes || "Not specified",
            drinks: userDataFromDB.aboutYou?.drinks || "Not specified",
            zodiac: userDataFromDB.aboutYou?.zodiac || "Not specified",
            religion: userDataFromDB.aboutYou?.religion || "Not specified",
            languages:
              userDataFromDB.aboutYou?.languages?.join(", ") || "Not specified",
          });

          setUsername(userDataFromDB.username || "");
          setPhoneNumber(
            userDataFromDB.phoneNumber ? String(userDataFromDB.phoneNumber) : ""
          );
          setGender(userDataFromDB.gender || "");
          setProfileImages(userDataFromDB.images || []);
          setSelectedPreferences(userDataFromDB.selectedPreferences || []);

          // Country, state, city
          setCountryName(userDataFromDB.countryName || "");
          setStateName(userDataFromDB.stateName || "");
          setCityName(userDataFromDB.cityName || "");
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later."
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert(
          "Error",
          "Failed to load profile data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

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

      // Sanitize userData
      const sanitizedUserData = {
        ...userData,
        height:
          userData.height !== "Not specified" ? Number(userData.height) : null,
        work: userData.work !== "Not specified" ? userData.work : null,
        educationLevel:
          userData.educationLevel !== "Not specified"
            ? userData.educationLevel
            : null,
        smokes: userData.smokes !== "Not specified" ? userData.smokes : null,
        drinks: userData.drinks !== "Not specified" ? userData.drinks : null,
        zodiac: userData.zodiac !== "Not specified" ? userData.zodiac : null,
        religion:
          userData.religion !== "Not specified" ? userData.religion : null,
        languages:
          userData.languages !== "Not specified"
            ? userData.languages.split(", ")
            : [],
      };

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
        userData: sanitizedUserData,
      });

      console.log("Update user :", response);

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
    <GestureHandlerRootView style={styles.container}>
      {/* <KeyboardAvoidingView style={styles.keycontainer} behavior="padding"> */}
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
            {/* {renderFieldWithOptions("Gender", "gender")} */}

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
          {renderFieldWithOptions("Preferred Languages", "languages")}
          {renderFieldWithOptions("Zodiac Sign", "zodiac")}
          {renderFieldWithOptions("Religion", "religion")}
          {renderFieldWithOptions("Education Level", "educationLevel")}
          {renderFieldWithOptions("Do you drink?", "drinks")}
          {renderFieldWithOptions("Do you smoke?", "smokes")}
          {/* <Button title="Flatlist" onPress={() => pressHandler4()} /> */}

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

      <BottomSheet
        ref={bottomSheetRef}
        activeHeight={height * 0.6}
        backgroundColor="white"
        backDropColor="black"
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.bottomSheetTitle}>
            Edit {currentField.charAt(0).toUpperCase() + currentField.slice(1)}
          </Text>

          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSelectOption(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomSheet>
      {/* </KeyboardAvoidingView> */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f4f4f4",
  },
  keycontainer: { marginBottom: 120 },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    // backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // for shadow effect
    // marginBottom: 100,
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fieldValue: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  listContainer: {
    margin: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  listText: {
    fontSize: 16,
    color: "#333",
  },
  editText: {
    fontSize: 16,
    color: "#007BFF",
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
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

  editIconWrapper: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
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
    // marginBottom: "auto",
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
  bottomSheetContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 20,
    paddingBottom: 120,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  Bottominput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  optionsContainer: { marginTop: 16, marginBottom: 20 },
  optionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  optionText: { fontSize: 16 },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 5,
  },
});

export default EditProfileScreen;
