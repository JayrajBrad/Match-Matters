import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { getUserId } from "../backend/registrationUtils";

const { width: screenWidth } = Dimensions.get("window");

export default function EventParticipantsScreen({ route }) {
  const { eventId } = route.params;
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();

    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/events/${eventId}/participants`
        );
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();
  }, [eventId]);

  const sendRequest = async (receiverId) => {
    try {
      if (!userId) {
        Alert.alert("User ID not found. Please try again.");
        return;
      }

      const userData = {
        senderId: userId,
        receiverId,
      };

      const response = await axios.post(`${API_URL}/api/sendrequest`, userData);

      if (response.status === 200) {
        Alert.alert(
          "Your request has been shared. Wait for the user to accept your request."
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.participantImage}
          />
        )}
        <View style={styles.nameOverlay}>
          <Text style={styles.participantName}>
            {item.username || "No Name"}
          </Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.participantEmail}>
          {item.emailId || "No Email"}
        </Text>
        <Text style={styles.participantDetails}>
          Phone: {item.phoneNumber || "N/A"}
        </Text>
        <Text style={styles.participantDetails}>Age: {item.age || "N/A"}</Text>
        <Text style={styles.participantDetails}>
          Birthdate: {new Date(item.birthdate).toLocaleDateString() || "N/A"}
        </Text>
        <Text style={styles.participantDetails}>
          Gender: {item.gender || "N/A"}
        </Text>
        <Text style={styles.participantDetails}>
          Location: {item.cityName}, {item.stateName}, {item.countryName}
        </Text>
        <Text style={styles.participantDetails}>
          Preferences: {item.selectedPreferences.join(", ") || "None"}
        </Text>
      </View>
      <View style={styles.messageContainer}>
        <Entypo name="emoji-happy" size={24} color="black" />
        {/* <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.messageInput}
          placeholder="Type your message..."
        /> */}
        <Pressable
          onPress={() => sendRequest(item._id)}
          style={styles.sendButton}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Participants</Text>
      <FlatList
        data={participants}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: screenWidth * 0.85,
  },
  imageContainer: {
    position: "relative",
  },
  participantImage: {
    width: "100%",
    height: 350,
  },
  nameOverlay: {
    position: "absolute",
    bottom: 0,
    left: 10,
    width: "100%",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    // alignItems: "center",
  },
  participantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  infoContainer: {
    padding: 15,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  participantEmail: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    fontWeight: "600",
    marginBottom: 10,
  },
  participantDetails: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    letterSpacing: 0.5,
    lineHeight: 22,
    marginBottom: 3,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    marginHorizontal: 50,
    borderRadius: 20,
    justifyContent: "center",
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
  },
  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 10,
  },
});


///////////////CARD COUROSEL///////////////////////////////////////

//////////////////////cloudinary sample replacement///////////////

// import * as React from "react";
// import {
//   StatusBar,
//   Image,
//   FlatList,
//   Dimensions,
//   Animated,
//   Text,
//   View,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// const { width } = Dimensions.get("screen");
// import { EvilIcons } from "@expo/vector-icons";
// import {
//   FlingGestureHandler,
//   Directions,
//   State,
// } from "react-native-gesture-handler";

// const DATA = [
//   {
//     title: "Afro vibes",
//     location: "Mumbai, India",
//     date: "Nov 17th, 2020",
//     poster:
//       "https://res.cloudinary.com/dxcwpxdev/image/upload/v1731326959/profile_pictures/u5flqsrmnux1z80uig11.jpg",
//   },
//   {
//     title: "Jungle Party",
//     location: "Unknown",
//     date: "Sept 3rd, 2020",
//     poster:
//       "https://res.cloudinary.com/dxcwpxdev/image/upload/v1731327157/profile_pictures/j1ebuczz5oxfj9lqkfkw.jpg",
//   },
//   {
//     title: "4th Of July",
//     location: "New York, USA",
//     date: "Oct 11th, 2020",
//     poster:
//       "https://res.cloudinary.com/dxcwpxdev/image/upload/v1731404022/profile_pictures/ynovsnt5slyts1umf1re.jpg",
//   },
//   {
//     title: "Summer festival",
//     location: "Bucharest, Romania",
//     date: "Aug 17th, 2020",
//     poster:
//       "https://res.cloudinary.com/dxcwpxdev/image/upload/v1731413802/profile_pictures/raafh2krndmb8ss7outk.jpg",
//   },
//   {
//     title: "BBQ with friends",
//     location: "Prague, Czech Republic",
//     date: "Sept 11th, 2020",
//     poster:
//       "https://www.creative-flyers.com/wp-content/uploads/2020/06/BBQ-Flyer-Psd-Template.jpg",
//   },
//   {
//     title: "Festival music",
//     location: "Berlin, Germany",
//     date: "Apr 21th, 2021",
//     poster:
//       "https://www.creative-flyers.com/wp-content/uploads/2020/06/Festival-Music-PSD-Template.jpg",
//   },
//   {
//     title: "Beach House",
//     location: "Liboa, Portugal",
//     date: "Aug 12th, 2020",
//     poster:
//       "https://www.creative-flyers.com/wp-content/uploads/2020/06/Summer-Beach-House-Flyer.jpg",
//   },
// ];

// const OVERFLOW_HEIGHT = 70;
// const SPACING = 10;
// const ITEM_WIDTH = width * 0.76;
// const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
// const VISIBLE_ITEMS = 3;

// const OverflowItems = ({ data, scrollXAnimated }) => {
//   const inputRange = [-1, 0, 1];
//   const translateY = scrollXAnimated.interpolate({
//     inputRange,
//     outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
//   });
//   return (
//     <View style={styles.overflowContainer}>
//       <Animated.View style={{ transform: [{ translateY }] }}>
//         {data.map((item, index) => {
//           return (
//             <View key={index} style={styles.itemContainer}>
//               <Text style={[styles.title]} numberOfLines={1}>
//                 {item.title}
//               </Text>
//               <View style={styles.itemContainerRow}>
//                 <Text style={[styles.location]}>
//                   <EvilIcons
//                     name="location"
//                     size={16}
//                     color="black"
//                     style={{ marginRight: 5 }}
//                   />
//                   {item.location}
//                 </Text>
//                 <Text style={[styles.date]}>{item.date}</Text>
//               </View>
//             </View>
//           );
//         })}
//       </Animated.View>
//     </View>
//   );
// };

// export default function EventParticipantsScreen() {
//   const [data, setData] = React.useState(DATA);
//   const scrollXIndex = React.useRef(new Animated.Value(0)).current;
//   const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
//   const [index, setIndex] = React.useState(0);
//   const setActiveIndex = React.useCallback((activeIndex) => {
//     scrollXIndex.setValue(activeIndex);
//     setIndex(activeIndex);
//   });

//   React.useEffect(() => {
//     if (index === data.length - VISIBLE_ITEMS - 1) {
//       // get new data
//       // fetch more data
//       const newData = [...data, ...data];
//       setData(newData);
//     }
//   });

//   React.useEffect(() => {
//     Animated.spring(scrollXAnimated, {
//       toValue: scrollXIndex,
//       useNativeDriver: true,
//     }).start();
//   });

//   return (
//     <FlingGestureHandler
//       key="left"
//       direction={Directions.LEFT}
//       onHandlerStateChange={(ev) => {
//         if (ev.nativeEvent.state === State.END) {
//           if (index === data.length - 1) {
//             return;
//           }
//           setActiveIndex(index + 1);
//         }
//       }}
//     >
//       <FlingGestureHandler
//         key="right"
//         direction={Directions.RIGHT}
//         onHandlerStateChange={(ev) => {
//           if (ev.nativeEvent.state === State.END) {
//             if (index === 0) {
//               return;
//             }
//             setActiveIndex(index - 1);
//           }
//         }}
//       >
//         <SafeAreaView style={styles.container}>
//           <StatusBar hidden />
//           <OverflowItems data={data} scrollXAnimated={scrollXAnimated} />
//           <FlatList
//             data={data}
//             keyExtractor={(_, index) => String(index)}
//             horizontal
//             inverted
//             contentContainerStyle={{
//               flex: 1,
//               justifyContent: "center",
//               padding: SPACING * 2,
//               marginTop: 50,
//             }}
//             scrollEnabled={false}
//             removeClippedSubviews={false}
//             CellRendererComponent={({
//               item,
//               index,
//               children,
//               style,
//               ...props
//             }) => {
//               const newStyle = [style, { zIndex: data.length - index }];
//               return (
//                 <View style={newStyle} index={index} {...props}>
//                   {children}
//                 </View>
//               );
//             }}
//             renderItem={({ item, index }) => {
//               const inputRange = [index - 1, index, index + 1];
//               const translateX = scrollXAnimated.interpolate({
//                 inputRange,
//                 outputRange: [50, 0, -100],
//               });
//               const scale = scrollXAnimated.interpolate({
//                 inputRange,
//                 outputRange: [0.8, 1, 1.3],
//               });
//               const opacity = scrollXAnimated.interpolate({
//                 inputRange,
//                 outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
//               });

//               return (
//                 <Animated.View
//                   style={{
//                     position: "absolute",
//                     left: -ITEM_WIDTH / 2,
//                     opacity,
//                     transform: [
//                       {
//                         translateX,
//                       },
//                       { scale },
//                     ],
//                   }}
//                 >
//                   <Image
//                     source={{ uri: item.poster }}
//                     style={{
//                       width: ITEM_WIDTH,
//                       height: ITEM_HEIGHT,
//                       borderRadius: 14,
//                     }}
//                   />
//                 </Animated.View>
//               );
//             }}
//           />
//         </SafeAreaView>
//       </FlingGestureHandler>
//     </FlingGestureHandler>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "900",
//     textTransform: "uppercase",
//     letterSpacing: -1,
//   },
//   location: {
//     fontSize: 16,
//   },
//   date: {
//     fontSize: 12,
//   },
//   itemContainer: {
//     height: OVERFLOW_HEIGHT,
//     padding: SPACING * 2,
//   },
//   itemContainerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   overflowContainer: {
//     height: OVERFLOW_HEIGHT,
//     overflow: "hidden",
//   },
// });

