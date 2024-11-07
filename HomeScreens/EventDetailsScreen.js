import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo
import { Ionicons } from "@expo/vector-icons"; // For the back arrow icon
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { getToken, getRefreshToken } from "../backend/token";
import { getUserId } from "../backend/registrationUtils";
import { v4 as uuidv4 } from "uuid";

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locationCoords, setLocationCoords] = useState(null);

  const images = event?.images || [];

  useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("Event ID:", eventId);

      try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(response.data);
        // await fetchLocationCoordinates(response.data.location);
        const locationString = `${response.data.location.baseAddress}, ${response.data.location.city}, ${response.data.location.state}, ${response.data.location.country}`;
        await fetchLocationCoordinates(locationString);
      } catch (error) {
        console.error("Error fetching event details:", error.response);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocationCoordinates = async (locationString) => {
      try {
        console.log("ola api : ", OLA_MAPS_API_KEY);
        console.log("location :", locationString);

        const requestId = uuidv4();
        console.log("requestId", requestId);

        const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${locationString}&api_key=${OLA_MAPS_API_KEY}`;
        const response = await axios.get(geocodeUrl, {
          headers: { "X-Request-Id": requestId },
        });

        if (
          response.data.geocodingResults &&
          response.data.geocodingResults.length > 0
        ) {
          const { lat, lng } =
            response.data.geocodingResults[0].geometry.location;
          console.log("Coordinates:", { latitude: lat, longitude: lng });
          setLocationCoords({ latitude: lat, longitude: lng });
        } else {
          console.error("No results found for the provided location.");
        }
      } catch (error) {
        console.error(
          "Error fetching coordinates:",
          error.response || error.message
        );
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  // Function to handle booking the event
  // const handleBookEvent = async () => {
  //   try {
  //     const token = await getToken();
  //     const response = await axios.post(
  //       `${API_URL}/api/events/${eventId}/register`, // Make sure your backend has this endpoint
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "x-refresh-token": refreshToken,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       alert("Successfully registered for the event!");
  //     }
  //   } catch (error) {
  //     console.error("Error booking event:", error.response);
  //     alert("Failed to register for the event. Please try again.");
  //   }
  // };

  const handleBookEvent = async () => {
    try {
      let token = await getToken(); // Get the initial token
      const userId = await getUserId();
      const refreshToken = await getRefreshToken(); // Retrieve the refresh token
      if (!token) {
        alert("No access token found. Cannot proceed with registration.");
        return; // Prevent proceeding without a valid token
      }

      const registerForEvent = async (token) => {
        return await axios.post(
          `${API_URL}/api/events/${eventId}/register`,
          { userId }, // Ensure your backend has this endpoint

          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-refresh-token": refreshToken,
            },
          }
        );
      };

      try {
        const response = await registerForEvent(token);
        if (response.status === 200) {
          alert("Successfully registered for the event!");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Token expired, attempting to refresh...");
          try {
            // Refresh the token
            token = await refreshAuthToken(refreshToken); // Refresh the token
            await saveToken(token); // Optionally save the new token

            // Retry the registration with the new token
            const retryResponse = await registerForEvent(token);
            if (retryResponse.status === 200) {
              alert("Successfully registered for the event!");
            } else {
              alert(
                `Failed to register for the event on retry. Status: ${retryResponse.status}`
              );
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            alert("Session expired. Please log in again.");
            // Optionally, redirect the user to the login page
            // navigation.navigate("Login"); // Adjust according to your navigation setup
          }
        } else {
          throw error; // Handle other errors
        }
      }
    } catch (error) {
      console.error("Error booking event:", error);
      alert("Failed to register for the event. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View> */}

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.eventImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: index === currentIndex ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Event Title, Date, Time */}
        <View style={styles.titleDateContainer}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.dateTimeContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#BF1013"
            />
            <Text style={styles.dateText}>
              {new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>
                {new Date(event.date)
                  .toLocaleString("en-US", { month: "short" })
                  .toUpperCase()}
              </Text>
              <Text style={styles.dateBadgeNumber}>
                {new Date(event.date).getDate()}
              </Text>
            </View>
          </View>
        </View>

        {/* Thin Line */}
        <View style={styles.thinLine} />

        {/* Organizer Section */}
        <View style={styles.organizerContainer}>
          <Text style={styles.organizerText}>Organized by</Text>
          <Text>{event.organizer || "Unknown"}</Text>
        </View>

        {/* Event Details Section */}
        <View>
          <Text style={styles.sectionHeader}>Event Details</Text>
          <View style={styles.eventDetailsContainer}>
            <Text style={styles.eventDetailsText}>
              {event.eventDetails || "No description available"}
            </Text>
          </View>
        </View>

        {/* Thin Line */}
        <View style={styles.thinLine} />

        {/* Artist Section */}
        <View style={styles.artistsContainer}>
          {event.artists?.map((artist, index) => (
            <View key={index} style={styles.singleArtist}>
              {/* <Image
                source={{ uri: artist.image }}
                style={styles.artistImage}
              /> */}
              <Text style={styles.sectionHeader}>{artist.role}</Text>
              <Text style={styles.artistName}>{artist.name}</Text>
            </View>
          ))}
        </View>

        {/* Interested Section */}
        <View style={styles.interestedContainer}>
          <Text style={styles.interestedPrompt}>
            Click on interested to stay updated about this event
          </Text>
          <TouchableOpacity style={styles.interestedButton}>
            <Text style={styles.interestedText}> Interested </Text>
          </TouchableOpacity>
        </View>

        {/* Address Section */}
        {/* Address Section */}
        <View style={styles.addressContainer}>
          <Text style={styles.cityText}>{event.location?.city || "City"}</Text>
          <Text style={styles.addressText}>
            {`${event.location?.baseAddress || "Address"}, ${
              event.location?.state || "State"
            }, ${event.location?.country || "Country"}`}
          </Text>
        </View>

        {/* About the Venue and Map */}
        <View style={styles.venueContainer}>
          <View style={styles.venueHeaderContainer}>
            <Text style={styles.venueHeader}>About the Venue</Text>
            <TouchableOpacity>
              <Text style={styles.getDestinationText}>Get Destination</Text>
            </TouchableOpacity>
          </View>
          {/* Map Section */}
          {locationCoords && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: locationCoords.latitude,
                longitude: locationCoords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={locationCoords} title="Event Location" />
            </MapView>
          )}
        </View>

        {/* Distance from Home */}
        {/* <Text style={styles.distanceText}>
          {event.distance || "Distance"} km distance from your home
        </Text> */}

        {/* Thin Line */}
        <View style={styles.thinLine} />

        {/* Invite and Book Event Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.buttonText}>Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookEvent}>
            <Text style={styles.buttonText}>Book Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: { height: 200, marginVertical: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#BF1013",
    paddingTop: 50, // Adjust for status bar height
    padding: 20,
    // paddingHorizontal: 20,
    // paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  sliderContainer: {
    width: "100%",
    height: 200,
    marginTop: 1, // Adjusted to accommodate the header
  },
  eventImage: {
    width: Dimensions.get("window").width,
    height: 200,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: "#BF1013",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  contentContainer: {
    padding: 20,
  },
  titleDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#BF1013",
  },
  dateBadge: {
    backgroundColor: "#BF1013",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  dateBadgeText: {
    color: "#fff",
    fontSize: 12,
  },
  dateBadgeNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  thinLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  organizerContainer: {
    marginBottom: 10,
  },
  organizerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  eventDetailsContainer: {
    marginBottom: 10,
  },
  eventDetailsText: {
    fontSize: 16,
    color: "#666",
  },
  artistsContainer: {
    marginBottom: 10,
  },
  singleArtist: {
    marginBottom: 10,
  },
  artistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    color: "#333",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  interestedContainer: {
    marginBottom: 10,
  },
  interestedPrompt: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  interestedButton: {
    backgroundColor: "#BF1013",
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 5,

    paddingHorizontal: 20,
  },
  interestedText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  addressContainer: {
    marginBottom: 10,
  },
  cityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addressText: {
    fontSize: 16,
    color: "#666",
  },
  venueContainer: {
    marginBottom: 10,
  },
  venueHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  venueHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  getDestinationText: {
    fontSize: 16,
    color: "#BF1013",
  },
  map: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
  distanceText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inviteButton: {
    backgroundColor: "#BF1013",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
  },
  bookButton: {
    backgroundColor: "#333",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#BF1013",
    textAlign: "center",
  },
});

export default EventDetailsScreen;
