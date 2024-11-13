import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { getUserId } from "../backend/registrationUtils";

const { width: screenWidth } = Dimensions.get("window");

export default function EventParticipantsScreen({ route }) {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();

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
      <View style={styles.messageContainer}>
        <Entypo name="emoji-happy" size={24} color="black" />
        {/* <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.messageInput}
          placeholder="Type your message..."
        /> */}
        <Pressable
          onPress={() => sendRequest(item._id)}
          style={styles.sendButton}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
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
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    marginHorizontal: 50,
    borderRadius: 20,
    justifyContent: "center",
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
});
