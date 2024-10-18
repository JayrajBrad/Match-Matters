// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "@env";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";
// import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY } from "@env";
// import { saveToken, getToken, clearToken } from "../backend/token";
// import { getUserId } from "../backend/registrationUtils";
// import FormData from "form-data";

// export default function PreferenceScreen({ navigation }) {
//   const [userData, setUserData] = useState();

//   useEffect(() => {
//     getAllUserData();
//   }, []);

//   const getAllUserData = async () => {
//     try {
//       const screens = [
//         "PhoneNum",
//         "Email",
//         "Password",
//         "Name",
//         "Age",
//         "Photos",
//         "Preference",
//       ];

//       let userData = {};

//       for (const screenName of screens) {
//         const screenData = await getRegistrationProgress(screenName);
//         if (screenData) {
//           userData = { ...userData, ...screenData };
//         }
//       }

//       setUserData(userData);
//     } catch (error) {
//       console.log("Error", error);
//     }
//   };

//   const clearAllScreenData = async () => {
//     try {
//       const screens = [
//         "PhoneNum",
//         "Email",
//         "Password",
//         "Name",
//         "Age",
//         "Photos",
//         "Preference",
//       ];

//       for (const screenName of screens) {
//         const key = `registration_progress_${screenName}`;
//         await AsyncStorage.removeItem(key);
//       }

//       console.log(
//         "All Screen Data Was Saved And Cleared For New Users....!!!!"
//       );
//     } catch (error) {
//       console.log("Error", error);
//     }
//   };

//   const validateUserData = (data) => {
//     const requiredFields = [
//       "phoneNumber",
//       "emailId",
//       "password",
//       "firstName",
//       "lastName",
//       "age",
//       "birthdate",
//       "gender",
//     ];
//     for (const field of requiredFields) {
//       if (!data[field]) {
//         console.log(`Missing required field: ${field}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const registerUser = async () => {
//     console.log(
//       "All The registration Details have been saved in the Async Local Storage for now!!"
//     );
//     console.log("data", userData);

//     if (!validateUserData(userData)) {
//       console.log("User data is incomplete.");
//       return; // Prevent sending incomplete data
//     }

//     // Upload images to Cloudinary and get their URLs
//     if (userData.images && Array.isArray(userData.images)) {
//       const uploadPromises = userData.images
//         .filter((imageUri) => imageUri) // Filter out null or undefined URIs
//         .map((imageUri) => uploadImageToCloudinary(imageUri)); // Assume this function returns a Promise

//       try {
//         const uploadedImageUrls = await Promise.all(uploadPromises);
//         userData.images = uploadedImageUrls; // Replace the local image URIs with Cloudinary URLs
//       } catch (uploadError) {
//         console.error("Error uploading images to Cloudinary:", uploadError);
//         return; // Handle upload error (optional: show a message to the user)
//       }
//     }

//     await sendData(userData); // Await sendData call
//     await clearAllScreenData();
//     navigation.navigate("HomeScreen", { userData }); // Navigate to ProfileScreen instead of HomeScreen
//   };

//   const uploadImageToCloudinary = async (imageUri) => {
//     const formData = new FormData();
//     console.log("Image URI to upload:", imageUri);

//     formData.append("file", {
//       uri: imageUri,
//       type: "image/jpeg",
//       name: "photo.jpg",
//     });
//     formData.append("upload_preset", "profilepic_preset"); // Make sure the name matches exactly
//     formData.append("folder", "profile_pictures"); // Optional: specify the folder if needed

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Image uploaded successfully:", response.data.secure_url);
//       return response.data.secure_url; // Return the URL of the uploaded image
//     } catch (error) {
//       console.error(
//         "Error uploading to Cloudinary:",
//         error.response?.data || error.message
//       );
//       throw error; // Propagate the error to be handled in registerUser
//     }
//   };

//   const sendData = async () => {
//     try {
//       const response = await axios.post(`${API_URL}/user/register`, userData, {
//         headers: { "Content-Type": "application/json" },
//         timeout: 60000,
//       });

//       // const response = await axios.post(`${API_URL}/user/register`, userData, {
//       //   headers: { "Content-Type": "application/json" },
//       //   timeout: 20000,
//       // });

//       console.log("Response from server:", response.data);

//       if (response.status === 200) {
//         console.log("User registered successfully!");

//         // Check if the token is in the response
//         const token = response.data.token;
//         const user = response.data.user;

//         if (token && user) {
//           await AsyncStorage.setItem("token", token); // Save the token
//           console.log("JWT token saved successfully!");

//           // // Save user data in AsyncStorage
//           // await AsyncStorage.setItem("userData", JSON.stringify(userData));
//           await AsyncStorage.setItem("userData", JSON.stringify(user));

//           await AsyncStorage.setItem("userId", user._id);

//           const userId = await getUserId();
//           console.log("New User ID:", userId);

//           await sendAuthenticatedRequest();
//         } else {
//           console.log("No token received from the server.");
//         }
//       } else {
//         console.log("Failed to register user. Status:", response.status);
//       }
//     } catch (error) {
//       console.error("Error registering user:", error.message);
//     }
//   };

//   const sendAuthenticatedRequest = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       console.log("Token:", token);

//       // Replace with the correct route
//       const fullUrl = `${API_URL}/user/getAllUsers`;
//       console.log("Requesting:", fullUrl);

//       const response = await axios.get(fullUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // console.log("Response data:", response.data);
//     } catch (error) {
//       console.error("Error in authenticated request:", error);
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

//         <Text style={styles.headTitle}>Complete Registration</Text>

//         <TouchableOpacity onPress={registerUser}>
//           <View style={styles.skipButton}>
//             <Text style={styles.skipText}>Register</Text>
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
//     // marginTop : 10,
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
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";
import { CLOUDINARY_CLOUD_NAME } from "@env";
import { getUserId } from "../backend/registrationUtils";
import FormData from "form-data";

export default function PreferenceScreen({ navigation }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getAllUserData();
  }, []);

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
        "Preference",
      ];

      let userData = {};

      // Fetch all stored data
      for (const screenName of screens) {
        const screenData = await getRegistrationProgress(screenName);
        if (screenData) {
          userData = { ...userData, ...screenData };
        }
      }

      // Fetch country, state, and city
      // const country = await getRegistrationProgress("Country");
      // const state = await getRegistrationProgress("State");
      // const city = await getRegistrationProgress("City");

      // // Add country, state, and city to userData
      // userData = { ...userData, country, state, city };
      console.log(userData);

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

  // Validate user data
  const validateUserData = (data) => {
    const requiredFields = [
      "phoneNumber",
      "emailId",
      "password",
      "username",
      // "firstName",
      // "lastName",
      "age",
      "birthdate",
      "gender",
      "countryName",
      "stateName",
      "cityName", // Ensure location fields are filled
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        return false;
      }
    }
    return true;
  };

  // Register the user
  const registerUser = async () => {
    console.log(
      "All The registration Details have been saved in the Async Local Storage for now!!"
    );
    console.log("data", userData);

    if (!validateUserData(userData)) {
      console.log("User data is incomplete.");
      return;
    }

    // Upload images to Cloudinary and get their URLs
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
    console.log("Image URI to upload:", imageUri);

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
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image uploaded successfully:", response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error(
        "Error uploading to Cloudinary:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const sendData = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
      });

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        console.log("User registered successfully!");

        const token = response.data.token;
        const user = response.data.user;

        if (token && user) {
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("userData", JSON.stringify(user));
          await AsyncStorage.setItem("userId", user._id);

          const userId = await getUserId();
          console.log("New User ID:", userId);

          await sendAuthenticatedRequest();
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

  const sendAuthenticatedRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      const fullUrl = `${API_URL}/user/getAllUsers`;
      console.log("Requesting:", fullUrl);

      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error in authenticated request:", error);
    }
  };

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.Back}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headTitle}>Complete Registration</Text>

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
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Back: {
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  headTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginVertical: 20,
  },
  skipButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF1013",
    marginVertical: 20,
  },
  skipText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
