import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const ConnectionsScreen = ({ navigation }) => {
  const chats = [{ id: "user2", title: "Chat with User 2" }];

  // Get user ID from AsyncStorage
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      console.log(userId);
      return userId;
    } catch (error) {
      console.error("Failed to get user ID:", error);
    }
  };

  const initiateChat = async (userId2) => {
    const userId1 = await getUserId();
    try {
      const response = await axios.post(`${API_URL}/createChat`, {
        userId1,
        userId2,
      });
      return response.data.chatId;
    } catch (error) {
      console.error("Failed to initiate chat:", error);
    }
  };

  const handlePress = async (userId2) => {
    const chatId = await initiateChat(userId2);
    navigation.navigate("ChatRoomScreen", {
      chatId,
      chatName: `Chat with ${userId2}`,
    });
  };

  return (
    <View style={styles.container}>
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          style={styles.chatButton}
          onPress={() => handlePress(chat.id)}
        >
          <Text style={styles.chatText}>{chat.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chatButton: {
    padding: 15,
    backgroundColor: "#007BFF",
    marginVertical: 10,
    borderRadius: 5,
  },
  chatText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ConnectionsScreen;
