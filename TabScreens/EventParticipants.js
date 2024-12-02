// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Dimensions,
//   Image,
//   TextInput,
//   Pressable,
//   Alert,
//   TouchableOpacity,
//   Animated,
// } from "react-native";
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { API_URL } from "@env";
// import { useNavigation } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import Entypo from "@expo/vector-icons/Entypo";
// import {
//   State,
//   FlingGestureHandler,
//   Directions,
// } from "react-native-gesture-handler";
// import { UserContext } from "../navigation/UserProvider";

// const { width: screenWidth } = Dimensions.get("window");

// export default function EventParticipantsScreen({ route }) {
//   const { eventId } = route.params;
//   const [participants, setParticipants] = useState([]);
//   const [message, setMessage] = useState("");
//   // const [userId, setUserId] = useState(null);
//   const navigation = useNavigation();
//   const scrollX = React.useRef(new Animated.Value(0)).current;

//   const { userId } = useContext(UserContext);

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/${eventId}/participants`
//         );
//         const filteredParticipants = response.data.filter(
//           (participant) => participant._id !== userId
//         );

//         setParticipants(filteredParticipants);
//       } catch (error) {
//         console.error("Error fetching participants:", error);
//       }
//     };

//     fetchParticipants();
//   }, [eventId]);

//   const sendRequest = async (receiverId) => {
//     try {
//       if (!userId) {
//         Alert.alert("User ID not found. Please try again.");
//         return;
//       }

//       const userData = {
//         senderId: userId,
//         receiverId,
//       };

//       const response = await axios.post(`${API_URL}/api/sendrequest`, userData);

//       if (response.status === 200) {
//         Alert.alert(
//           "Your request has been shared. Wait for the user to accept your request."
//         );
//       }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.imageContainer}>
//         {item.images && item.images.length > 0 && (
//           <Image
//             source={{ uri: item.images[0] }}
//             style={styles.participantImage}
//           />
//         )}
//         <View style={styles.nameOverlay}>
//           <Text style={styles.participantName}>
//             {item.username || "No Name"}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.infoContainer}>
//         <Text style={styles.participantEmail}>
//           {item.emailId || "No Email"}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Phone: {item.phoneNumber || "N/A"}
//         </Text>
//         <Text style={styles.participantDetails}>Age: {item.age || "N/A"}</Text>
//         <Text style={styles.participantDetails}>
//           Birthdate: {new Date(item.birthdate).toLocaleDateString() || "N/A"}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Gender: {item.gender || "N/A"}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Location: {item.cityName}, {item.stateName}, {item.countryName}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Preferences: {item.selectedPreferences.join(", ") || "None"}
//         </Text>
//       </View>
//       <View style={styles.messageContainer}>
//         <Entypo name="emoji-happy" size={24} color="black" />
//         {/* <TextInput
//           value={message}
//           onChangeText={(text) => setMessage(text)}
//           style={styles.messageInput}
//           placeholder="Type your message..."
//         /> */}
//         <Pressable
//           onPress={() => sendRequest(item._id)}
//           style={styles.sendButton}
//         >
//           <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
//         </Pressable>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Participants</Text>
//       <FlatList
//         data={participants}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.flatListContent}
//       />
//     </View>
//   );

//   // const renderItem = ({ item, index }) => {
//   //   const inputRange = [
//   //     (index - 1) * screenWidth,
//   //     index * screenWidth,
//   //     (index + 1) * screenWidth,
//   //   ];
//   //   const scale = scrollX.interpolate({
//   //     inputRange,
//   //     outputRange: [0.8, 1, 0.8],
//   //   });
//   //   const opacity = scrollX.interpolate({
//   //     inputRange,
//   //     outputRange: [0.5, 1, 0.5],
//   //   });

//   //   return (
//   //     <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
//   //       <View style={styles.imageContainer}>
//   //         {item.images && item.images.length > 0 && (
//   //           <Image
//   //             source={{ uri: item.images[0] }}
//   //             style={styles.participantImage}
//   //           />
//   //         )}
//   //         <View style={styles.nameOverlay}>
//   //           <Text style={styles.participantName}>
//   //             {item.username || "No Name"}
//   //           </Text>
//   //         </View>
//   //       </View>
//   //       <View style={styles.infoContainer}>
//   //         <Text style={styles.participantEmail}>
//   //           {item.emailId || "No Email"}
//   //         </Text>
//   //         <Text style={styles.participantDetails}>
//   //           Phone: {item.phoneNumber || "N/A"}
//   //         </Text>
//   //         <Text style={styles.participantDetails}>
//   //           Age: {item.age || "N/A"}
//   //         </Text>
//   //         <Text style={styles.participantDetails}>
//   //           Birthdate: {new Date(item.birthdate).toLocaleDateString() || "N/A"}
//   //         </Text>
//   //         <Text style={styles.participantDetails}>
//   //           Gender: {item.gender || "N/A"}
//   //         </Text>
//   //         <Text style={styles.participantDetails}>
//   //           Location: {item.cityName}, {item.stateName}, {item.countryName}
//   //         </Text>
//   //         <Text style={styles.participantDetails}>
//   //           Preferences: {item.selectedPreferences.join(", ") || "None"}
//   //         </Text>
//   //       </View>
//   //       <View style={styles.messageContainer}>
//   //         <Pressable
//   //           onPress={() => sendRequest(item._id)}
//   //           style={styles.sendButton}
//   //         >
//   //           <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
//   //         </Pressable>
//   //       </View>
//   //     </Animated.View>
//   //   );
//   // };

//   // return (
//   //   <Animated.FlatList
//   //     data={participants}
//   //     renderItem={renderItem}
//   //     keyExtractor={(item) => item._id}
//   //     horizontal
//   //     showsHorizontalScrollIndicator={false}
//   //     pagingEnabled
//   //     onScroll={Animated.event(
//   //       [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//   //       { useNativeDriver: true }
//   //     )}
//   //     scrollEventThrottle={16}
//   //   />
//   // );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginRight: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     width: screenWidth * 0.85,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   participantImage: {
//     width: "100%",
//     height: 350,
//   },
//   nameOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 10,
//     width: "100%",
//     // backgroundColor: "rgba(0, 0, 0, 0.5)",
//     paddingVertical: 8,
//     // alignItems: "center",
//   },
//   participantName: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   infoContainer: {
//     padding: 15,
//   },
//   flatListContent: {
//     paddingVertical: 10,
//   },
//   participantEmail: {
//     fontSize: 14,
//     color: "#555",
//     fontStyle: "italic",
//     fontWeight: "600",
//     marginBottom: 10,
//   },
//   participantDetails: {
//     fontSize: 15,
//     color: "#333",
//     fontWeight: "500",
//     letterSpacing: 0.5,
//     lineHeight: 22,
//     marginBottom: 3,
//   },
//   requestButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#007bff",
//     paddingVertical: 10,
//     marginHorizontal: 50,
//     borderRadius: 20,
//     justifyContent: "center",
//     // borderBottomLeftRadius: 10,
//     // borderBottomRightRadius: 10,
//   },
//   requestButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     marginLeft: 5,
//   },
//   messageContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#dddddd",
//   },
//   messageInput: {
//     flex: 1,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "gray",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     marginLeft: 10,
//   },
//   sendButton: {
//     backgroundColor: "#007bff",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     marginLeft: 10,
//   },
// });

///////////////////update////////////////////////////

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Pressable,
  Animated,
  ScrollView,
  FlatList,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import { ScreenHeight } from "react-native-elements/dist/helpers";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

////////////do not delete this function///////////
// export default function EventParticipantsScreen({ route }) {
//   const { eventId } = route.params;
//   const [participants, setParticipants] = useState([]);
//   const { userId } = useContext(UserContext);

//   const scrollX = React.useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/${eventId}/participants`
//         );
//         const filteredParticipants = response.data.filter(
//           (participant) => participant._id !== userId
//         );
//         setParticipants(filteredParticipants);
//       } catch (error) {
//         console.error("Error fetching participants:", error);
//       }
//     };

//     fetchParticipants();
//   }, [eventId]);

//   const sendRequest = async (receiverId) => {
//     try {
//       if (!userId) {
//         Alert.alert("User ID not found. Please try again.");
//         return;
//       }

//       const userData = {
//         senderId: userId,
//         receiverId,
//       };

//       const response = await axios.post(`${API_URL}/api/sendrequest`, userData);

//       if (response.status === 200) {
//         Alert.alert(
//           "Your request has been shared. Wait for the user to accept your request."
//         );
//       }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };

//   const renderItem = ({ item, index }) => {
//     const inputRange = [
//       (index - 1) * screenWidth,
//       index * screenWidth,
//       (index + 1) * screenWidth,
//     ];

//     const scale = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.3, 1, 0.3],
//       extrapolate: "clamp",
//     });

//     const opacity = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.5, 1, 0.5],
//       extrapolate: "clamp",
//     });

//     return (
//       <View style={styles.cardWrapper}>
//         <Animated.View
//           style={[styles.card, { transform: [{ scale }], opacity }]}
//         >
//           <View style={styles.imageContainer}>
//             {item.images && item.images.length > 0 && (
//               <Image
//                 source={{ uri: item.images[0] }}
//                 style={styles.participantImage}
//               />
//             )}
//           </View>
//           <View style={styles.infoContainer}>
//             <Text style={styles.participantName}>
//               {item.username || "No Name"}
//             </Text>
//             <Text style={styles.participantEmail}>
//               {item.emailId || "No Email"}
//             </Text>
//             <Text style={styles.participantDetails}>
//               Phone: {item.phoneNumber || "N/A"}
//             </Text>
//             <Text style={styles.participantDetails}>
//               Age: {item.age || "N/A"}
//             </Text>
//             <Text style={styles.participantDetails}>
//               Gender: {item.gender || "N/A"}
//             </Text>
//             <Text style={styles.participantDetails}>
//               Location: {item.cityName}, {item.stateName}, {item.countryName}
//             </Text>
//           </View>
//           <Pressable
//             onPress={() => sendRequest(item._id)}
//             style={styles.sendButton}
//           >
//             <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
//           </Pressable>
//         </Animated.View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Participants</Text>
//       <Animated.FlatList
//         data={participants}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         pagingEnabled
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   cardWrapper: {
//     width: screenWidth,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     paddingLeft: 20,
//     paddingVertical: 20,
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     width: screenWidth * 0.85,
//     height: 550, // Ensure fixed height to avoid layout shifts
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     overflow: "hidden",
//   },
//   imageContainer: {
//     width: "100%",
//     height: 300, // Fixed height for images
//     overflow: "hidden",
//   },
//   participantImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   infoContainer: {
//     padding: 15,
//     flex: 1, // Ensure consistent height for text container
//   },
//   participantName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#333",
//   },
//   participantEmail: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 5,
//   },
//   participantDetails: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 5,
//   },
//   sendButton: {
//     backgroundColor: "#007bff",
//     padding: 10,
//     width: 120,
//     borderRadius: 20,
//     margin: 10,
//     // alignContent: "center",
//     alignItems: "center",
//     // justifyContent: "center",
//     alignSelf: "center",
//   },
// });

export default function EventParticipantsScreen({ route }) {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState([]);
  const { userId } = useContext(UserContext);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/events/${eventId}/participants`
        );
        const filteredParticipants = response.data.filter(
          (participant) => participant._id !== userId
        );
        setParticipants(filteredParticipants);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [eventId]);

  const sendRequest = async (receiverId) => {
    try {
      if (!userId) {
        Alert.alert("User ID not found. Please try again.");
        return;
      }

      const userData = {
        senderId: userId,
        receiverId,
      };

      const response = await axios.post(`${API_URL}/api/sendrequest`, userData);

      if (response.status === 200) {
        Alert.alert(
          "Your request has been shared. Wait for the user to accept your request."
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.cardWrapper}>
        <Animated.View
          style={[styles.card, { transform: [{ scale }], opacity }]}
        >
          <ScrollView contentContainerStyle={styles.scrollableContent}>
            {/* Display the first image at the top */}
            {item.images && item.images.length > 0 && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.participantImage}
                />
              </View>
            )}

            {/* Participant Details */}
            <View style={styles.infoContainer}>
              <Text style={styles.participantName}>
                {item.username || "No Name"}
              </Text>
              <Text style={styles.participantEmail}>
                {item.emailId || "No Email"}
              </Text>
              <Text style={styles.participantDetails}>
                Phone: {item.phoneNumber || "N/A"}
              </Text>
              <Text style={styles.participantDetails}>
                Age: {item.age || "N/A"}
              </Text>
              <Text style={styles.participantDetails}>
                Gender: {item.gender || "N/A"}
              </Text>
              <Text style={styles.participantDetails}>
                Preferences: {item.selectedPreferences.join(", ") || "None"}
              </Text>
              <Text style={styles.participantDetails}>
                Location: {item.cityName}, {item.stateName}, {item.countryName}
              </Text>
            </View>

            {/* Display additional images below the details */}
            {item.images && item.images.length > 1 && (
              <View style={styles.imagesContainer}>
                <FlatList
                  data={item.images.slice(1)} // Skip the first image
                  renderItem={({ item: imageUri }) => (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.participantImage}
                    />
                  )}
                  keyExtractor={(image, idx) => `${item._id}-${idx}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Send Button */}
            <Pressable
              onPress={() => sendRequest(item._id)}
              style={styles.sendButton}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Send Request
              </Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Participants</Text>
      <Animated.FlatList
        data={participants}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes full available height
    backgroundColor: "#f9f9f9",
  },
  cardWrapper: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight * 0.75, // Use 75% of the screen height (you can adjust this as needed)
    paddingBottom: 20,
  },
  header: {
    paddingLeft: 20,
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: screenWidth * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    overflow: "hidden",
  },
  scrollableContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 20, // Ensure scrollable space at the bottom
    showsHorizontalScrollIndicator: false,
  },
  imageContainer: {
    width: "100%",
    height: 500, // Fixed height for the first image
    overflow: "hidden",
  },
  participantImage: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
    marginBottom: 10, // Space between images and details
  },
  imagesContainer: {
    // padding: 10,
  },
  infoContainer: {
    padding: 15,
  },
  participantName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  participantEmail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  participantDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    width: 120,
    borderRadius: 20,
    margin: 10,
    alignItems: "center",
    alignSelf: "center",
  },
});

// export default function EventParticipantsScreen({ route }) {
//   const { eventId } = route.params;
//   const [participants, setParticipants] = useState([]);
//   const { userId } = useContext(UserContext);

//   const scrollX = React.useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/${eventId}/participants`
//         );
//         const filteredParticipants = response.data.filter(
//           (participant) => participant._id !== userId
//         );
//         setParticipants(filteredParticipants);
//       } catch (error) {
//         console.error("Error fetching participants:", error);
//       }
//     };

//     fetchParticipants();
//   }, [eventId]);

//   const sendRequest = async (receiverId) => {
//     try {
//       if (!userId) {
//         Alert.alert("User ID not found. Please try again.");
//         return;
//       }

//       const userData = {
//         senderId: userId,
//         receiverId,
//       };

//       const response = await axios.post(`${API_URL}/api/sendrequest`, userData);

//       if (response.status === 200) {
//         Alert.alert(
//           "Your request has been shared. Wait for the user to accept your request."
//         );
//       }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };

//   const renderItem = ({ item, index }) => {
//     const inputRange = [
//       (index - 1) * screenWidth,
//       index * screenWidth,
//       (index + 1) * screenWidth,
//     ];

//     const scale = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.3, 1, 0.3],
//       extrapolate: "clamp",
//     });

//     const opacity = scrollX.interpolate({
//       inputRange,
//       outputRange: [0.5, 1, 0.5],
//       extrapolate: "clamp",
//     });

//     return (
//       <View style={styles.cardWrapper}>
//         <Animated.View
//           style={[styles.card, { transform: [{ scale }], opacity }]}
//         >
//           {/* Vertical ScrollView for card content */}
//           <ScrollView contentContainerStyle={styles.scrollableContent}>
//             <View style={styles.infoContainer}>
//               <Text style={styles.participantName}>
//                 {item.username || "No Name"}
//               </Text>
//               <Text style={styles.participantEmail}>
//                 {item.emailId || "No Email"}
//               </Text>
//               <Text style={styles.participantDetails}>
//                 Phone: {item.phoneNumber || "N/A"}
//               </Text>
//               <Text style={styles.participantDetails}>
//                 Age: {item.age || "N/A"}
//               </Text>
//               <Text style={styles.participantDetails}>
//                 Gender: {item.gender || "N/A"}
//               </Text>
//               <Text style={styles.participantDetails}>
//                 Location: {item.cityName}, {item.stateName}, {item.countryName}
//               </Text>
//             </View>

//             {/* Display images below user data */}
//             {item.images && item.images.length > 0 && (
//               <View style={styles.imagesContainer}>
//                 <Text style={styles.imageTitle}>Images</Text>
//                 <FlatList
//                   data={item.images}
//                   renderItem={({ item: imageUri }) => (
//                     <Image
//                       source={{ uri: imageUri }}
//                       style={styles.participantImage}
//                     />
//                   )}
//                   keyExtractor={(image, idx) => `${item._id}-${idx}`}
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                 />
//               </View>
//             )}

//             <Pressable
//               onPress={() => sendRequest(item._id)}
//               style={styles.sendButton}
//             >
//               <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
//             </Pressable>
//           </ScrollView>
//         </Animated.View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Participants</Text>
//       <Animated.FlatList
//         data={participants}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         pagingEnabled
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   cardWrapper: {
//     width: screenWidth,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     paddingLeft: 20,
//     paddingVertical: 20,
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     width: screenWidth * 0.85,
//     height: 550, // Set a base height for the card
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     overflow: "hidden",
//   },
//   scrollableContent: {
//     flexGrow: 1,
//     justifyContent: "flex-start",
//     paddingBottom: 20, // Ensure scrollable space at the bottom
//   },
//   imageContainer: {
//     width: "100%",
//     height: 300, // Fixed height for the first image
//     overflow: "hidden",
//   },
//   participantImage: {
//     width: "100%",
//     height: 200,
//     resizeMode: "cover",
//     marginRight: 10, // Margin for horizontal list of images
//   },
//   imagesContainer: {
//     padding: 10,
//   },
//   imageTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   infoContainer: {
//     padding: 15,
//     flex: 1,
//   },
//   participantName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 5,
//     color: "#333",
//   },
//   participantEmail: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 5,
//   },
//   participantDetails: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 5,
//   },
//   sendButton: {
//     backgroundColor: "#007bff",
//     padding: 10,
//     width: 120,
//     borderRadius: 20,
//     margin: 10,
//     alignSelf: "center",
//   },
// });
