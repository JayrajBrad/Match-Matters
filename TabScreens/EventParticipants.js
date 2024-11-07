// import { View, Text, StyleSheet, FlatList } from "react-native";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "@env";

// export default function EventParticipantsScreen({ route }) {
//   const { eventId } = route.params; // Get eventId from the route parameters
//   const [participants, setParticipants] = useState([]);

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/${eventId}/participants`
//         );
//         setParticipants(response.data);
//       } catch (error) {
//         console.error("Error fetching participants:", error);
//       }
//     };

//     fetchParticipants();
//   }, [eventId]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Participants</Text>
//       <FlatList
//         data={participants}
//         renderItem={({ item }) => (
//           <View style={styles.participantItem}>
//             {/* Replace with the desired fields from the participant object */}
//             <Text style={styles.participantName}>{item.username}</Text>
//             <Text style={styles.participantEmail}>{item.emailId}</Text>
//             {/* Add more fields as needed */}
//           </View>
//         )}
//         keyExtractor={(item) => item._id} // Use _id as the key
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   participantItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   participantName: {
//     fontSize: 18,
//   },
// });

// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   Dimensions,
//   Image,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "@env";

// const { width: screenWidth } = Dimensions.get("window");

// export default function EventParticipantsScreen({ route }) {
//   const { eventId } = route.params;
//   const [participants, setParticipants] = useState([]);

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/events/${eventId}/participants`
//         );
//         setParticipants(response.data);
//       } catch (error) {
//         console.error("Error fetching participants:", error);
//       }
//     };

//     fetchParticipants();
//   }, [eventId]);

//   // Function to render each item
//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       {item.images && item.images.length > 0 && (
//         <Image
//           source={{ uri: item.images[0] }}
//           style={styles.participantImage}
//         />
//       )}
//       <View style={styles.infoContainer}>
//         <Text style={styles.participantName}>{item.username || "No Name"}</Text>
//         <Text style={styles.participantEmail}>
//           {item.emailId || "No Email"}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Phone: {item.phoneNumber || "N/A"}
//         </Text>
//         <Text style={styles.participantDetails}>Age: {item.age || "N/A"}</Text>
//         <Text style={styles.participantDetails}>
//           Birthdate: {new Date(item.birthdate).toLocaleDateString() || "N/A"}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Gender: {item.gender || "N/A"}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Location: {item.cityName}, {item.stateName}, {item.countryName}
//         </Text>
//         <Text style={styles.participantDetails}>
//           Preferences: {item.selectedPreferences.join(", ") || "None"}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Participants</Text>
//       <FlatList
//         data={participants}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.flatListContent}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     overflow: "hidden",
//     marginRight: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     elevation: 5,
//     width: screenWidth * 0.85,
//   },
//   participantImage: {
//     width: "100%", // Full width of the card
//     height: 350, // Height to occupy upper section
//     padding: 10,
//   },
//   infoContainer: {
//     padding: 15, // Padding for the text section
//   },
//   flatListContent: {
//     paddingVertical: 10,
//   },
//   participantName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 5,
//   },
//   participantEmail: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 10,
//   },
//   participantDetails: {
//     fontSize: 15,
//     color: "#333",
//     marginBottom: 3,
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";

const { width: screenWidth } = Dimensions.get("window");

export default function EventParticipantsScreen({ route }) {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/events/${eventId}/participants`
        );
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [eventId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.participantImage}
          />
        )}
        <View style={styles.nameOverlay}>
          <Text style={styles.participantName}>
            {item.username || "No Name"}
          </Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.participantEmail}>
          {item.emailId || "No Email"}
        </Text>
        <Text style={styles.participantDetails}>
          Phone: {item.phoneNumber || "N/A"}
        </Text>
        <Text style={styles.participantDetails}>Age: {item.age || "N/A"}</Text>
        <Text style={styles.participantDetails}>
          Birthdate: {new Date(item.birthdate).toLocaleDateString() || "N/A"}
        </Text>
        <Text style={styles.participantDetails}>
          Gender: {item.gender || "N/A"}
        </Text>
        <Text style={styles.participantDetails}>
          Location: {item.cityName}, {item.stateName}, {item.countryName}
        </Text>
        <Text style={styles.participantDetails}>
          Preferences: {item.selectedPreferences.join(", ") || "None"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Participants</Text>
      <FlatList
        data={participants}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: screenWidth * 0.85,
  },
  imageContainer: {
    position: "relative",
  },
  participantImage: {
    width: "100%",
    height: 350,
  },
  nameOverlay: {
    position: "absolute",
    bottom: 0,
    left: 10,
    width: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    // alignItems: "center",
  },
  participantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  infoContainer: {
    padding: 15,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  participantEmail: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    fontWeight: "600",
    marginBottom: 10,
  },
  participantDetails: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    letterSpacing: 0.5,
    lineHeight: 22,
    marginBottom: 3,
  },
});
