// import React, { useContext, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   Button,
// } from "react-native";
// import { useEvent } from "expo";
// import { useVideoPlayer, VideoView } from "expo-video"; // Corrected import
// import { useNavigation } from "@react-navigation/native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { UserContext } from "../../navigation/UserProvider";
// import axios from "axios";
// import { API_URL } from "@env";

// const { width, height } = Dimensions.get("window");

// const HEADER_HEIGHT = 60;
// const TAB_BAR_HEIGHT = 60;

// const containerHeight = height - HEADER_HEIGHT - TAB_BAR_HEIGHT;

// const EventItem = React.memo(function EventItem({ item, index, shouldPlay }) {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const tabBarHeight = 60;
//   const [isPlayerReady, setIsPlayerReady] = useState(false);

//   const { userId } = useContext(UserContext);
//   console.log(userId);
//   const [vibesCount, setVibesCount] = useState(item.vibes?.length || 0);
//   const [hasVibed, setHasVibed] = useState(
//     item.vibes?.includes(userId) || false
//   );

//   useEffect(() => {
//     if (!item.vibes) return;
//     const userHasVibed = item.vibes.includes(userId);
//     setHasVibed(userHasVibed);
//   }, [item.vibes, userId]);

//   const handleVibe = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/events/${item._id}/vibe`,
//         { userId }
//       );
//       if (response.status === 200) {
//         const { vibesCount } = response.data;
//         setVibesCount(vibesCount);
//         setHasVibed((prev) => !prev);
//       }
//     } catch (error) {
//       console.error("Error vibing event:", error);
//     }
//   };

//   // Initialize the video player
//   const player = useVideoPlayer(item.videoUrl, (player) => {
//     player.loop = false; // No looping
//   });

//   // Listen to the 'playingChange' event to get the current playback state
//   const { isPlaying } = useEvent(player, "playingChange", {
//     isPlaying: player.playing,
//   });

//   // Determine if this item is active (visible)
//   const isActive = shouldPlay;

//   // useEffect(() => {
//   //   if (!isPlayerReady) return;
//   //   console.log(isActive);
//   //   if (isActive) {
//   //     player.play();
//   //   } else {
//   //     player.pause();
//   //   }
//   // }, [isActive, isPlayerReady, player, index]);

//   useEffect(() => {
//     if (!isPlayerReady) return;
//     console.log(isActive);
//     if (isActive && shouldPlay) {
//       player.play();
//     } else {
//       player.pause();
//     }
//   }, [isActive, isPlayerReady, player, index, shouldPlay]);

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       player.pause();
//     } else {
//       player.play();
//     }
//   };

//   return (
//     <View style={styles.videoContainer}>
//       <VideoView
//         style={styles.video}
//         player={player}
//         nativeControls={false}
//         allowsFullscreen
//         allowsPictureInPicture
//       />

//       <View style={styles.bottom}>
//         {/* Event Details */}
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={() =>
//             navigation.navigate("EventDetailsScreen", { eventId: item._id })
//           }
//         >
//           <View style={styles.bottomInfo}>
//             <Text style={styles.eventTitle}>{item.title}</Text>
//             <Text style={styles.organizer}>By {item.organizer}</Text>
//           </View>
//         </TouchableOpacity>

//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <TouchableOpacity onPress={handleVibe} style={styles.vibeButton}>
//             <Text style={styles.vibeButtonText}>
//               {hasVibed ? "Vibed" : "Vibe it"}
//             </Text>
//           </TouchableOpacity>
//           <Text style={{ marginLeft: 8, color: "#fff" }}>
//             {vibesCount} vibes
//           </Text>
//         </View>

//         {/* Play/Pause Button */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             onPress={handlePlayPause}
//             style={styles.playPauseButton}
//           >
//             {/* <Text style={styles.playPauseButtonText}>
//               {isPlaying ? "Pause" : "Play"}
//             </Text> */}

//             <MaterialCommunityIcons
//               name={isPlaying ? "pause-circle" : "play-circle"}
//               size={30}
//               color="#fff"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// });

// export default EventItem;

// const styles = StyleSheet.create({
//   videoContainer: {
//     // width,
//     // height: height * 0.8,
//     width,
//     height: containerHeight,

//     position: "relative",
//     overflow: "hidden",
//     backgroundColor: "#fff",
//     marginBottom: 20,
//     borderWidth: 1,
//     resizeMode: "cover",
//     borderColor: "red",
//   },
//   video: {
//     // width,
//     // height: height * 0.8,
//     width,
//     height: containerHeight,
//   },
//   bottom: {
//     flexDirection: "row", // Align items horizontally
//     alignItems: "center", // Center items vertically
//     justifyContent: "space-between", // Space out items
//     paddingHorizontal: 10, // Horizontal padding for spacing
//     paddingVertical: 15, // Vertical padding for spacing
//     backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background for better readability
//     position: "absolute", // Position it at the bottom of the container
//     bottom: 0, // Stick it to the bottom
//     width: "100%", // Ensure it spans the entire width
//   },
//   overlay: {
//     flex: 1,
//     padding: 10,
//   },
//   bottomInfo: {
//     flex: 1, // Take up available space
//     paddingHorizontal: 10, // Add horizontal padding
//   },
//   eventTitle: {
//     color: "#fff",
//     fontSize: 18, // Font size for better visibility
//     fontFamily: "CenturyGothicBold",
//   },
//   organizer: {
//     color: "#ddd",
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//   },
//   buttonContainer: {
//     paddingHorizontal: 10, // Space around the button
//   },
//   playPauseButton: {
//     backgroundColor: "transparent",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   playPauseButtonText: {
//     color: "#000",
//     fontSize: 14,
//     fontFamily: "CenturyGothicBold",
//   },
// });

//////////////////////////////////////////////////////////////////////////

// import React, { useContext, useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { Video, ResizeMode } from "expo-av";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { UserContext } from "../../navigation/UserProvider";
// import axios from "axios";
// import { API_URL } from "@env";

// const { width, height } = Dimensions.get("window");

// // Adjust if needed:
// const HEADER_HEIGHT = 60;
// const TAB_BAR_HEIGHT = 60;
// const containerHeight = height - HEADER_HEIGHT - TAB_BAR_HEIGHT;

// const EventItem = React.memo(function EventItem({ item, index, shouldPlay }) {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();

//   // Calculate available height dynamically
//   const dynamicHeight =
//     height - insets.top - insets.bottom - HEADER_HEIGHT - TAB_BAR_HEIGHT;

//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Create a ref to the <Video> component
//   const videoRef = useRef(null);

//   // Access the user context for vibes, etc.
//   const { userId } = useContext(UserContext);

//   // State for vibes
//   const [vibesCount, setVibesCount] = useState(item.vibes?.length || 0);
//   const [hasVibed, setHasVibed] = useState(
//     item.vibes?.includes(userId) || false
//   );

//   // Keep hasVibed in sync with item.vibes
//   useEffect(() => {
//     if (item.vibes?.includes(userId)) {
//       setHasVibed(true);
//     } else {
//       setHasVibed(false);
//     }
//   }, [item.vibes, userId]);

//   // On mount, set up playback status updates
//   useEffect(() => {
//     if (!videoRef.current) return;

//     // Listen for playback status changes
//     videoRef.current.setOnPlaybackStatusUpdate((status) => {
//       // We'll track 'isPlaying' from status
//       if (status.isLoaded) {
//         setIsPlaying(status.isPlaying);
//       }
//     });
//   }, [videoRef]);

//   // Auto-play / auto-pause whenever `shouldPlay` toggles
//   useEffect(() => {
//     // Only proceed once we have a ref and the video is loaded
//     if (!videoRef.current || !isPlayerReady) return;

//     if (shouldPlay) {
//       videoRef.current.playAsync().catch((err) => console.warn(err));
//     } else {
//       videoRef.current.pauseAsync().catch((err) => console.warn(err));
//     }
//   }, [shouldPlay, isPlayerReady]);

//   // Vibe handler
//   const handleVibe = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/events/${item._id}/vibe`,
//         {
//           userId,
//         }
//       );
//       if (response.status === 200) {
//         const { vibesCount } = response.data;
//         setVibesCount(vibesCount);
//         setHasVibed((prev) => !prev);
//       }
//     } catch (error) {
//       console.error("Error vibing event:", error);
//     }
//   };

//   // Manual play/pause button
//   const handlePlayPause = async () => {
//     if (!videoRef.current) return;
//     if (isPlaying) {
//       await videoRef.current.pauseAsync();
//     } else {
//       await videoRef.current.playAsync();
//     }
//   };

//   // useFocusEffect(
//   //   React.useCallback(() => {
//   //     // When the screen is focused, do nothing
//   //     return () => {
//   //       // When the screen is unfocused, pause the video
//   //       if (videoRef.current && isPlaying) {
//   //         videoRef.current
//   //           .pauseAsync()
//   //           .catch((err) => console.warn("Error pausing video on blur:", err));
//   //       }
//   //     };
//   //   }, [videoRef, isPlaying])
//   // );

//   // You can optionally unmount the <Video> if `shouldPlay` is false:
//   //   {shouldPlay && (<Video>...</Video>)}
//   // This frees memory off-screen.
//   // For demonstration, we'll KEEP the video mounted but just pause it if not active.
//   // If you want to unmount, wrap <Video> in {shouldPlay && (...)}.

//   return (
//     <View style={[styles.videoContainer, { width, height: dynamicHeight }]}>
//       {shouldPlay && (
//         <Video
//           ref={videoRef}
//           source={{ uri: item.videoUrl }}
//           // style={styles.video}
//           style={StyleSheet.absoluteFill}
//           // resizeMode="cover" // Similar to expo-video's 'cover'
//           resizeMode={ResizeMode.CONTAIN}
//           useNativeControls={false} // If you want default native controls or not
//           isLooping={true} // Or true, if you prefer looping
//           onReadyForDisplay={() => setIsPlayerReady(true)}
//           // These next two only matter if you want PiP or background in expo-av
//           // posterSource={...} // optional poster
//           // shouldPlay={false} // We control it manually, so set false here
//         />
//       )}

//       <View style={styles.bottom}>
//         {/* Event Details */}
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={() =>
//             navigation.navigate("EventDetailsScreen", { eventId: item._id })
//           }
//         >
//           <View style={styles.bottomInfo}>
//             <Text style={styles.eventTitle}>{item.title}</Text>
//             <Text style={styles.organizer}>By {item.organizer}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Vibe Button */}
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <TouchableOpacity onPress={handleVibe} style={styles.vibeButton}>
//             <Text style={styles.vibeButtonText}>
//               {hasVibed ? "Vibed" : "Vibe it"}
//             </Text>
//           </TouchableOpacity>
//           <Text style={{ marginLeft: 8, color: "#fff" }}>
//             {vibesCount} vibes
//           </Text>
//         </View>

//         {/* Play/Pause Button */}
//         {/* <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             onPress={handlePlayPause}
//             style={styles.playPauseButton}
//           >
//             <MaterialCommunityIcons
//               name={isPlaying ? "pause-circle" : "play-circle"}
//               size={30}
//               color="#fff"
//             />
//           </TouchableOpacity>
//         </View> */}
//       </View>
//     </View>
//   );
// });

// export default EventItem;

// const styles = StyleSheet.create({
//   // videoContainer: {
//   //   width,
//   //   height: containerHeight,
//   //   position: "relative",
//   //   overflow: "hidden",
//   //   backgroundColor: "#fff",
//   //   marginBottom: 20,
//   //   borderWidth: 1,
//   //   borderColor: "red",
//   // },
//   videoContainer: {
//     position: "relative",
//     overflow: "hidden",
//     backgroundColor: "#fff",
//   },
//   video: {
//     width,
//     height: containerHeight,
//   },
//   bottom: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//   },
//   overlay: {
//     flex: 1,
//     padding: 10,
//   },
//   bottomInfo: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   eventTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//   },
//   organizer: {
//     color: "#ddd",
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//   },
//   vibeButton: {
//     backgroundColor: "#f44336",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   vibeButtonText: {
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//     fontSize: 14,
//   },
//   buttonContainer: {
//     paddingHorizontal: 10,
//   },
//   playPauseButton: {
//     backgroundColor: "transparent",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

////////////recent working code //////////////////

// import React, { useContext, useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   StyleSheet as RNStyleSheet,
// } from "react-native";
// import { Video, ResizeMode } from "expo-av";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { UserContext } from "../../navigation/UserProvider";
// import axios from "axios";
// import { API_URL } from "@env";

// const { width, height } = Dimensions.get("window");

// // Constants for header and tab bar heights
// const HEADER_HEIGHT = 60;
// const TAB_BAR_HEIGHT = 60;

// const EventItem = React.memo(function EventItem({
//   item,
//   index,
//   shouldPlay,
//   hasTabBar = true, // New prop: defaults to true
// }) {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();

//   // Calculate available height dynamically:
//   // Subtract the tab bar height only if hasTabBar is true.
//   const dynamicHeight =
//     height -
//     insets.top -
//     insets.bottom -
//     HEADER_HEIGHT -
//     (hasTabBar ? TAB_BAR_HEIGHT : 0);

//   const [isPlayerReady, setIsPlayerReady] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);

//   // Create a ref for the Video component
//   const videoRef = useRef(null);

//   // Access user context (e.g., for vibes)
//   const { userId } = useContext(UserContext);

//   // State for vibes
//   const [vibesCount, setVibesCount] = useState(item.vibes?.length || 0);
//   const [hasVibed, setHasVibed] = useState(
//     item.vibes?.includes(userId) || false
//   );

//   // Sync hasVibed with item.vibes
//   useEffect(() => {
//     setHasVibed(item.vibes?.includes(userId) || false);
//   }, [item.vibes, userId]);

//   // Setup playback status updates on mount
//   useEffect(() => {
//     if (!videoRef.current) return;

//     videoRef.current.setOnPlaybackStatusUpdate((status) => {
//       if (status.isLoaded) {
//         setIsPlaying(status.isPlaying);
//       }
//     });
//   }, [videoRef]);

//   // Auto-play/pause based on shouldPlay prop
//   useEffect(() => {
//     if (!videoRef.current || !isPlayerReady) return;

//     if (shouldPlay) {
//       videoRef.current.playAsync().catch((err) => console.warn(err));
//     } else {
//       videoRef.current.pauseAsync().catch((err) => console.warn(err));
//     }
//   }, [shouldPlay, isPlayerReady]);

//   // Handler for vibing
//   const handleVibe = async () => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/api/events/${item._id}/vibe`,
//         { userId }
//       );
//       if (response.status === 200) {
//         const { vibesCount } = response.data;
//         setVibesCount(vibesCount);
//         setHasVibed((prev) => !prev);
//       }
//     } catch (error) {
//       console.error("Error vibing event:", error);
//     }
//   };

//   return (
//     <View style={[styles.videoContainer, { width, height: dynamicHeight }]}>
//       {shouldPlay && (
//         <Video
//           ref={videoRef}
//           source={{ uri: item.videoUrl }}
//           style={RNStyleSheet.absoluteFill}
//           resizeMode={ResizeMode.CONTAIN}
//           useNativeControls={false}
//           isLooping={true}
//           onReadyForDisplay={() => setIsPlayerReady(true)}
//         />
//       )}

//       <View style={styles.bottom}>
//         {/* Event Details */}
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={() =>
//             navigation.navigate("EventDetailsScreen", { eventId: item._id })
//           }
//         >
//           <View style={styles.bottomInfo}>
//             <Text style={styles.eventTitle}>{item.title}</Text>
//             <Text style={styles.organizer}>By {item.organizer}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Vibe Button */}
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             paddingHorizontal: 20,
//           }}
//         >
//           <TouchableOpacity onPress={handleVibe} style={styles.vibeButton}>
//             <Text style={styles.vibeButtonText}>
//               {hasVibed ? "Vibed" : "Vibe it"}
//             </Text>
//           </TouchableOpacity>
//           <Text style={{ marginLeft: 8, color: "#fff" }}>
//             {vibesCount} vibes
//           </Text>
//         </View>
//       </View>
//     </View>
//   );
// });

// export default EventItem;

// const styles = StyleSheet.create({
//   videoContainer: {
//     position: "relative",
//     overflow: "hidden",
//     backgroundColor: "#fff",
//   },
//   bottom: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//   },
//   overlay: {
//     flex: 1,
//     padding: 10,
//   },
//   bottomInfo: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   eventTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//   },
//   organizer: {
//     color: "#ddd",
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//   },
//   vibeButton: {
//     backgroundColor: "#290F4C",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   vibeButtonText: {
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//     fontSize: 14,
//   },
// });

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserContext } from "../../navigation/UserProvider";
import axios from "axios";
import { API_URL } from "@env";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 60;
const TAB_BAR_HEIGHT = 60;

const EventItem = React.memo(function EventItem({
  item,
  index,
  shouldPlay,
  hasTabBar = true, // New prop: defaults to true
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { userId } = useContext(UserContext);

  // Calculate the height available for the video
  const dynamicHeight =
    height -
    insets.top -
    insets.bottom -
    HEADER_HEIGHT -
    (hasTabBar ? TAB_BAR_HEIGHT : 0);

  // We'll store the final playable URL from the backend
  const [presignedVideoUrl, setPresignedVideoUrl] = useState(
    item.presignedVideoUrl || null
  );

  console.log(presignedVideoUrl);

  // For controlling the video playback
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);

  // For vibes
  const [vibesCount, setVibesCount] = useState(item.vibes?.length || 0);
  const [hasVibed, setHasVibed] = useState(
    item.vibes?.includes(userId) || false
  );

  // If the event object updates with a new presignedVideoUrl, we can catch it here
  useEffect(() => {
    if (item.presignedVideoUrl) {
      setPresignedVideoUrl(item.presignedVideoUrl);
    }
  }, [item.presignedVideoUrl]);

  // Setup playback status updates
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
      }
    });
  }, [videoRef]);

  // Auto-play/pause based on shouldPlay & readiness
  useEffect(() => {
    if (!videoRef.current || !isPlayerReady) return;

    if (shouldPlay) {
      videoRef.current.playAsync().catch((err) => console.warn(err));
    } else {
      videoRef.current.pauseAsync().catch((err) => console.warn(err));
    }
  }, [shouldPlay, isPlayerReady]);

  // Vibe handler
  const handleVibe = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/events/${item._id}/vibe`,
        { userId }
      );
      if (response.status === 200) {
        const { vibesCount: updatedCount } = response.data;
        setVibesCount(updatedCount);
        setHasVibed((prev) => !prev);
      }
    } catch (error) {
      console.error("Error vibing event:", error);
    }
  };

  return (
    <View style={[styles.videoContainer, { width, height: dynamicHeight }]}>
      {/* If we have the presigned URL, show the video */}
      {presignedVideoUrl ? (
        <Video
          ref={videoRef}
          source={{ uri: presignedVideoUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onReadyForDisplay={() => setIsPlayerReady(true)}
          onLoadStart={() => console.log("Video is loading...")}
          onLoad={() => console.log("Video loaded.")}
          onError={(err) => console.log("Video error:", err)}
        />
      ) : (
        // Otherwise, a fallback for no video
        <View style={[StyleSheet.absoluteFill, styles.loadingContainer]}>
          <Text style={styles.loadingText}>No Video Available</Text>
        </View>
      )}

      {/* Overlay: event details & vibe button */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.overlay}
          onPress={() =>
            navigation.navigate("EventDetailsScreen", { eventId: item._id })
          }
        >
          <View style={styles.bottomInfo}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.organizer}>By {item.organizer}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.vibeContainer}>
          <TouchableOpacity onPress={handleVibe} style={styles.vibeButton}>
            <Text style={styles.vibeButtonText}>
              {hasVibed ? "Vibed" : "Vibe it"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.vibeCount}>{vibesCount} vibes</Text>
        </View>
      </View>
    </View>
  );
});

export default EventItem;

const styles = StyleSheet.create({
  videoContainer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  overlay: {
    flex: 1,
    padding: 10,
  },
  bottomInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
  },
  organizer: {
    color: "#ddd",
    fontSize: 14,
    fontFamily: "CenturyGothic",
  },
  vibeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  vibeButton: {
    backgroundColor: "#290F4C",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  vibeButtonText: {
    color: "#fff",
    fontFamily: "CenturyGothicBold",
    fontSize: 14,
  },
  vibeCount: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 14,
  },
});
