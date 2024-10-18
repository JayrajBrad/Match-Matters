// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getUserId } from "../backend/registrationUtils"; // Adjust the import path
// import { API_URL } from "@env";

// const MyEventsScreen = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Function to fetch created events
//     const fetchCreatedEvents = async () => {
//       try {
//         // const userId = await AsyncStorage.getItem("userId");
//         const userId = await getUserId();
//         if (!userId) {
//           console.error("User ID not found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(`${API_URL}/user/${userId}/events`);
//         console.log("Fetched created events:", response.data);
//         // Handle the response data (e.g., set it in state)

//         setEvents(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch created events:", error);
//         setError("Failed to fetch created events."); // Set error message
//         setLoading(false);
//       }
//     };

//     fetchCreatedEvents();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Events</Text>
//       <FlatList
//         data={events}
//         keyExtractor={(event) => event._id}
//         renderItem={({ item }) => (
//           <View style={styles.eventItem}>
//             <Text style={styles.eventTitle}>{item.title}</Text>
//             <Text>{new Date(item.date).toLocaleDateString()}</Text>
//             <Text>{item.organizer}</Text>
//             <Text>{item.eventDetails}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   eventItem: {
//     marginBottom: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//   },
//   eventTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginTop: 20,
//   },
// });

// export default MyEventsScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserId } from "../backend/registrationUtils"; // Adjust the import path
import { API_URL } from "@env";

const MyEventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch created events
    const fetchCreatedEvents = async () => {
      try {
        const userId = await getUserId(); // Using getUserId to get the user ID
        if (!userId) {
          console.error("User ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/user/${userId}/events`);
        console.log("Fetched created events:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch created events:", error.message);
        setError("Failed to fetch created events."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedEvents();
  }, []);

  const renderEventItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.eventItem}
        onPress={() =>
          navigation.navigate("EventDetailsScreen", { eventId: item._id })
        }
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
          <Text style={styles.eventDetails}>{item.eventDetails}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Events</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
    padding: 10,
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MyEventsScreen;
