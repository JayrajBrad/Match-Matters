// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// const preferences = [
//   "Clubbing",
//   "Party",
//   "Movies",
//   "Travel",
//   "Music",
//   "Fitness",
//   "Cooking",
//   "Gaming",
//   "Art",
//   "Photography",
// ];

// export default function PreferenceScreen({ navigation }) {
//   const [selectedPreferences, setSelectedPreferences] = useState([]);

//   const togglePreference = (preference) => {
//     if (selectedPreferences.includes(preference)) {
//       setSelectedPreferences(
//         selectedPreferences.filter((item) => item !== preference)
//       );
//     } else {
//       setSelectedPreferences([...selectedPreferences, preference]);
//     }
//   };

//   const onPressContinue = () => {
//     if (selectedPreferences.length >= 2) {
//       saveRegistrationProgress("Preference", { selectedPreferences });
//       navigation.navigate("LastScreen");
//     } else {
//       alert("Please select at least 2 preferences.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.goBack();
//           }}
//         >
//           <Text style={styles.Back}>Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.headTitle}>So What Do You Like?</Text>
//         <Text style={styles.headTag}>What are your preferences?</Text>
//         <Text style={styles.headTag}>Select Atleast 2</Text>

//         <View style={styles.gridContainer}>
//           {preferences.map((preference, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[
//                 styles.preferenceItem,
//                 selectedPreferences.includes(preference) && styles.selectedItem,
//               ]}
//               onPress={() => togglePreference(preference)}
//             >
//               <Text style={styles.preferenceText}>{preference}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity onPress={onPressContinue}>
//           <View style={styles.skipButton}>
//             <Text style={styles.skipText}>Continue</Text>
//           </View>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   Back: {
//     alignItems: "center",
//   },
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   headTitle: {
//     fontSize: 32,
//     fontWeight: "800",
//     marginVertical: 20,
//   },
//   headTag: {
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   preferenceItem: {
//     width: 100,
//     height: 100,
//     margin: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#E0E0E0",
//   },
//   selectedItem: {
//     backgroundColor: "#BF1013",
//   },
//   preferenceText: {
//     fontSize: 16,
//     color: "#fff",
//   },
//   skipButton: {
//     width: 150,
//     height: 50,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#BF1013",
//     marginVertical: 20,
//   },
//   skipText: {
//     fontSize: 20,
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, CLOUDINARY_CLOUD_NAME } from "@env";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
  getUserId,
} from "../backend/registrationUtils";
import FormData from "form-data";

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

export default function PreferenceScreen({ navigation }) {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [userData, setUserData] = useState({});

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
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Clear all saved registration data
  const clearAllScreenData = async () => {
    try {
      const screens = [
        "PhoneNum",
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
        .map((imageUri) => uploadImageToCloudinary(imageUri));

      try {
        const uploadedImageUrls = await Promise.all(uploadPromises);
        userData.images = uploadedImageUrls;
      } catch (uploadError) {
        console.error("Error uploading images to Cloudinary:", uploadError);
        return;
      }
    }

    await sendData(userData);
    await clearAllScreenData();
    navigation.navigate("HomeScreen", { userData });
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    formData.append("upload_preset", "profilepic_preset");
    formData.append("folder", "profile_pictures");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error.message);
      throw error;
    }
  };

  const sendData = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;

        if (token && user) {
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("userData", JSON.stringify(user));
          await AsyncStorage.setItem("userId", user._id);

          const userId = await getUserId();
          console.log("New User ID:", userId);
        } else {
          console.log("No token received from the server.");
        }
      } else {
        console.log("Failed to register user. Status:", response.status);
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.Back}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headTitle}>So What Do You Like?</Text>
        <Text style={styles.headTag}>Select Atleast 2</Text>

        <View style={styles.gridContainer}>
          {preferences.map((preference, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.preferenceItem,
                selectedPreferences.includes(preference) && styles.selectedItem,
              ]}
              onPress={() => togglePreference(preference)}
            >
              <Text style={styles.preferenceText}>{preference}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={registerUser}>
          <View style={styles.skipButton}>
            <Text style={styles.skipText}>Register</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: "#fff" },
  Back: { alignItems: "center" },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  headTitle: { fontSize: 32, fontWeight: "800", marginVertical: 20 },
  headTag: { fontSize: 16, marginBottom: 20 },
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
  selectedItem: { backgroundColor: "#BF1013" },
  preferenceText: { fontSize: 16, color: "#fff" },
  skipButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF1013",
    marginVertical: 20,
  },
  skipText: { fontSize: 20, color: "#fff", fontWeight: "bold" },
});
