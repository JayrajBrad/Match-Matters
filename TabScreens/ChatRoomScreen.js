import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import io from "socket.io-client";
import axios from "axios";
import { API_URL } from "@env";

const socket = io(`${API_URL}`); // Change to your server URL

const ChatRoomScreen = ({ route }) => {
  const { chatId, chatName } = route.params; // Assuming chatName is passed in params
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Join the chat room
    socket.emit("joinRoom", { chatId });

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, formatMessage(message))
      );
    });

    // Fetch existing messages
    fetchMessages();

    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  // Fetch messages from the server
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/messages/${chatId}`);
      console.log("Fetched messages:", response.data);

      const formattedMessages = response.data.map(formatMessage);
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message to the server
  const onSend = useCallback((messages = []) => {
    const { _id, text, user } = messages[0];
    socket.emit("sendMessage", { chatId, senderId: user._id, text });
    console.log("Sending message:", { chatId, senderId: user._id, text });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // Format message for GiftedChat
  const formatMessage = (message) => ({
    _id: message._id,
    text: message.text,
    createdAt: new Date(message.timestamp),
    user: {
      _id: message.senderId,
      name: "User", // Replace with actual user data if available
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{chatName || "Chat Room"}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: "user1", // Replace with dynamic user ID
        }}
        textInputStyle={styles.textInput}
        scrollToBottom
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Light gray background
  },
  header: {
    backgroundColor: "#0078d4", // Primary color for header
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: "#fff", // White background for text input
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ChatRoomScreen;
