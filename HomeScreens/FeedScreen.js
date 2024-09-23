import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Share,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Video } from "expo-av";
import * as Location from "expo-location";
import icon from "../assets/Match matters logo (1).png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

const { width, height } = Dimensions.get("window");

export default function FeedScreen({ navigation, route }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [data, setData] = useState("");
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [focusedButton, setFocusedButton] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [radius, setRadius] = useState(10); // Default radius is 10 kilometers

  useEffect(() => {
    if (route.params?.selectedRadius) {
      setRadius(route.params.selectedRadius);
    }
  }, [route.params?.selectedRadius]);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // useEffect(() => {
  //   // fetch("http://192.168.1.43:4000/getLatestUser", {
  //   fetch(`${API_URL}/user/getLatestUser`, {
  //     method: "GET",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("userData from /lastestUser", data);
  //       setData(data.data);
  //     });
  // }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileImageUri = await AsyncStorage.getItem("profile_image");
        console.log("Fetched profile image URI:", profileImageUri);
        if (profileImageUri) {
          setProfileImage(profileImageUri);
        }
      } catch (error) {
        console.log("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLocationSearch = () => {};

  const handleLikePress = () => {
    setLiked(!liked);
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
  };

  const navigateToTickets = () => {
    navigation.navigate("TicketSales");
  };

  const handleShare = async () => {
    try {
      const profileUrl = `http://yourwebsite.com/profile/${data.id}`; // Replace with your profile URL structure
      const result = await Share.share({
        message: `Check out this profile: ${data.firstName}\n\n${profileUrl}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <View style={styles.headerContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image source={icon} style={styles.profileImage} />
        )}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search location"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={handleLocationSearch}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons
            name="menu"
            color={"#000"}
            size={30}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        Where <Text style={styles.highlight}>Friendships</Text> Begin
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            focusedButton === "Most Happening" && styles.buttonFocused,
          ]}
          onPress={() => {
            navigation.navigate("MostHappening");
            setFocusedButton("Most Happening");
          }}
          onPressOut={() => setFocusedButton(null)}
        >
          <Text style={styles.buttonText}>Most Happening</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            focusedButton === "For You" && styles.buttonFocused,
          ]}
          onPress={() => {
            navigation.navigate("ForYou");
            setFocusedButton("For You");
          }}
          onPressOut={() => setFocusedButton(null)}
        >
          <Text style={styles.buttonText}> For You </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.radiusButton]} // Apply similar styling as the other buttons
          onPress={() => {
            navigation.navigate("Radius");
          }}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            color={"#fff"}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.videoContainer}>
          <Video
            source={require("../assets/onscreen2.mp4")}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
          <View style={styles.overlay}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{data.firstName}</Text>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.eventDateButton}
              onPress={navigateToTickets}
            >
              <Text style={styles.eventDateText}>July 06, 2024 11:00</Text>
            </TouchableOpacity>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketPrice}>₹999 - ₹5,999</Text>
              <TouchableOpacity
                style={styles.ticketAvailabilityButton}
                onPress={navigateToTickets}
              >
                <Text style={styles.ticketAvailabilityText}>
                  Tickets sales end soon
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLikePress}
            >
              <MaterialCommunityIcons
                name={liked ? "heart" : "heart-outline"}
                color={liked ? "red" : "#fff"}
                size={30}
                style={styles.icon}
              />
              <Text style={styles.likeCountText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <MaterialCommunityIcons
                name="share-variant"
                color={"#fff"}
                size={30}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons
                name="dots-vertical"
                color={"#fff"}
                size={30}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.videoContainer}>
          <Video
            source={require("../assets/sv1.mp4")}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
          <View style={styles.overlay}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{data.firstName}</Text>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.eventDateButton}>
              <Text style={styles.eventDateText}>July 06, 2024 11:00</Text>
            </TouchableOpacity>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketPrice}>₹999 - ₹5,999</Text>
              <TouchableOpacity
                style={styles.ticketAvailabilityButton}
                onPress={navigateToTickets}
              >
                <Text style={styles.ticketAvailabilityText}>
                  Tickets sales end soon
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLikePress}
            >
              <MaterialCommunityIcons
                //source={require('../assets/Connection')}
                name="heart-outline"
                color={liked ? "red" : "#fff"}
                size={30}
                style={styles.icon}
              />
              <Text style={styles.likeCountText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <MaterialCommunityIcons
                name="share-variant"
                color={"#fff"}
                size={30}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons
                name="dots-vertical"
                color={"#fff"}
                size={30}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flex: 1,
    marginLeft: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
  },
  menuIcon: {
    marginLeft: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    textAlign: "left",
    paddingLeft: 20,
  },
  highlight: {
    color: "#000000",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    marginTop: 10,
    gap: 5,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#BF1013",
    borderColor: "#BF1013",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  buttonFocused: {
    backgroundColor: "#FF5A5F",
    borderColor: "#FF5A5F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "stretch",
  },
  radiusButton: {
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
    position: "relative",
    width: width,
    height: height - 160,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  followButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  followButtonText: {
    color: "white",
  },
  eventDateButton: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#BF1013",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  eventDateText: {
    color: "white",
  },
  ticketInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 35,
    borderRadius: 10,
  },
  ticketPrice: {
    color: "white",
    marginRight: 10,
  },
  ticketAvailabilityButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ticketAvailabilityText: {
    color: "white",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    bottom: 20,
    justifyContent: "space-between",
    height: 200,
    paddingVertical: 20,
  },
  iconButton: {
    marginVertical: 10,
    alignItems: "center",
    marginTop: 2,
  },
  icon: {
    marginVertical: 10,
  },
  likeCountText: {
    color: "#fff",
    marginTop: 5,
  },
});

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   Animated,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Dimensions,
//   Share,
//   ActivityIndicator,
// } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { Video } from "expo-av";
// import * as Location from "expo-location";
// import icon from "../assets/Match matters logo (1).png";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "@env";
// import { getToken } from "../backend/token";
// import axios from "axios";

// const { width, height } = Dimensions.get("window");

// export default function FeedScreen({ navigation, route }) {
//   const fadeAnimation = useRef(new Animated.Value(0)).current;
//   const [events, setEvents] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [focusedButton, setFocusedButton] = useState(null);
//   const [profileImage, setProfileImage] = useState(null);
//   const [radius, setRadius] = useState(10); // Default radius is 10 kilometers
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (route.params?.selectedRadius) {
//       setRadius(route.params.selectedRadius);
//     }
//   }, [route.params?.selectedRadius]);

//   useEffect(() => {
//     Animated.timing(fadeAnimation, {
//       toValue: 1,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   }, [fadeAnimation]);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     })();
//   }, []);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const token = await getToken();
//         const response = await axios.get(`${API_URL}/api/all-events`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 200) {
//           setEvents(response.data);
//         } else {
//           console.error("Failed to fetch events:", response.status);
//         }
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     const fetchProfileImage = async () => {
//       try {
//         const profileImageUri = await AsyncStorage.getItem("profile_image");
//         if (profileImageUri) {
//           setProfileImage(profileImageUri);
//         }
//       } catch (error) {
//         console.log("Error fetching profile image:", error);
//       }
//     };

//     fetchProfileImage();
//   }, []);

//   const handleLocationSearch = () => {};

//   const handleLikePress = () => {};

//   const navigateToBooking = (eventId) => {
//     navigation.navigate("BookingPage", { eventId });
//   };

//   const handleShare = async (event) => {
//     try {
//       const profileUrl = `http://yourwebsite.com/event/${event._id}`;
//       const result = await Share.share({
//         message: `Check out this event: ${event.title}\n\n${profileUrl}`,
//       });
//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           // shared with activity type of result.activityType
//         } else {
//           // shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // dismissed
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }

//   return (
//     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
//       <View style={styles.headerContainer}>
//         {profileImage ? (
//           <Image source={{ uri: profileImage }} style={styles.profileImage} />
//         ) : (
//           <Image source={icon} style={styles.profileImage} />
//         )}
//         <View style={styles.searchContainer}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search location"
//             value={searchText}
//             onChangeText={(text) => setSearchText(text)}
//             onSubmitEditing={handleLocationSearch}
//           />
//         </View>
//         <TouchableOpacity onPress={() => navigation.openDrawer()}>
//           <MaterialCommunityIcons
//             name="menu"
//             color={"#000"}
//             size={30}
//             style={styles.menuIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title}>
//         Where <Text style={styles.highlight}>Friendships</Text> Begin
//       </Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             focusedButton === "Most Happening" && styles.buttonFocused,
//           ]}
//           onPress={() => {
//             navigation.navigate("MostHappening");
//             setFocusedButton("Most Happening");
//           }}
//           onPressOut={() => setFocusedButton(null)}
//         >
//           <Text style={styles.buttonText}>Most Happening</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             focusedButton === "For You" && styles.buttonFocused,
//           ]}
//           onPress={() => {
//             navigation.navigate("ForYou");
//             setFocusedButton("For You");
//           }}
//           onPressOut={() => setFocusedButton(null)}
//         >
//           <Text style={styles.buttonText}>For You</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.radiusButton]}
//           onPress={() => {
//             navigation.navigate("Radius");
//           }}
//         >
//           <MaterialCommunityIcons
//             name="crosshairs-gps"
//             color={"#fff"}
//             size={20}
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollContainer}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {events.map((event) => (
//           <View key={event._id} style={styles.videoContainer}>
//             <Video
//               source={{ uri: event.videoUrl }} // Ensure your event object has a videoUrl field
//               rate={1.0}
//               volume={1.0}
//               isMuted={false}
//               resizeMode="cover"
//               shouldPlay
//               isLooping
//               style={styles.video}
//             />
//             <View style={styles.overlay}>
//               <View style={styles.userInfo}>
//                 <Text style={styles.userName}>{event.title}</Text>
//                 {/* <TouchableOpacity style={styles.followButton}>
//                   <Text style={styles.followButtonText}>Follow</Text>
//                 </TouchableOpacity> */}
//               </View>
//               {/* <TouchableOpacity
//                 style={styles.eventDateButton}
//                 onPress={() => navigateToBooking(event._id)}
//               >
//                 <Text style={styles.eventDateText}>{event.date}</Text>
//               </TouchableOpacity> */}
//               <View style={styles.ticketInfo}>
//                 {/* <Text style={styles.ticketPrice}>{`₹${event.priceRange}`}</Text> */}
//                 <TouchableOpacity
//                   style={styles.ticketAvailabilityButton}
//                   onPress={() => navigateToBooking(event._id)}
//                 >
//                   <Text style={styles.ticketAvailabilityText}>
//                     Tickets sales end soon
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.iconContainer}>
//               <TouchableOpacity
//                 style={styles.iconButton}
//                 onPress={() => handleShare(event)}
//               >
//                 <MaterialCommunityIcons
//                   name="share-variant"
//                   color={"#fff"}
//                   size={30}
//                   style={styles.icon}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 40,
//     marginBottom: 20,
//     paddingHorizontal: 16,
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   searchContainer: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     height: 40,
//   },
//   menuIcon: {
//     marginLeft: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 20,
//   },
//   highlight: {
//     color: "#f39c12",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#3498db",
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   buttonFocused: {
//     backgroundColor: "#2980b9",
//   },
//   radiusButton: {
//     backgroundColor: "#e74c3c",
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   scrollContent: {
//     alignItems: "center",
//   },
//   videoContainer: {
//     width: width - 20,
//     marginVertical: 10,
//     borderRadius: 10,
//     overflow: "hidden",
//     backgroundColor: "#000",
//   },
//   video: {
//     width: "100%",
//     height: height / 4,
//   },
//   overlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     padding: 10,
//   },
//   userInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   userName: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   followButton: {
//     backgroundColor: "#3498db",
//     borderRadius: 20,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   followButtonText: {
//     color: "#fff",
//   },
//   eventDateButton: {
//     backgroundColor: "#e74c3c",
//     borderRadius: 20,
//     paddingVertical: 5,
//     marginVertical: 5,
//   },
//   eventDateText: {
//     color: "#fff",
//   },
//   ticketInfo: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   ticketPrice: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   ticketAvailabilityButton: {
//     backgroundColor: "#3498db",
//     borderRadius: 20,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   ticketAvailabilityText: {
//     color: "#fff",
//   },
//   iconContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 10,
//   },
//   iconButton: {
//     backgroundColor: "#3498db",
//     borderRadius: 50,
//     padding: 10,
//     margin: 5,
//   },
//   icon: {
//     color: "#fff",
//   },
// });
