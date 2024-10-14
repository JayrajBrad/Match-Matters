import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyEventsScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../assets/4 Sample.png")} // Update this path as per your project structure
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      {/* <View style={styles.header}> */}
      {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Created Events</Text> */}
      {/* </View> */}
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="apple-safari"
          size={100}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.message}>
          We couldn't find any events in this section
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateEventScreen")}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#BF1013",
    paddingTop: 50, // Reduced to fit the status bar
  },
  backButton: {
    marginRight: 20, // Space between the button and the title
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1, // Make title take up available space
    textAlign: "center", // Center the title
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#BF1013",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyEventsScreen;

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// const MyEventsScreen = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       {/* Main Content */}
//       <View style={styles.content}>
//         <MaterialCommunityIcons
//           name="apple-safari"
//           size={100}
//           color="black"
//           style={styles.icon}
//         />
//         <Text style={styles.message}>
//           We couldn't find any events in this section
//         </Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => navigation.navigate("CreateEventScreen")}
//         >
//           <Text style={styles.buttonText}>Create Event</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF", // Set a plain background color
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#BF1013",
//     paddingTop: 50, // Reduced to fit the status bar
//   },
//   backButton: {
//     marginRight: 20, // Space between the button and the title
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "white",
//     flex: 1, // Make title take up available space
//     textAlign: "center", // Center the title
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   icon: {
//     marginBottom: 20,
//   },
//   message: {
//     fontSize: 18,
//     color: "black",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#BF1013",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default MyEventsScreen;
