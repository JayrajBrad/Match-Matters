import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  RefreshControl,
  ActivityIndicator, // Import ActivityIndicator
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { getUserId } from "../backend/registrationUtils";
import { UserContext } from "../navigation/UserProvider";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyBookingsScreen = ({ navigation }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status
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
  }, []);

  // Function to fetch booked events for the user
  const fetchBookedEvents = async () => {
    try {
      setLoading(true);
      console.log("User ID:", userId);
      const response = await axios.get(
        `${API_URL}/user/users/${userId}/events`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching booked events:", error.response);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await fetchBookedEvents(); // Fetch events again
    setRefreshing(false); // Set refreshing to false after fetching
  };

  const handleEventPress = async (eventId) => {
    navigation.navigate("EventDetailsScreen", { eventId }); // Navigate to the participants screen
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading your booked events...</Text>
      </View>
    );
  }

  const confirmCancelEvent = (eventId, ticketPrice) => {
    Alert.alert(
      "Cancel Event",
      "Are you sure you want to cancel this event?",
      [
        {
          text: "No",
          style: "cancel", // Dismiss the dialog
        },
        {
          text: "Yes",
          onPress: () => handleCancelEvent(eventId, ticketPrice), // Proceed with cancellation
        },
      ],
      { cancelable: true } // Allow dismissing the alert by tapping outside
    );
  };

  const handleCancelEvent = async (eventId, ticketPrice) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/${userId}/cancel-event/${eventId}`
      );
      Alert.alert("Success", response.data.message);
      fetchBookedEvents(); // Refresh the list of events
    } catch (error) {
      console.error(
        "Error canceling event:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to cancel the event.");
    }
  };

  // const handleCancelEvent = async (eventId, ticketPrice) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/user/${userId}/cancel-event/${eventId}`,
  //       { ticketPrice } // Include ticketPrice in the request body
  //     );
  //     Alert.alert("Success", response.data.message);
  //     fetchBookedEvents(); // Refresh the list of events
  //   } catch (error) {
  //     console.error(
  //       "Error canceling event:",
  //       error.response?.data || error.message
  //     );
  //     Alert.alert("Error", "Failed to cancel the event.");
  //   }
  // };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEventPress(item._id)}
            style={styles.eventItem}
          >
            <Image
              source={{ uri: item.images[0]?.url }}
              style={styles.eventImage}
            />
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
              {/* <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelEvent(item._id, item.ticketPrice)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => confirmCancelEvent(item._id, item.ticketPrice)} // Call the confirmation alert
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Animated.View>
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
  eventItem: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
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
  lottieAnimation: {
    width: 200, // Adjust size of the Lottie animation
    height: 200,
    marginBottom: 20,
  },
  eventDetails: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
