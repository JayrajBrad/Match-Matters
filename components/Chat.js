// import { useEffect, useState, useContext } from "react";
// import { Text, View, Pressable, Image, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useSocketContext } from "../SocketContext";
// import axios from "axios";
// import { API_URL } from "@env";
// import { UserContext } from "../navigation/UserProvider";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// const Chat = ({ item, latestMessage }) => {
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

//   const navigation = useNavigation();
//   const { socket } = useSocketContext();
//   const [fontsLoaded, setFontsLoaded] = useState(false);

//   const { userId } = useContext(UserContext);

//   useEffect(() => {
//     if (userId && item._id && socket) {
//       // Socket listener to update the latest message in real time
//       if (socket) {
//         const handleNewMessage = (data) => {
//           if (
//             (data.latestMessage.senderId === userId &&
//               data.latestMessage.receiverId === item._id) ||
//             (data.latestMessage.senderId === item._id &&
//               data.latestMessage.receiverId === userId)
//           ) {
//             // Update the latestMessage prop by triggering a re-render
//             // This can be handled by updating the parent component's state
//             // Here, it's assumed that the parent will pass the updated latestMessage
//           }
//         };

//         socket.on("latestMessage", handleNewMessage);

//         return () => {
//           socket.off("latestMessage", handleNewMessage);
//         };
//       } else {
//         console.error("Socket is not available");
//       }
//     }
//   }, [userId, socket, item._id]);

//   return (
//     <View style={styles.container}>
//       <Pressable
//         onPress={() =>
//           navigation.navigate("ChatRoom", {
//             name: item?.username,
//             receiverId: item?._id,
//           })
//         }
//         style={{ marginVertical: 15 }}
//       >
//         <View style={styles.chatItem}>
//           <Image source={{ uri: item.images[0] }} style={styles.avatar} />
//           <View style={styles.chatDetails}>
//             <Text style={styles.username}>{item?.username}</Text>
//             <Text style={styles.messagePreview}>
//               {latestMessage || `Chat with ${item?.username}`}
//             </Text>
//           </View>
//         </View>
//       </Pressable>
//     </View>
//   );
// };

// export default Chat;

// // Preserve your original styles below
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   chatDetails: {
//     flex: 1,
//   },
//   chatItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   username: {
//     fontSize: 16,
//     fontFamily: "CenturyGothicBold",
//     color: "#814C68",
//   },
//   messagePreview: {
//     fontSize: 14,
//     color: "#888",
//     marginTop: 2,
//     fontFamily: "CenturyGothicBold",
//   },
// });

import React, { useEffect, useState, useContext } from "react";
import { Text, View, Pressable, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";
import { useSocketContext } from "../SocketContext";
import { UserContext } from "../navigation/UserProvider";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const Chat = ({ item, latestMessage }) => {
  const navigation = useNavigation();
  const { socket } = useSocketContext();
  const { userId } = useContext(UserContext);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  // Store the pre-signed URL in state
  const [profileImageUrl, setProfileImageUrl] = useState(null);

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

  // Fetch the pre-signed URL for the user's first image
  useEffect(() => {
    if (item?.images && item.images.length > 0) {
      fetchProfileImageUrl(item.images[0]);
    }
  }, [item]);

  const fetchProfileImageUrl = async (s3Key) => {
    try {
      // Make sure to encode the key if it has special characters
      const response = await axios.get(`${API_URL}/api/s3-presigned-url`, {
        params: { key: s3Key },
      });
      if (response.data && response.data.preSignedUrl) {
        setProfileImageUrl(response.data.preSignedUrl);
      }
    } catch (error) {
      console.error("Error fetching pre-signed URL:", error);
    }
  };

  // Socket listener to update the latest message in real time
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (
        (data.latestMessage.senderId === userId &&
          data.latestMessage.receiverId === item._id) ||
        (data.latestMessage.senderId === item._id &&
          data.latestMessage.receiverId === userId)
      ) {
        // If needed, you can do something to reflect the new latestMessage in this component.
        // Usually, the parent screen (ChatScreen) handles updates.
      }
    };

    socket.on("latestMessage", handleNewMessage);
    return () => {
      socket.off("latestMessage", handleNewMessage);
    };
  }, [socket, userId, item]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          navigation.navigate("ChatRoom", {
            name: item?.username,
            receiverId: item?._id,
            // Optionally pass along the first image key or the entire images array
            // so ChatRoom can also display the user’s profile pic
            images: item?.images,
          })
        }
        style={{ marginVertical: 15 }}
      >
        <View style={styles.chatItem}>
          {/* Display the image from AWS pre-signed URL */}
          <Image
            source={{ uri: profileImageUrl || undefined }}
            style={styles.avatar}
          />
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

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
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
