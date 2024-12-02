import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSocketContext } from "../SocketContext";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { getUserId } from "../backend/registrationUtils";
import { UserContext } from "../navigation/UserProvider";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId, user } = useContext(UserContext);
  // const [userId, setUserId] = useState(null);
  const { socket } = useSocketContext();
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const receiverId = route?.params?.receiverId;
  const receiverName = route?.params?.name;
  const [sending, setSending] = useState(false);
  const hasFetchedMessages = useRef(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: receiverName || "Chat Room",
    });
  }, [navigation, receiverName]);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const id = await getUserId();
  //     setUserId(id);
  //   };

  //   fetchUserId();
  // }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || hasFetchedMessages.current) return;
      try {
        const response = await axios.get(`${API_URL}/api/messages`, {
          params: { senderId: userId, receiverId },
        });
        // console.log("Fetched Messages:", response.data);

        setMessages(
          response.data.map((msg) => ({
            ...msg,
            senderId:
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId,
            receiverId: msg.receiverId,
          }))
        );
        hasFetchedMessages.current = true;
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId, receiverId]);

  useEffect(() => {
    if (socket && !socket.connected) {
      socket.connect(); // Connect if not already connected
    }
    console.log("Socket connected:", socket?.connected);

    const handleReceiveMessage = (newMessage) => {
      console.log("Received new message:", newMessage);
      const isValidTimeStamp = !isNaN(new Date(newMessage.timeStamp).getTime());
      const messageExists = messages.some(
        (msg) =>
          msg.senderId === newMessage.senderId &&
          msg.receiverId === newMessage.receiverId &&
          msg.message === newMessage.message &&
          msg.timeStamp === newMessage.timeStamp
      );

      if (isValidTimeStamp && !messageExists) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, messages]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (sending || !message.trim()) return;

    const newMessage = {
      senderId: userId,
      receiverId,
      message,
      timeStamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      await axios.post(`${API_URL}/api/sendMessage`, newMessage);
      console.log("new message from chatroom", newMessage);

      if (socket?.connected) {
        socket.emit("sendMessage", newMessage);
      } else {
        console.warn("Socket is not connected");
        socket?.connect();
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior for iOS and Android
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 10 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={{
                  alignSelf:
                    msg.senderId === userId ? "flex-end" : "flex-start",
                  backgroundColor: msg.senderId === userId ? "#DCF8C6" : "#FFF",
                  padding: 10,
                  marginVertical: 5,
                  borderRadius: 10,
                  maxWidth: "70%",
                }}
              >
                <Text>{msg.message}</Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "gray",
                    textAlign: "right",
                    marginTop: 5,
                  }}
                >
                  {new Date(msg.timeStamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>

        <View
          style={{
            flexDirection: "row",
            padding: 10,
            borderTopWidth: 1,
            borderColor: "#ddd",
            marginBottom: "auto",
            position: "absolute",
            bottom: 100,
            width: "100%",
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderColor: "#ddd",
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 10,
            }}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <Pressable
            onPress={sendMessage}
            style={{
              backgroundColor: "#0066b2",
              padding: 10,
              borderRadius: 20,
              marginLeft: 8,
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoom;
