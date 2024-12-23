import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import Navigation from "./navigation/Navigation"; // Import the Navigation component
import { SocketContextProvider } from "./SocketContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider } from "./navigation/UserProvider";

const App = () => {
  return (
    <SafeAreaProvider>
    <UserProvider>
      <SocketContextProvider>
        <GestureHandlerRootView style={styles.container}>
          <Navigation></Navigation>
        </GestureHandlerRootView>
      </SocketContextProvider>
    </UserProvider>
</SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

