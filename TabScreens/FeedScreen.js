import React, { useEffect, useState, useRef, useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { UserContext } from "../navigation/UserProvider"; // Import UserContext
import Filter from "../components/FilterComponent";
import { v4 as uuidv4 } from "react-native-uuid";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

export default function FeedScreen({
  // navigation,
  showFilters,
  setShowFilters,
  selectedDateRange,
  setSelectedDateRange,

  selectedRadius,
}) {
  const navigation = useNavigation();

  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  // const [showFilters, setShowFilters] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [refreshing, setRefreshing] = useState(false);
  const videoRefs = useRef({});
  const [isPlaying, setIsPlaying] = useState({});
  const [noEventsMessage, setNoEventsMessage] = useState("");

  const handleFilterClose = () => {
    setShowFilters(false);
  };

  const { token, setToken, user, setUser, userId, setUserId } =
    useContext(UserContext); // Use context here
  console.log("USER DETAILS FROM FEEDSCREEN", user, userId);

  // Check for token and fetch user data
  useEffect(() => {
    console.log("Fetching user details...");
    const fetchUser = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const userId = decodedToken.userId;
          setUserId(userId);
          setToken(storedToken); // Set token in context
          setUser(decodedToken); // Assuming decodedToken contains user info
        } catch (error) {
          console.error("Token decoding failed:", error);
        }
      } else {
        navigation.navigate("Login"); // Redirect to StartScreen if no token
      }
    };
    fetchUser();
  }, []);

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
    console.log("Filtered Events:", filtered);
  };

  // Fetch events based on user location
  const fetchEventsByUserLocation = async (city, state, country) => {
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

  const fetchNearbyEvents = async (
    city,
    state,
    country,
    latitude,
    longitude,
    maxDistance = "300000"
  ) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/events/nearby/${city}/${state}/${country}/${latitude}/${longitude}/${maxDistance}`
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(
        "Error fetching nearby events:",
        error.response || error.message
      );
      return null;
    }
  };

  const fetchEventsByDateRange = async (startDate, endDate) => {
    if (!startDate || !endDate) return [];

    try {
      const response = await axios.get(
        `${API_URL}/api/events/filterByDate/${
          startDate.toISOString().split("T")[0]
        }/${endDate.toISOString().split("T")[0]}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching events by date range:", error);
      return [];
    }
  };

  //RADIUS FUNCTION
  // const fetchEventsByRadius = async (latitude, longitude, radius) => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/api/events/nearby/${latitude}/${longitude}/${radius}`
  //     );
  //     if (response.status === 200) {
  //       return response.data;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching events by radius:", error);
  //     return [];
  //   }
  // };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return null;
      }
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

  //DONT DELETE THIS//

  // const loadEvents = async () => {
  //   if (!userId) {
  //     console.log("No user ID found, unable to load events.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const { cityName, stateName, countryName } = user;
  //     let combinedEvents = [];

  //     if (cityName && stateName && countryName) {
  //       // Fetch location-based events
  //       const locationEvents =
  //         (await fetchEventsByLocation(cityName, stateName, countryName)) || [];

  //       // Fetch location coordinates
  //       const locationString = `${cityName}, ${stateName}, ${countryName}`;
  //       const { latitude, longitude } =
  //         (await fetchLocationCoordinates(locationString)) || {};

  //       // Fetch nearby events
  //       let nearbyEvents = [];
  //       if (latitude && longitude) {
  //         nearbyEvents =
  //           (await fetchNearbyEvents(
  //             cityName,
  //             stateName,
  //             countryName,
  //             latitude,
  //             longitude
  //           )) || [];
  //       }

  //       // Combine location-based and nearby events into one list
  //       combinedEvents = [
  //         ...new Map(
  //           [...locationEvents, ...nearbyEvents].map((event) => [
  //             event._id,
  //             event,
  //           ])
  //         ).values(),
  //       ];

  //       // Initially set combined events
  //       setEvents(combinedEvents);
  //       setFilteredEvents(combinedEvents);
  //       setNoEventsMessage(
  //         combinedEvents.length === 0 ? "No events found." : ""
  //       );

  //       // If a date range is selected, filter events
  //       if (selectedDateRange) {
  //         const dateRangeEvents = await fetchEventsByDateRange(
  //           selectedDateRange.startDate,
  //           selectedDateRange.endDate
  //         );

  //         // Set eventsToLoad with filtered date range events
  //         const eventsToLoad = combinedEvents.filter((event) =>
  //           dateRangeEvents.some((rangeEvent) => rangeEvent._id === event._id)
  //         );

  //         // Update filtered events based on the selected date range
  //         setFilteredEvents(eventsToLoad);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error loading events or user data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // CURRENT LOCATION USING EXPO ////

  const loadEvents = async () => {
    if (!userId) {
      console.log("No user ID found, unable to load events.");
      return;
    }

    try {
      setLoading(true);
      const { cityName, stateName, countryName } = user;
      let combinedEvents = [];

      // Get user's actual location
      const location = await getCurrentLocation();
      if (!location) {
        console.error("Unable to get location.");
        return;
      }
      console.log("location :", location.latitude, location.longitude);

      let latitude = location ? location.latitude : null;
      let longitude = location ? location.longitude : null;

      if (cityName && stateName && countryName && !latitude && !longitude) {
        // Fallback to generated coordinates if actual location is not available
        const locationString = `${cityName}, ${stateName}, ${countryName}`;
        const coordinates =
          (await fetchLocationCoordinates(locationString)) || {};
        latitude = coordinates.latitude;
        longitude = coordinates.longitude;
      }

      if (latitude && longitude) {
        // Fetch location-based events
        const locationEvents =
          (await fetchEventsByUserLocation(cityName, stateName, countryName)) ||
          [];

        // Fetch nearby events
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

        // Combine location-based and nearby events into one list
        combinedEvents = [
          ...new Map(
            [...locationEvents, ...nearbyEvents].map((event) => [
              event._id,
              event,
            ])
          ).values(), // Corrected syntax here
        ];

        // Initially set combined events
        setEvents(combinedEvents);
        setFilteredEvents(combinedEvents);
        setNoEventsMessage(
          combinedEvents.length === 0 ? "No events found." : ""
        );

        // If a date range is selected, filter events
        if (selectedDateRange) {
          const dateRangeEvents = await fetchEventsByDateRange(
            selectedDateRange.startDate,
            selectedDateRange.endDate
          );

          // Set eventsToLoad with filtered date range events
          const eventsToLoad = combinedEvents.filter((event) =>
            dateRangeEvents.some((rangeEvent) => rangeEvent._id === event._id)
          );

          // Update filtered events based on the selected date range
          setFilteredEvents(eventsToLoad);
        }
      }
    } catch (error) {
      console.error("Error loading events or user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) {
      loadEvents(); // Load events if token and userId are set
    }
  }, [token, userId]);

  // useEffect(() => {
  //   loadEvents();
  // }, [selectedGenre, userId]);

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
        {showFilters && (
          <Filter
            setFilteredEvents={setFilteredEvents}
            setGenre={setSelectedGenre}
            loadEvents={loadEvents}
          />
        )}

        {filteredEvents.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsMessage}>OOPS !! No events found</Text>
          </View>
        ) : (
          filteredEvents.map((event, index) => (
            <View
              key={`${event._id}-${index}`}
              // {event._id}
              style={styles.videoContainer}
            >
              <Video
                ref={(ref) => (videoRefs.current[index] = ref)}
                source={{ uri: event.videoUrl }}
                style={styles.video}
                resizeMode="contain"
                shouldPlay={isPlaying[index]}
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                  if (!isPlaying[index] && status.isPlaying) {
                    videoRefs.current[index].pauseAsync(); // Prevent auto play when other video starts
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
          ))
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
  noEventsContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: height - 150, // Adjust this height according to your design
  },
  noEventsMessage: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
});
