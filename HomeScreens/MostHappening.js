// // import React from 'react';
// // import { View, Text, StyleSheet, ScrollView } from 'react-native';

// // export default function MostHappening() {
// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.sectionTitle}>Most Happening Events</Text>
// //       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Event 1</Text>
// //           <Text style={styles.cardText}>Details about Event 1</Text>
// //         </View>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Event 2</Text>
// //           <Text style={styles.cardText}>Details about Event 2</Text>
// //         </View>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Event 3</Text>
// //           <Text style={styles.cardText}>Details about Event 3</Text>
// //         </View>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Event 4</Text>
// //           <Text style={styles.cardText}>Details about Event 4</Text>
// //         </View>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Event 5</Text>
// //           <Text style={styles.cardText}>Details about Event 5</Text>
// //         </View>
// //         {/* Add more cards as needed */}
// //       </ScrollView>

// //       <Text style={styles.sectionTitle}>For You</Text>
// //       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Nearby Events</Text>
// //           <Text style={styles.cardText}>Discover events happening near you.</Text>
// //         </View>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Party Meetups</Text>
// //           <Text style={styles.cardText}>Meet new people while partying.</Text>
// //         </View>
// //         <View style={styles.card}>
// //           <Text style={styles.cardTitle}>Explore</Text>
// //           <Text style={styles.cardText}>Meet new people During the Journey!</Text>
// //         </View>
// //         {/* Add more cards as needed */}
// //       </ScrollView>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingBottom: 20,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',

// //   },
// //   sectionTitle: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginVertical: 40,
// //     textAlign: 'left',
// //     color: '#111',

// //   },
// // //   sectionTitle2: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     marginVertical: 40,
// // //     textAlign: 'left',
// // //     marginTop: 10,

// // //   },
// //   horizontalScroll: {
// //     marginBottom: 20,
// //   },
// //   card: {
// //     width: 200,
// //     height: 150,
// //     backgroundColor: '#BF1013',
// //     borderRadius: 10,
// //     marginHorizontal: 10,
// //     padding: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   cardTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#fff'

// //   },
// //   cardText: {
// //     fontSize: 14,
// //     textAlign: 'center',
// //     color: '#fff'

// //   },
// // });

// // screens/MostHappeningScreen.js

// // screens/MostHappeningScreen.js

// // screens/MostHappeningScreen.js

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import EventItem from "../TabScreens/Tabcomponents/EventItem"; // Adjust the path as needed
// import axios from "axios";
// import { API_URL } from "@env";

// const MostHappeningScreen = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeIndex, setActiveIndex] = useState(null);

//   const viewabilityConfig = {
//     viewAreaCoveragePercentThreshold: 95,
//   };

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const firstVisibleIndex = viewableItems[0].index;
//       setActiveIndex(firstVisibleIndex);
//     }
//   }).current;

//   const fetchMostHappeningEvents = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/events/most-happening`);
//       console.log("most happening:", response);
//       if (response.status === 200) {
//         return response.data.events;
//       } else {
//         throw new Error("Failed to fetch events");
//       }
//     } catch (error) {
//       console.error("Error fetching most happening events:", error);
//       throw error;
//     }
//   };

//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       const fetchedEvents = await fetchMostHappeningEvents();
//       setEvents(fetchedEvents);
//     } catch (err) {
//       setError("Failed to load events. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     try {
//       setRefreshing(true);
//       const fetchedEvents = await fetchMostHappeningEvents();
//       setEvents(fetchedEvents);
//     } catch (err) {
//       setError("Failed to refresh events. Please try again later.");
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const renderEventItem = useCallback(
//     ({ item, index }) => (
//       <EventItem item={item} index={index} shouldPlay={index === activeIndex} />
//     ),
//     [activeIndex]
//   );

//   const keyExtractor = useCallback((item) => item._id.toString(), []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#f44336" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>{error}</Text>
//         {/* Optionally, add a retry button */}
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={events}
//         keyExtractor={keyExtractor}
//         renderItem={renderEventItem}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.center}>
//             <Text>No events found.</Text>
//           </View>
//         }
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         pagingEnabled
//         decelerationRate="fast"
//         snapToInterval={
//           Dimensions.get("window").height - HEADER_HEIGHT - TAB_BAR_HEIGHT
//         }
//         snapToAlignment="start"
//         showsVerticalScrollIndicator={false}
//         removeClippedSubviews
//         maxToRenderPerBatch={5}
//         windowSize={5}
//       />
//     </View>
//   );
// };

// export default MostHappeningScreen;

// const HEADER_HEIGHT = 60;
// const TAB_BAR_HEIGHT = 60;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000", // Assuming video background
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     color: "#f44336",
//     fontSize: 16,
//     textAlign: "center",
//     marginHorizontal: 20,
//   },
// });

// MostHappeningScreen.js

// import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
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
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { API_URL } from "@env";
// import { UserContext } from "../navigation/UserProvider";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";
// import EventItem from "../TabScreens/Tabcomponents/EventItem";
// import Filter from "../components/FilterComponent";

// const { width, height } = Dimensions.get("window");

// // Adjust based on your app's layout
// const HEADER_HEIGHT = 60;
// const TAB_BAR_HEIGHT = 60;
// const containerHeight = height - HEADER_HEIGHT - TAB_BAR_HEIGHT;

// export default function MostHappeningScreen({
//   filterVisible,
//   toggleFilterModal,
//   setShowFilters,
//   selectedDateRange,
// }) {
//   const navigation = useNavigation();

//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const fadeAnimation = useRef(new Animated.Value(0)).current;

//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [noEventsMessage, setNoEventsMessage] = useState("");

//   const [refreshing, setRefreshing] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(null);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [hasMoreEvents, setHasMoreEvents] = useState(true);

//   const [shouldPlay, setShouldPlay] = useState(false);

//   const { token, setToken, user, setUser, userId, setUserId } =
//     useContext(UserContext);

//   // Define how many to fetch per page
//   const EVENTS_PER_PAGE = 10; // Adjust as needed

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

//   // Fetch most happening events
//   const fetchMostHappeningEvents = useCallback(
//     async (page = 1) => {
//       try {
//         if (page === 1) {
//           setLoading(true);
//         } else {
//           setIsLoadingMore(true);
//         }

//         const response = await axios.get(`${API_URL}/api/events/most-happening`, {
//           params: {
//             page,
//             limit: EVENTS_PER_PAGE,
//           },
//         });

//         if (response.status === 200 && response.data) {
//           const { events: newEvents, totalCount, currentPage, totalPages } =
//             response.data;

//           if (page === 1) {
//             setEvents(newEvents);
//             setFilteredEvents(newEvents);
//           } else {
//             setEvents((prev) => [...prev, ...newEvents]);
//             setFilteredEvents((prev) => [...prev, ...newEvents]);
//           }

//           setHasMoreEvents(currentPage < totalPages);
//           setTotalPages(totalPages);

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
//         } else {
//           console.error("Error fetching most happening events:", error.message);
//         }
//       } finally {
//         setLoading(false);
//         setIsLoadingMore(false);
//       }
//     },
//     [API_URL]
//   );

//   // onRefresh (pull to refresh)
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setCurrentPage(1);
//     // Re-fetch from page=1
//     fetchMostHappeningEvents(1).then(() => setRefreshing(false));
//   }, [fetchMostHappeningEvents]);

//   // onEndReached (load more)
//   const handleLoadMore = useCallback(async () => {
//     if (!loading && !isLoadingMore && hasMoreEvents) {
//       setIsLoadingMore(true);
//       const nextPage = currentPage + 1;
//       setCurrentPage(nextPage);
//       try {
//         await fetchMostHappeningEvents(nextPage);
//       } finally {
//         setIsLoadingMore(false);
//       }
//     }
//   }, [loading, isLoadingMore, hasMoreEvents, currentPage, fetchMostHappeningEvents]);

//   // Track viewable items to determine activeIndex
//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const firstVisibleIndex = viewableItems[0].index;
//       setActiveIndex(firstVisibleIndex);
//     }
//   }).current;

//   const viewabilityConfig = {
//     viewAreaCoveragePercentThreshold: 95,
//   };

//   // Rendering each item
//   const renderEventItem = useCallback(
//     ({ item, index }) => (
//       <EventItem
//         item={item}
//         index={index}
//         shouldPlay={index === activeIndex}
//       />
//     ),
//     [activeIndex]
//   );

//   const renderFooter = useCallback(() => {
//     if (!isLoadingMore || events.length === 0) {
//       return null;
//     }

//     return (
//       <View style={styles.footerContainer}>
//         <ActivityIndicator size="small" color="#814C68" />
//         <Text style={styles.footerLoadingText}>Loading more events...</Text>
//       </View>
//     );
//   }, [isLoadingMore, events]);

//   // Trigger initial load when userId is ready
//   useEffect(() => {
//     if (token && userId) {
//       fetchMostHappeningEvents(1);
//     }
//   }, [token, userId, fetchMostHappeningEvents]);

//   // Key extractor using unique identifier
//   const keyExtractor = useCallback((item) => item._id, []);

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       {/* Modal for Filter */}
//       {/* <Modal
//         visible={filterVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={toggleFilterModal}
//       >
//         <View style={modalStyles.modalOverlay}>
//           <View style={modalStyles.modalContent}>
//             <Filter
//               setFilteredEvents={setFilteredEvents}
//               loadEvents={fetchMostHappeningEvents}
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
//       </Modal> */}

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
//         pagingEnabled // Enforces one item per "page" swipe
//         decelerationRate="normal" // Faster snap
//         snapToAlignment="start"
//         maxToRenderPerBatch={5}
//         windowSize={5} // Increased window size for smoother scrolling
//         initialNumToRender={EVENTS_PER_PAGE}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={1}
//         showsVerticalScrollIndicator={false}
//         ListFooterComponent={renderFooter}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         removeClippedSubviews
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
//   footerContainer: {
//     paddingBottom: 80,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footerLoadingText: {
//     fontFamily: "CenturyGothic",
//     fontSize: 14,
//     color: "#290F4C",
//     marginTop: 5,
//   },
// });

// // const modalStyles = StyleSheet.create({
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   modalContent: {
// //     width: "90%",
// //     backgroundColor: "#fff",
// //     borderRadius: 10,
// //     padding: 20,
// //   },
// //   closeButton: {
// //     marginTop: 20,
// //     alignSelf: "center",
// //     backgroundColor: "#252355",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 5,
// //   },
// //   closeButtonText: {
// //     color: "#fff",
// //     fontFamily: "CenturyGothicBold",
// //   },
// // });

// MostHappeningScreen.js

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
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import EventItem from "../TabScreens/Tabcomponents/EventItem";
import Filter from "../components/FilterComponent";

const { width, height } = Dimensions.get("window");

// Adjust based on your app's layout
const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60;
const containerHeight = height - HEADER_HEIGHT - TAB_BAR_HEIGHT;

export default function MostHappeningScreen({
  filterVisible,
  toggleFilterModal,
  setShowFilters,
  selectedDateRange,
}) {
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const fadeAnimation = useRef(new Animated.Value(0)).current;

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

  // Fetch most happening events
  const fetchMostHappeningEvents = useCallback(
    async (page = 1) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await axios.get(
          `${API_URL}/api/events/most-happening`,
          {
            params: {
              page,
              limit: EVENTS_PER_PAGE,
            },
          }
        );

        if (response.status === 200 && response.data) {
          const {
            events: newEvents,
            totalCount,
            currentPage,
            totalPages,
          } = response.data;

          if (page === 1) {
            setEvents(newEvents);
            setFilteredEvents(newEvents);
          } else {
            setEvents((prev) => [...prev, ...newEvents]);
            setFilteredEvents((prev) => [...prev, ...newEvents]);
          }

          setHasMoreEvents(currentPage < totalPages);
          setTotalPages(totalPages);

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
        } else {
          console.error("Error fetching most happening events:", error.message);
        }
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [API_URL]
  );

  // onRefresh (pull to refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    // Re-fetch from page=1
    fetchMostHappeningEvents(1).then(() => setRefreshing(false));
  }, [fetchMostHappeningEvents]);

  // onEndReached (load more)
  const handleLoadMore = useCallback(async () => {
    if (!loading && !isLoadingMore && hasMoreEvents) {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      try {
        await fetchMostHappeningEvents(nextPage);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [
    loading,
    isLoadingMore,
    hasMoreEvents,
    currentPage,
    fetchMostHappeningEvents,
  ]);

  // Track viewable items to determine activeIndex
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
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
        shouldPlay={shouldPlay && index === activeIndex} // Updated line
        hasTabBar={false}
      />
    ),
    [shouldPlay, activeIndex]
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
      fetchMostHappeningEvents(1);
    }
  }, [token, userId, fetchMostHappeningEvents]);

  // Handle screen focus to control video playback
  useFocusEffect(
    useCallback(() => {
      // When the screen is focused, allow videos to play
      setShouldPlay(true);

      return () => {
        // When the screen is unfocused, prevent videos from playing
        setShouldPlay(false);
      };
    }, [])
  );

  // Key extractor using unique identifier
  const keyExtractor = useCallback((item) => item._id, []); // Corrected line

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
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
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
      />
    </Animated.View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
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
