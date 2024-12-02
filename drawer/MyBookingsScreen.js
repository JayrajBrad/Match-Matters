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
import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { getUserId } from "../backend/registrationUtils";
import { UserContext } from "../navigation/UserProvider";

const MyBookingsScreen = ({ navigation }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status
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
      console.log("User ID:", userId);
      const response = await axios.get(
        `${API_URL}/user/users/${userId}/events`
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching booked events:", error.response);
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
              source={{ uri: item.images[0]?.url }} // Assuming images is an array and we get the first image
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={styles.eventOrganizer}>{item.organizer}</Text>
              {/* <Text style={styles.eventDetails}>{item.eventDetails}</Text> */}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        style={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No liked events found</Text>
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  eventItem: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  eventImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  eventInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "transparent", // Semi-transparent black background
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff", // White text color for contrast
    fontFamily: "Chalkboard SE",
  },
  eventDate: {
    fontSize: 18,
    color: "#ddd",
    marginTop: 5,
    fontFamily: "Chalkboard SE",
  },
  eventOrganizer: {
    fontSize: 18,
    color: "#ddd",
    marginTop: 5,
    fontFamily: "Chalkboard SE",
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
});
