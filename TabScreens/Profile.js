// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { UserContext } from "../navigation/UserProvider";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useFonts } from "expo-font";
// // import AppLoading from "expo-app-loading";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// const ProfileScreen = () => {
//   const insets = useSafeAreaInsets();

//   useEffect(() => {
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
//           CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
//         });
//         setFontsLoaded(true);
//       } catch (error) {
//         console.error("Error loading fonts:", error);
//       } finally {
//         SplashScreen.hideAsync();
//       }
//     }
//     loadFonts();
//   }, []);

//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status

//   const navigation = useNavigation();
//   const { user, userId, logoutUser } = useContext(UserContext);
//   const [activeTab, setActiveTab] = useState("Plans");

//   const handleEditProfile = () => {
//     navigation.navigate("EditProfileScreen");
//   };

//   const handleLogout = () => {
//     logoutUser(); // Call logoutUser from context
//     // props.navigation.navigate("Login"); // Navigate to the Login screen
//     navigation.navigate("AuthStack", { screen: "Login" });
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = async () => {
//     setRefreshing(true); // Set refreshing to true
//     await fetchBookedEvents(); // Fetch events again
//     setRefreshing(false); // Set refreshing to false after fetching
//   };

//   return (
//     <ScrollView
//       style={[styles.container, { paddingTop: insets.top }]}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
//       }
//     >
//       <View style={styles.itemContainer}>
//         {/* Membership Section */}
//         <View style={styles.profileSection}>
//           {user?.images && user.images.length > 0 ? (
//             <Image
//               source={{
//                 uri: `${user.images[0]}?timestamp=${new Date().getTime()}`, // Add a unique timestamp
//               }}
//               style={styles.profileImage}
//             />
//           ) : (
//             <Image
//               source={{ uri: "default_fallback_image_url" }} // Fallback image
//               style={styles.profileImage}
//             />
//           )}
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>
//               {user?.username ? `${user.username}, ${user.age}` : "Loading..."}
//             </Text>
//             <View style={styles.editProfile}>
//               <TouchableOpacity
//                 onPress={handleEditProfile}
//                 style={styles.editProfileButton}
//               >
//                 <Text style={styles.editProfileText}>Enhance your profile</Text>
//                 <Icon name="arrow-forward-ios" size={15} color="#000" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <View style={styles.quickActionRow}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => navigation.navigate("MyEvents")}
//             >
//               <Icon name="shopping-bag" size={20} color="#fff" />
//               <Text style={styles.actionButtonText}>My Events</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => navigation.navigate("MyBookingsScreen")}
//             >
//               <Icon name="favorite" size={20} color="#fff" />
//               <Text style={styles.actionButtonText}>My Bookings</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.activitySection}>
//           <Text style={styles.boxTitle}>Activity</Text>

//           {/* <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("AllEvents")}
//           >
//             <Text style={styles.buttonText}>All Events</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity> */}
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("CouponScreen")}
//           >
//             <Text style={styles.buttonText}>My Coupons</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("HelpScreen")}
//           >
//             <Text style={styles.buttonText}>Help</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("PrivacyCenterScreen")}
//           >
//             <Text style={styles.buttonText}>Privacy</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("ContactUsScreen")}
//           >
//             <Text style={styles.buttonText}>Contact Us</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("FAQScreen")}
//           >
//             <Text style={styles.buttonText}>FAQ</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.ordersSection}>
//           <View style={styles.orderLine}>
//             {/* <Text style={styles.sectionTitle}>Logout</Text> */}
//           </View>
//           <View style={styles.orderBorder}>
//             <Text style={styles.noOrdersText}>Leaving us?</Text>
//             <TouchableOpacity
//               style={styles.shopNowButton}
//               onPress={handleLogout}
//             >
//               <Text style={styles.shopButtonText}>Logout</Text>
//               <Icon name="arrow-right" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   logoutButton: {
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: "#f44336", // Red color for logout button
//     marginTop: "auto", // Push the button to the bottom
//     marginBottom: 20,
//     borderRadius: 8,
//     marginHorizontal: 10,
//   },
//   logoutButtonText: {
//     color: "white",
//     fontSize: 16,
//     textAlign: "center",
//     fontFamily: "CenturyGothic",
//   },
//   profileImage: {
//     width: 100, // Adjust as needed
//     height: 100, // Adjust as needed
//     borderRadius: 15, // For circular images
//     resizeMode: "cover", // Ensures the image is scaled to fill
//     backgroundColor: "#f0f0f0",
//     marginRight: 20,
//     marginHorizontal: 40,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 22,
//     fontFamily: "CenturyGothicBold",
//     color: "#290F4C",
//   },
//   // editProfile: {
//   //   flexDirection: "row",
//   // },
//   editProfileButton: {
//     marginTop: 10,
//     backgroundColor: "#FEF1F1",
//     borderRadius: 5,
//     width: 180,
//     padding: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   editProfileText: {
//     color: "#290F4C",
//     fontFamily: "CenturyGothic",
//   },
//   itemContainer: {
//     marginTop: 30,
//   },
//   membershipSection: {
//     padding: 20,
//     alignItems: "center",
//   },
//   membershipButton: {
//     backgroundColor: "#814C68",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#fff",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#814C68",
//     fontSize: 16,
//     fontFamily: "CenturyGothic",
//   },
//   quickActions: {
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 20,
//   },
//   quickActionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   actionButton: {
//     backgroundColor: "#814C68",
//     padding: 10,
//     borderRadius: 10,
//     width: "48%",
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   actionButtonText: {
//     color: "#fff",
//     marginLeft: 5,
//     fontFamily: "CenturyGothic",
//   },
//   ordersSection: {
//     padding: 20,
//     marginBottom: 60,
//   },
//   orderLine: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },
//   orderBorder: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//     borderColor: "#ddd",
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     fontFamily: "CenturyGothic",
//   },
//   seeAllText: {
//     color: "#000",
//     textDecorationLine: "underline",
//     fontFamily: "CenturyGothic",
//   },
//   noOrdersText: {
//     marginBottom: 10,
//     color: "#814C68",
//     fontSize: 18,
//     fontFamily: "CenturyGothic",
//   },
//   shopNowButton: {
//     backgroundColor: "#814C68",
//     padding: 10,
//     margin: 5,
//     borderRadius: 10,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   shopButtonText: {
//     color: "#fff",
//     marginRight: 5,
//     fontFamily: "CenturyGothic",
//   },
//   accountSection: {
//     padding: 20,
//     borderWidth: 1,
//     borderColor: "#814C68",
//     borderRadius: 10,
//     margin: 10,
//   },
//   accountButton: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#290F4C",
//     paddingVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   activitySection: {
//     padding: 20,
//     backgroundColor: "#fff",

//     borderWidth: 1,
//     borderRadius: 10,
//     margin: 10,
//     // marginBottom: 100,
//   },
//   activityButton: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#290F4C",
//     paddingVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   boxTitle: {
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//     color: "#814C68",
//     textAlign: "center",
//     marginBottom: 10,
//   },
// });

// export default ProfileScreen;

// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { UserContext } from "../navigation/UserProvider";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { API_URL } from "@env";
// import axios from "axios";

// const ProfileScreen = () => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const { user, logoutUser } = useContext(UserContext);
//   const [refreshing, setRefreshing] = useState(false);
//   const [profileImageUrl, setProfileImageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch only the first image from AWS S3
//   useEffect(() => {
//     async function fetchProfileImageUrl() {
//       console.log("User data:", user); // Debugging: Check if user object has latest data

//       if (user?.images && user.images.length > 0) {
//         try {
//           setLoading(true);

//           const imageKey = user.images[0]; // Get first image key
//           console.log("Fetching image key:", imageKey);

//           // Ensure the key exists in the database user object
//           if (!user.images.includes(imageKey)) {
//             console.error(
//               "Error: Image key does not exist in user images array!"
//             );
//             return;
//           }

//           const response = await axios.get(
//             `${API_URL}/api/s3-presigned-url?key=${encodeURIComponent(
//               imageKey
//             )}`
//           );

//           if (response.status === 200) {
//             console.log(
//               "Pre-signed URL fetched successfully:",
//               response.data.preSignedUrl
//             );
//             setProfileImageUrl(response.data.preSignedUrl);
//           } else {
//             console.error("Error fetching image URL");
//           }
//         } catch (error) {
//           console.error("Error fetching pre-signed URL:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         console.warn("No images found for user.");
//         setLoading(false);
//       }
//     }

//     fetchProfileImageUrl();
//   }, [user]); // Runs when `user` updates

//   return (
//     <ScrollView
//       style={[styles.container, { paddingTop: insets.top }]}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={() => {
//             setRefreshing(true);
//             fetchProfileImageUrl().then(() => setRefreshing(false));
//           }}
//         />
//       }
//     >
//       <View style={styles.itemContainer}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           {loading ? (
//             <ActivityIndicator size="large" color="#814C68" />
//           ) : profileImageUrl ? (
//             <Image
//               source={{
//                 uri: profileImageUrl
//                   ? `${profileImageUrl}&t=${Date.now()}`
//                   : "default_fallback_image_url",
//               }}
//               style={styles.profileImage}
//             />
//           ) : (
//             <Image
//               source={{ uri: "default_fallback_image_url" }}
//               style={styles.profileImage}
//             />
//           )}

//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>
//               {user?.username ? `${user.username}, ${user.age}` : "Loading..."}
//             </Text>
//             <TouchableOpacity
//               onPress={() => navigation.navigate("EditProfileScreen")}
//               style={styles.editProfileButton}
//             >
//               <Text style={styles.editProfileText}>Enhance your profile</Text>
//               <Icon name="arrow-forward-ios" size={15} color="#000" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 15,
//     resizeMode: "cover",
//     backgroundColor: "#f0f0f0",
//     marginRight: 20,
//     marginHorizontal: 40,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 22,
//     fontFamily: "CenturyGothicBold",
//     color: "#290F4C",
//   },
//   editProfileButton: {
//     marginTop: 10,
//     backgroundColor: "#FEF1F1",
//     borderRadius: 5,
//     width: 180,
//     padding: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   editProfileText: {
//     color: "#290F4C",
//     fontFamily: "CenturyGothic",
//   },
//   itemContainer: {
//     marginTop: 30,
//   },
// });

// export default ProfileScreen;

// import React, { useState, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { UserContext } from "../navigation/UserProvider";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import axios from "axios";
// import { API_URL } from "@env";

// const ProfileScreen = () => {
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const { user, logoutUser } = useContext(UserContext);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch the pre-signed URL for the first image when user data loads or changes
//   const [profileImageUrl, setProfileImageUrl] = useState(null);

//   // Fetch only the first image
//   useEffect(() => {
//     async function fetchProfileImageUrl() {
//       if (user?.images && user.images.length > 0) {
//         try {
//           // Fetch the pre-signed GET URL using `fetch()`
//           const response = await fetch(
//             `${API_URL}/api/s3-presigned-url?key=${encodeURIComponent(
//               user.images[0]
//             )}`
//           );

//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }

//           const data = await response.json(); // Parse JSON response

//           // Log the response
//           console.log("Pre-signed GET URL:", data.preSignedUrl);

//           // Set the image URL
//           setProfileImageUrl(data.preSignedUrl);
//         } catch (error) {
//           console.error("Error fetching pre-signed URL:", error);
//         }
//       }
//     }

//     fetchProfileImageUrl();
//   }, [user]);
//   const handleEditProfile = () => {
//     navigation.navigate("EditProfileScreen");
//   };

//   const handleLogout = () => {
//     logoutUser();
//     navigation.navigate("AuthStack", { screen: "Login" });
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = async () => {
//     setRefreshing(true);
//     // You can add code here to refresh user data if needed.
//     setRefreshing(false);
//   };

//   return (
//     <ScrollView
//       style={[styles.container, { paddingTop: insets.top }]}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <View style={styles.itemContainer}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           {console.log(profileImageUrl)}
//           {profileImageUrl ? (
//             <Image
//               source={{ uri: profileImageUrl }}
//               style={styles.profileImage}
//             />
//           ) : (
//             <Image
//               source={{ uri: "default_fallback_image_url" }} // Replace with a fallback image
//               style={styles.profileImage}
//             />
//           )}
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>
//               {user?.username ? `${user.username}, ${user.age}` : "Loading..."}
//             </Text>
//             <TouchableOpacity
//               onPress={handleEditProfile}
//               style={styles.editProfileButton}
//             >
//               <Text style={styles.editProfileText}>Enhance your profile</Text>
//               <Icon name="arrow-forward-ios" size={15} color="#000" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           <View style={styles.quickActionRow}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => navigation.navigate("MyEvents")}
//             >
//               <Icon name="shopping-bag" size={20} color="#fff" />
//               <Text style={styles.actionButtonText}>My Events</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => navigation.navigate("MyBookingsScreen")}
//             >
//               <Icon name="favorite" size={20} color="#fff" />
//               <Text style={styles.actionButtonText}>My Bookings</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Activity Section */}
//         <View style={styles.activitySection}>
//           <Text style={styles.boxTitle}>Activity</Text>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("CouponScreen")}
//           >
//             <Text style={styles.buttonText}>My Coupons</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("HelpScreen")}
//           >
//             <Text style={styles.buttonText}>Help</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("PrivacyCenterScreen")}
//           >
//             <Text style={styles.buttonText}>Privacy</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("ContactUsScreen")}
//           >
//             <Text style={styles.buttonText}>Contact Us</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.activityButton}
//             onPress={() => navigation.navigate("FAQScreen")}
//           >
//             <Text style={styles.buttonText}>FAQ</Text>
//             <Icon name="arrow-forward-ios" size={15} color="#000" />
//           </TouchableOpacity>
//         </View>

//         {/* Logout Section */}
//         <View style={styles.ordersSection}>
//           <View style={styles.orderBorder}>
//             <Text style={styles.noOrdersText}>Leaving us?</Text>
//             <TouchableOpacity
//               style={styles.shopNowButton}
//               onPress={handleLogout}
//             >
//               <Text style={styles.shopButtonText}>Logout</Text>
//               <Icon name="arrow-right" size={20} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 15,
//     resizeMode: "cover",
//     backgroundColor: "#f0f0f0",
//     marginRight: 20,
//     marginHorizontal: 40,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 22,
//     fontFamily: "CenturyGothicBold",
//     color: "#290F4C",
//   },
//   editProfileButton: {
//     marginTop: 10,
//     backgroundColor: "#FEF1F1",
//     borderRadius: 5,
//     width: 180,
//     padding: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   editProfileText: {
//     color: "#290F4C",
//     fontFamily: "CenturyGothic",
//   },
//   itemContainer: {
//     marginTop: 30,
//   },
//   quickActions: {
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 20,
//   },
//   quickActionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   actionButton: {
//     backgroundColor: "#814C68",
//     padding: 10,
//     borderRadius: 10,
//     width: "48%",
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   actionButtonText: {
//     color: "#fff",
//     marginLeft: 5,
//     fontFamily: "CenturyGothic",
//   },
//   activitySection: {
//     padding: 20,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderRadius: 10,
//     margin: 10,
//   },
//   activityButton: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#290F4C",
//     paddingVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   boxTitle: {
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//     color: "#814C68",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "#814C68",
//     fontSize: 16,
//     fontFamily: "CenturyGothic",
//   },
//   ordersSection: {
//     padding: 20,
//     marginBottom: 60,
//   },
//   orderBorder: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//     borderColor: "#ddd",
//   },
//   noOrdersText: {
//     marginBottom: 10,
//     color: "#814C68",
//     fontSize: 18,
//     fontFamily: "CenturyGothic",
//   },
//   shopNowButton: {
//     backgroundColor: "#814C68",
//     padding: 10,
//     margin: 5,
//     borderRadius: 10,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   shopButtonText: {
//     color: "#fff",
//     marginRight: 5,
//     fontFamily: "CenturyGothic",
//   },
// });

// export default ProfileScreen;

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../navigation/UserProvider";
import { API_URL } from "@env";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, logoutUser } = useContext(UserContext); // from context
  const [profileData, setProfileData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // 1) Get user data (username, age, images) from DB using Axios
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      if (response.status === 200) {
        console.log("Fetched profile data:", response.data);
        setProfileData(response.data);

        // If user has images, fetch the pre-signed S3 URL using fetch
        const { images } = response.data;
        if (images && images.length > 0) {
          fetchProfileImageUrl(images[0]);
        } else {
          setProfileImageUrl(null);
        }
      }
    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // 2) Fetch the pre-signed S3 URL using the native fetch API (NOT Axios)
  const fetchProfileImageUrl = async (imageKey) => {
    try {
      const encodedKey = encodeURIComponent(imageKey);
      const res = await fetch(
        `${API_URL}/api/s3-presigned-url?key=${encodedKey}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch S3 URL: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched S3 pre-signed URL (via fetch):", data.preSignedUrl);
      setProfileImageUrl(data.preSignedUrl);
    } catch (error) {
      console.error("Error fetching S3 pre-signed URL:", error);
      setProfileImageUrl(null);
    }
  };

  // 3) Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  // 4) Handle logout
  const handleLogout = () => {
    logoutUser();
    navigation.navigate("AuthStack", { screen: "Login" });
  };

  // Loading spinner while fetching data
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // If no data found (error or empty)
  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>Failed to load profile data.</Text>
      </View>
    );
  }

  const { username, age } = profileData;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: profileImageUrl
              ? profileImageUrl
              : "https://via.placeholder.com/100x100.png?text=No+Image",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {username ? `${username}, ${age}` : "No username"}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfileScreen")}
            style={styles.editProfileButton}
          >
            <Text style={styles.editProfileText}>Enhance your profile</Text>
            <Icon name="arrow-forward-ios" size={15} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Example activity section */}
      <View style={styles.activitySection}>
        <Text style={styles.boxTitle}>Activity</Text>
        <TouchableOpacity style={styles.activityButton}>
          <Text style={styles.buttonText}>My Coupons</Text>
          <Icon name="arrow-forward-ios" size={15} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

/* ----------- Styles ----------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#814C68",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#290F4C",
  },
  editProfileButton: {
    marginTop: 10,
    backgroundColor: "#FEF1F1",
    borderRadius: 5,
    width: 180,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editProfileText: {
    color: "#290F4C",
  },
  activitySection: {
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    margin: 10,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#814C68",
    textAlign: "center",
    marginBottom: 10,
  },
  activityButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#290F4C",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    color: "#814C68",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#814C68",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
  },
});
