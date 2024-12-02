// import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

// import React from "react";
// import Navigation from "./navigation/Navigation"; // Import the Navigation component
// import { SocketContextProvider } from "./SocketContext";
// import { UserProvider } from "./navigation/UserProvider";

// const App = () => {
//   return (
//     <UserProvider>
//       <SocketContextProvider>
//         <Navigation></Navigation>
//       </SocketContextProvider>
//     </UserProvider>
//   );
// };

// export default App;

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
