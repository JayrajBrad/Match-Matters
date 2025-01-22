import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Pressable,
  Animated,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import { ScreenHeight } from "react-native-elements/dist/helpers";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const EventParticipantsScreen = ({ route }) => {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState([]);
  const { userId } = useContext(UserContext);
  const [scrollX] = useState(new Animated.Value(0));
  const [currentIndex, setCurrentIndex] = useState(0);

  // const scrollX = React.useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      // Perform any actions needed when the screen is focused
      console.log("ParticipantsScreen focused");

      return () => {
        console.log("ParticipantsScreen unfocused");
        setParticipants([]); // Reset state when leaving the screen
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      scrollX.setValue(0); // Reset scroll position on unmount
    };
  }, []);

  // useEffect(() => {
  //   const fetchParticipants = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/api/events/${eventId}/participants`
  //       );
  //       const filteredParticipants = response.data.filter(
  //         (participant) => participant._id !== userId
  //       );
  //       setParticipants(filteredParticipants);
  //     } catch (error) {
  //       console.error("Error fetching participants:", error);
  //     }
  //   };

  //   fetchParticipants();
  // }, [eventId]);

  useEffect(() => {
    let isMounted = true;

    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/events/${eventId}/participants`
        );
        if (isMounted) {
          const filteredParticipants = response.data.filter(
            (participant) => participant._id !== userId
          );
          setParticipants(filteredParticipants);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();

    return () => {
      isMounted = false;
    };
  }, [eventId, userId]);

  const sendRequest = async (receiverId) => {
    try {
      if (!userId) {
        Alert.alert("User ID not found. Please try again.");
        return;
      }

      const userData = {
        senderId: userId,
        receiverId,
      };

      const response = await axios.post(`${API_URL}/api/sendrequest`, userData);

      if (response.status === 200) {
        Alert.alert(
          "Your request has been shared. Wait for the user to accept your request."
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const renderItem = React.useCallback(
    ({ item, index }) => {
      const inputRange = [
        (index - 1) * screenWidth,
        index * screenWidth,
        (index + 1) * screenWidth,
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: "clamp",
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.5, 1, 0.5],
        extrapolate: "clamp",
      });

      return (
        <View style={styles.cardWrapper}>
          <Animated.View
            style={[styles.card, { transform: [{ scale }], opacity }]}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollableContent}
            >
              {item.images && item.images.length > 0 && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.participantImage}
                  />
                  {/* NEW: Text overlay for username */}
                  <Text style={styles.usernameOverlay}>
                    {item.username || "N/A"}, {item.age || "N/A"}
                  </Text>
                </View>
              )}

              <View style={styles.infoContainer}></View>

              <View style={{ paddingLeft: 10 }}>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Preferences</Text>
                </View>
                <View style={styles.preferencesContainer}>
                  {item.selectedPreferences &&
                  item.selectedPreferences.length > 0 ? (
                    item.selectedPreferences.map((pref, idx) => (
                      <View key={idx} style={styles.preferenceBox}>
                        <Text style={styles.preferenceText}>{pref}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={styles.preferenceBox}>
                      <Text style={styles.preferenceText}>None</Text>
                    </View>
                  )}
                </View>
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <View style={styles.fieldValueBox}>
                    <Text style={styles.fieldValueText}>
                      {item.gender || "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Preferences */}

                {/* Location */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Home Town</Text>
                  <View style={styles.fieldValueBox}>
                    <Text style={styles.fieldValueText}>
                      {item.cityName}, {item.stateName}, {item.countryName}
                    </Text>
                  </View>
                </View>
              </View>

              {item.images && item.images.length > 1 && (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={item.images.slice(1)}
                    renderItem={({ item: imageUri }) => (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.participantImage}
                      />
                    )}
                    keyExtractor={(image, idx) => `${item._id}-${idx}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={false}
                  />
                </View>
              )}

              {item.aboutYou && (
                <View style={styles.aboutYouSection}>
                  <Text style={styles.aboutYouHeader}>About You</Text>

                  {/* WRAPPER with flexWrap */}
                  <View style={styles.aboutYouWrapContainer}>
                    {/* Looking For */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="account-search"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.lookingFor || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Job Industry */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="briefcase-outline"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.jobIndustry || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Education */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="school-outline"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.educationLevel || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Relationship Status */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="heart-outline"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.relationshipStatus || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Smokes */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="smoking"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.smokes || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Drinks */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="glass-wine"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.drinks || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Zodiac Sign */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="star-four-points-outline"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.zodiac || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Religion */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="church"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.religion || "N/A"}
                        </Text>
                      </View>
                    </View>

                    {/* Exercise Frequency */}
                    <View style={styles.aboutYouItem}>
                      <View style={styles.fieldValueBox}>
                        <MaterialCommunityIcons
                          name="run"
                          size={16}
                          color="#814C68"
                          style={{ marginRight: 5 }}
                        />
                        <Text style={styles.fieldValueText}>
                          {item.aboutYou.exerciseFrequency || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* END aboutYouWrapContainer */}
                </View>
              )}

              <Pressable
                onPress={() => sendRequest(item._id)}
                style={styles.sendButton}
              >
                <Text
                  style={{ color: "white", fontFamily: "CenturyGothicBold" }}
                >
                  Send Request
                </Text>
              </Pressable>
            </ScrollView>
          </Animated.View>
        </View>
      );
    },
    [scrollX] // Ensure updates only when necessary
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false, // needed for the listener
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        // Use Math.round instead of Math.floor
        const index = Math.round(offsetX / screenWidth) + 1;
        setCurrentIndex(index);
      },
    }
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Participants</Text> */}
      {/* <Text style={styles.participantCount}>
        {currentIndex}/{participants.length}
      </Text> */}
      <SafeAreaView>
        <Animated.FlatList
          data={participants}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          // onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
    </View>
  );
};

export default EventParticipantsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes full available height
    backgroundColor: "#fff",
  },
  participantCount: {
    fontSize: 20,
    fontFamily: "CenturyGothicBold",
    textAlign: "center",
    marginVertical: 10,
    color: "#814C68",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "flex-start",
    // or "space-between" if you want them at ends of the row
  },
  usernameOverlay: {
    position: "absolute",
    bottom: 10, // 10px from bottom
    left: 10, // 10px from left edge
    color: "#fff",
    fontSize: 20,
    fontFamily: "CenturyGothicBold",
    backgroundColor: "rgba(0,0,0,0.3)", // optional semi-transparent black
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },

  fieldLabel: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    color: "#fff",
    marginRight: 8, // small gap between label and value
  },
  fieldValueBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row", // Add this
    alignItems: "center",
  },
  fieldValueText: {
    fontSize: 14,
    fontFamily: "CenturyGothic",
    color: "#814C68",
  },

  aboutYouWrapContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    // optional: alignItems: "flex-start",
  },
  // aboutYouItem: {
  //   // remove or reduce flexDirection here if you want each item
  //   // to act like a single "chip" rather than label + value in a row
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginHorizontal: 8,
  //   marginBottom: 8,
  //   justifyContent: "flex-start",
  // },

  aboutYouSection: {
    marginTop: 15,
    backgroundColor: "#814C68",
    borderRadius: 10,
    padding: 10,
  },

  aboutYouHeader: {
    fontSize: 24,
    fontFamily: "CenturyGothicBold",
    marginBottom: 10,
    color: "#fff",
  },
  aboutYouItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 5,
    justifyContent: "flex-start",
  },
  cardWrapper: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    height: screenHeight * 0.85, // Use 75% of the screen height (you can adjust this as needed)
    paddingBottom: 20,
    marginVertical: 20,
  },
  header: {
    // paddingLeft: 20,
    paddingVertical: 20,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "CenturyGothicBold",

    marginBottom: 10,
    color: "#fff",
  },
  card: {
    backgroundColor: "#814C68",
    marginTop: 20,
    borderRadius: 10,
    width: screenWidth * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    overflow: "hidden",
  },
  scrollableContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 20, // Ensure scrollable space at the bottom
    showsHorizontalScrollIndicator: false,
  },
  imageContainer: {
    width: "100%",
    height: 500, // Fixed height for the first image
    overflow: "hidden",
  },
  participantImage: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
    marginBottom: 10, // Space between images and details
  },
  infoContainer: {
    padding: 5,
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows wrapping to next line
    marginBottom: 10,
  },
  preferenceBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6, // So each box has spacing on right & bottom
  },
  preferenceText: {
    fontSize: 14,
    fontFamily: "CenturyGothic",
    color: "#814C68",
  },
  participantName: {
    fontSize: 20,
    fontFamily: "CenturyGothicBold",

    marginBottom: 5,
    color: "#fff",
  },
  participantEmail: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "CenturyGothic",
    marginBottom: 5,
  },
  participantDetails: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "CenturyGothic",
    marginBottom: 5,
  },

  aboutYouDetails: {
    fontSize: 14,
    color: "#000",
    fontFamily: "CenturyGothic",
    marginBottom: 5,
  },
  sendButton: {
    backgroundColor: "#290F4C",
    padding: 10,
    width: 160,
    borderRadius: 16,
    margin: 10,
    alignItems: "center",
    alignSelf: "center",
  },
});
