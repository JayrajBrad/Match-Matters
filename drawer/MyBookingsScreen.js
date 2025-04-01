// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Animated,
//   RefreshControl,
//   ActivityIndicator, // Import ActivityIndicator
//   Alert,
// } from "react-native";
// import React, { useEffect, useRef, useState, useContext } from "react";
// import axios from "axios";
// import { API_URL } from "@env";
// import { getUserId } from "../backend/registrationUtils";
// import { UserContext } from "../navigation/UserProvider";
// import LottieView from "lottie-react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// const MyBookingsScreen = ({ navigation }) => {
//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const [events, setEvents] = useState([]);
//   const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status
//   const [loading, setLoading] = useState(true);
//   const { userId } = useContext(UserContext);
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

//   // Function to fetch booked events for the user
//   const fetchBookedEvents = async () => {
//     try {
//       setLoading(true);
//       console.log("User ID:", userId);
//       const response = await axios.get(
//         `${API_URL}/user/users/${userId}/events`
//       );
//       setEvents(response.data);
//     } catch (error) {
//       console.error("Error fetching booked events:", error.response);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = async () => {
//     setRefreshing(true); // Set refreshing to true
//     await fetchBookedEvents(); // Fetch events again
//     setRefreshing(false); // Set refreshing to false after fetching
//   };

//   const handleEventPress = async (eventId) => {
//     navigation.navigate("EventDetailsScreen", { eventId }); // Navigate to the participants screen
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#814C68" />
//         <Text style={styles.loadingText}>Loading your booked events...</Text>
//       </View>
//     );
//   }

//   const confirmCancelEvent = (eventId, ticketPrice) => {
//     Alert.alert(
//       "Cancel Event",
//       "Are you sure you want to cancel this event?",
//       [
//         {
//           text: "No",
//           style: "cancel", // Dismiss the dialog
//         },
//         {
//           text: "Yes",
//           onPress: () => handleCancelEvent(eventId, ticketPrice), // Proceed with cancellation
//         },
//       ],
//       { cancelable: true } // Allow dismissing the alert by tapping outside
//     );
//   };

//   const handleCancelEvent = async (eventId, ticketPrice) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/user/${userId}/cancel-event/${eventId}`
//       );
//       Alert.alert("Success", response.data.message);
//       fetchBookedEvents(); // Refresh the list of events
//     } catch (error) {
//       console.error(
//         "Error canceling event:",
//         error.response?.data || error.message
//       );
//       Alert.alert("Error", "Failed to cancel the event.");
//     }
//   };

//   // const handleCancelEvent = async (eventId, ticketPrice) => {
//   //   try {
//   //     const response = await axios.post(
//   //       `${API_URL}/user/${userId}/cancel-event/${eventId}`,
//   //       { ticketPrice } // Include ticketPrice in the request body
//   //     );
//   //     Alert.alert("Success", response.data.message);
//   //     fetchBookedEvents(); // Refresh the list of events
//   //   } catch (error) {
//   //     console.error(
//   //       "Error canceling event:",
//   //       error.response?.data || error.message
//   //     );
//   //     Alert.alert("Error", "Failed to cancel the event.");
//   //   }
//   // };

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       <FlatList
//         data={events}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => handleEventPress(item._id)}
//             style={styles.eventItem}
//           >
//             <Image
//               source={{ uri: item.images[0]?.url }}
//               style={styles.eventImage}
//             />
//             <View style={styles.eventDetailsContainer}>
//               <Text style={styles.eventTitle}>{item.title}</Text>
//               <View style={styles.dateTimeContainer}>
//                 <MaterialCommunityIcons
//                   name="calendar"
//                   size={18}
//                   color="#fff"
//                 />
//                 <Text style={styles.dateText}>
//                   {new Date(item.date)
//                     .toLocaleString("en-US", { month: "short" })
//                     .toUpperCase()}
//                 </Text>
//                 <Text style={styles.dateText}>
//                   {new Date(item.date).getDate()}
//                 </Text>
//                 <Text style={styles.dateText}>
//                   |{" "}
//                   {new Date(item.date).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </Text>
//               </View>
//               <Text style={styles.eventOrganizer}>
//                 <MaterialCommunityIcons name="account" size={18} color="#fff" />{" "}
//                 {item.organizer}
//               </Text>
//               {/* Cancel Button */}
//               {/* <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => handleCancelEvent(item._id, item.ticketPrice)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity> */}

//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => confirmCancelEvent(item._id, item.ticketPrice)} // Call the confirmation alert
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item._id}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//     </Animated.View>
//   );
// };

// export default MyBookingsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#290F4C",
//     fontFamily: "CenturyGothic",
//   },
//   title: {
//     fontSize: 28,
//     color: "#290F4C",
//     fontFamily: "CenturyGothicBold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   eventItem: {
//     marginVertical: 10,
//     borderRadius: 15,
//     overflow: "hidden",
//     borderWidth: 1,
//   },
//   eventImage: {
//     width: "100%",
//     height: 240,
//     resizeMode: "cover",
//   },
//   eventDetailsContainer: {
//     padding: 15,
//     backgroundColor: "#814C68",
//   },
//   dateTimeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 5,
//   },
//   dateText: {
//     fontSize: 12,
//     color: "#fff",
//     marginLeft: 5,
//     fontFamily: "CenturyGothicBold",
//   },
//   eventTitle: {
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//     color: "#fff",
//     marginBottom: 5,
//   },
//   eventOrganizer: {
//     fontSize: 14,
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//     marginTop: 5,
//   },
//   lottieAnimation: {
//     width: 200, // Adjust size of the Lottie animation
//     height: 200,
//     marginBottom: 20,
//   },
//   eventDetails: {
//     fontSize: 12,
//     color: "#ccc",
//     marginTop: 5,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     top: 120,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#888",
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginTop: 20,
//   },
//   cancelButton: {
//     marginTop: 10,
//     backgroundColor: "#290F4C",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//     fontSize: 14,
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
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Helper to fetch a GET pre-signed URL from your backend.
 * Takes the S3 key (e.g. "mm_images/xyz.jpg") and returns a
 * short-lived public URL for display.
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

const MyBookingsScreen = ({ navigation }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    if (userId) {
      fetchBookedEvents();
    }
  }, [userId]);

  // Fetch user's booked events from your backend
  // const fetchBookedEvents = async () => {
  //   try {
  //     setLoading(true);
  //     console.log("User ID:", userId);
  //     const response = await axios.get(
  //       `${API_URL}/user/users/${userId}/events`
  //     );
  //     // response.data is an array of events with images,
  //     // e.g. event.images = [{ url: "mm_images/abc.jpg" }, ...]
  //     const fetchedEvents = response.data;

  //     // Convert each event's first image key to a real pre-signed URL
  //     const eventsWithImages = await Promise.all(
  //       fetchedEvents.map(async (event) => {
  //         if (!event.images || event.images.length === 0) {
  //           // No images
  //           return event;
  //         }

  //         // Some backends return a simple string, others return an object with "url"
  //         const firstImage = event.images[0];
  //         const key =
  //           typeof firstImage === "string" ? firstImage : firstImage.url;

  //         // Fetch the pre-signed URL for the first image
  //         const presignedUrl = await fetchPresignedUrl(key);
  //         return {
  //           ...event,
  //           // We'll store the actual presignedUrl in, say, event.firstImageUrl
  //           firstImageUrl: presignedUrl,
  //         };
  //       })
  //     );

  //     setEvents(eventsWithImages);
  //   } catch (error) {
  //     console.error("Error fetching booked events:", error.response || error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBookedEvents = async () => {
    try {
      setLoading(true);
      console.log("User ID:", userId);
      const response = await axios.get(
        `${API_URL}/user/users/${userId}/events`
      );
      const fetchedEvents = response.data;

      const eventsWithPresignedUrls = await Promise.all(
        fetchedEvents.map(async (event) => {
          if (!event.images || event.images.length === 0) {
            return event;
          }

          const firstImage = event.images[0];
          const key =
            typeof firstImage === "string" ? firstImage : firstImage.url;
          const presignedUrl = await fetchPresignedUrl(key);

          if (presignedUrl) {
            await Image.prefetch(presignedUrl); // Preload image
          }

          return {
            ...event,
            firstImageUrl: presignedUrl,
          };
        })
      );

      setEvents(eventsWithPresignedUrls);
    } catch (error) {
      console.error("Error fetching booked events:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  // Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookedEvents();
    setRefreshing(false);
  };

  const handleEventPress = (eventId) => {
    navigation.navigate("EventDetailsScreen", { eventId });
  };

  // Confirmation alert
  const confirmCancelEvent = (eventId, ticketPrice) => {
    Alert.alert(
      "Cancel Event",
      `Are you sure you want to cancel this event? You will receive a coupon worth ${ticketPrice}.`,

      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleCancelEvent(eventId, ticketPrice),
        },
      ],
      { cancelable: true }
    );
  };

  // Actually cancel the event
  // const handleCancelEvent = async (eventId, ticketPrice) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/user/${userId}/cancel-event/${eventId}`
  //     );
  //     Alert.alert("Success", response.data.message);
  //     fetchBookedEvents(); // Refresh the list
  //   } catch (error) {
  //     console.error("Error canceling event:", error.response || error);
  //     Alert.alert("Error", "Failed to cancel the event.");
  //   }
  // };

  const handleCancelEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/${userId}/cancel-event/${eventId}`
      );
      Alert.alert("Success", response.data.message);
      fetchBookedEvents(); // Refresh the list
    } catch (error) {
      console.error("Error canceling event:", error.response || error);
      Alert.alert("Error", "Failed to cancel the event.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading your booked events...</Text>
      </View>
    );
  }

  return (
    // <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEventPress(item._id)}
            style={styles.eventItem}
          >
            {/* {item.firstImageUrl ? (
              <Image
                source={{ uri: item.firstImageUrl }}
                style={styles.eventImage}
                onError={(err) =>
                  console.log("Image load error:", err.nativeEvent)
                }
              />
            ) : (
              <View style={[styles.eventImage, styles.noImageContainer]}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )} */}
            {item.firstImageUrl ? (
              <Image
                source={{ uri: item.firstImageUrl, cache: "force-cache" }}
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
                  size={18}
                  color="#fff"
                />
                <Text style={styles.dateText}>
                  {new Date(item.date)
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).getDate()}
                </Text>
                <Text style={styles.dateText}>
                  |{" "}
                  {new Date(item.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              <Text style={styles.eventOrganizer}>
                <MaterialCommunityIcons name="account" size={18} color="#fff" />{" "}
                {item.organizer}
              </Text>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => confirmCancelEvent(item._id, item.ticketPrice)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
    /* </Animated.View> */
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  eventItem: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  eventImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  noImageContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#333",
    fontSize: 14,
  },
  eventDetailsContainer: {
    padding: 15,
    backgroundColor: "#814C68",
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    marginBottom: 5,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "CenturyGothicBold",
  },
  eventOrganizer: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "CenturyGothicBold",
    marginTop: 5,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#290F4C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontFamily: "CenturyGothicBold",
    fontSize: 14,
  },
});
