import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { getToken } from "../backend/token"; // Function to get the token
import axios from "axios";
import { API_URL } from "@env";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importing icon library
import { UserContext } from "../navigation/UserProvider";
import { SharedElement } from "react-navigation-shared-element";

const AllEvents = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserEvents();
    }
  }, []);

  const fetchUserEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/all-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setEvents(response.data);
      } else {
        console.error("Failed to fetch events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // const renderEventItem = ({ item }) => {
  //   // Format location string if it is an object
  //   const location =
  //     typeof item.location === "object"
  //       ? `${item.location.baseAddress}, ${item.location.city}, ${item.location.state}, ${item.location.country}`
  //       : item.location;

  //   return (
  //     <TouchableOpacity
  //       style={styles.eventItem}
  //       onPress={() =>
  //         navigation.navigate("EventDetailsScreen", { eventId: item._id })
  //       }
  //     >
  //       <Image
  //         source={{ uri: item.images[0]?.url }}
  //         style={styles.eventImage}
  //       />
  //       <View style={styles.eventInfo}>
  //         <Text style={styles.eventTitle}>{item.title}</Text>
  //         <Text style={styles.eventDate}>
  //           {new Date(item.date).toLocaleDateString()}
  //         </Text>
  //         <Text style={styles.eventLocation}>{location}</Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const renderEventItem = ({ item }) => {
    // Format location string if it is an object
    const location =
      typeof item.location === "object"
        ? `${item.location.baseAddress}, ${item.location.city}, ${item.location.state}, ${item.location.country}`
        : item.location;

    return (
      <TouchableOpacity
        style={styles.eventItem}
        onPress={() =>
          navigation.navigate("EventDetailsScreen", { eventId: item._id })
        }
      >
        {/* <SharedElement id={`event.${item._id}.image`}> */}
        <Image
          source={{ uri: item.images[0]?.url }}
          style={styles.eventImage}
        />
        {/* </SharedElement> */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text style={styles.eventLocation}>{location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Location</Text>
      </View> */}
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEventItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        )}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#BF1013",
//     paddingTop: 50, // Adjusted to fit below the status bar
//   },
//   backButton: {
//     // marginRight: 20, // Space between the button and the title
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "white",
//     flex: 1, // Make title take up available space
//     textAlign: "center", // Center the title
//   },
//   eventItem: {
//     marginTop: 15,
//     marginHorizontal: 10,
//     flexDirection: "row",
//     // marginBottom: 16,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     padding: 10,
//   },
//   eventImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   eventInfo: {
//     marginLeft: 10,
//     justifyContent: "center",
//   },
//   eventTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   eventDate: {
//     fontSize: 14,
//     color: "#555",
//   },
//   eventLocation: {
//     fontSize: 14,
//     color: "#888",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#888",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#BF1013",
    paddingTop: 50,
  },
  backButton: {
    // marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  eventItem: {
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: "#000", // Background for fallback
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
    backgroundColor: "transparent", // Semi-transparent overlay
    padding: 15,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    fontFamily: "Chalkboard SE",
  },
  eventDate: {
    fontSize: 14,
    color: "#f0f0f0",
    marginBottom: 5,
    fontFamily: "Chalkboard SE",
  },
  eventLocation: {
    fontSize: 14,
    color: "#d0d0d0",
    fontFamily: "Chalkboard SE",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default AllEvents;
