////////DATE LOGIC CODE////////////////
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Animated,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Dimensions,
//   Share,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { Video } from "expo-av";
// import * as Location from "expo-location";
// import icon from "../assets/Match matters logo (1).png";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "@env";
// import { getToken } from "../backend/token";
// import axios from "axios";
// import { getUserData, getUserId } from "../backend/registrationUtils";
// import Filter from "../components/FilterComponent";

// const { width, height } = Dimensions.get("window");

// export default function FeedScreen({ navigation, route }) {
//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const [events, setEvents] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   // const [location, setLocation] = useState(null);
//   // const [errorMsg, setErrorMsg] = useState(null);
//   // const [focusedButton, setFocusedButton] = useState(null);
//   // const [profileImage, setProfileImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // const [likedEvents, setLikedEvents] = useState([]);

//   const [showFilters, setShowFilters] = useState(false);
//   const [filteredEvents, setFilteredEvents] = useState(events);
//   const [refreshing, setRefreshing] = useState(false);
//   // const [filteredEvents, setFilteredEvents] = useState(events);
//   // const [fadeAnimation] = useState(new Animated.Value(1));

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   // Fetch events based on user location
//   const fetchEventsByLocation = async (city, state, country) => {
//     try {
//       const response = await axios.get(`${API_URL}/api/events/location`, {
//         params: { cityName: city, stateName: state, countryName: country },
//       });
//       console.log("fetchEventsByLocation from feedScreen :", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching events :", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const loadEvents = async (startDate, endDate) => {
//     try {
//       const userId = await getUserId();
//       if (userId) {
//         const userData = await getUserData(userId);
//         if (userData) {
//           const { cityName, stateName, countryName } = userData;

//           if (cityName && stateName && countryName) {
//             const eventsData = await fetchEventsByLocation(
//               cityName,
//               stateName,
//               countryName
//             );

//             if (eventsData) {
//               // Filter events based on the selected date range
//               const filteredEvents = eventsData.filter((event) => {
//                 const eventDate = new Date(event.date); // Assuming event.date holds the event date
//                 return (
//                   (!startDate || eventDate >= startDate) &&
//                   (!endDate || eventDate <= endDate)
//                 );
//               });

//               setEvents(eventsData);
//               setFilteredEvents(
//                 filteredEvents.length > 0 ? filteredEvents : eventsData
//               );
//             } else {
//               console.error("No events found for this location.");
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error loading events or user data:", error);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadEvents().then(() => {
//       setRefreshing(false);
//     });
//   };

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       <ScrollView
//         style={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Header Section */}
//         <View style={styles.headerContainer}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <MaterialCommunityIcons name="menu" color={"#000"} size={30} />
//           </TouchableOpacity>
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search location"
//               value={searchText}
//               onChangeText={(text) => setSearchText(text)}
//             />
//           </View>
//           {/* Filter Icon in Header */}
//           <TouchableOpacity
//             onPress={() => setShowFilters(!showFilters)}
//             style={styles.filterIcon}
//           >
//             <MaterialCommunityIcons
//               name="account-filter"
//               color={"#000"}
//               size={30}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Show Filter Component based on toggle */}
//         {showFilters && (
//           <Filter
//             setFilteredEvents={setFilteredEvents}
//             loadEvents={loadEvents}
//           />
//         )}

//         {/* Display Events: either filtered or all */}
//         {filteredEvents.map((event) => (
//           <View key={event._id} style={styles.videoContainer}>
//             <Video source={{ uri: event.videoUrl }} style={styles.video} />
//             <View style={styles.overlay}>
//               <View style={styles.bottomInfo}>
//                 <Text style={styles.eventTitle}>{event.title}</Text>
//                 <Text style={styles.organizer}>by {event.organizer}</Text>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     margin: 5,
//   },
//   searchContainer: {
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     height: 40,
//   },
//   filterIcon: {
//     paddingHorizontal: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     paddingHorizontal: 16,
//   },
//   button: {
//     backgroundColor: "#3498db",
//     borderRadius: 20,
//     paddingVertical: 10,
//     flex: 1,
//     marginHorizontal: 5,
//     paddingHorizontal: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   videoContainer: {
//     width,
//     height: height * 0.9,
//     position: "relative",
//   },
//   video: {
//     width: "100%",
//     height: "100%",
//   },
//   overlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 10,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//   },
//   rightIcons: {
//     position: "absolute",
//     right: 10,
//     bottom: 100,
//     alignItems: "center",
//   },
//   bottomInfo: {
//     marginTop: 10,
//   },
//   eventTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   organizer: {
//     color: "#ddd",
//     fontSize: 14,
//   },
// });
////////DATE LOGIC CODE////////////////

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Video } from "expo-av";
import axios from "axios";
import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { getUserData, getUserId } from "../backend/registrationUtils";
import Filter from "../components/FilterComponent";
import { v4 as uuidv4 } from "uuid";

const { width, height } = Dimensions.get("window");

// export default function FeedScreen({ navigation }) {
//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const [events, setEvents] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedGenre, setSelectedGenre] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [filteredEvents, setFilteredEvents] = useState(events);
//   const [refreshing, setRefreshing] = useState(false);
//   const videoRefs = useRef({});
//   const [isPlaying, setIsPlaying] = useState({}); // Track play/pause state for each video
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [noEventsMessage, setNoEventsMessage] = useState("");

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   const handleSearch = (text) => {
//     setSearchText(text);
//     const filtered = events.filter(
//       (event) =>
//         event.title.toLowerCase().includes(text.toLowerCase()) ||
//         event.organizer.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredEvents(filtered);
//   };

//   // Fetch events based on user location
//   const fetchEventsByLocation = async (city, state, country) => {
//     try {
//       // Modify the endpoint to include parameters in the URL
//       const response = await axios.get(
//         `${API_URL}/api/events/location/${city}/${state}/${country}`
//       );

//       if (response.status === 200) {
//         return response.data;
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching events by location:",
//         error.response ? error.response.data : error.message
//       );

//       return null;
//     }
//   };

//   const fetchEventsByGenre = async (genre) => {
//     try {
//       // Modify the endpoint to include genre in the URL
//       const response = await axios.get(`${API_URL}/api/events/genre/${genre}`);

//       if (response.status === 200) {
//         return response.data;
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching events by genre:",
//         error.response ? error.response.data : error.message
//       );

//       return [];
//     }
//   };

// const fetchLocationCoordinates = async (locationString) => {
//   try {
//     console.log("ola api : ", OLA_MAPS_API_KEY);
//     console.log("location FROM FEEDSCREEN :", locationString);

//     const requestId = uuidv4();
//     console.log("requestId", requestId);

//     const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${locationString}&api_key=${OLA_MAPS_API_KEY}`;
//     const response = await axios.get(geocodeUrl, {
//       headers: { "X-Request-Id": requestId },
//     });

//     if (
//       response.data.geocodingResults &&
//       response.data.geocodingResults.length > 0
//     ) {
//       const { lat, lng } =
//         response.data.geocodingResults[0].geometry.location;
//       console.log("Coordinates:", { latitude: lat, longitude: lng });
//       return { latitude: lat, longitude: lng }; // Return coordinates
//     } else {
//       console.error("No results found for the provided location.");
//       return null; // Return null if no results found
//     }
//   } catch (error) {
//     console.error(
//       "Error fetching coordinates:",
//       error.response || error.message
//     );
//     return null; // Return null on error
//   }
// };

//   const handleGetNearbyEvents = async (city, state, country) => {
//     const locationString = `${city}, ${state}, ${country}`;
//     const coordinates = await fetchLocationCoordinates(locationString);
//     const maxDistance = 5000000;
//     if (coordinates) {
//       console.log("Fetching nearby events with data:", {
//         city,
//         state,
//         country,
//         coordinates,
//         maxDistance,
//       });
//       // Call your function to fetch nearby events using the obtained coordinates
//       await fetchNearbyEvents(
//         city,
//         state,
//         country,
//         coordinates.latitude,
//         coordinates.longitude
//       );
//     } else {
//       console.error(
//         "Could not fetch nearby events due to missing coordinates."
//       );
//     }
//   };

//   const fetchNearbyEvents = async (
//     city,
//     state,
//     country,
//     latitude,
//     longitude,
//     maxDistance = 5000000
//   ) => {
//     try {
//       // Pass each parameter in the URL path
//       const response = await axios.get(
//         `${API_URL}/api/events/nearby/${city}/${state}/${country}/${latitude}/${longitude}/${maxDistance}`
//       );

//       console.log(
//         `${API_URL}/api/events/nearby/${city}/${state}/${country}/${latitude}/${longitude}/${maxDistance}`
//       );

//       if (response.status === 200) {
//         // setEvents(response.data);
//         // setFilteredEvents(response.data);
//         // setNoEventsMessage(
//         //   response.data.length === 0 ? "No nearby events found." : ""
//         // );
//         console.log("Fetched nearby events:", response.data);
//         return response.data;
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching nearby events:",
//         error.response ? error.response.data : error.message
//       );
//       return null;
//     }
//   };

//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       const userId = await getUserId();
//       if (userId) {
//         const userData = await getUserData(userId);
//         console.log("user data from feedscreen :", userData);
//         if (userData) {
//           const { cityName, stateName, countryName } = userData;
//           if (cityName && stateName && countryName) {
//             // Pass parameters directly in the API calls
//             const eventsDataByLocation =
//               (await fetchEventsByLocation(cityName, stateName, countryName)) ||
//               [];
//             // if (eventsDataByLocation.length < 5) {
//             //   await handleGetNearbyEvents(cityName, stateName, countryName);
//             // }

//             // if (!eventsDataByLocation || eventsDataByLocation.length < 5) {
//             //   await handleGetNearbyEvents(cityName, stateName, countryName);
//             // }

//             const eventsDataByGenre = selectedGenre
//               ? (await fetchEventsByGenre(selectedGenre)) || []
//               : [];

//             let locationSpecificEvents = eventsDataByLocation || [];
//             let nearbyEvents =
//               (await handleGetNearbyEvents(cityName, stateName, countryName)) ||
//               [];
//             // if (locationSpecificEvents.length < 5) {
//             //   const nearbyEvents =
//             //     (await handleGetNearbyEvents(
//             //       cityName,
//             //       stateName,
//             //       countryName
//             //     )) || [];

//             // Combine both location-specific and nearby events, ensuring no duplicates
//             // Merge location-specific and nearby events while avoiding duplicates
//             const combinedEvents = [
//               ...new Map(
//                 [
//                   ...(locationSpecificEvents || []),
//                   // ...(eventsDataByGenre || []),
//                   ...(nearbyEvents || []),
//                 ].map((event) => [event._id, event])
//               ).values(),
//             ];

//             setEvents(combinedEvents);
//             setFilteredEvents(combinedEvents);
//             setNoEventsMessage(
//               eventsDataByGenre.length === 0
//                 ? "No events found for this genre."
//                 : ""
//             );

//             console.log("Fetched events by location:", eventsDataByLocation);
//             console.log("Fetched events by genre:", eventsDataByGenre);
//             console.log("combined events :", combinedEvents);
//             console.log("Location Specific Events:", locationSpecificEvents);
//             console.log("Nearby Events:", nearbyEvents);

//             // const combinedEvents = [
//             //   ...new Map(
//             //     [
//             //       ...(eventsDataByLocation || []),
//             //       ...(eventsDataByGenre || []),
//             //     ].map((event) => [event._id, event])
//             //   ).values(),
//             // ];

//             // Set message if no events
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error loading events or user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadEvents();
//   }, [selectedGenre]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadEvents().then(() => {
//       setRefreshing(false);
//     });
//   };

//   const handleVideoPlayback = (index) => {
//     const video = videoRefs.current[index];
//     video.getStatusAsync().then((status) => {
//       const isCurrentlyPlaying = status.isPlaying;
//       if (isCurrentlyPlaying) {
//         video.pauseAsync(); // Pause if currently playing
//         setIsPlaying((prev) => ({ ...prev, [index]: false })); // Update state
//       } else {
//         video.playAsync(); // Play if currently paused
//         setIsPlaying((prev) => ({ ...prev, [index]: true })); // Update state
//       }
//     });
//   };

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       <ScrollView
//         style={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View style={styles.headerContainer}>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <MaterialCommunityIcons name="menu" color={"#000"} size={30} />
//           </TouchableOpacity>
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search Events"
//               value={searchText}
//               onChangeText={handleSearch}
//             />
//           </View>
//           <TouchableOpacity
//             onPress={() => setShowFilters(!showFilters)}
//             style={styles.filterIcon}
//           >
//             <MaterialCommunityIcons
//               name="account-filter"
//               color={"#000"}
//               size={30}
//             />
//           </TouchableOpacity>
//         </View>

//         {showFilters && (
//           <Filter
//             setFilteredEvents={setFilteredEvents}
//             setGenre={setSelectedGenre}
//             loadEvents={loadEvents}
//             // handleApplyDateFilters={handleApplyDateFilters}
//           />
//         )}

//         {filteredEvents.map((event, index) => (
//           <View key={event._id} style={styles.videoContainer}>
//             <Video
//               ref={(ref) => (videoRefs.current[index] = ref)}
//               source={{ uri: event.videoUrl }}
//               style={styles.video}
//               resizeMode="contain"
//               shouldPlay={isPlaying[index]} // Play based on state
//               isLooping={false}
//               onPlaybackStatusUpdate={(status) => {
//                 if (!isPlaying[index] && status.isPlaying) {
//                   Video.pauseAsync(); // Pause if scrolling
//                 }
//               }}
//             />
//             <View>
//               <TouchableOpacity
//                 onPress={() => handleVideoPlayback(index)}
//                 style={styles.pauseIcon}
//               >
//                 <MaterialCommunityIcons
//                   name={isPlaying[index] ? "pause-circle" : "play-circle"}
//                   color={"#fff"} // Change to white for better visibility
//                   size={40}
//                 />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={styles.overlay}
//               onPress={() =>
//                 navigation.navigate("EventDetailsScreen", {
//                   eventId: event._id,
//                 })
//               }
//             >
//               <View style={styles.bottomInfo}>
//                 <Text style={styles.eventTitle}>{event.title}</Text>
//                 <Text style={styles.organizer}>by {event.organizer}</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>
//     </Animated.View>
//   );
// }

export default function FeedScreen({ navigation }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [refreshing, setRefreshing] = useState(false);
  const videoRefs = useRef({});
  const [isPlaying, setIsPlaying] = useState({});
  const [noEventsMessage, setNoEventsMessage] = useState("");

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(text.toLowerCase()) ||
        event.organizer.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  // Fetch events based on user location
  const fetchEventsByLocation = async (city, state, country) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/events/location/${city}/${state}/${country}`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching events by location:", error);
      return null;
    }
  };

  const fetchLocationCoordinates = async (locationString) => {
    try {
      console.log("ola api : ", OLA_MAPS_API_KEY);
      console.log("location FROM FEEDSCREEN :", locationString);

      const requestId = uuidv4();
      console.log("requestId", requestId);

      const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${locationString}&api_key=${OLA_MAPS_API_KEY}`;
      const response = await axios.get(geocodeUrl, {
        headers: { "X-Request-Id": requestId },
      });

      if (
        response.data.geocodingResults &&
        response.data.geocodingResults.length > 0
      ) {
        const { lat, lng } =
          response.data.geocodingResults[0].geometry.location;
        console.log("Coordinates:", { latitude: lat, longitude: lng });
        return { latitude: lat, longitude: lng }; // Return coordinates
      } else {
        console.error("No results found for the provided location.");
        return null; // Return null if no results found
      }
    } catch (error) {
      console.error(
        "Error fetching coordinates:",
        error.response || error.message
      );
      return null; // Return null on error
    }
  };

  const fetchNearbyEvents = async (
    city,
    state,
    country,
    latitude,
    longitude,
    maxDistance = "1000000"
  ) => {
    try {
      console.log("Fetching nearby events with parameters:");
      console.log({ city, state, country, latitude, longitude, maxDistance });
      const response = await axios.get(
        `${API_URL}/api/events/nearby/${city}/${state}/${country}/${latitude}/${longitude}/${maxDistance}`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(
        "Error fetching nearby events:",
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const userId = await getUserId(); // Implement this to get userId
      if (userId) {
        const userData = await getUserData(userId); // Implement this to get user data
        if (userData) {
          const { cityName, stateName, countryName } = userData;
          if (cityName && stateName && countryName) {
            const locationEvents =
              (await fetchEventsByLocation(cityName, stateName, countryName)) ||
              [];

            // Create a location string for the coordinates lookup
            const locationString = `${cityName}, ${stateName}, ${countryName}`;
            const { latitude, longitude } =
              (await fetchLocationCoordinates(locationString)) || {};

            // Only fetch nearby events if coordinates are successfully retrieved
            let nearbyEvents = [];
            if (latitude && longitude) {
              nearbyEvents =
                (await fetchNearbyEvents(
                  cityName,
                  stateName,
                  countryName,
                  latitude,
                  longitude
                )) || [];
            }

            // Combine both event lists and avoid duplicates
            const combinedEvents = [
              ...new Map(
                [...locationEvents, ...nearbyEvents].map((event) => [
                  event._id,
                  event,
                ])
              ).values(),
            ];

            setEvents(combinedEvents);
            setFilteredEvents(combinedEvents);
            setNoEventsMessage(
              combinedEvents.length === 0 ? "No events found." : ""
            );
          }
        }
      }
    } catch (error) {
      console.error("Error loading events or user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedGenre]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents().then(() => {
      setRefreshing(false);
    });
  };

  const handleVideoPlayback = (index) => {
    const video = videoRefs.current[index];
    video.getStatusAsync().then((status) => {
      const isCurrentlyPlaying = status.isPlaying;
      if (isCurrentlyPlaying) {
        video.pauseAsync();
        setIsPlaying((prev) => ({ ...prev, [index]: false }));
      } else {
        video.playAsync();
        setIsPlaying((prev) => ({ ...prev, [index]: true }));
      }
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" color={"#000"} size={30} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Events"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterIcon}
          >
            <MaterialCommunityIcons
              name="account-filter"
              color={"#000"}
              size={30}
            />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <Filter
            setFilteredEvents={setFilteredEvents}
            setGenre={setSelectedGenre}
            loadEvents={loadEvents}
          />
        )}

        {filteredEvents.map((event, index) => (
          <View key={event._id} style={styles.videoContainer}>
            <Video
              ref={(ref) => (videoRefs.current[index] = ref)}
              source={{ uri: event.videoUrl }}
              style={styles.video}
              resizeMode="contain"
              shouldPlay={isPlaying[index]}
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (!isPlaying[index] && status.isPlaying) {
                  Video.pauseAsync();
                }
              }}
            />
            <TouchableOpacity
              onPress={() => handleVideoPlayback(index)}
              style={styles.pauseIcon}
            >
              <MaterialCommunityIcons
                name={isPlaying[index] ? "pause-circle" : "play-circle"}
                color={"#fff"}
                size={40}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.overlay}
              onPress={() =>
                navigation.navigate("EventDetailsScreen", {
                  eventId: event._id,
                })
              }
            >
              <View style={styles.bottomInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.organizer}>by {event.organizer}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {noEventsMessage && (
          <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  filterIcon: {
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  videoContainer: {
    width,
    height: height * 0.9,
    position: "relative",
    // marginBottom: 100,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "transparent",
  },
  pauseIcon: {
    position: "absolute",
    bottom: 100, // Adjust position above the bottom
    left: 5,
    right: 0,
  },
  bottomInfo: {
    marginTop: 30,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  organizer: {
    color: "#ddd",
    fontSize: 14,
  },
});
