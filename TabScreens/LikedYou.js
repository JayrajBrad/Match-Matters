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
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { getUserId } from "../backend/registrationUtils";

export default function Profile({ navigation }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    fetchBookedEvents(); // Fetch events when the component mounts
  }, []);

  // Function to fetch booked events for the user
  const fetchBookedEvents = async () => {
    try {
      const userId = await getUserId(); // Retrieve the user ID
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
    navigation.navigate("EventParticipantsScreen", { eventId }); // Navigate to the participants screen
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

      <View style={styles.premium}>
        <TouchableOpacity>
          <View>
            <Text style={styles.premiumText}>Boost Your Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* 
      <View style={styles.premium1}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile.js")}>
          <Text style={styles.premiumText1}>Edit Your Profile</Text>
        </TouchableOpacity>
      </View> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventsList: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
  eventItem: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  eventInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
  },
  eventOrganizer: {
    fontSize: 14,
    color: "#888",
  },
  eventDetails: {
    fontSize: 12,
    color: "#aaa",
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
  premium: {
    marginTop: 40,
    padding: 25,
    left: 40,
    paddingHorizontal: 20,
    backgroundColor: "#ffb3ba",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "10%",
  },
  premiumText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  premium1: {
    marginTop: 40,
    marginBottom: 20,
    padding: 25,
    left: 40,
    paddingHorizontal: 20,
    backgroundColor: "#bae1ff",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "10%",
  },
  premiumText1: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
