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

////////multiple//////////////
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
//   KeyboardAvoidingView,
//   ActivityIndicator,
//   Button,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { API_URL, CLOUDINARY_CLOUD_NAME } from "@env";
// import * as ImagePicker from "expo-image-picker"; // Import Expo ImagePicker
// import PreferencesDropdown from "../components/PreferencesDropdown";
// import { getUserData, getUserId } from "../backend/registrationUtils";
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
//   const [profileImages, setProfileImages] = useState([]);
//   const [userId, setUserId] = useState("");
//   const [selectedPreferences, setSelectedPreferences] = useState([]);
//   const [loading, setLoading] = useState(false); // Add loading state

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true); // Start loading
//       try {
//         const storedUserId = await getUserId();
//         setUserId(storedUserId);

//         const response = await axios.get(`${API_URL}/user/${storedUserId}`);
//         if (response.status === 200) {
//           const userData = response.data;
//           setFirstName(userData.firstName || "");
//           setLastName(userData.lastName || "");
//           setPhoneNumber(
//             userData.phoneNumber ? String(userData.phoneNumber) : ""
//           );
//           setGender(userData.gender || "");
//           setProfileImages(userData.images || []);
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
//       } finally {
//         setLoading(false); // End loading
//       }
//     };

//     fetchUserData();
//   }, []);

//   const requestPermission = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission required",
//         "You need to grant permission to access the photo library."
//       );
//     }
//   };

//   const changeProfileImage = async (index) => {
//     await requestPermission();

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const imageUri = result.assets[0].uri; // Get the image URI
//       console.log("Image selected URI:", imageUri);
//       uploadImageToCloudinary(imageUri, index); // Pass the correct URI and index
//     } else {
//       console.log("User cancelled image picker");
//     }
//   };

//   const uploadImageToCloudinary = async (source, index) => {
//     if (!source) {
//       console.error("Source is undefined or empty");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", {
//         uri: source,
//         type: "image/png", // Ensure the MIME type matches the selected file
//         name: "photo.png", // Provide the correct file extension and name
//       });
//       formData.append("upload_preset", "profilepic_preset");
//       formData.append("folder", "profile_pictures");

//       const uploadResponse = await axios.post(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       const imageUrl = uploadResponse.data.secure_url;
//       console.log("Cloudinary upload response:", uploadResponse.data);
//       console.log("Image URL:", imageUrl); // Log the successful upload URL

//       await updateProfileImage(userId, imageUrl, index); // Pass index to update the correct image
//     } catch (error) {
//       console.error("Error uploading image to Cloudinary:", error);
//       Alert.alert("Error", "Failed to upload image. Please try again.");
//     }
//   };

//   const updateProfileImage = async (userId, imageUrl, index) => {
//     try {
//       const updatedImages = [...profileImages];
//       updatedImages[index] = imageUrl; // Update the specific image in the array

//       console.log("Updating profile images:", updatedImages);

//       const response = await axios.put(
//         `${API_URL}/user/${userId}/update-profile-image`,
//         {
//           images: updatedImages, // Pass the updated images array
//         },
//         { timeout: 10000 }
//       );

//       if (response.status === 200) {
//         setProfileImages(updatedImages); // Update the state with the new images
//         console.log("Profile image updated successfully");
//       }
//     } catch (error) {
//       console.error(
//         "Error updating profile image:",
//         error.response ? error.response.data : error
//       );
//       Alert.alert("Error", "Failed to update profile image. Please try again.");
//     }
//   };

//   const handleUpdateProfile = async () => {
//     setLoading(true); // Start loading
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
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <ScrollView style={styles.container}>
//         <View style={styles.profileSection}>
//           {/* Image gallery */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.imageGallery}
//           >
//             {profileImages.length > 0 ? (
//               profileImages.map((uri, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => changeProfileImage(index)}
//                 >
//                   <Image
//                     source={{ uri }}
//                     style={styles.profileImage} // Use defined styles for images
//                   />
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <Text>No Profile Image Available</Text>
//             )}
//             <Button
//               title="Add Profile Image"
//               onPress={() => changeProfileImage(profileImages.length)}
//             />
//           </ScrollView>

//           {/* Profile Info Fields */}
//           <View style={styles.profileInfo}>{/* Input fields here */}</View>
//         </View>

//         <View style={styles.profileInfo}>
//           <Text style={styles.label}>First Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="First Name"
//             value={firstName}
//             onChangeText={setFirstName}
//           />

//           <Text style={styles.label}>Last Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Last Name"
//             value={lastName}
//             onChangeText={setLastName}
//           />

//           <Text style={styles.label}>Phone Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="numeric"
//           />

//           <Text style={styles.label}>Gender</Text>
//           <GenderDropdown gender={gender} onSelectGender={setGender} />

//           <Text style={styles.label}>Preferences</Text>
//           <PreferencesDropdown
//             preferences={preferences}
//             selectedPreferences={selectedPreferences}
//             onSelect={setSelectedPreferences}
//           />
//         </View>

//         {/* Update Button */}
//         {loading ? (
//           <ActivityIndicator size="large" color="#007BFF" /> // Loader while updating
//         ) : (
//           <TouchableOpacity
//             style={styles.updateButton}
//             onPress={handleUpdateProfile}
//           >
//             <Text style={styles.updateButtonText}>Update Profile</Text>
//           </TouchableOpacity>
//         )}
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   profileSection: {
//     marginBottom: 20,
//   },
//   imageGallery: {
//     flexDirection: "row",
//     marginBottom: 20,
//     padding: 5,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 10,
//     backgroundColor: "#f0f0f0", // Placeholder background color
//   },
//   profileInfo: {
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//   },
//   updateButton: {
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   updateButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default EditProfileScreen;

// ///////////BEST WORKING/////////////
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
//   KeyboardAvoidingView,
//   ActivityIndicator,
//   Button,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { API_URL, CLOUDINARY_CLOUD_NAME } from "@env";
// import * as ImagePicker from "expo-image-picker"; // Import Expo ImagePicker
// import PreferencesDropdown from "../components/PreferencesDropdown";
// import { getUserData, getUserId } from "../backend/registrationUtils";
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
//   const [profileImages, setProfileImages] = useState([]);
//   const [userId, setUserId] = useState("");
//   const [selectedPreferences, setSelectedPreferences] = useState([]);
//   const [loading, setLoading] = useState(false); // Add loading state

//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true); // Start loading
//       try {
//         const storedUserId = await getUserId();
//         setUserId(storedUserId);

//         const response = await axios.get(`${API_URL}/user/${storedUserId}`);
//         if (response.status === 200) {
//           const userData = response.data;
//           setFirstName(userData.firstName || "");
//           setLastName(userData.lastName || "");
//           setPhoneNumber(
//             userData.phoneNumber ? String(userData.phoneNumber) : ""
//           );
//           setGender(userData.gender || "");
//           setProfileImages(userData.images || []);
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
//       } finally {
//         setLoading(false); // End loading
//       }
//     };

//     fetchUserData();
//   }, []);

//   const requestPermission = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert(
//         "Permission required",
//         "You need to grant permission to access the photo library."
//       );
//     }
//   };

//   const changeProfileImage = async (index) => {
//     await requestPermission();

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const imageUri = result.assets[0].uri; // Get the image URI
//       console.log("Image selected URI:", imageUri);
//       uploadImageToCloudinary(imageUri, index); // Pass the correct URI and index
//     } else {
//       console.log("User cancelled image picker");
//     }
//   };

//   const uploadImageToCloudinary = async (source, index) => {
//     if (!source) {
//       console.error("Source is undefined or empty");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", {
//         uri: source,
//         type: "image/png", // Ensure the MIME type matches the selected file
//         name: "photo.png", // Provide the correct file extension and name
//       });
//       formData.append("upload_preset", "profilepic_preset");
//       formData.append("folder", "profile_pictures");

//       const uploadResponse = await axios.post(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       const imageUrl = uploadResponse.data.secure_url;
//       console.log("Cloudinary upload response:", uploadResponse.data);
//       console.log("Image URL:", imageUrl); // Log the successful upload URL

//       await updateProfileImage(userId, imageUrl, index); // Pass index to update the correct image
//     } catch (error) {
//       console.error("Error uploading image to Cloudinary:", error);
//       Alert.alert("Error", "Failed to upload image. Please try again.");
//     }
//   };

//   const updateProfileImage = async (userId, imageUrl, index) => {
//     try {
//       const updatedImages = [...profileImages];
//       updatedImages[index] = imageUrl; // Update the specific image in the array

//       console.log("Updating profile images:", updatedImages);

//       const response = await axios.put(
//         `${API_URL}/user/${userId}/update-profile-image`,
//         {
//           images: updatedImages, // Pass the updated images array
//         },
//         { timeout: 10000 }
//       );

//       if (response.status === 200) {
//         setProfileImages(updatedImages); // Update the state with the new images
//         console.log("Profile image updated successfully");
//       }
//     } catch (error) {
//       console.error(
//         "Error updating profile image:",
//         error.response ? error.response.data : error
//       );
//       Alert.alert("Error", "Failed to update profile image. Please try again.");
//     }
//   };

//   const handleUpdateProfile = async () => {
//     setLoading(true); // Start loading
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
//     } finally {
//       setLoading(false); // End loading
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <ScrollView style={styles.container}>
//         <View style={styles.profileSection}>
//           {/* Image gallery */}
//           {/* <View style={styles.imageContainer}>
//             {profileImages.length > 0 ? (
//               profileImages.map((uri, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => changeProfileImage(index)}
//                   style={styles.profileImageWrapper}
//                 >
//                   <Image
//                     source={{ uri }}
//                     style={styles.profileImage} // Use defined styles for images
//                   />
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <Text>No Profile Image Available</Text>
//             )}
//             <TouchableOpacity
//               onPress={() => changeProfileImage(profileImages.length)}
//               style={styles.addImageButtonWrapper}
//             >
//               <Text style={{ fontSize: 24, color: "#007BFF" }}>+</Text>
//             </TouchableOpacity>
//           </View> */}
//           <View style={styles.imageContainer}>
//             {profileImages.length > 0 ? (
//               profileImages.map((uri, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => changeProfileImage(index)}
//                   style={styles.profileImageWrapper}
//                 >
//                   <Image
//                     source={{ uri }}
//                     style={styles.profileImage} // Use defined styles for images
//                   />
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <Text>No Profile Image Available</Text>
//             )}

//             {/* Show the + button only if there are less than 4 images */}
//             {profileImages.length < 4 && (
//               <TouchableOpacity
//                 onPress={() => changeProfileImage(profileImages.length)}
//                 style={styles.addImageButtonWrapper}
//               >
//                 <Text style={{ fontSize: 24, color: "#007BFF" }}>+</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Profile Info Fields */}
//           <View style={styles.profileInfo}>
//             <Text style={styles.label}>First Name</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="First Name"
//               value={firstName}
//               onChangeText={setFirstName}
//             />

//             <Text style={styles.label}>Last Name</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Last Name"
//               value={lastName}
//               onChangeText={setLastName}
//             />

//             <Text style={styles.label}>Phone Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//               keyboardType="numeric"
//             />

//             <Text style={styles.label}>Gender</Text>
//             <GenderDropdown gender={gender} onSelectGender={setGender} />

//             <Text style={styles.label}>Preferences</Text>
//             <PreferencesDropdown
//               preferences={preferences}
//               selectedPreferences={selectedPreferences}
//               onSelect={setSelectedPreferences}
//             />
//           </View>

//           {/* Update Button */}
//           {loading ? (
//             <ActivityIndicator size="large" color="#007BFF" /> // Loader while updating
//           ) : (
//             <TouchableOpacity
//               style={styles.updateButton}
//               onPress={handleUpdateProfile}
//             >
//               <Text style={styles.updateButtonText}>Update Profile</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },
//   profileSection: {
//     marginBottom: 20,
//   },
//   imageContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   profileImageWrapper: {
//     margin: 5,
//     position: "relative", // Required for absolute delete icon positioning
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   deleteIconWrapper: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     backgroundColor: "rgba(255, 255, 255, 0.7)",
//     borderRadius: 50,
//     padding: 5,
//   },
//   addImageButtonWrapper: {
//     margin: 5,
//     justifyContent: "center",
//     alignItems: "center",
//     width: 100,
//     height: 100,
//     borderWidth: 1,
//     borderColor: "#007BFF",
//     borderRadius: 50,
//   },
//   profileInfo: {
//     marginBottom: 20,
//   },
//   label: {
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
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
  KeyboardAvoidingView,
  ActivityIndicator,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, CLOUDINARY_CLOUD_NAME } from "@env";
import * as ImagePicker from "expo-image-picker"; // Import Expo ImagePicker
import PreferencesDropdown from "../components/PreferencesDropdown";
import { getUserData, getUserId } from "../backend/registrationUtils";
import GenderDropdown from "../components/GenderDropdown";
import { Ionicons } from "@expo/vector-icons"; // For delete icon

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
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profileImages, setProfileImages] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [showDeleteIcon, setShowDeleteIcon] = useState(null); // Track which image is being long-pressed

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Start loading
      try {
        const storedUserId = await getUserId();
        setUserId(storedUserId);

        const response = await axios.get(`${API_URL}/user/${storedUserId}`);
        if (response.status === 200) {
          const userData = response.data;
          // setFirstName(userData.firstName || "");
          // setLastName(userData.lastName || "");
          setUsername(userData.username || "");
          setPhoneNumber(
            userData.phoneNumber ? String(userData.phoneNumber) : ""
          );
          setGender(userData.gender || "");
          setProfileImages(userData.images || []);
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
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUserData();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "You need to grant permission to access the photo library."
      );
    }
  };

  const changeProfileImage = async (index) => {
    await requestPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri; // Get the image URI
      console.log("Image selected URI:", imageUri);
      uploadImageToCloudinary(imageUri, index); // Pass the correct URI and index
    } else {
      console.log("User cancelled image picker");
    }
  };

  const uploadImageToCloudinary = async (source, index) => {
    if (!source) {
      console.error("Source is undefined or empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: source,
        type: "image/png", // Ensure the MIME type matches the selected file
        name: "photo.png", // Provide the correct file extension and name
      });
      formData.append("upload_preset", "profilepic_preset");
      formData.append("folder", "profile_pictures");

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = uploadResponse.data.secure_url;
      console.log("Cloudinary upload response:", uploadResponse.data);
      console.log("Image URL:", imageUrl); // Log the successful upload URL

      await updateProfileImage(userId, imageUrl, index); // Pass index to update the correct image
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const updateProfileImage = async (userId, imageUrl, index) => {
    try {
      const updatedImages = [...profileImages];
      updatedImages[index] = imageUrl; // Update the specific image in the array

      console.log("Updating profile images:", updatedImages);

      const response = await axios.put(
        `${API_URL}/user/${userId}/update-profile-image`,
        {
          images: updatedImages, // Pass the updated images array
        },
        { timeout: 10000 }
      );

      if (response.status === 200) {
        setProfileImages(updatedImages); // Update the state with the new images
        console.log("Profile image updated successfully");
      }
    } catch (error) {
      console.error(
        "Error updating profile image:",
        error.response ? error.response.data : error
      );
      Alert.alert("Error", "Failed to update profile image. Please try again.");
    }
  };

  const handleDeleteImage = async (index) => {
    try {
      const updatedImages = [...profileImages];
      const imageUrlToDelete = updatedImages.splice(index, 1)[0]; // Remove the image from the array

      console.log("Deleting image URL:", imageUrlToDelete);

      const response = await axios.delete(
        `${API_URL}/user/${userId}/delete-profile-image`,
        {
          data: { imageUrl: imageUrlToDelete }, // Send image URL to backend for deletion
        }
      );

      if (response.status === 200) {
        setProfileImages(updatedImages); // Update the state with the new images
        setShowDeleteIcon(null); // Hide delete icon after deletion
        console.log("Profile image deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete image. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error deleting profile image:",
        error.response ? error.response.data : error
      );
      Alert.alert("Error", "Failed to delete image. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.put(`${API_URL}/user/updateUserProfile`, {
        userId,
        // firstName,
        // lastName,
        username,
        phoneNumber,
        gender,
        selectedPreferences,
      });

      if (response.status === 200) {
        // await AsyncStorage.setItem("firstName", firstName);
        // await AsyncStorage.setItem("lastName", lastName);
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
      console.error("Error updating profile", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          {/* Image gallery */}
          <View style={styles.imageContainer}>
            {profileImages.length > 0 ? (
              profileImages.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onLongPress={() => setShowDeleteIcon(index)} // Show delete icon on long press
                  onPress={() => changeProfileImage(index)} // Allow changing image
                  style={styles.profileImageWrapper}
                >
                  <Image
                    source={{ uri }}
                    style={styles.profileImage} // Use defined styles for images
                  />
                  {showDeleteIcon === index && (
                    <TouchableOpacity
                      style={styles.deleteIconWrapper}
                      onPress={() => handleDeleteImage(index)} // Delete image on icon press
                    >
                      <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text>No Profile Image Available</Text>
            )}
            {/* Show the + button only if there are less than 4 images */}
            {profileImages.length < 4 && (
              <TouchableOpacity
                onPress={() => changeProfileImage(profileImages.length)}
                style={styles.addImageButtonWrapper}
              >
                <Text style={{ fontSize: 24, color: "#007BFF" }}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Info Fields */}
          {/* <View style={styles.profileInfo}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              placeholder="Enter your first name"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder="Enter your last name"
            /> */}
          {/* Profile Info Fields */}
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(text) => setUsername(text)}
              placeholder="Enter your username"
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <GenderDropdown gender={gender} onSelectGender={setGender} />
          </View>

          {/* Preferences Dropdown */}
          <PreferencesDropdown
            preferences={preferences}
            selectedPreferences={selectedPreferences}
            onSelect={setSelectedPreferences}
          />

          {/* Save Button */}
          <Button
            title="Save Profile"
            // onPress={() => console.log("Save Profile")}
            onPress={handleUpdateProfile}
            disabled={loading} // Disable button while loading
          />

          {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profileSection: {
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Enable wrapping to the next line
    justifyContent: "space-between", // Distribute images evenly
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: "48%", // Two images per row with spacing
    aspectRatio: 1, // Ensure the container is square
    position: "relative", // Required for absolute positioning of the delete icon
    marginBottom: 10, // Add space between rows
  },

  profileImage: {
    width: "100%", // Image fills the wrapper
    height: "100%",
    borderRadius: 8,
  },
  deleteIconWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    borderRadius: 50,
    padding: 5,
    zIndex: 10, // Ensure the delete icon appears above the image
  },
  addImageButtonWrapper: {
    width: "48%", // Same size as images
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  profileInfo: {
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
