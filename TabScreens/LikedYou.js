// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Animated,
//   RefreshControl,
// } from "react-native";
// import React, { useEffect, useRef, useState, useContext } from "react";
// import axios from "axios";
// import { API_URL } from "@env";
// import { UserContext } from "../navigation/UserProvider";
// import LottieView from "lottie-react-native";
// import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// import { useFocusEffect } from "@react-navigation/native";

// export default function Profile({ navigation }) {
//   const fadeAnimation = useRef(new Animated.Value(0)).current;

//   const insets = useSafeAreaInsets();

//   const animationRef = useRef(null);

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

//   const [events, setEvents] = useState([]);
//   const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status
//   const { userId } = useContext(UserContext);
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   useEffect(() => {
//     if (userId) {
//       fetchBookedEvents();
//     }
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       // If the animation exists, reset it & play
//       if (animationRef.current) {
//         animationRef.current.reset();
//         animationRef.current.play();
//       }
//     }, [])
//   );

//   // Function to fetch booked events for the user
//   const fetchBookedEvents = async () => {
//     try {
//       console.log("User ID:", userId);
//       const response = await axios.get(
//         `${API_URL}/user/users/${userId}/events`
//       );
//       setEvents(response.data);
//     } catch (error) {
//       console.error("Error fetching booked events:", error.response);
//     }
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = async () => {
//     setRefreshing(true); // Set refreshing to true
//     await fetchBookedEvents(); // Fetch events again
//     setRefreshing(false); // Set refreshing to false after fetching
//   };

//   const handleEventPress = async (eventId) => {
//     navigation.navigate("EventParticipantsScreen", { eventId }); // Navigate to the participants screen
//   };

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         { paddingTop: insets.top },
//         { opacity: fadeAnimation },
//       ]}
//     >
//       <FlatList
//         data={events}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleEventPress(item._id)}
//             style={styles.eventItem}
//           >
//             <Image
//               source={{ uri: item.images[0]?.url }} // Assuming images is an array and we get the first image
//               style={styles.eventImage}
//             />
//             <View style={styles.eventDetailsContainer}>
//               <Text style={styles.eventTitle}>{item.title}</Text>
//               <View style={styles.dateTimeContainer}>
//                 <MaterialCommunityIcons
//                   name="calendar"
//                   size={20}
//                   color="#fff"
//                 />
//                 <Text style={styles.dateText}>
//                   {new Date(item.date)
//                     .toLocaleString("en-US", { month: "short" })
//                     .toUpperCase()}{" "}
//                   |
//                 </Text>
//                 <Text style={styles.dateText}>
//                   {new Date(item.date).getDate()}
//                 </Text>
//                 <Text style={styles.dateText}>
//                   {new Date(item.date).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </Text>
//               </View>
//               <Text style={styles.eventOrganizer}>
//                 <MaterialCommunityIcons name="account" size={20} color="#fff" />{" "}
//                 {item.organizer}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ paddingBottom: 60 }}
//         style={styles.eventsList}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.animationContainer}>
//             <LottieView
//               ref={animationRef}
//               source={require("../Onboarding-Screen-2/src/assets/animations/no_event.json")} // Replace with your animation file path
//               autoPlay
//               loop
//               style={styles.lottie}
//             />
//             <Text style={styles.emptyText}>No events Booked</Text>
//           </View>
//         )}
//       />
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   eventsList: {
//     // marginTop: 20,
//     width: "100%",
//     paddingHorizontal: 10,
//     // elevation: 8,

//     // // iOS shadow
//     // shadowColor: "#000",
//     // shadowOffset: { width: 0, height: 4 },
//     // shadowOpacity: 0.7,
//     // shadowRadius: 4,
//   },
//   animationContainer: {
//     height: 400,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   lottie: {
//     width: 300,
//     height: 300,
//   },
//   eventItem: {
//     marginVertical: 15,
//     marginHorizontal: 10,
//     borderRadius: 16,
//     // overflow: "hidden",
//     backgroundColor: "#fff", // Background color for the container
//     // borderWidth: 1,
//     // elevation: 8,

//     // // iOS shadow
//     // shadowColor: "#000",
//     // shadowOffset: { width: 0, height: 4 },
//     // shadowOpacity: 0.7,
//     // shadowRadius: 4,
//   },
//   eventDetailsContainer: {
//     padding: 15,
//     backgroundColor: "#814C68",
//     borderBottomLeftRadius: 16, // Ensure the bottom corners match the eventItem
//     borderBottomRightRadius: 16,
//   },
//   dateTimeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   dateText: {
//     fontSize: 12,
//     color: "#fff",
//     marginLeft: 5,
//     fontFamily: "CenturyGothicBold",
//   },
//   eventTitle: {
//     fontSize: 24,
//     fontFamily: "CenturyGothicBold",

//     color: "#fff",
//     marginBottom: 5,
//   },
//   eventOrganizer: {
//     fontSize: 12,
//     color: "#fff",
//     marginTop: 5,
//     fontFamily: "CenturyGothicBold",
//   },
//   eventImage: {
//     width: "100%",
//     height: 240,
//     resizeMode: "cover",
//     borderTopLeftRadius: 16, // Ensure the top corners match the eventItem
//     borderTopRightRadius: 16,
//   },

//   eventInfo: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
//     padding: 15,
//   },

//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#888",
//   },
//   premium: {
//     marginTop: 40,
//     marginHorizontal: "10%",
//     backgroundColor: "#ffb3ba",
//     borderRadius: 30,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 15,
//     elevation: 5,
//   },
//   premiumText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     fontFamily: "Chalkboard SE",
//   },
// });

// import React, { useEffect, useRef, useState, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Animated,
//   RefreshControl,
// } from "react-native";
// import axios from "axios";
// import { API_URL } from "@env";
// import { UserContext } from "../navigation/UserProvider";
// import LottieView from "lottie-react-native";
// import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// import { useFocusEffect } from "@react-navigation/native";

// export default function Profile({ navigation }) {
//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const insets = useSafeAreaInsets();
//   const animationRef = useRef(null);

//   const [events, setEvents] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const { userId } = useContext(UserContext);
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   useEffect(() => {
//     // Load custom fonts (if needed)
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

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   useFocusEffect(
//     React.useCallback(() => {
//       // If the animation exists, reset it & play
//       if (animationRef.current) {
//         animationRef.current.reset();
//         animationRef.current.play();
//       }
//     }, [])
//   );

//   // Fetch booked events when the screen mounts
//   useEffect(() => {
//     if (userId) {
//       fetchBookedEvents();
//     }
//   }, [userId]);

//   /**
//    * Helper function to fetch the pre-signed URL from your backend
//    * for a single image (S3 key).
//    */
//   const fetchPresignedUrl = async (key) => {
//     try {
//       const response = await axios.get(`${API_URL}/api/s3-presigned-url`, {
//         params: { key },
//       });
//       return response.data.preSignedUrl; // The actual usable URL
//     } catch (error) {
//       console.error("Error fetching pre-signed URL for key:", key, error);
//       return null;
//     }
//   };

//   /**
//    * Function to fetch booked events for the user, then convert
//    * each S3 key to a pre-signed URL so it can be displayed in <Image />.
//    */
//   const fetchBookedEvents = async () => {
//     try {
//       console.log("User ID:", userId);
//       const response = await axios.get(
//         `${API_URL}/user/users/${userId}/events`
//       );
//       const fetchedEvents = response.data;

//       // For each event, fetch pre-signed URLs for all its images
//       const eventsWithPresignedUrls = await Promise.all(
//         fetchedEvents.map(async (event) => {
//           if (!event.images || event.images.length === 0) {
//             return event;
//           }

//           // Convert each S3 key (or object) in event.images to a pre-signed URL
//           const updatedImages = await Promise.all(
//             event.images.map(async (imgObj) => {
//               // If `imgObj` is an object, extract the `url` field.
//               // If it’s already a string, just use it.
//               const key = typeof imgObj === "string" ? imgObj : imgObj.url;
//               console.log(key);
//               const presignedURL = await fetchPresignedUrl(key);
//               console.log(presignedURL);
//               return presignedURL;
//             })
//           );

//           // Return a new event object with the replaced images array
//           return {
//             ...event,
//             images: updatedImages,
//           };
//         })
//       );

//       setEvents(eventsWithPresignedUrls);
//     } catch (error) {
//       console.error("Error fetching booked events:", error.response || error);
//     }
//   };

//   // Handle pull-to-refresh
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchBookedEvents();
//     setRefreshing(false);
//   };

//   const handleEventPress = async (eventId) => {
//     navigation.navigate("EventParticipantsScreen", { eventId });
//   };

//   if (!fontsLoaded) {
//     // Return null or a splash screen while fonts are loading
//     return null;
//   }

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         { paddingTop: insets.top },
//         { opacity: fadeAnimation },
//       ]}
//     >
//       <FlatList
//         data={events}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleEventPress(item._id)}
//             style={styles.eventItem}
//           >
//             {/**
//              * IMPORTANT:
//              * Now we directly use item.images[0] because it’s
//              * already converted into a pre-signed URL from fetchBookedEvents.
//              */}
//             {item.images && item.images[0] ? (
//               <Image
//                 source={{ uri: item.images[0] }}
//                 style={styles.eventImage}
//               />
//             ) : (
//               <View style={[styles.eventImage, styles.noImageContainer]}>
//                 <Text style={styles.noImageText}>No Image</Text>
//               </View>
//             )}
//             <View style={styles.eventDetailsContainer}>
//               <Text style={styles.eventTitle}>{item.title}</Text>
//               <View style={styles.dateTimeContainer}>
//                 <MaterialCommunityIcons
//                   name="calendar"
//                   size={20}
//                   color="#fff"
//                 />
//                 <Text style={styles.dateText}>
//                   {new Date(item.date)
//                     .toLocaleString("en-US", { month: "short" })
//                     .toUpperCase()}{" "}
//                   |
//                 </Text>
//                 <Text style={styles.dateText}>
//                   {new Date(item.date).getDate()}
//                 </Text>
//                 <Text style={styles.dateText}>
//                   {new Date(item.date).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </Text>
//               </View>
//               <Text style={styles.eventOrganizer}>
//                 <MaterialCommunityIcons name="account" size={20} color="#fff" />{" "}
//                 {item.organizer}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={{ paddingBottom: 60 }}
//         style={styles.eventsList}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={() => (
//           <View style={styles.animationContainer}>
//             <LottieView
//               ref={animationRef}
//               source={require("../Onboarding-Screen-2/src/assets/animations/no_event.json")}
//               autoPlay
//               loop
//               style={styles.lottie}
//             />
//             <Text style={styles.emptyText}>No events Booked</Text>
//           </View>
//         )}
//       />
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   eventsList: {
//     width: "100%",
//     paddingHorizontal: 10,
//   },
//   animationContainer: {
//     height: 400,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   lottie: {
//     width: 300,
//     height: 300,
//   },
//   eventItem: {
//     marginVertical: 15,
//     marginHorizontal: 10,
//     borderRadius: 16,
//     backgroundColor: "#fff",
//   },
//   eventDetailsContainer: {
//     padding: 15,
//     backgroundColor: "#814C68",
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   dateTimeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   dateText: {
//     fontSize: 12,
//     color: "#fff",
//     marginLeft: 5,
//     fontFamily: "CenturyGothicBold",
//   },
//   eventTitle: {
//     fontSize: 24,
//     fontFamily: "CenturyGothicBold",
//     color: "#fff",
//     marginBottom: 5,
//   },
//   eventOrganizer: {
//     fontSize: 12,
//     color: "#fff",
//     marginTop: 5,
//     fontFamily: "CenturyGothicBold",
//   },
//   eventImage: {
//     width: "100%",
//     height: 240,
//     resizeMode: "cover",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   noImageContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ccc",
//   },
//   noImageText: {
//     color: "#333",
//     fontSize: 14,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#888",
//   },
// });

import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  RefreshControl,
} from "react-native";
import { API_URL } from "@env"; // Ensure this is correct
import { UserContext } from "../navigation/UserProvider";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile({ navigation }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const animationRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useContext(UserContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load custom fonts
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

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useFocusEffect(
    React.useCallback(() => {
      // If the animation exists, reset it & play
      if (animationRef.current) {
        animationRef.current.reset();
        animationRef.current.play();
      }
    }, [])
  );

  // Fetch booked events when the screen mounts (if userId is available)
  useEffect(() => {
    if (userId) {
      fetchBookedEvents();
    }
  }, [userId]);

  /**
   * Helper function to fetch the pre-signed URL from your backend
   * for a single image (S3 key) using fetch().
   */
  const fetchPresignedUrl = async (key) => {
    try {
      // IMPORTANT: use encodeURIComponent for the `key` param
      const response = await fetch(
        `${API_URL}/api/s3-presigned-url?key=${encodeURIComponent(key)}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch pre-signed URL, status: ${response.status}`
        );
      }

      const data = await response.json();
      return data.preSignedUrl; // Return the usable URL
    } catch (error) {
      console.error("Error fetching pre-signed URL for key:", key, error);
      return null;
    }
  };

  /**
   * Fetch booked events for the user, then convert each
   * S3 key to a pre-signed URL so it can be displayed in <Image />.
   */
  const fetchBookedEvents = async () => {
    try {
      console.log("Fetching events for user ID:", userId);

      // 1) Fetch the events
      const response = await fetch(`${API_URL}/user/users/${userId}/events`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user events, status: ${response.status}`
        );
      }

      const fetchedEvents = await response.json();

      // 2) For each event, fetch pre-signed URLs for all its images
      const eventsWithPresignedUrls = await Promise.all(
        fetchedEvents.map(async (event) => {
          if (!event.images || event.images.length === 0) {
            return event; // No images to process
          }

          const updatedImages = await Promise.all(
            event.images.map(async (imgObj) => {
              // Some backends return a simple string, others return an object with `url`.
              const key = typeof imgObj === "string" ? imgObj : imgObj.url;
              const presignedURL = await fetchPresignedUrl(key);
              console.log(presignedURL);
              return presignedURL; // could be null if fetch fails
            })
          );

          return {
            ...event,
            images: updatedImages,
          };
        })
      );

      // 3) Update state with the final data
      setEvents(eventsWithPresignedUrls);
    } catch (error) {
      console.error("Error fetching booked events:", error);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookedEvents();
    setRefreshing(false);
  };

  // Navigate to participants
  const handleEventPress = (eventId) => {
    navigation.navigate("EventParticipantsScreen", { eventId });
  };

  if (!fontsLoaded) {
    // Show nothing or a placeholder while fonts are loading
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top },
        { opacity: fadeAnimation },
      ]}
    >
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEventPress(item._id)}
            style={styles.eventItem}
          >
            {/**
             * Now item.images[] is an array of full pre-signed URLs.
             * Use item.images[0] if you only want the first image.
             */}
            {item.images && item.images[0] ? (
              <Image
                source={{ uri: item.images[0] }}
                style={styles.eventImage}
                onError={(err) =>
                  console.log("Image load error:", err.nativeEvent)
                }
              />
            ) : (
              <View style={[styles.eventImage, styles.noImageContainer]}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
            <View style={styles.eventDetailsContainer}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.dateTimeContainer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.dateText}>
                  {new Date(item.date)
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}{" "}
                  |
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).getDate()}
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <Text style={styles.eventOrganizer}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />{" "}
                {item.organizer}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 60 }}
        style={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require("../Onboarding-Screen-2/src/assets/animations/no_event.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.emptyText}>No events Booked</Text>
          </View>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventsList: {
    width: "100%",
    paddingHorizontal: 10,
  },
  animationContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 300,
    height: 300,
  },
  eventItem: {
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  eventDetailsContainer: {
    padding: 15,
    backgroundColor: "#814C68",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "CenturyGothicBold",
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    marginBottom: 5,
  },
  eventOrganizer: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    fontFamily: "CenturyGothicBold",
  },
  eventImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  noImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  noImageText: {
    color: "#333",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});
