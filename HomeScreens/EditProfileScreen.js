// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { API_URL } from "@env";
// import PreferencesDropdown from "../components/PreferencesDropdown";
// import { getUserData, getUserId } from "../backend/registrationUtils"; // Adjust path as needed
// import GenderDropdown from "../components/GenderDropdown";

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

// const EditProfileScreen = () => {
//   const navigation = useNavigation();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [gender, setGender] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
//   const [userId, setUserId] = useState("");
//   const [selectedPreferences, setSelectedPreferences] = useState([]);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const storedUserId = await getUserId(); // Assuming getUserId retrieves the user ID from AsyncStorage
//         setUserId(storedUserId);

//         const response = await axios.get(`${API_URL}/user/${storedUserId}`);

//         if (response.status === 200) {
//           const userData = response.data; // Adjust according to your API response structure
//           setFirstName(userData.firstName || "");
//           setLastName(userData.lastName || "");
//           setPhoneNumber(
//             userData.phoneNumber ? String(userData.phoneNumber) : ""
//           );
//           setGender(userData.gender || "");
//           setProfileImage(userData.profileImage || null);
//           setSelectedPreferences(userData.selectedPreferences || []);
//         } else {
//           Alert.alert(
//             "Error",
//             "Failed to load profile data. Please try again later."
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching user data", error);
//         Alert.alert(
//           "Error",
//           "Failed to load profile data. Please try again later."
//         );
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleUpdateProfile = async () => {
//     try {
//       const response = await axios.put(`${API_URL}/user/updateUserProfile`, {
//         userId,
//         firstName,
//         lastName,
//         phoneNumber,
//         gender,
//         selectedPreferences,
//       });

//       if (response.status === 200) {
//         await AsyncStorage.setItem("firstName", firstName);
//         await AsyncStorage.setItem("lastName", lastName);
//         await AsyncStorage.setItem("phoneNumber", phoneNumber);
//         await AsyncStorage.setItem("gender", gender);
//         await AsyncStorage.setItem(
//           "selectedPreferences",
//           JSON.stringify(selectedPreferences)
//         );

//         Alert.alert("Success", "Profile updated successfully!");
//         navigation.goBack();
//       } else {
//         Alert.alert("Error", "Failed to update profile. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error updating profile", error);
//       Alert.alert("Error", "Failed to update profile. Please try again.");
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Icon name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Edit Profile</Text>
//       </View>

//       <View style={styles.profileSection}>
//         {profileImage ? (
//           <Image source={{ uri: profileImage }} style={styles.profileImage} />
//         ) : (
//           <Image
//             source={require("../assets/updated-logo.png")}
//             style={styles.profileImage}
//           />
//         )}
//         <View style={styles.profileInfo}>
//           {/* Label for First Name */}
//           <Text style={styles.label}>First Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="First Name"
//             value={firstName}
//             onChangeText={setFirstName}
//           />

//           {/* Label for Last Name */}
//           <Text style={styles.label}>Last Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Last Name"
//             value={lastName}
//             onChangeText={setLastName}
//           />

//           {/* Label for Phone Number */}
//           <Text style={styles.label}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="numeric"
//           />

//           {/* Label for Gender */}
//           <Text style={styles.label}>Gender</Text>
//           <GenderDropdown gender={gender} onSelectGender={setGender} />

//           {/* Label for Preferences */}
//           <Text style={styles.label}>Preferences</Text>
//           <PreferencesDropdown
//             preferences={preferences}
//             selectedPreferences={selectedPreferences}
//             onSelect={setSelectedPreferences}
//           />
//         </View>
//       </View>

//       <TouchableOpacity
//         onPress={handleUpdateProfile}
//         style={styles.updateButton}
//       >
//         <Text style={styles.updateButtonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   backButton: {
//     padding: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     flex: 1,
//     textAlign: "center",
//   },
//   profileSection: {
//     alignItems: "center",
//     marginBottom: 20,
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 20,
//   },
//   profileInfo: {
//     width: "100%",
//   },
//   label: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 6,
//     marginLeft: 2,
//     fontWeight: "bold",
//   },
//   input: {
//     height: 40,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//   },
//   updateButton: {
//     backgroundColor: "#BF1013",
//     paddingVertical: 15,
//     borderRadius: 20,
//     alignItems: "center",
//     marginHorizontal: 16,
//   },
//   updateButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default EditProfileScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";
import {
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "react-native-image-picker";
import * as ImagePicker from "react-native-image-picker"; // Import Image Picker
import PreferencesDropdown from "../components/PreferencesDropdown";
import { getUserData, getUserId } from "../backend/registrationUtils";
import GenderDropdown from "../components/GenderDropdown";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profileImages, setProfileImages] = useState([]); // State to hold all images
  const [userId, setUserId] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await getUserId();
        setUserId(storedUserId);

        const response = await axios.get(`${API_URL}/user/${storedUserId}`);
        if (response.status === 200) {
          const userData = response.data;
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setPhoneNumber(
            userData.phoneNumber ? String(userData.phoneNumber) : ""
          );
          setGender(userData.gender || "");
          setProfileImages(userData.images || []); // Set all images from user data
          setSelectedPreferences(userData.selectedPreferences || []);
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later."
          );
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        Alert.alert(
          "Error",
          "Failed to load profile data. Please try again later."
        );
      }
    };

    fetchUserData();
  }, []);

  // Image picker function
  // const selectImage = async () => {
  //   const options = {
  //     mediaType: "photo",
  //     quality: 1,
  //   };

  //   try {
  //     const response = await launchImageLibrary(options);
  //     console.log("Image Picker:", launchImageLibrary);

  //     if (response.didCancel) {
  //       console.log("User cancelled image picker");
  //     } else if (response.error) {
  //       console.error("ImagePicker Error: ", response.error);
  //       Alert.alert("Error", "Failed to select image.");
  //     } else {
  //       const imageUri = response.assets[0].uri; // Ensure response.assets exists
  //       const uploadedImageUrl = await uploadImageToCloudinary(imageUri);
  //       setSelectedImage(uploadedImageUrl); // Set the new image URL
  //     }
  //   } catch (error) {
  //     console.error("Error launching image library", error);
  //     Alert.alert("Error", "Failed to launch image library.");
  //   }
  // };

  const selectImage = async () => {
    const options = {
      mediaTypes: MediaTypeOptions.Images, // Specify that we want images
      quality: 1,
    };

    try {
      const response = await launchImageLibraryAsync(options);

      if (response.canceled) {
        console.log("User cancelled image picker");
      } else {
        const imageUri = response.assets[0].uri;
        const uploadedImageUrl = await uploadImageToCloudinary(imageUri); // Ensure uploadImageToCloudinary is defined
        setSelectedImage(uploadedImageUrl); // Set the new image URL
      }
    } catch (error) {
      console.error("Error launching image picker: ", error);
      Alert.alert("Error", "Failed to select image.");
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // Adjust type if necessary
      name: "profile_image.jpg", // Adjust name if necessary
    });
    formData.append("upload_preset", "profilepic_preset"); // Add your Cloudinary preset
    formData.append("folder", "profile_pictures"); // Add your Cloudinary cloud name

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url; // Return the image URL
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedImages = selectedImage
        ? [...profileImages, selectedImage] // Add new image to the existing ones
        : profileImages;

      const response = await axios.put(`${API_URL}/user/updateUserProfile`, {
        userId,
        firstName,
        lastName,
        phoneNumber,
        gender,
        selectedPreferences,
        images: updatedImages, // Include all images
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("firstName", firstName);
        await AsyncStorage.setItem("lastName", lastName);
        await AsyncStorage.setItem("phoneNumber", phoneNumber);
        await AsyncStorage.setItem("gender", gender);
        await AsyncStorage.setItem(
          "selectedPreferences",
          JSON.stringify(selectedPreferences)
        );
        await AsyncStorage.setItem("images", JSON.stringify(updatedImages)); // Store all images

        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View> */}

      <View style={styles.profileSection}>
        <View style={styles.imageGallery}>
          {profileImages.length > 0 ? (
            profileImages.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={styles.profileImage}
              />
            ))
          ) : (
            <Text>No images uploaded.</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={selectImage}
          style={styles.changeImageButton}
        >
          <Text style={styles.changeImageButtonText}>Change Profile Image</Text>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Gender</Text>
          <GenderDropdown gender={gender} onSelectGender={setGender} />

          <Text style={styles.label}>Preferences</Text>
          <PreferencesDropdown
            preferences={preferences}
            selectedPreferences={selectedPreferences}
            onSelect={setSelectedPreferences}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleUpdateProfile}
        style={styles.updateButton}
      >
        <Text style={styles.updateButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  imageGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 4,
  },
  changeImageButton: {
    backgroundColor: "#BF1013",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  changeImageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileInfo: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: "#008CBA",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
