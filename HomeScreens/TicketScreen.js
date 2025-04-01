// // TicketScreen.js
// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// const TicketScreen = ({ route }) => {
//   // We get the ticket data from navigation params
//   const { ticketData, eventTitle } = route.params || {};

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Ticket</Text>
//       {ticketData ? (
//         <>
//           <Text>Event: {eventTitle}</Text>
//           <Text>Ticket Code: {ticketData.ticket_code}</Text>
//           <Text>
//             Purchased On: {new Date(ticketData.purchase_time).toString()}
//           </Text>
//         </>
//       ) : (
//         <Text>No ticket data.</Text>
//       )}
//     </View>
//   );
// };

// export default TicketScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
// });

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";

const TicketScreen = () => {
  const { userId } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user tickets on mount
  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    if (!userId) {
      Alert.alert("Error", "No user is logged in.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Example endpoint: GET /api/tickets?userId=someUserId
      // or /user/:userId/tickets, whichever your server uses
      const response = await axios.get(`${API_URL}/api/tickets`, {
        params: { userId },
      });
      console.log(response.data);
      setTickets(response.data?.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      Alert.alert("Error", "Failed to retrieve tickets from DB.");
    } finally {
      setLoading(false);
    }
  };

  // Renders each ticket in a card
  const renderTicket = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.headerText}>Your Ticket</Text>
        <View style={styles.divider} />

        {/* Event Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Event</Text>
          <Text style={styles.value}>{item.eventId.title}</Text>
        </View>

        <View style={styles.divider} />

        {/* Ticket Code */}
        <View style={styles.section}>
          <Text style={styles.label}>Ticket Code</Text>
          <Text style={styles.ticketCode}>{item.ticket_code}</Text>
        </View>

        <View style={styles.divider} />

        {/* Purchase Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Purchased On</Text>
          <Text style={styles.value}>
            {new Date(item.purchase_time).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  // Loading indicator
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={{ marginTop: 10 }}>Loading Tickets...</Text>
      </View>
    );
  }

  // No tickets found
  if (tickets.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTicketText}>No tickets found.</Text>
      </View>
    );
  }

  // Main list of tickets
  return (
    <View style={styles.container}>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id} // or whatever unique field you have
        renderItem={renderTicket}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TicketScreen;

// ------------- STYLES -------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginVertical: 10,
    // For Android shadow
    elevation: 3,
    // For iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 10,
  },
  section: {
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
    fontWeight: "400",
  },
  ticketCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C81F4D",
    marginTop: 4,
  },
  noTicketText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
