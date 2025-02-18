import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY } from "@env";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
  getUserId,
} from "../backend/registrationUtils";
import FormData from "form-data";
import LottieView from "lottie-react-native";
import { UserContext } from "../navigation/UserProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

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

SplashScreen.preventAutoHideAsync();

export default function PreferenceScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
          CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { loginUser } = useContext(UserContext);

  useEffect(() => {
    getAllUserData();
  }, []);

  const togglePreference = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(
        selectedPreferences.filter((item) => item !== preference)
      );
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  // Fetch all registration data
  const getAllUserData = async () => {
    try {
      const screens = [
        "PhoneNum",
        "CountryCode",
        "Email",
        "Password",
        "Username",
        "Name",
        "Location",
        "Age",
        "Photos",
      ];

      let userData = {};
      for (const screenName of screens) {
        const screenData = await getRegistrationProgress(screenName);
        if (screenData) {
          userData = { ...userData, ...screenData };
        }
      }
      setUserData(userData);
      console.log("get data :", userData);
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Clear all saved registration data
  const clearAllScreenData = async () => {
    try {
      const screens = [
        "PhoneNum",
        "CountryCode",

        "Email",
        "Password",
        "Username",
        "Name",
        "Age",
        "Photos",
        "Preference",
        "Country",
        "State",
        "City",
      ];

      for (const screenName of screens) {
        const key = `registration_progress_${screenName}`;
        await AsyncStorage.removeItem(key);
      }

      console.log(
        "All Screen Data Was Saved And Cleared For New Users....!!!!"
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  const validateUserData = (data) => {
    const requiredFields = [
      "phoneNumber",
      "countryCode",
      "emailId",
      "password",
      "username",
      "age",
      "birthdate",
      "gender",
      "countryName",
      "stateName",
      "cityName",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        return false;
      }
    }
    return true;
  };

  const registerUser = async () => {
    if (selectedPreferences.length < 2) {
      Alert.alert("Please select at least 2 preferences.");
      return;
    }

    saveRegistrationProgress("Preference", { selectedPreferences });
    userData.selectedPreferences = selectedPreferences;

    if (!validateUserData(userData)) {
      Alert.alert("Incomplete registration details.");
      return;
    }

    if (userData.images && Array.isArray(userData.images)) {
      const uploadPromises = userData.images
        .filter((imageUri) => imageUri)
        .map((imageUri) => uploadImageToS3(imageUri));

      try {
        const uploadedKeys = await Promise.all(uploadPromises);
        userData.images = uploadedKeys;
      } catch (uploadError) {
        console.error("Error uploading images to Cloud:", uploadError);
        return;
      }
    }
    setLoading(true);
    // await sendData(userData);
    // await clearAllScreenData();
    // setLoading(false);
    // navigation.navigate("FeedScreen", { userData });

    console.log("user data from pref :", userData);
    try {
      const response = await sendData(userData); // Make sure sendData returns the response
      if (response && response.token && response.user) {
        // Call loginUser function to save token and user info in context
        await loginUser(response); // now this call updates the context and stores it
        // Navigate to the FeedScreen after successful login
        await clearAllScreenData();

        navigation.navigate("MainDrawer", {
          screen: "FeedScreen",
          params: { userData },
        });
      } else {
        Alert.alert("Registration failed, please try again.");
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      Alert.alert("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const uploadImageToCloudinary = async (imageUri) => {
  //   const { data } = await axios.get(`${API_URL}/api/cloudinary-signature`);
  //   const { signature, timestamp } = data;

  //   const formData = new FormData();
  //   formData.append("file", {
  //     uri: imageUri,
  //     type: "image/jpeg",
  //     name: "photo.jpg",
  //   });
  //   formData.append("upload_preset", "profilepic_preset");
  //   formData.append("folder", "profile_pictures");

  //   formData.append("signature", signature);
  //   formData.append("timestamp", timestamp);

  //   formData.append("api_key", CLOUDINARY_API_KEY);
  //   console.log(CLOUDINARY_API_KEY); // This should print your API key

  //   //image resize////
  //   // formData.append("transformation", "w_400,h_400,c_fill");
  //   formData.append("transformation", "w_800,h_800,c_fill,q_80,f_auto"); // Resize to 800x800, 80% quality, auto format (like WebP)

  //   try {
  //     const response = await axios.post(
  //       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  //     return response.data.secure_url;
  //   } catch (error) {
  //     console.error(
  //       "Error uploading to Cloudinary:",
  //       error.response?.data || error.message
  //     );
  //     throw error;
  //   }
  // };
  // You can place these helpers in a utils file or near your upload function.

  function getFileExtension(uri) {
    // e.g., if uri is "file:///path/to/image.png"
    // this returns "png"
    const lastDotIndex = uri.lastIndexOf(".");
    if (lastDotIndex === -1) {
      // fallback if no extension found
      return "";
    }
    return uri.substring(lastDotIndex + 1).toLowerCase();
  }

  function getMimeTypeFromExtension(ext) {
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        // fallback if extension isn't recognized
        return "application/octet-stream";
    }
  }

  const uploadImageToS3 = async (imageUri) => {
    try {
      // 1) Derive file extension from the URI
      // const extension = getFileExtension(imageUri);
      // // 2) Map extension to a valid MIME type
      // const mimeType = getMimeTypeFromExtension(extension) || "image/jpeg";
      const extension = imageUri.split(".").pop();
      const mimeType = extension === "png" ? "image/png" : "image/jpeg";

      // 3) Generate a unique file name (optional, but recommended)
      const uniqueFileName = `${Date.now()}.${extension || "jpg"}`;

      // 4) Ask your backend to generate a pre-signed URL
      const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
        folder: "mm_profilePic",
        fileType: mimeType,
        fileName: uniqueFileName,
      });

      const { uploadUrl, key } = data;
      console.log("Pre-signed upload URL:", uploadUrl);

      // 5) Convert local file path (imageUri) to a blob
      const fileResponse = await fetch(imageUri);
      const blob = await fileResponse.blob();

      console.log("Upload URL:", uploadUrl);
      console.log("Blob before upload:", blob);
      console.log("Blob size:", blob.size);

      // 6) Upload to S3 using the pre-signed URL
      await fetch(uploadUrl, {
        method: "PUT",
        body: blob, // Use blob directly
        headers: {
          "Content-Type": mimeType,
          "Content-Length": blob.size, // Make sure MIME type is correct
        },
      });

      // 7) Return the key (or store it in userData, etc.)
      return key;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  // const uploadImageToS3 = async (imageUri) => {
  //   try {
  //     // 1) Ask your backend to generate a pre-signed URL.
  //     //    We pass folder name & file type (and optionally fileName) to the endpoint
  //     const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
  //       folder: "mm_profilePic", // or whichever folder you want
  //       fileType: "image/jpeg", // or derive from the actual file
  //       fileName: "profile-pic.jpg", // you can also generate a unique name
  //     });

  //     const { uploadUrl, key } = data;
  //     console.log(uploadUrl);
  //     // 'uploadUrl' is the pre-signed URL
  //     // 'key' is the S3 object key where the file will be stored

  //     // 2) Convert local file path (imageUri) to a blob
  //     const fileResponse = await fetch(imageUri);
  //     const blob = await fileResponse.blob();

  //     // 3) Upload to S3 using the pre-signed URL
  //     await axios.put(uploadUrl, blob, {
  //       headers: {
  //         "Content-Type": "image/jpeg",
  //       },
  //     });

  //     // Return the key (or full URL if your backend returns it)
  //     return key;
  //   } catch (error) {
  //     console.error("Error uploading to S3:", error);
  //     throw error;
  //   }
  // };

  const sendData = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });
      return response.data; // Return the response data directly
    } catch (error) {
      console.error("Error registering user:", error.message);
      throw error; // Rethrow error to handle it in registerUser
    }
  };

  if (!fontsLoaded) {
    return null; // Render nothing while the splash screen is shown
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior={"padding"}
          style={styles.containerAvoidingView}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.Back}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>So What Do You Like ?</Text>
          <Text style={styles.headTag}>Select Atleast 2</Text>

          <View style={styles.gridContainer}>
            {preferences.map((preference, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.preferenceItem,
                  selectedPreferences.includes(preference) &&
                    styles.selectedItem,
                ]}
                onPress={() => togglePreference(preference)}
              >
                <Text style={styles.preferenceText}>{preference}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={registerUser}>
            <View style={styles.skipButton}>
              {loading ? (
                <LottieView
                  source={require("../Onboarding-Screen-2/src/assets/animations/loader.json")} // Path to your loader animation
                  autoPlay
                  loop
                  style={styles.loader}
                />
              ) : (
                <Text style={styles.skipText}>Register</Text>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: "#290F4C" },
  Back: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "CenturyGothicBold",
    paddingHorizontal: 20,

    // alignItems: "flex-start",
    // top: 20, // Distance from the top of the frame
    // left: 20, // Distance from the left of the frame
  },
  containerAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 50,
    alignItems: "center",
  },
  // container: {
  //   flexGrow: 1,
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   paddingVertical: 20,
  // },
  headTitle: {
    fontSize: 28,
    fontFamily: "CenturyGothicBold",
    paddingHorizontal: 20,

    color: "#FFF",
  },
  headTag: {
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    color: "#FFF",
    fontFamily: "CenturyGothic",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  preferenceItem: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E0E0",
  },
  selectedItem: { backgroundColor: "#814C68" },
  preferenceText: { fontSize: 14, color: "#000", fontFamily: "CenturyGothic" },
  skipButton: {
    width: 180,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#814C68",
    marginVertical: 20,

    alignSelf: "center",
  },
  skipText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "CenturyGothic",
  },
});
