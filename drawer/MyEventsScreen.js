import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Button,
  Alert,
  Animated,
  RefreshControl,
} from "react-native";

import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyEventsScreen = ({ navigation }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const { userId } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    // Function to fetch created events
    const fetchCreatedEvents = async () => {
      try {
        // const userId = await getUserId(); // Using getUserId to get the user ID
        if (!userId) {
          console.error("User ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/user/${userId}/events`);

        if (response.status === 404 || response.data.length === 0) {
          // If 404 or no events are found
          setError("No events found"); // Update error state
          setEvents([]); // Clear events
        } else {
          // console.log("Fetched created events:", response.data);
          setEvents(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch created events:", error.message);
        setError("Failed to fetch created events."); // Set error message
        setEvents([]); // Clear events
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedEvents();
  }, [userId]);

  const toggleSelection = (eventId) => {
    setSelectedEvents((prev) => {
      const newSelectedEvents = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];

      if (newSelectedEvents.length === 0) {
        setIsSelectionMode(false); // Exit selection mode when no events are selected
      }
      return newSelectedEvents;
    });
  };

  const deleteSelectedEvents = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/events/delete`, {
        eventIds: selectedEvents,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Selected events have been deleted.");
        setEvents((prev) =>
          prev.filter((event) => !selectedEvents.includes(event._id))
        );
        setSelectedEvents([]);
        setIsSelectionMode(false); // Exit selection mode
      }
    } catch (error) {
      console.error("Failed to delete events:", error.message);
      Alert.alert("Error", "Failed to delete selected events.");
    }
  };

  const handleEventPress = (eventId) => {
    if (isSelectionMode) {
      toggleSelection(eventId);
    } else {
      navigation.navigate("EditEventScreen", { eventId });
    }
  };

  const handleEventLongPress = (eventId) => {
    setIsSelectionMode(true);
    toggleSelection(eventId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCreatedEvents();
    setRefreshing(false);
  };

  const renderEventItem = ({ item }) => {
    const isSelected = selectedEvents.includes(item._id);
    return (
      <View style={styles.eventItem}>
        <TouchableOpacity
          onPress={() => handleEventPress(item._id)}
          onLongPress={() => handleEventLongPress(item._id)}
          style={styles.eventTouchable}
        >
          <Image
            source={{ uri: item.images[0]?.url }}
            style={styles.eventImage}
          />
          {isSelectionMode && (
            <TouchableOpacity
              style={[
                styles.deleteIconContainer,
                isSelected && styles.selectedIcon,
              ]}
              onPress={() => toggleSelection(item._id)}
            >
              <MaterialIcons
                name={isSelected ? "delete" : "delete-outline"}
                size={32}
                color={isSelected ? "#FF5252" : "#FFF"} // Red for selected, white for unselected
              />
            </TouchableOpacity>
          )}
          <View style={styles.eventDetailsContainer}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={styles.dateTimeContainer}>
              <MaterialCommunityIcons name="calendar" size={18} color="#fff" />
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
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading your events...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      {/* <Text style={styles.title}>Your Events</Text> */}
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEventItem}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {/* Lottie Animation for No Events */}
            <LottieView
              source={require("../Onboarding-Screen-2/src/assets/animations/NO_request.json")} // Replace with your own Lottie animation
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        )}
      />
      {isSelectionMode && selectedEvents.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteSelectedEvents}
        >
          <Text style={styles.deleteButtonText}>Delete Selected Events</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

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
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  title: {
    fontSize: 28,
    color: "#290F4C",
    fontFamily: "CenturyGothicBold",
    marginBottom: 16,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#290F4C", // Red background for delete
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "#FFF", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },

  eventItem: {
    marginVertical: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  eventTouchable: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  deleteIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slight background for contrast
    borderRadius: 16,
    padding: 2,
  },
  selectedIcon: {
    // backgroundColor: "rgba(76, 175, 80, 0.7)", // Green tint when selected
  },
  eventItem: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
  },
  eventImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  eventDetailsContainer: {
    padding: 15,
    backgroundColor: "#814C68",
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
  eventTitle: {
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    marginBottom: 5,
  },
  eventOrganizer: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "CenturyGothicBold",
    marginTop: 5,
  },
  eventDetails: {
    fontSize: 12,
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    top: 120,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  lottieAnimation: {
    width: 200, // Adjust size of the Lottie animation
    height: 200,
    marginBottom: 20,
  },
});

export default MyEventsScreen;
