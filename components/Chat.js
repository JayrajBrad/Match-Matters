import { useEffect, useState } from "react";
import { Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSocketContext } from "../SocketContext";
import axios from "axios";
import { getUserId } from "../backend/registrationUtils";
import { API_URL } from "@env";

const Chat = ({ item }) => {
  const navigation = useNavigation();
  const { socket } = useSocketContext();
  const [latestMessage, setLatestMessage] = useState("");
  const [userId, setUserId] = useState(null);

  // Fetch userId on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId(); // Fetch user ID
      setUserId(id); // Store userId in state
    };

    fetchUserId();
  }, []);

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
    <Pressable
      onPress={() =>
        navigation.navigate("ChatRoom", {
          name: item?.username,
          receiverId: item?._id,
        })
      }
      style={{ marginVertical: 15 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {/* <Image
          //   source={require("../assets/profile.jpg")}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        /> */}
        <View>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            {item?.username}
          </Text>
          <Text style={{ marginTop: 4, color: "gray" }}>
            {latestMessage || `Chat with ${item?.username}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Chat;
