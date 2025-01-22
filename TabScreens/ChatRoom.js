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
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { UserContext } from "../navigation/UserProvider";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo

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

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!userId || hasFetchedMessages.current) return;
  //     try {
  //       const response = await axios.get(`${API_URL}/api/messages`, {
  //         params: { senderId: userId, receiverId },
  //       });
  //       // console.log("Fetched Messages:", response.data);

  //       setMessages(
  //         response.data.map((msg) => ({
  //           ...msg,
  //           senderId:
  //             typeof msg.senderId === "object"
  //               ? msg.senderId._id
  //               : msg.senderId,
  //           receiverId: msg.receiverId,
  //         }))
  //       );
  //       hasFetchedMessages.current = true;
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, [userId, receiverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (hasFetchedMessages.current) return; // Prevent re-fetching
      try {
        const response = await axios.get(`${API_URL}/api/messages`, {
          params: { senderId: userId, receiverId },
        });
        console.log("Fetched Messages:", response.data);

        // setMessages(response.data.map(msg => ({
        //   ...msg,
        //   senderId: typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId,
        //   receiverId: msg.receiverId,
        // })));
        if (Array.isArray(response.data.messages)) {
          setMessages(
            response.data.messages.map((msg) => ({
              ...msg,
              senderId:
                typeof msg.senderId === "object"
                  ? msg.senderId._id
                  : msg.senderId,
              receiverId:
                typeof msg.receiverId === "object"
                  ? msg.receiverId._id
                  : msg.receiverId,
            }))
          );
        } else {
          console.error("Fetched data is not an array:", response.data);
          setMessages([]); // Set messages to an empty array to avoid crashes
        }

        hasFetchedMessages.current = true; // Mark as fetched
      } catch (error) {
        console.error("Error fetching messages from chatroom :", error);
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
      <View
        style={{
          padding: 10,
          backgroundColor: "#290F4C",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            // backgroundColor: "#FFF",
            padding: 10,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            // marginRight: 5,
            // marginLeft: "10",
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            fontFamily: "CenturyGothicBold",
            marginLeft: "10",
          }}
        >
          {receiverName}
        </Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust offset for iOS
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
                  backgroundColor: msg.senderId === userId ? "#814C68" : "#fff",
                  padding: 10,
                  marginVertical: 5,
                  borderRadius: 10,
                  maxWidth: "70%",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: msg.senderId === userId ? "white" : "black",
                    fontFamily: "CenturyGothic",
                  }}
                >
                  {msg.message}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: msg.senderId === userId ? "white" : "gray",
                    textAlign: "right",
                    marginTop: 5,
                    fontFamily: "CenturyGothic",
                  }}
                >
                  {new Date(msg.timeStamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>
        </TouchableWithoutFeedback>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderTopWidth: 1,
            borderColor: "#ddd",
            backgroundColor: "#FFF",
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingVertical: 10,
              fontSize: 16,
              fontFamily: "CenturyGothic",
            }}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <Pressable
            onPress={sendMessage}
            style={{
              backgroundColor: "#814C68",
              padding: 10,
              borderRadius: 20,
              marginLeft: 10,
              width: "20%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "CenturyGothicBold",
                textAlign: "center",
              }}
            >
              Send
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoom;
