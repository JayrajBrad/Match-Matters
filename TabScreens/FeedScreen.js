///////////////////////////////////
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Share,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Video } from "expo-av";
import * as Location from "expo-location";
import icon from "../assets/Match matters logo (1).png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { getToken } from "../backend/token";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function FeedScreen({ navigation, route }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [focusedButton, setFocusedButton] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedEvents, setLikedEvents] = useState([]);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getToken();
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

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileImageUri = await AsyncStorage.getItem("profile_image");
        if (profileImageUri) {
          setProfileImage(profileImageUri);
        }
      } catch (error) {
        console.log("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLikePress = (eventId) => {
    setLikedEvents((prevLikedEvents) =>
      prevLikedEvents.includes(eventId)
        ? prevLikedEvents.filter((id) => id !== eventId)
        : [...prevLikedEvents, eventId]
    );
  };

  const navigateToComments = (eventId) => {
    navigation.navigate("CommentsPage", { eventId });
  };

  const navigateToBooking = (eventId) => {
    navigation.navigate("BookingPage", { eventId });
  };

  const handleShare = async (event) => {
    try {
      const profileUrl = `http://yourwebsite.com/event/${event._id}`;
      await Share.share({
        message: `Check out this event: ${event.title}\n\n${profileUrl}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" color={"#000"} size={30} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search location"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={icon} style={styles.profileImage} />
          )}
        </View>

        <Text style={styles.title}>
          Where <Text style={styles.highlight}>Friendships</Text> Begin
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              focusedButton === "Most Happening" && styles.buttonFocused,
            ]}
            onPress={() => {
              navigation.navigate("MostHappening");
              setFocusedButton("Most Happening");
            }}
          >
            <Text style={styles.buttonText}>Most Happening</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              focusedButton === "For You" && styles.buttonFocused,
            ]}
            onPress={() => {
              navigation.navigate("ForYou");
              setFocusedButton("For You");
            }}
          >
            <Text style={styles.buttonText}>For You</Text>
          </TouchableOpacity>
        </View>

        {events.map((event) => (
          <View key={event._id} style={styles.videoContainer}>
            <Video
              source={{ uri: event.videoUrl }}
              rate={1.0}
              volume={1.0}
              isMuted={true}
              resizeMode="cover"
              // shouldPlay
              // isLooping
              style={styles.video}
            />
            <View style={styles.overlay}>
              <View style={styles.rightIcons}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleLikePress(event._id)}
                >
                  <MaterialCommunityIcons
                    name={
                      likedEvents.includes(event._id)
                        ? "heart"
                        : "heart-outline"
                    }
                    color={"#fff"}
                    size={30}
                  />
                  <Text style={styles.iconText}>123</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => navigateToComments(event._id)}
                >
                  <MaterialCommunityIcons
                    name="comment-outline"
                    color={"#fff"}
                    size={30}
                  />
                  <Text style={styles.iconText}>45</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleShare(event)}
                >
                  <MaterialCommunityIcons
                    name="share-outline"
                    color={"#fff"}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.organizer}>by {event.organizer}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: 50,
    // marginBottom: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  highlight: {
    color: "#f39c12",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // or "space-between"
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#3498db",
    borderRadius: 20,
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 5,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  buttonFocused: {
    backgroundColor: "#2980b9",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
  },
  videoContainer: {
    width,
    height: height * 0.9,
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  // rightIcons: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },
  rightIcons: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
  },
  iconButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconText: {
    color: "#fff",
  },
  bottomInfo: {
    marginTop: 10,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  organizer: {
    color: "#ddd",
    fontSize: 14,
  },
});
