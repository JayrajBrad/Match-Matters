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
import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo

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
  const [dataLoaded, setDataLoaded] = useState(false);
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

  const [userData, setUserData] = useState({
    lookingFor: "",
    jobIndustry: "",
    relationshipStatus: "",
    educationLevel: "",
    smokes: false,
    drinks: false,
    zodiac: "",
    religion: "",
    exerciseFrequency: "",
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
    lookingFor: [
      "Friendship",
      "Relationship",
      "Networking",
      "Dating",
      "Job Opportunities",
      "Collaborations",
      "Mentorship",
      "Partnership",
    ],
    jobIndustry: [
      "Technology",
      "Healthcare",
      "Education",
      "Finance",
      "Entertainment",
      "Engineering",
      "Marketing",
      "Design",
      "Sales",
      "Law",
      "Consulting",
      "Real Estate",
      "Arts",
    ],
    relationshipStatus: [
      "Single",
      "In a Relationship",
      "Married",
      "Engaged",
      "Divorced",
      "Widowed",
      "Complicated",
      "In an Open Relationship",
    ],
    exerciseFrequency: [
      "Daily",
      "Weekly",
      "Monthly",
      "Rarely",
      "Never",
      "Occasionally",
      "Several times a week",
      "A few times a month",
    ],
    educationLevel: [
      "High School",
      "In College",
      "Undergraduate College",
      "Graduate Degree",
    ],
    drinks: ["Yes, I drink", "I rarely drink", "No, I don’t drink"],
    smokes: ["Yes, I smoke", "I rarely smoke", "No, I don’t smoke"],
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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        if (response.status === 200) {
          const userDataFromDB = response.data;

          setUserData({
            lookingFor: userDataFromDB.aboutYou?.lookingFor || "Not specified",
            jobIndustry:
              userDataFromDB.aboutYou?.jobIndustry || "Not specified",
            relationshipStatus:
              userDataFromDB.aboutYou?.relationshipStatus || "Not specified",
            exerciseFrequency:
              userDataFromDB.aboutYou?.exerciseFrequency || "Not specified",

            educationLevel:
              userDataFromDB.aboutYou?.educationLevel || "Not specified",
            smokes: userDataFromDB.aboutYou?.smokes || "Not specified",
            drinks: userDataFromDB.aboutYou?.drinks || "Not specified",
            zodiac: userDataFromDB.aboutYou?.zodiac || "Not specified",
            religion: userDataFromDB.aboutYou?.religion || "Not specified",
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
        setDataLoaded(true);
      }
    };
    fetchUserData();
  }, [userId]);

  if (!dataLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

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

        lookingFor:
          userData.lookingFor !== "Not specified" ? userData.lookingFor : null,
        jobIndustry:
          userData.jobIndustry !== "Not specified"
            ? userData.jobIndustry
            : null,
        relationshipStatus:
          userData.relationshipStatus !== "Not specified"
            ? userData.relationshipStatus
            : null,

        educationLevel:
          userData.educationLevel !== "Not specified"
            ? userData.educationLevel
            : null,
        smokes: userData.smokes !== "Not specified" ? userData.smokes : null,
        drinks: userData.drinks !== "Not specified" ? userData.drinks : null,
        zodiac: userData.zodiac !== "Not specified" ? userData.zodiac : null,
        religion:
          userData.religion !== "Not specified" ? userData.religion : null,
        exerciseFrequency:
          userData.exerciseFrequency !== "Not specified"
            ? userData.exerciseFrequency
            : null,
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

      // console.log("Update user :", response);

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
        {/* <View
          style={{
            // padding: 10,
            // backgroundColor: "#0F3460",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: "#0F3460",
              padding: 10,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View> */}
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
              placeholderTextColor="#000"
            />

            {/* phone code */}
            {/* <Text style={styles.label}>Phone Number</Text> */}
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
            {/* <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#aaa"
            /> */}

            <View>
              <Text style={styles.label}>Gender</Text>

              <GenderDropdown gender={gender} onSelectGender={setGender} />
              {/* {renderFieldWithOptions("Gender", "gender")} */}
            </View>

            <View>
              <Text style={styles.label}>Preferences</Text>

              <PreferencesDropdown
                preferences={preferences}
                selectedPreferences={selectedPreferences}
                onSelect={setSelectedPreferences}
              />
            </View>

            {/* Country */}
            <View style={styles.LocContainer}>
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
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  search
                  onChange={handleCountryChange}
                  containerStyle={[styles.dropdown, styles.dropdownBackground]}
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
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
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
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  search
                  onChange={handleCityChange}
                  containerStyle={styles.dropdown}
                />
              )}
            </View>
          </View>

          <Text style={styles.aboutYoulabel}>About you</Text>
          {renderFieldWithOptions("Education Level", "educationLevel")}
          {renderFieldWithOptions("Job Industry", "jobIndustry")}
          {renderFieldWithOptions("Relationship Status", "relationshipStatus")}
          {renderFieldWithOptions("Looking For", "lookingFor")}
          {renderFieldWithOptions("Exercise Frequency", "exerciseFrequency")}

          {renderFieldWithOptions("Zodiac Sign", "zodiac")}
          {renderFieldWithOptions("Religion", "religion")}

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
        activeHeight={height * 0.8}
        backgroundColor="#814C68"
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
    backgroundColor: "#fff",
    // marginBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  keycontainer: { marginBottom: 120 },
  scrollContainer: {
    // paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    // backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    // elevation: 5, // for shadow effect
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
    fontFamily: "CenturyGothicBold",

    color: "#814C68",
  },
  fieldValue: {
    fontSize: 14,
    color: "#814C68",
    fontFamily: "CenturyGothic",

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
    backgroundColor: "#814C68",
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
    color: "#814C68",
    fontFamily: "CenturyGothic",
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
    color: "#814C68",
    fontSize: 16,
    fontFamily: "CenturyGothic",
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
    // elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  placeholderStyle: {
    color: "#814C68",
    fontSize: 14,
    fontFamily: "CenturyGothic",
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
    width: 120,
    height: 120,
    backgroundColor: "grey",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  inputSection: {
    marginTop: 20,
    color: "#814C68",
  },
  label: {
    fontSize: 14,
    fontFamily: "CenturyGothicBold",

    color: "#814C68",
    marginBottom: 8,
  },
  aboutYoulabel: {
    fontSize: 24,
    fontFamily: "CenturyGothicBold",

    color: "#814C68",
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "CenturyGothic",
    color: "#fff",
    backgroundColor: "#814C68",
    marginBottom: 15,
  },
  dropdownBackground: {
    backgroundColor: "#fff", // Add white background to dropdown
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
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#814C68",
    flex: 1,
    marginRight: 10,
    fontFamily: "CenturyGothic",
  },
  inputSearchStyle: {
    fontSize: 16,
    color: "#814C68",
    fontFamily: "CenturyGothic",
  },
  dropdownContainerStyle: {
    borderRadius: 8,
    padding: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },

  selectedTextStyle: {
    color: "#814C68",
    fontSize: 14,
    fontFamily: "CenturyGothic",
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
    fontFamily: "CenturyGothic",
  },
  dropdown: {
    backgroundColor: "#814C68",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    fontFamily: "CenturyGothic",

    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
  },
  button: {
    backgroundColor: "#290F4C",
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 20,
    // marginBottom: "auto",
  },
  buttonDisabled: {
    backgroundColor: "#0F3460",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
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
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    marginBottom: 25,
  },
  Bottominput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    // color: "#fff",
    marginBottom: 20,
  },
  optionsContainer: { marginTop: 16, marginBottom: 20 },
  optionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  optionText: { fontSize: 16, fontFamily: "CenturyGothic", color: "#fff" },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 5,
  },
});

export default EditProfileScreen;
