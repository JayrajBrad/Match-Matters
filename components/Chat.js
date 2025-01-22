import { useEffect, useState, useContext } from "react";
import { Text, View, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSocketContext } from "../SocketContext";
import axios from "axios";
import { getUserId } from "../backend/registrationUtils";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const Chat = ({ item }) => {
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

  const navigation = useNavigation();
  const { socket } = useSocketContext();
  const [latestMessage, setLatestMessage] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // const [userId, setUserId] = useState(null);
  const { userId } = useContext(UserContext);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const id = await getUserId(); // Fetch user ID
  //     setUserId(id); // Store userId in state
  //   };

  //   fetchUserId();
  // }, []);

  useEffect(() => {
    if (userId && item._id && socket) {
      // Function to fetch the latest message when the component mounts
      const fetchLatestMessage = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/latestMessage`, {
            params: { senderId: userId, receiverId: item._id },
          });
          if (response.data) {
            setLatestMessage(response.data.message || "No messages yet");
          }
        } catch (error) {
          console.error("Error fetching latest message:", error);
        }
      };

      fetchLatestMessage();

      // Socket listener to update the latest message in real time
      if (socket) {
        const handleNewMessage = (data) => {
          if (
            (data.latestMessage.senderId === userId &&
              data.latestMessage.receiverId === item._id) ||
            (data.latestMessage.senderId === item._id &&
              data.latestMessage.receiverId === userId)
          ) {
            setLatestMessage(data.latestMessage.message);
          }
        };

        socket.on("latestMessage", handleNewMessage);

        return () => {
          socket.off("latestMessage", handleNewMessage);
        };
      } else {
        console.error("Socket is not available");
      }
    }
  }, [userId, socket, item._id]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          navigation.navigate("ChatRoom", {
            name: item?.username,
            receiverId: item?._id,
          })
        }
        style={{ marginVertical: 15 }}
      >
        <View style={styles.chatItem}>
          <Image source={{ uri: item.images[0] }} style={styles.avatar} />
          <View style={styles.chatDetails}>
            <Text style={styles.username}>{item?.username}</Text>
            <Text style={styles.messagePreview}>
              {latestMessage || `Chat with ${item?.username}`}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",

    color: "#814C68",
  },
  messagePreview: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
    fontFamily: "CenturyGothicBold",
  },
});

export default Chat;
