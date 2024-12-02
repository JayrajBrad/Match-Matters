import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { getUserId } from "../backend/registrationUtils";
import { API_URL } from "@env";
import axios from "axios";
import Chat from "../components/Chat";
import { UserContext } from "../navigation/UserProvider";

const ChatScreen = () => {
  const [options, setOptions] = useState(["Chats"]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  // const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State to handle the refreshing state
  const [requestCount, setRequestCount] = useState(0);
  const navigation = useNavigation();

  const { userId } = useContext(UserContext);

  // Fetch UserId on initial mount
  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const userIdFromToken = await getUserId();
  //     setUserId(userIdFromToken);
  //   };
  //   fetchUserId();
  // }, []);

  // Fetch Requests when userId is available
  useEffect(() => {
    if (userId) {
      getRequests();
    }
  }, [userId]);

  // Fetch User chats when userId is available
  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);

  // Function to fetch requests from server
  const getRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/getrequests/${userId}`);
      setRequests(response.data);
      setRequestCount(response.data.length);
      console.log("requests :", response.data);
    } catch (error) {
      console.log("get request :", error.message);
    }
  };

  // Function to fetch User data from server
  const getUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/user/${userId}`);
      setChats(response.data);
    } catch (error) {
      console.log("get user :", error.message);
    }
  };

  // Function to handle accepting requests
  const acceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`${API_URL}/api/acceptrequest`, {
        userId: userId,
        requestId: requestId,
      });

      if (response.status === 200) {
        // Filter out the accepted request from the local state
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.from._id !== requestId)
        );
      }
    } catch (error) {
      console.log("Error accepting request:", error.message);
    }
  };

  // Function to handle option toggle
  const chooseOption = (option) => {
    setOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option]
    );
  };

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await getRequests(); // Refresh the requests
    await getUser(); // Refresh the chats
    setRefreshing(false);
  };

  const uniqueRequests = Array.from(
    new Set(requests.map((item) => item.from._id))
  ).map((id) => requests.find((item) => item.from._id === id));

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView
        style={styles.chatList}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* <StatusBar backgroundColor="transparent" translucent={true} /> */}
        <View style={styles.header}>
          <TextInput placeholder="Search message..." style={styles.searchBar} />
          <Pressable onPress={() => navigation.navigate("RequestScreen")}>
            <AntDesign name="hearto" size={24} color="red" />
            {requestCount > 0 && (
              <View style={styles.requestBadge}>
                <Text style={styles.requestBadgeText}>{requestCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={{ padding: 10 }}>
          <Pressable
            onPress={() => chooseOption("Chats")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.header}>
              <Text style={styles.noChatsText}>Chats</Text>
            </View>
            <Entypo name="chevron-down" size={24} color="black" />
          </Pressable>

          <View>
            {options?.includes("Chats") &&
              (chats?.length > 0 ? (
                <View>
                  {chats?.map((item) => (
                    <Chat item={item} key={item._id || item.username} />
                  ))}
                </View>
              ) : (
                <View
                  style={{
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.noChats}>
                    <Text style={styles.noChatsText}>No Chats</Text>
                    <Text style={styles.getStartedText}>
                      Get Started by messaging a friend
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    // borderWidth: 2, // Debug border
    // borderColor: "blue",
    marginTop: 0,
  },
  // header: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#f0f0f0",
  // },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15, // Remove or reduce this value
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    // borderWidth: 2, // Debug border
    // borderColor: "red",
    marginTop: 0,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  requestBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  requestBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  noChats: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    textAlign: "center",
    color: "gray",
  },
  getStartedText: {
    marginTop: 4,
    color: "gray",
  },
  chatList: {
    flex: 1,
    padding: 0,
    margin: 0,
    paddingTop: -50,
  },
});
