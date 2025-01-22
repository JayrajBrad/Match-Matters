// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Animated } from "react-native";
// import NetInfo from "@react-native-community/netinfo";

// const NetworkStatus = () => {
//   const [isConnected, setIsConnected] = useState(true);
//   const [showBanner, setShowBanner] = useState(false);
//   const bannerOpacity = new Animated.Value(0);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       if (state.isConnected !== isConnected) {
//         setIsConnected(state.isConnected);
//         setShowBanner(true);
//         Animated.timing(bannerOpacity, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start(() => {
//           setTimeout(() => {
//             Animated.timing(bannerOpacity, {
//               toValue: 0,
//               duration: 500,
//               useNativeDriver: true,
//             }).start(() => setShowBanner(false));
//           }, 2000);
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, [isConnected, bannerOpacity]);

//   if (!showBanner) return null;

//   return (
//     <Animated.View
//       style={[
//         styles.banner,
//         {
//           backgroundColor: isConnected ? "green" : "red",
//           opacity: bannerOpacity,
//         },
//       ]}
//     >
//       <Text style={styles.text}>
//         {isConnected ? "Back Online" : "No Internet Connection"}
//       </Text>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   banner: {
//     position: "absolute",
//     top: 0,
//     width: "100%",
//     padding: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//   },
//   text: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default NetworkStatus;

// components/NetworkStatus.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import * as Network from "expo-network";

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const bannerOpacity = new Animated.Value(0);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const status = await Network.getNetworkStateAsync();
      console.log("Initial Network Status:", status);
      setIsConnected(status.isConnected);
    };

    checkNetworkStatus(); // Initial check

    const interval = setInterval(async () => {
      const status = await Network.getNetworkStateAsync();
      if (status.isConnected !== isConnected) {
        setIsConnected(status.isConnected);
        setShowBanner(true);
        Animated.timing(bannerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(bannerOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => setShowBanner(false));
          }, 2000);
        });
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [isConnected, bannerOpacity]);

  if (!showBanner) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: isConnected ? "green" : "red",
          opacity: bannerOpacity,
        },
      ]}
    >
      <Text style={styles.text}>
        {isConnected ? "Back Online" : "No Internet Connection"}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default NetworkStatus;
