/////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useContext,
//   useCallback,
//   useMemo,
// } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   Dimensions,
//   Animated,
//   FlatList,
//   SafeAreaView,
//   TouchableOpacity,
//   RefreshControl,
//   Image,
//   ActivityIndicator,
//   Modal,
// } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useVideoPlayer, VideoView } from "expo-video";
// import EventItem from "./Tabcomponents/EventItem";
// import axios from "axios";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { API_URL, OLA_MAPS_API_KEY } from "@env";
// import { UserContext } from "../navigation/UserProvider"; // Import UserContext
// import Filter from "../components/FilterComponent";
// import { v4 as uuidv4 } from "react-native-uuid";
// import * as Location from "expo-location";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import _ from "lodash";

// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// const screen = Dimensions.get("window");
// const { width, height } = screen;
// const screenHeight = Dimensions.get("window").height;
// const eventsPerPage = 5;

// export default function FeedScreen({
//   filterVisible,
//   toggleFilterModal,
//   setShowFilters,
//   selectedDateRange,
// }) {
//   useEffect(() => {
//     let isMounted = true;
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
//           CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
//         });
//         if (isMounted) setFontsLoaded(true);
//       } catch (error) {
//         console.error("Error loading fonts:", error);
//       } finally {
//         SplashScreen.hideAsync();
//       }
//     }
//     loadFonts();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const navigation = useNavigation();
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const [showFilters, setShowFilters] = useState(false);
//   const [filteredEvents, setFilteredEvents] = useState(events);
//   const [refreshing, setRefreshing] = useState(false);
//   // const videoRefs = useRef({});
//   const [noEventsMessage, setNoEventsMessage] = useState("");

//   // const [filterVisible, setFilterVisible] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(null);
//   //////
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMoreEvents, setHasMoreEvents] = useState(true);
//   // Number of events per page
//   ///////

//   // const handleFilterClose = () => {
//   //   setShowFilters(false);
//   // };

//   const { token, setToken, user, setUser, userId, setUserId } =
//     useContext(UserContext); // Use context here
//   // console.log("USER DETAILS FROM FEEDSCREEN", user, userId);

//   // Check for token and fetch user data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchUser = async () => {
//       const storedToken = await AsyncStorage.getItem("token");
//       if (storedToken && isMounted) {
//         try {
//           const decodedToken = jwtDecode(storedToken);
//           setUserId(decodedToken.userId);
//           setToken(storedToken);
//           setUser(decodedToken);
//         } catch (error) {
//           console.error("Token decoding failed:", error);
//         }
//       }
//     };

//     fetchUser();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

// const fetchLocationCoordinates = async (locationString) => {
//   try {
//     const generateId = () => Math.random().toString(36).substring(2, 15);
//     const requestId = generateId();

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

//   const fetchEventsByUserLocation = useCallback(
//     async (city, state, country) => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/location/${city}/${state}/${country}`
//         );

//         // Check if we got a 2xx status AND an array
//         if (
//           response.status === 200 &&
//           response.data &&
//           Array.isArray(response.data.events)
//         ) {
//           const currentDate = new Date().toISOString().split("T")[0];
//           // Now it's safe to do .filter
//           const futureEvents = response.data.events.filter(
//             (event) =>
//               new Date(event.date).toISOString().split("T")[0] >= currentDate
//           );
//           return futureEvents;
//         } else {
//           // If the status isn't 200, or data isn't an array, log it or handle gracefully
//           console.log(
//             "Unexpected response or no events array:",
//             response.status,
//             response.data
//           );
//           return [];
//         }
//       } catch (error) {
//         console.error("Error fetching events by user location:", error);
//         return []; // Return empty array on error
//       }
//     },
//     []
//   );

//   const fetchNearbyEvents = useCallback(
//     async (
//       city,
//       state,
//       country,
//       latitude,
//       longitude,
//       maxDistance = "300000"
//     ) => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/nearby/${city}/${state}/${country}/${latitude}/${longitude}/${maxDistance}`
//         );

//         // Check if the server gave a 2xx status and the data is an array
//         if (
//           response.status === 200 &&
//           response.data &&
//           Array.isArray(response.data.events)
//         ) {
//           const currentDate = new Date().toISOString().split("T")[0];
//           // Safe to call .filter() now
//           const futureEvents = response.data.events.filter(
//             (event) =>
//               new Date(event.date).toISOString().split("T")[0] >= currentDate
//           );
//           return futureEvents;
//         } else {
//           // Possibly the server returned { message: "..."} or something else
//           console.log(
//             "Nearby events not an array or bad status:",
//             response.status,
//             response.data
//           );
//           return [];
//         }
//       } catch (error) {
//         console.error("Error fetching nearby events:", error);
//         // Return empty array or null to indicate failure
//         return [];
//       }
//     },
//     []
//   );

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Location permission denied");
//         return null;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       return location.coords;
//     } catch (error) {
//       console.error("Error getting location:", error);
//       return null;
//     }
//   };

//   // Memoize paginated events
//   const paginatedEvents = useMemo(() => {
//     const startIndex = (currentPage - 1) * eventsPerPage;
//     return events.slice(startIndex, startIndex + eventsPerPage);
//   }, [events, currentPage]);

//   const loadEvents = useCallback(
//     async (page = 1) => {
//       if (!userId) {
//         console.log("No user ID found, unable to load events.");
//         return;
//       }

//       try {
//         setLoading(true);
//         const { cityName, stateName, countryName } = user;
//         let combinedEvents = [];

//         // Get user's actual location
//         const location = await getCurrentLocation();
//         if (!location) {
//           console.error("Unable to get location.");
//           return;
//         }
//         console.log(
//           "location from getCurrentLocation:",
//           location.latitude,
//           location.longitude
//         );

//         let latitude = location ? location.latitude : null;
//         let longitude = location ? location.longitude : null;

//         if (cityName && stateName && countryName && !latitude && !longitude) {
//           // Fallback to generated coordinates if actual location is not available
//           const locationString = `${cityName}, ${stateName}, ${countryName}`;
//           const coordinates =
//             (await fetchLocationCoordinates(locationString)) || {};
//           latitude = coordinates.latitude;
//           longitude = coordinates.longitude;
//         }

//         if (latitude && longitude) {
//           // Fetch location-based events
//           const locationEvents =
//             (await fetchEventsByUserLocation(
//               cityName,
//               stateName,
//               countryName
//             )) || [];

//           // Fetch nearby events
//           let nearbyEvents = [];
//           if (latitude && longitude) {
//             nearbyEvents =
//               (await fetchNearbyEvents(
//                 cityName,
//                 stateName,
//                 countryName,
//                 latitude,
//                 longitude
//               )) || [];
//           }

//           // Combine location-based and nearby events into one list
//           combinedEvents = [
//             ...new Map(
//               [...locationEvents, ...nearbyEvents].map((event) => [
//                 event._id,
//                 event,
//               ])
//             ).values(), // Corrected syntax here
//           ];
//           if (page === 1) {
//             setEvents(combinedEvents);
//             setFilteredEvents(combinedEvents);
//           } else {
//             setEvents((prev) => [...prev, ...combinedEvents]);
//             setFilteredEvents((prev) => [...prev, ...combinedEvents]);
//           }

//           setHasMoreEvents(combinedEvents.length === eventsPerPage);
//           setNoEventsMessage(
//             combinedEvents.length === 0 ? "No events found." : ""
//           );
//         }
//       } catch (error) {
//         console.error("Error loading events or user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [userId, fetchEventsByUserLocation, fetchNearbyEvents, user]
//   );

//   useEffect(() => {
//     if (token && userId) {
//       loadEvents(); // Load events if token and userId are set
//     }
//   }, [token, userId]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     loadEvents(1).then(() => setRefreshing(false));
//   }, [loadEvents]);

//   // Throttle handleLoadMore
//   const handleLoadMore = useMemo(
//     () =>
//       _.debounce(() => {
//         if (!loading && hasMoreEvents) {
//           const nextPage = currentPage + 1;
//           setCurrentPage(nextPage);
//           loadEvents(nextPage);
//         }
//       }, 2000),
//     [loading, hasMoreEvents, currentPage]
//   );

//   const handleViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const firstVisibleIndex = viewableItems[0].index;
//       if (activeIndex !== firstVisibleIndex) {
//         setActiveIndex(firstVisibleIndex);
//       }
//     }
//   }).current;

//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//   };

//   const renderEventItem = useCallback(
//     ({ item, index }) => (
//       <EventItem
//         item={item}
//         index={index}
//         activeIndex={activeIndex}
//         setActiveIndex={setActiveIndex}
//       />
//     ),
//     [activeIndex]
//   );

//   const keyExtractor = useCallback((item, index) => `${item._id}-${index}`, []);

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       {/* Modal for Filter */}
//       <Modal
//         visible={filterVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={toggleFilterModal}
//       >
//         <View style={modalStyles.modalOverlay}>
//           <View style={modalStyles.modalContent}>
//             <Filter
//               setFilteredEvents={setFilteredEvents}
//               setGenre={(genre) => console.log("Selected Genre:", genre)}
//               loadEvents={loadEvents}
//             />
//             <TouchableOpacity
//               style={modalStyles.closeButton}
//               onPress={toggleFilterModal}
//             >
//               <Text style={modalStyles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Display a loader if loading */}
//       {loading && (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#814C68" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       )}

//       {/* Display no events message */}
//       {!loading && filteredEvents.length === 0 && (
//         <View style={styles.noEventsContainer}>
//           <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>
//         </View>
//       )}

//       <FlatList
//         // style={styles.FlatList}
//         data={filteredEvents}
//         renderItem={renderEventItem}
//         keyExtractor={keyExtractor}
//         maxToRenderPerBatch={3}
//         windowSize={3}
//         removeClippedSubviews={true}
//         initialNumToRender={eventsPerPage} // Render only the first 3 items initially
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//       />
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },

//   scrollContainer: {
//     flex: 1,
//     // top: -20,
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
//   videoContainer: {
//     width: width,
//     height: height,
//     position: "relative",
//     overflow: "hidden",
//   },
//   video: {
//     width: width,
//     height: height,
//   },
//   pauseIcon: {
//     position: "absolute",
//     justifyContent: "center",
//     alignItems: "center",
//     top: "45%",
//     left: "45%",
//     transform: [{ translateX: -35 }, { translateY: -35 }],
//     zIndex: 1,
//   },
//   playIcon: {
//     position: "absolute",
//     justifyContent: "center",
//     alignItems: "center",
//     top: "50%",
//     left: "50%",
//     transform: [{ translateX: -35 }, { translateY: -35 }],
//     zIndex: 2,
//   },
//   // Tapping anywhere on the video while playing will pause
//   tapArea: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: 2,
//   },
//   overlay: {
//     position: "absolute",
//     bottom: 50,
//     left: 0,
//     right: 20,
//     padding: 10,
//     backgroundColor: "gray",
//   },

//   bottomInfo: {
//     marginTop: 10,
//     padding: 10,
//   },
//   eventTitle: {
//     color: "#fff",
//     fontSize: 24,
//     fontFamily: "CenturyGothicBold",
//   },
//   organizer: {
//     color: "#ddd",
//     fontSize: 18,
//     fontFamily: "CenturyGothic",
//   },
//   noEventsContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     height: height - 150, // Adjust this height according to your design
//   },
//   noEventsMessage: {
//     fontSize: 22,
//     color: "#333",
//     fontFamily: "CenturyGothicBold",
//   },
// });

// const modalStyles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   closeButton: {
//     marginTop: 20,
//     alignSelf: "center",
//     backgroundColor: "#252355",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//   },
// });

////////////////////////////////////////////////////////////////////////////////////////////////

// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useContext,
//   useCallback,
//   useMemo,
// } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   ActivityIndicator,
//   Modal,
// } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import { API_URL, OLA_MAPS_API_KEY } from "@env";
// import { UserContext } from "../navigation/UserProvider";
// import * as Location from "expo-location";
// import _ from "lodash";

// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";
// import EventItem from "./Tabcomponents/EventItem";
// import Filter from "../components/FilterComponent";

// const { width, height } = Dimensions.get("window");

// export default function FeedScreen({
//   filterVisible,
//   toggleFilterModal,
//   setShowFilters,
//   selectedDateRange,
// }) {
//   const navigation = useNavigation();

//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const fadeAnimation = useRef(new Animated.Value(0)).current;

//   // Main events array
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [noEventsMessage, setNoEventsMessage] = useState("");

//   const [refreshing, setRefreshing] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(null);
//   const [visibleIndices, setVisibleIndices] = useState([]);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [hasMoreEvents, setHasMoreEvents] = useState(true);

//   const { token, setToken, user, setUser, userId, setUserId } =
//     useContext(UserContext);

//   // Just for demonstration, define how many to fetch per page
//   const EVENTS_PER_PAGE = 5;

//   useEffect(() => {
//     let isMounted = true;
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
//           CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
//         });
//         if (isMounted) setFontsLoaded(true);
//       } catch (error) {
//         console.error("Error loading fonts:", error);
//       } finally {
//         SplashScreen.hideAsync();
//       }
//     }
//     loadFonts();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     // Fade in animation
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   // 1) Helper to get user's current device location
//   const getCurrentLocation = useCallback(async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Location permission denied");
//         return null;
//       }
//       const location = await Location.getCurrentPositionAsync({});
//       return location.coords; // { latitude, longitude }
//     } catch (error) {
//       console.error("Error getting location:", error);
//       return null;
//     }
//   }, []);

//   const fetchLocationCoordinates = async (locationString) => {
//     try {
//       const generateId = () => Math.random().toString(36).substring(2, 15);
//       const requestId = generateId();

//       const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${locationString}&api_key=${OLA_MAPS_API_KEY}`;
//       const response = await axios.get(geocodeUrl, {
//         headers: { "X-Request-Id": requestId },
//       });

//       if (
//         response.data.geocodingResults &&
//         response.data.geocodingResults.length > 0
//       ) {
//         const { lat, lng } =
//           response.data.geocodingResults[0].geometry.location;
//         return { latitude: lat, longitude: lng }; // Return coordinates
//       } else {
//         console.error("No results found for the provided location.");
//         return null; // Return null if no results found
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching coordinates:",
//         error.response || error.message
//       );
//       return null; // Return null on error
//     }
//   };

//   // 2) Main fetch function calling the new combined endpoint
//   const fetchCombinedEvents = useCallback(
//     async (page = 1) => {
//       try {
//         setLoading(true);

//         // Suppose user object has cityName, stateName, countryName
//         const { cityName, stateName, countryName } = user || {};
//         console.log(cityName, stateName, countryName);
//         // Get device coords if needed (for nearby logic)
//         const coords = await getCurrentLocation();

//         let lat = null;
//         let lng = null;

//         if (coords) {
//           // We got the device location
//           lat = coords.latitude;
//           lng = coords.longitude;
//         } else {
//           // Fallback logic: convert city/state/country to lat/lng
//           const locationString = `${cityName}, ${stateName}, ${countryName}`;
//           const fallbackCoords = await fetchLocationCoordinates(locationString);
//           lat = fallbackCoords?.latitude;
//           lng = fallbackCoords?.longitude;
//         }

//         console.log(lat, lng);

//         // Example: calling /events/combined?city=Delhi&state=Delhi&country=India&latitude=28&longitude=77&maxDistance=300000&page=1&limit=5
//         const response = await axios.get(`${API_URL}/api/events/combined`, {
//           params: {
//             city: cityName,
//             state: stateName,
//             country: countryName,
//             latitude: lat,
//             longitude: lng,
//             maxDistance: 300000, // or pass user’s chosen distance
//             page,
//             limit: EVENTS_PER_PAGE, // 5
//           },
//         });

//         if (response.status === 200 && response.data) {
//           const {
//             events: newEvents,
//             totalCount,
//             currentPage,
//             totalPages,
//           } = response.data;

//           if (page === 1) {
//             // Overwrite
//             setEvents(newEvents);
//             setFilteredEvents(newEvents);
//           } else {
//             // Append
//             setEvents((prev) => [...prev, ...newEvents]);
//             setFilteredEvents((prev) => [...prev, ...newEvents]);
//           }

//           // If we have more pages left, hasMore = true
//           setHasMoreEvents(currentPage < totalPages);
//           setTotalPages(totalPages);

//           // Show "No events found" if no events at all
//           if (totalCount === 0) {
//             setNoEventsMessage("No events found.");
//           } else {
//             setNoEventsMessage("");
//           }
//         }
//       } catch (error) {
//         if (error.response) {
//           console.error("Server error data:", error.response.data);
//           console.error("Server error status:", error.response.status);
//         }
//       } finally {
//         setLoading(false);
//       }
//     },
//     [user, getCurrentLocation]
//   );

//   // 3) onRefresh (pull to refresh)
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     // Re-fetch from page=1
//     fetchCombinedEvents(1).then(() => setRefreshing(false));
//   }, [fetchCombinedEvents]);

//   // 4) onEndReached (load more)
//   const handleLoadMore = useMemo(
//     () =>
//       _.debounce(() => {
//         if (!loading && hasMoreEvents) {
//           const nextPage = currentPage + 1;
//           setCurrentPage(nextPage);
//           fetchCombinedEvents(nextPage);
//         }
//       }, 500),
//     [loading, hasMoreEvents, currentPage, fetchCombinedEvents]
//   );

//   // 5) Trigger initial load when userId is ready
//   useEffect(() => {
//     if (token && userId) {
//       fetchCombinedEvents(1);
//     }
//   }, [token, userId, fetchCombinedEvents]);

//   // const handleViewableItemsChanged = useRef(({ viewableItems }) => {
//   //   if (viewableItems.length > 0) {
//   //     // Set the first visible item's index as activeIndex
//   //     setActiveIndex(viewableItems[0].index);
//   //   }
//   // }).current;

//   const handleViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const firstVisibleIndex = viewableItems[0].index;
//       if (activeIndex !== firstVisibleIndex) {
//         setActiveIndex(firstVisibleIndex);
//       }
//     }
//   }).current;

//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 50,
//   };

//   // 7) Rendering each item
//   const renderEventItem = useCallback(
//     ({ item, index }) => (
//       <EventItem
//         item={item}
//         index={index}
//         // visibleIndices={visibleIndices}
//         activeIndex={activeIndex}
//         // setActiveIndex={setActiveIndex}
//       />
//     ),
//     [visibleIndices]
//   );

//   // 8) Key extractor
//   const keyExtractor = useCallback((item, idx) => `${item._id}-${idx}`, []);

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       {/* Modal for Filter */}
//       <Modal
//         visible={filterVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={toggleFilterModal}
//       >
//         <View style={modalStyles.modalOverlay}>
//           <View style={modalStyles.modalContent}>
//             <Filter
//               setFilteredEvents={setFilteredEvents}
//               loadEvents={fetchCombinedEvents}
//               // setGenre, etc. if needed
//             />
//             <TouchableOpacity
//               style={modalStyles.closeButton}
//               onPress={toggleFilterModal}
//             >
//               <Text style={modalStyles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Display a loader if loading */}
//       {loading && events.length === 0 && (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#814C68" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       )}

//       {/* Display no events message */}
//       {!loading && filteredEvents.length === 0 && (
//         <View style={styles.noEventsContainer}>
//           <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>
//         </View>
//       )}

//       <FlatList
//         data={filteredEvents}
//         renderItem={renderEventItem}
//         keyExtractor={keyExtractor}
//         maxToRenderPerBatch={3}
//         windowSize={5}
//         initialNumToRender={EVENTS_PER_PAGE}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         // getItemLayout={(data, index) => ({
//         //   length: ITEM_HEIGHT,
//         //   offset: ITEM_HEIGHT * index,
//         //   index,
//         // })}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onViewableItemsChanged={handleViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         removeClippedSubviews={true}
//       />
//     </Animated.View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
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
//   noEventsContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noEventsMessage: {
//     fontSize: 22,
//     color: "#333",
//     fontFamily: "CenturyGothicBold",
//   },
// });

// const modalStyles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 20,
//   },
//   closeButton: {
//     marginTop: 20,
//     alignSelf: "center",
//     backgroundColor: "#252355",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//   },
// });

////////////////////////////////////////////////////////////////////////////////////////

import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { UserContext } from "../navigation/UserProvider";
import * as Location from "expo-location";

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import EventItem from "./Tabcomponents/EventItem";
import Filter from "../components/FilterComponent";

const { width, height } = Dimensions.get("window");

export default function FeedScreen({
  filterVisible,
  toggleFilterModal,
  setShowFilters,
  selectedDateRange,
}) {
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // Main events array
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [noEventsMessage, setNoEventsMessage] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);

  const [shouldPlay, setShouldPlay] = useState(false);

  const { token, setToken, user, setUser, userId, setUserId } =
    useContext(UserContext);

  // Define how many to fetch per page
  const EVENTS_PER_PAGE = 10; // Adjust as needed

  useEffect(() => {
    let isMounted = true;
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
          CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
        });
        if (isMounted) setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    loadFonts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  // Helper to get user's current device location
  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      return location.coords; // { latitude, longitude }
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  }, []);

  const fetchLocationCoordinates = async (locationString) => {
    try {
      const generateId = () => Math.random().toString(36).substring(2, 15);
      const requestId = generateId();

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

  // Main fetch function calling the new combined endpoint
  const fetchCombinedEvents = useCallback(
    async (page = 1) => {
      try {
        if (page === 1) {
          // Show "loading" for the initial fetch
          setLoading(true);
        } else {
          // For subsequent pages, show bottom spinner
          setIsLoadingMore(true);
        }
        // Suppose user object has cityName, stateName, countryName
        const { cityName, stateName, countryName } = user || {};
        console.log(cityName, stateName, countryName);
        // Get device coords if needed (for nearby logic)
        const coords = await getCurrentLocation();

        let lat = null;
        let lng = null;

        if (coords) {
          // We got the device location
          lat = coords.latitude;
          lng = coords.longitude;
        } else {
          // Fallback logic: convert city/state/country to lat/lng
          const locationString = `${cityName}, ${stateName}, ${countryName}`;
          const fallbackCoords = await fetchLocationCoordinates(locationString);
          lat = fallbackCoords?.latitude;
          lng = fallbackCoords?.longitude;
        }

        console.log(lat, lng);

        // Example: calling /events/combined?city=Delhi&state=Delhi&country=India&latitude=28&longitude=77&maxDistance=300000&page=1&limit=5
        const response = await axios.get(`${API_URL}/api/events/combined`, {
          params: {
            city: cityName,
            state: stateName,
            country: countryName,
            latitude: lat,
            longitude: lng,
            maxDistance: 300000, // or pass user’s chosen distance
            page,
            limit: EVENTS_PER_PAGE, // 5
          },
        });

        if (response.status === 200 && response.data) {
          const {
            events: newEvents,
            totalCount,
            currentPage,
            totalPages,
          } = response.data;

          if (page === 1) {
            // Overwrite
            setEvents(newEvents);
            setFilteredEvents(newEvents);
          } else {
            // Append
            setEvents((prev) => [...prev, ...newEvents]);
            setFilteredEvents((prev) => [...prev, ...newEvents]);
          }

          // If we have more pages left, hasMore = true
          setHasMoreEvents(currentPage < totalPages);
          setTotalPages(totalPages);

          // Show "No events found" if no events at all
          if (totalCount === 0) {
            setNoEventsMessage("No events found.");
          } else {
            setNoEventsMessage("");
          }
        }
      } catch (error) {
        if (error.response) {
          console.error("Server error data:", error.response.data);
          console.error("Server error status:", error.response.status);
        }
      } finally {
        setLoading(false);
      }
    },
    [user, getCurrentLocation]
  );

  // onRefresh (pull to refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    // Re-fetch from page=1
    fetchCombinedEvents(1).then(() => setRefreshing(false));
  }, [fetchCombinedEvents]);

  // onEndReached (load more)
  // const handleLoadMore = useCallback(() => {
  //   if (!loading && hasMoreEvents) {
  //     const nextPage = currentPage + 1;
  //     setCurrentPage(nextPage);
  //     fetchCombinedEvents(nextPage);
  //   }
  // }, [loading, hasMoreEvents, currentPage, fetchCombinedEvents]);

  // onEndReached (load more)
  const handleLoadMore = useCallback(async () => {
    if (!loading && !isLoadingMore && hasMoreEvents) {
      setIsLoadingMore(true);

      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      try {
        await fetchCombinedEvents(nextPage);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [loading, isLoadingMore, hasMoreEvents, currentPage, fetchCombinedEvents]);

  // Track viewable items to determine activeIndex
  // const handleViewableItemsChanged = useRef(({ viewableItems }) => {
  //   if (viewableItems.length > 0) {
  //     const firstVisibleIndex = viewableItems[0].index;
  //     if (activeIndex !== firstVisibleIndex) {
  //       setActiveIndex(firstVisibleIndex);
  //     }
  //   }
  // }).current;

  // const viewabilityConfig = {
  //   itemVisiblePercentThreshold: 80, // Adjust as needed
  // };

  useFocusEffect(
    React.useCallback(() => {
      // When the screen is focused, start playing the videos
      setShouldPlay(true);

      return () => {
        // When the screen is unfocused, stop playing the videos
        setShouldPlay(false);
      };
    }, [setShouldPlay])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    // If you want an item considered "active" only if it is fully in view,
    // you can tweak your `viewabilityConfig` thresholds.
    if (viewableItems.length > 0) {
      // Typically the first item in viewableItems is the "active" item
      const firstVisibleIndex = viewableItems[0].index;
      setActiveIndex(firstVisibleIndex);
    }
  }).current;

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 95,
  };

  // Rendering each item
  const renderEventItem = useCallback(
    ({ item, index }) => (
      <EventItem
        item={item}
        index={index}
        // activeIndex={activeIndex}
        // shouldPlay={index === activeIndex}    1st working one 
        shouldPlay={shouldPlay && index === activeIndex}
      />
    ),
    [shouldPlay,activeIndex]
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore || events.length === 0) {
      return null;
    }

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#814C68" />
        <Text style={styles.footerLoadingText}>Loading more events...</Text>
      </View>
    );
  }, [isLoadingMore, events]);

  // Trigger initial load when userId is ready
  useEffect(() => {
    if (token && userId) {
      fetchCombinedEvents(1);
    }
  }, [token, userId, fetchCombinedEvents]);


/////////////////////////////////////////////////////////////////////////
  useFocusEffect(
    useCallback(() => {
      // When the screen is focused, allow videos to play
      setShouldPlay(true);

      return () => {
        // When the screen is unfocused, prevent videos from playing
        setShouldPlay(false);
      };
},[])
);

////////////////////////////////////////////////////////////////////////
  // Key extractor using only unique identifier
  // const keyExtractor = useCallback((item) => `${item._id}`, []); 1st working 
  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      {/* Modal for Filter */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilterModal}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContent}>
            <Filter
              setFilteredEvents={setFilteredEvents}
              loadEvents={fetchCombinedEvents}
              // setGenre, etc. if needed
            />
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={toggleFilterModal}
            >
              <Text style={modalStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display a loader if loading */}
      {loading && events.length === 0 && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#814C68" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* Display no events message */}
      {!loading && filteredEvents.length === 0 && (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsMessage}>{noEventsMessage}</Text>
        </View>
      )}

      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={keyExtractor}
        pagingEnabled // Enforces one item per "page" swipe
        decelerationRate="normal" // Faster snap
        snapToAlignment="start"
        maxToRenderPerBatch={5}
        windowSize={5} // Increased window size for smoother scrolling
        initialNumToRender={EVENTS_PER_PAGE}
        onEndReached={handleLoadMore}
        // onEndReachedThreshold={0.5}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // onViewableItemsChanged={handleViewableItemsChanged}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
      />
    </Animated.View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsMessage: {
    fontSize: 22,
    color: "#333",
    fontFamily: "CenturyGothicBold",
  },
  footerContainer: {
    // paddingVertical: 20,
    paddingBottom: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLoadingText: {
    fontFamily: "CenturyGothic",
    fontSize: 14,
    color: "#290F4C",
    marginTop: 5,
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#252355",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontFamily: "CenturyGothicBold",
  },
});
