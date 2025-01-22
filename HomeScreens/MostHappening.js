// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';

// export default function MostHappening() {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.sectionTitle}>Most Happening Events</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Event 1</Text>
//           <Text style={styles.cardText}>Details about Event 1</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Event 2</Text>
//           <Text style={styles.cardText}>Details about Event 2</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Event 3</Text>
//           <Text style={styles.cardText}>Details about Event 3</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Event 4</Text>
//           <Text style={styles.cardText}>Details about Event 4</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Event 5</Text>
//           <Text style={styles.cardText}>Details about Event 5</Text>
//         </View>
//         {/* Add more cards as needed */}
//       </ScrollView>

//       <Text style={styles.sectionTitle}>For You</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Nearby Events</Text>
//           <Text style={styles.cardText}>Discover events happening near you.</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Party Meetups</Text>
//           <Text style={styles.cardText}>Meet new people while partying.</Text>
//         </View>
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Explore</Text>
//           <Text style={styles.cardText}>Meet new people During the Journey!</Text>
//         </View>
//         {/* Add more cards as needed */}
//       </ScrollView>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//     alignItems: 'center',

//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 40,
//     textAlign: 'left',
//     color: '#111',

//   },
// //   sectionTitle2: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginVertical: 40,
// //     textAlign: 'left',
// //     marginTop: 10,

// //   },
//   horizontalScroll: {
//     marginBottom: 20,
//   },
//   card: {
//     width: 200,
//     height: 150,
//     backgroundColor: '#BF1013',
//     borderRadius: 10,
//     marginHorizontal: 10,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#fff'

//   },
//   cardText: {
//     fontSize: 14,
//     textAlign: 'center',
//     color: '#fff'

//   },
// });

// screens/MostHappeningScreen.js

// screens/MostHappeningScreen.js

// screens/MostHappeningScreen.js

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import EventItem from "../TabScreens/Tabcomponents/EventItem"; // Adjust the path as needed
import axios from "axios";
import { API_URL } from "@env";

const MostHappeningScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 95,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleIndex = viewableItems[0].index;
      setActiveIndex(firstVisibleIndex);
    }
  }).current;

  const fetchMostHappeningEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/most-happening`);
      console.log("most happening:", response);
      if (response.status === 200) {
        return response.data.events;
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching most happening events:", error);
      throw error;
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchMostHappeningEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const fetchedEvents = await fetchMostHappeningEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError("Failed to refresh events. Please try again later.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const renderEventItem = useCallback(
    ({ item, index }) => (
      <EventItem item={item} index={index} shouldPlay={index === activeIndex} />
    ),
    [activeIndex]
  );

  const keyExtractor = useCallback((item) => item._id.toString(), []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f44336" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        {/* Optionally, add a retry button */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderEventItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No events found.</Text>
          </View>
        }
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={
          Dimensions.get("window").height - HEADER_HEIGHT - TAB_BAR_HEIGHT
        }
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

export default MostHappeningScreen;

const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Assuming video background
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
