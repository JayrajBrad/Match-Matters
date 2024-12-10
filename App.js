import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import React from "react";
import Navigation from "./navigation/Navigation"; // Import the Navigation component
import { SocketContextProvider } from "./SocketContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider } from "./navigation/UserProvider";

const App = () => {
  return (
    <UserProvider>
      <SocketContextProvider>
        <GestureHandlerRootView style={styles.container}>
          <Navigation></Navigation>
        </GestureHandlerRootView>
      </SocketContextProvider>
    </UserProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// import React, { useEffect } from "react";
// import { StyleSheet } from "react-native";
// import * as Linking from "expo-linking";
// import Navigation from "./navigation/Navigation";
// import { navigationRef } from "./navigation/NavigationService";
// import { SocketContextProvider } from "./SocketContext";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { UserProvider } from "./navigation/UserProvider";

// const App = () => {
//   useEffect(() => {
//     const handleDeepLink = (event) => {
//       const { path, queryParams } = Linking.parse(event.url);
//       console.log("Deep link path:", path);
//       console.log("Query parameters:", queryParams);

//       if (path === "reset-password") {
//         navigationRef.current?.navigate("ResetPassword", {
//           token: queryParams.token,
//         });
//       }
//     };

//     Linking.addEventListener("url", handleDeepLink);

//     return () => {
//       Linking.removeEventListener("url", handleDeepLink);
//     };
//   }, []);

//   return (
//     <UserProvider>
//       <SocketContextProvider>
//         <GestureHandlerRootView style={styles.container}>
//           <Navigation />
//         </GestureHandlerRootView>
//       </SocketContextProvider>
//     </UserProvider>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
