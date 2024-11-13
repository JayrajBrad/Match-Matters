import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { getUserId } from "../backend/registrationUtils";
import { API_URL } from "@env";
import axios from "axios";
import Chat from "../components/Chat";

const ChatScreen = () => {
  const [options, setOptions] = useState(["Chats"]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State to handle the refreshing state
  const navigation = useNavigation();

  // Fetch UserId on initial mount
  useEffect(() => {
    const fetchUserId = async () => {
      const userIdFromToken = await getUserId();
      setUserId(userIdFromToken);
    };
    fetchUserId();
  }, []);

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
    <SafeAreaView>
      <ScrollView
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500" }}>Chats</Text>
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
            <View>
              <Text>Chats</Text>
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
                  <Text style={{ textAlign: "center", color: "gray" }}>
                    No Chats
                  </Text>
                  <Text style={{ marginTop: 4, color: "gray" }}>
                    Get Started by messaging a friend
                  </Text>
                </View>
              ))}
          </View>

          <Pressable
            onPress={() => chooseOption("Requests")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text>Requests</Text>
            </View>
            <Entypo name="chevron-down" size={24} color="black" />
          </Pressable>

          <View style={{ marginVertical: 12 }}>
            {options?.includes("Requests") && (
              <View>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                  Checkout all the requests
                </Text>
                {uniqueRequests?.map((item, index) => (
                  <Pressable
                    key={item?.from?._id || index}
                    style={{ marginVertical: 12 }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Pressable></Pressable>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: "500" }}>
                          {item?.from?.username} sent you a request
                        </Text>
                        {/* <Text style={{ marginTop: 4, color: "gray" }}>
                          {item?.message}
                        </Text> */}
                      </View>
                      <Pressable
                        onPress={() => acceptRequest(item?.from?._id)}
                        style={{
                          padding: 8,
                          backgroundColor: "#005187",
                          width: 75,
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ textAlign: "center", color: "white" }}>
                          Accept
                        </Text>
                      </Pressable>
                      <AntDesign name="delete" size={24} color="red" />
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
