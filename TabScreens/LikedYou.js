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
import { UserContext } from "../navigation/UserProvider";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import { useFocusEffect } from "@react-navigation/native";

export default function Profile({ navigation }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();

  const animationRef = useRef(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
          CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to manage the refreshing status
  const { userId } = useContext(UserContext);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      // If the animation exists, reset it & play
      if (animationRef.current) {
        animationRef.current.reset();
        animationRef.current.play();
      }
    }, [])
  );

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
    navigation.navigate("EventParticipantsScreen", { eventId }); // Navigate to the participants screen
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top },
        { opacity: fadeAnimation },
      ]}
    >
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
            <View style={styles.eventDetailsContainer}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={styles.dateTimeContainer}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.dateText}>
                  {new Date(item.date)
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()}{" "}
                  |
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).getDate()}
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <Text style={styles.eventOrganizer}>
                <MaterialCommunityIcons name="account" size={20} color="#fff" />{" "}
                {item.organizer}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 60 }}
        style={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> // Add RefreshControl
        }
        ListEmptyComponent={() => (
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require("../Onboarding-Screen-2/src/assets/animations/no_event.json")} // Replace with your animation file path
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.emptyText}>No events Booked</Text>
          </View>
        )}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventsList: {
    // marginTop: 20,
    width: "100%",
    paddingHorizontal: 10,
    // elevation: 8,

    // // iOS shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.7,
    // shadowRadius: 4,
  },
  animationContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 300,
    height: 300,
  },
  eventItem: {
    marginVertical: 15,
    marginHorizontal: 10,
    borderRadius: 16,
    // overflow: "hidden",
    backgroundColor: "#fff", // Background color for the container
    // borderWidth: 1,
    // elevation: 8,

    // // iOS shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.7,
    // shadowRadius: 4,
  },
  eventDetailsContainer: {
    padding: 15,
    backgroundColor: "#814C68",
    borderBottomLeftRadius: 16, // Ensure the bottom corners match the eventItem
    borderBottomRightRadius: 16,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 5,
    fontFamily: "CenturyGothicBold",
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: "CenturyGothicBold",

    color: "#fff",
    marginBottom: 5,
  },
  eventOrganizer: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
    fontFamily: "CenturyGothicBold",
  },
  eventImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    borderTopLeftRadius: 16, // Ensure the top corners match the eventItem
    borderTopRightRadius: 16,
  },

  eventInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    padding: 15,
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
    marginHorizontal: "10%",
    backgroundColor: "#ffb3ba",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    elevation: 5,
  },
  premiumText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Chalkboard SE",
  },
});
