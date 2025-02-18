// import {
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   RefreshControl,
//   TextInput,
// } from "react-native";
// import React, { useState, useEffect, useContext } from "react";
// import { StatusBar } from "react-native";
// import LottieView from "lottie-react-native";

// import { SafeAreaView } from "react-native-safe-area-context";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Entypo from "@expo/vector-icons/Entypo";
// import { useNavigation } from "@react-navigation/native";
// import { getUserId } from "../backend/registrationUtils";
// import { API_URL } from "@env";
// import axios from "axios";
// import Chat from "../components/Chat";
// import { UserContext } from "../navigation/UserProvider";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// const ChatScreen = () => {
//   const insets = useSafeAreaInsets();

//   useEffect(() => {
//     async function loadFonts() {
//       try {
//         await Font.loadAsync({
//           CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
//           CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
//         });
//         setFontsLoaded(true);
//       } catch (error) {
//         console.error("Error loading fonts:", error);
//       } finally {
//         SplashScreen.hideAsync();
//       }
//     }
//     loadFonts();
//   }, []);

//   const [options, setOptions] = useState(["Chats"]);
//   const [chats, setChats] = useState([]);
//   const [requests, setRequests] = useState([]);
//   // const [userId, setUserId] = useState(null);
//   const [refreshing, setRefreshing] = useState(false); // State to handle the refreshing state
//   const [requestCount, setRequestCount] = useState(0);
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   const navigation = useNavigation();

//   const { userId } = useContext(UserContext);

//   // Fetch UserId on initial mount
//   // useEffect(() => {
//   //   const fetchUserId = async () => {
//   //     const userIdFromToken = await getUserId();
//   //     setUserId(userIdFromToken);
//   //   };
//   //   fetchUserId();
//   // }, []);

//   // Fetch Requests when userId is available
//   useEffect(() => {
//     if (userId) {
//       getRequests();
//     }
//   }, [userId]);

//   // Fetch User chats when userId is available
//   useEffect(() => {
//     if (userId) {
//       getUser();
//     }
//   }, [userId]);

//   // Function to fetch requests from server
//   const getRequests = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/getrequests/${userId}`);
//       setRequests(response.data);
//       setRequestCount(response.data.length);
//       console.log("requests :", response.data);
//     } catch (error) {
//       console.log("get request :", error.message);
//     }
//   };

//   // Function to fetch User data from server
//   const getUser = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/user/user/${userId}`);
//       setChats(response.data);
//     } catch (error) {
//       console.log("get user :", error.message);
//     }
//   };

//   // Function to handle accepting requests
//   const acceptRequest = async (requestId) => {
//     try {
//       const response = await axios.post(`${API_URL}/api/acceptrequest`, {
//         userId: userId,
//         requestId: requestId,
//       });

//       if (response.status === 200) {
//         // Filter out the accepted request from the local state
//         setRequests((prevRequests) =>
//           prevRequests.filter((request) => request.from._id !== requestId)
//         );
//       }
//     } catch (error) {
//       console.log("Error accepting request:", error.message);
//     }
//   };

//   // Function to handle option toggle
//   const chooseOption = (option) => {
//     setOptions((prevOptions) =>
//       prevOptions.includes(option)
//         ? prevOptions.filter((item) => item !== option)
//         : [...prevOptions, option]
//     );
//   };

//   // Function to handle pull-to-refresh
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await getRequests(); // Refresh the requests
//     await getUser(); // Refresh the chats
//     setRefreshing(false);
//   };

//   const uniqueRequests = Array.from(
//     new Set(requests.map((item) => item.from._id))
//   ).map((id) => requests.find((item) => item.from._id === id));

//   return (
//     <ScrollView
//       style={[styles.container, { paddingTop: insets.top }]}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <SafeAreaView
//         style={styles.chatList}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         {/* <StatusBar backgroundColor="transparent" translucent={true} /> */}
//         <View style={styles.header}>
//           {/* <TextInput placeholder="Search message..." style={styles.searchBar} /> */}
//           <Text style={styles.ChatsText}>Your matches</Text>

//           <Pressable onPress={() => navigation.navigate("RequestScreen")}>
//             <AntDesign name="hearto" size={30} color="#290F4C" />
//             {requestCount > 0 && (
//               <View style={styles.requestBadge}>
//                 <Text style={styles.requestBadgeText}>{requestCount}</Text>
//               </View>
//             )}
//           </Pressable>
//         </View>

//         <View style={{ padding: 10 }}>
//           {/* <Pressable
//             onPress={() => chooseOption("Chats")}
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <View style={styles.subheader}>
//               {/* <Text style={styles.noChatsText}>Matches</Text> */}
//           {/* </View>
//             <Entypo name="chevron-down" size={26} color="black" />
//           </Pressable>  */}

//           <View>
//             {options?.includes("Chats") &&
//               (chats?.length > 0 ? (
//                 <View>
//                   {chats?.map((item) => (
//                     <Chat item={item} key={item._id || item.username} />
//                   ))}
//                 </View>
//               ) : (
//                 <View
//                   style={{
//                     height: 300,
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <View style={styles.animationContainer}>
//                     <LottieView
//                       source={require("../Onboarding-Screen-2/src/assets/animations/no_chat.json")} // Replace with your animation file path
//                       autoPlay
//                       loop
//                       style={styles.lottie}
//                     />
//                     <Text style={styles.noChatsText}>Keep connecting</Text>
//                     <Text style={styles.getStartedText}>
//                       Get Started by messaging a friend
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//           </View>
//         </View>
//       </SafeAreaView>
//     </ScrollView>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingTop: 0,
//     // borderWidth: 2, // Debug border
//     // borderColor: "blue",
//     marginTop: 0,
//   },
//   animationContainer: {
//     height: 300,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   lottie: {
//     width: 200,
//     height: 200,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 15, // Remove or reduce this value
//     paddingVertical: 15,
//     // borderBottomWidth: 1,
//     // borderBottomColor: "#f0f0f0",
//     // borderWidth: 2, // Debug border
//     // borderColor: "red",
//     marginTop: 0,
//   },
//   subheader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingBottom: 15,

//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     marginTop: 0,
//   },
//   searchBar: {
//     flex: 1,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     marginRight: 10,
//     fontSize: 16,
//   },
//   requestBadge: {
//     position: "absolute",
//     top: -5,
//     right: -5,
//     backgroundColor: "red",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   requestBadgeText: {
//     color: "white",
//     fontSize: 12,
//     fontFamily: "CenturyGothicBold",
//   },
//   noChats: {
//     height: 300,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noChatsText: {
//     textAlign: "center",
//     color: "gray",
//     fontFamily: "CenturyGothicBold",
//   },
//   ChatsText: {
//     textAlign: "center",
//     color: "#814C68",
//     fontSize: 26,
//     fontFamily: "CenturyGothicBold",
//   },
//   getStartedText: {
//     marginTop: 4,
//     color: "gray",
//     fontFamily: "CenturyGothic",
//   },
//   chatList: {
//     flex: 1,
//     padding: 0,
//     margin: 0,
//     paddingTop: -50,
//   },
// });

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
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import axios from "axios";
import Chat from "../components/Chat";
import { UserContext } from "../navigation/UserProvider";
import { SocketContext } from "../SocketContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const ChatScreen = () => {
  const insets = useSafeAreaInsets();

  const [options, setOptions] = useState(["Chats"]);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to handle the refreshing state
  const [requestCount, setRequestCount] = useState(0);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const navigation = useNavigation();

  const { userId } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

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

  // Fetch Requests and Chats when userId is available
  useEffect(() => {
    if (userId) {
      getRequests();
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

  // Function to fetch User data and latest messages from server
  const getUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/user/${userId}`);
      const chatsData = response.data; // Assuming this is an array of chat objects

      // Fetch latest messages for all chats
      const chatsWithLatestMessages = await Promise.all(
        chatsData.map(async (chat) => {
          try {
            const latestMessageResponse = await axios.get(
              `${API_URL}/api/latestMessage`,
              {
                params: { senderId: userId, receiverId: chat._id },
              }
            );
            return {
              ...chat,
              latestMessage:
                latestMessageResponse.data.message || "No messages yet",
              latestMessageTime:
                latestMessageResponse.data.timeStamp || new Date(0),
            };
          } catch (error) {
            console.error(
              "Error fetching latest message for chat ID:",
              chat._id,
              error
            );
            return {
              ...chat,
              latestMessage: "Error fetching message",
              latestMessageTime: new Date(0),
            };
          }
        })
      );

      // Sort the chats based on latestMessageTime in descending order
      const sortedChats = chatsWithLatestMessages.sort(
        (a, b) => new Date(b.latestMessageTime) - new Date(a.latestMessageTime)
      );

      setChats(sortedChats);
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

        // Optionally, add the new friend to the chats list
        const newFriend = response.data.newFriend;
        if (newFriend) {
          // Fetch the latest message for the new friend
          try {
            const latestMessageResponse = await axios.get(
              `${API_URL}/api/latestMessage`,
              {
                params: { senderId: userId, receiverId: newFriend._id },
              }
            );
            const newFriendWithMessage = {
              ...newFriend,
              latestMessage:
                latestMessageResponse.data.message || "No messages yet",
              latestMessageTime:
                latestMessageResponse.data.timeStamp || new Date(0),
            };
            setChats((prevChats) => [newFriendWithMessage, ...prevChats]);
          } catch (error) {
            console.error(
              "Error fetching latest message for new friend:",
              error
            );
            setChats((prevChats) => [
              {
                ...newFriend,
                latestMessage: "No messages yet",
                latestMessageTime: new Date(0),
              },
              ...prevChats,
            ]);
          }
        }
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

  // Remove duplicate requests based on 'from._id'
  const uniqueRequests = Array.from(
    new Set(requests.map((item) => item.from._id))
  ).map((id) => requests.find((item) => item.from._id === id));

  // Handle real-time updates via sockets
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      const { latestMessage } = data;

      // Ensure the message is relevant to the current user
      if (
        (latestMessage.senderId === userId && latestMessage.receiverId) ||
        (latestMessage.senderId !== userId &&
          latestMessage.receiverId === userId)
      ) {
        setChats((prevChats) => {
          // Determine the other user's ID
          const otherUserId =
            latestMessage.senderId === userId
              ? latestMessage.receiverId
              : latestMessage.senderId;

          // Find the chat that corresponds to this message
          const chatIndex = prevChats.findIndex(
            (chat) => chat._id === otherUserId
          );

          if (chatIndex !== -1) {
            // Update the latest message and timestamp
            const updatedChat = {
              ...prevChats[chatIndex],
              latestMessage: latestMessage.message,
              latestMessageTime: latestMessage.timeStamp,
            };

            // Remove the old chat from its current position
            const updatedChats = [...prevChats];
            updatedChats.splice(chatIndex, 1);

            // Add the updated chat at the top
            updatedChats.unshift(updatedChat);

            return updatedChats;
          } else {
            // If the chat doesn't exist, you might want to fetch it or handle accordingly
            // For now, we'll ignore it
            return prevChats;
          }
        });
      }
    };

    socket.on("latestMessage", handleNewMessage);

    return () => {
      socket.off("latestMessage", handleNewMessage);
    };
  }, [socket, userId]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
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
          {/* <TextInput placeholder="Search message..." style={styles.searchBar} /> */}
          <Text style={styles.ChatsText}>Your matches</Text>

          <Pressable onPress={() => navigation.navigate("RequestScreen")}>
            <AntDesign name="hearto" size={30} color="#290F4C" />
            {requestCount > 0 && (
              <View style={styles.requestBadge}>
                <Text style={styles.requestBadgeText}>{requestCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={{ padding: 10 }}>
          <View>
            {options?.includes("Chats") &&
              (chats?.length > 0 ? (
                <View>
                  {chats?.map((item) => (
                    <Chat
                      item={item}
                      key={item._id || item.username}
                      latestMessage={item.latestMessage}
                    />
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
                  <View style={styles.animationContainer}>
                    <LottieView
                      source={require("../Onboarding-Screen-2/src/assets/animations/no_chat.json")} // Replace with your animation file path
                      autoPlay
                      loop
                      style={styles.lottie}
                    />
                    <Text style={styles.noChatsText}>Keep connecting</Text>
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

// Preserve your original styles below
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    marginTop: 0,
  },
  animationContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 200,
    height: 200,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15, // Remove or reduce this value
    paddingVertical: 15,
    marginTop: 0,
  },
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,

    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    fontFamily: "CenturyGothicBold",
  },
  noChats: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    textAlign: "center",
    color: "gray",
    fontFamily: "CenturyGothicBold",
  },
  ChatsText: {
    textAlign: "center",
    color: "#814C68",
    fontSize: 26,
    fontFamily: "CenturyGothicBold",
  },
  getStartedText: {
    marginTop: 4,
    color: "gray",
    fontFamily: "CenturyGothic",
  },
  chatList: {
    flex: 1,
    padding: 0,
    margin: 0,
    paddingTop: -50,
  },
});
