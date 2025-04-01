import React, { useEffect, useState, useContext, useRef } from "react";
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
  Linking,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import axios from "axios";
import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { UserContext } from "../navigation/UserProvider";

const screenWidth = Dimensions.get("window").width;

const fetchPresignedUrl = async (s3Key) => {
  try {
    // We URL-encode the key param
    const response = await fetch(
      `${API_URL}/api/s3-presigned-url?key=${encodeURIComponent(s3Key)}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pre-signed URL, status: ${response.status}`
      );
    }
    const data = await response.json();
    return data.preSignedUrl;
  } catch (error) {
    console.error("Error fetching pre-signed URL for key:", s3Key, error);
    return null;
  }
};

const EventDetailsScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [locationCoords, setLocationCoords] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [creator, setCreator] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  const { token, userId } = useContext(UserContext);

  // Load custom fonts once
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

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("Event ID:", eventId);
      if (!token) {
        alert("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // 1) Get the event from your backend
        const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedEvent = response.data;

        // 2) Convert each image’s S3 key to a pre-signed URL
        if (fetchedEvent.images && fetchedEvent.images.length > 0) {
          const imagesWithPresignedUrls = await Promise.all(
            fetchedEvent.images.map(async (imgObj) => {
              // Might be a string or { url: "mm_images/..." }
              const key = typeof imgObj === "string" ? imgObj : imgObj.url;
              const presignedUrl = await fetchPresignedUrl(key);
              return { url: presignedUrl };
            })
          );
          fetchedEvent.images = imagesWithPresignedUrls;
        }

        // 3) Fetch event creator details
        if (fetchedEvent.userId) {
          const creatorResponse = await axios.get(
            `${API_URL}/user/users/${fetchedEvent.userId}`
          );
          setCreator(creatorResponse.data);
        }

        // 4) Possibly get location coords
        if (fetchedEvent?.location) {
          const loc = fetchedEvent.location;
          const locationString = `${loc.baseAddress}, ${loc.city}, ${loc.state}, ${loc.country}`;
          await fetchLocationCoordinates(locationString);
        }

        setEvent(fetchedEvent);
      } catch (error) {
        console.error("Error fetching event details:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocationCoordinates = async (locationString) => {
      try {
        const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
          locationString
        )}&api_key=${OLA_MAPS_API_KEY}`;
        const response = await axios.get(geocodeUrl);
        if (
          response.data.geocodingResults &&
          response.data.geocodingResults.length > 0
        ) {
          const { lat, lng } =
            response.data.geocodingResults[0].geometry.location;
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
  }, [eventId, token]);

  useEffect(() => {
    if (!eventId || !userId) return;

    const checkBookedStatus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/events/${eventId}/booked?userId=${userId}`
        );
        if (response.data && response.data.booked === true) {
          setAlreadyBooked(true);
        } else {
          setAlreadyBooked(false);
        }
      } catch (error) {
        console.error("Error checking if event is booked:", error);
      }
    };

    checkBookedStatus();
  }, [eventId, userId]);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const openGoogleMaps = () => {
    if (locationCoords) {
      const { latitude, longitude } = locationCoords;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) =>
        console.error("Error opening Google Maps:", err)
      );
    } else {
      alert("Unable to fetch location coordinates.");
    }
  };

  // Book event -> go to checkout
  const handleBookEvent = () => {
    if (!event) {
      alert("Event details not available.");
      return;
    }
    navigation.navigate("CheckoutPage", {
      eventId: event._id,
      ticketPrice: event.ticketPrice,
      title: event.title,
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading event details...</Text>
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

  const images = event.images || [];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Slideshow */}
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
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex ? styles.activeDot : {},
              ]}
            />
          ))}
        </View>
      </View>

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        {/* Date & Time */}
        <View style={styles.dateTimeContainer}>
          <MaterialCommunityIcons name="calendar" size={24} color="#290F4C" />
          <Text style={styles.dateText}>
            {new Date(event.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.dateText}>
            {new Date(event.date)
              .toLocaleString("en-US", { month: "short" })
              .toUpperCase()}
          </Text>
          <Text style={styles.dateText}>{new Date(event.date).getDate()}</Text>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#290F4C"
            />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationText}>
                {`${event.location?.baseAddress || "Address"}, ${
                  event.location?.city || "City"
                } ${event.location?.state || "State"}, ${
                  event.location?.country || "Country"
                }`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={openGoogleMaps}
          >
            <View style={styles.navigationIconBox}>
              <MaterialCommunityIcons
                name="navigation-variant-outline"
                size={24}
                color="#FFF"
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text
          style={styles.eventDescription}
          numberOfLines={showFullDetails ? undefined : 4}
        >
          {event.eventDetails}
        </Text>
        {event.eventDetails?.split(" ").length > 50 && !showFullDetails && (
          <TouchableOpacity
            onPress={() => setShowFullDetails(true)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>Show More . . .</Text>
          </TouchableOpacity>
        )}

        {/* Organizer */}
        <View style={styles.organizerContainer}>
          <View style={styles.rowHeader}>
            <MaterialCommunityIcons name="account" size={20} color="#290F4C" />
            <Text style={styles.sectionHeader}>Organized by</Text>
          </View>
          <Text style={styles.organizerText}>
            {event.organizer || "Unknown"}
          </Text>
        </View>

        {/* Artist */}
        <View style={styles.organizerContainer}>
          <View style={styles.rowHeader}>
            <MaterialCommunityIcons
              name="music-circle"
              size={20}
              color="#290F4C"
            />
            <Text style={styles.sectionHeader}>Performing Artist</Text>
          </View>
          <Text style={styles.organizerText}>
            {event.artists[0]?.name || "Unknown"}
          </Text>
        </View>

        {/* Host Profile (creator) */}
        <View style={styles.organizerContainer}>
          <View style={styles.rowHeader}>
            <MaterialCommunityIcons name="ghost" size={20} color="#290F4C" />
            <Text style={styles.sectionHeader}>Host</Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View>
              <Text style={styles.organizerText}>
                {creator?.username || "Unknown Host"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ticket Price */}
        <View style={styles.organizerContainer}>
          <View style={styles.rowHeader}>
            <MaterialCommunityIcons name="bank" size={20} color="#290F4C" />
            <Text style={styles.sectionHeader}>Ticket Price</Text>
          </View>
          <Text style={styles.organizerText}>{event.ticketPrice || "NA"}</Text>
        </View>

        {/* Book Button */}
        {/* <TouchableOpacity style={styles.ticketButton} onPress={handleBookEvent}>
          <Text style={styles.ticketButtonText}>Book Now</Text>
        </TouchableOpacity> */}
        <View style={styles.detailsContainer}>
          {/* If already booked => Show 'Already Booked' */}
          {alreadyBooked ? (
            <View style={styles.ticketButton}>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 20,
                  fontFamily: "CenturyGothic",
                }}
              >
                You’ve already booked !
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.ticketButton}
              onPress={handleBookEvent}
            >
              <Text style={styles.ticketButtonText}>Book Now !</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Creator Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#000" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollableContent}>
              {/* Profile Image */}
              {creator?.images && creator.images.length > 0 && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: creator.images[0] }}
                    style={styles.participantImage}
                  />
                </View>
              )}
              {/* Creator Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.userName}>
                  {creator?.username || "No Name"}
                </Text>
                <Text style={styles.userEmail}>
                  {creator?.email || "No Email"}
                </Text>
                <Text style={styles.userDetail}>
                  Phone: {creator?.phoneNumber || "N/A"}
                </Text>
                <Text style={styles.userDetail}>
                  Age: {creator?.age || "N/A"}
                </Text>
                <Text style={styles.userDetail}>
                  Gender: {creator?.gender || "N/A"}
                </Text>
                <Text style={styles.userDetail}>
                  Preferences:{" "}
                  {creator?.selectedPreferences?.join(", ") || "No Preferences"}
                </Text>
                <Text style={styles.userDetail}>
                  Home Town: {creator?.cityName || "N/A"},{" "}
                  {creator?.stateName || "N/A"}, {creator?.countryName || "N/A"}
                </Text>
              </View>

              {/* Additional images */}
              {creator?.images && creator.images.length > 1 && (
                <View style={{ width: screenWidth, marginTop: 10 }}>
                  <FlatList
                    data={creator.images.slice(1)} // skip first
                    renderItem={({ item }) => (
                      <View style={styles.imageWrapper}>
                        <Image
                          source={{ uri: item }}
                          style={styles.participantSecondImage}
                        />
                      </View>
                    )}
                    keyExtractor={(item, index) => `creatorImage-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={false}
                    contentContainerStyle={{
                      paddingVertical: 10,
                      alignItems: "center",
                    }}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EventDetailsScreen;

/** Styles **/
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorText: {
    color: "#0F3460",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  sliderContainer: {
    width: "100%",
    height: Dimensions.get("window").width * 0.8,
    backgroundColor: "#E0E0E0",
  },
  eventImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width * 0.8,
    resizeMode: "cover",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#BDBDBD",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  eventTitle: {
    fontSize: 32,
    fontFamily: "CenturyGothicBold",
    color: "#290F4C",
    marginBottom: 20,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#290F4C",
    fontFamily: "CenturyGothicBold",
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  navigationButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  navigationIconBox: {
    backgroundColor: "#290F4C",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  eventDescription: {
    fontSize: 16,
    color: "#290F4C",
    marginBottom: 20,
    fontFamily: "CenturyGothic",
  },
  showMoreButton: {
    alignSelf: "flex-start",
    marginTop: -10,
    marginBottom: 20,
  },
  showMoreText: {
    color: "#290F4C",
    fontFamily: "CenturyGothicBold",
  },
  organizerContainer: {
    marginBottom: 20,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
    color: "#290F4C",
    marginLeft: 8,
  },
  organizerText: {
    fontSize: 14,
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  ticketButton: {
    backgroundColor: "#290F4C",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  ticketButtonText: {
    fontSize: 20,
    fontFamily: "CenturyGothicBold",
    color: "#FFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: screenWidth * 0.9,
    maxHeight: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    overflow: "hidden",
  },
  closeButton: {
    alignSelf: "flex-end",
    borderRadius: 20,
    padding: 5,
  },
  scrollableContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: 500,
    overflow: "hidden",
    borderRadius: 15,
    marginBottom: 15,
  },
  participantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#290F4C",
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    color: "#290F4C",
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 14,
    color: "#290F4C",
    marginBottom: 5,
  },
  imageWrapper: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  participantSecondImage: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    marginHorizontal: 10,
    borderRadius: 15,
    resizeMode: "cover",
    overflow: "hidden",
  },
});
