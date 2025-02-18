import React, { useState, useEffect, useContext } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL } from "@env";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getUserId } from "../backend/registrationUtils";
import { UserContext } from "../navigation/UserProvider";
import LottieView from "lottie-react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const RequestScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

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

  const [requests, setRequests] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { userId } = useContext(UserContext);

  useEffect(() => {
    if (userId) {
      getRequests();
    }
  }, [userId]);

  const getRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/getrequests/${userId}`);
      setRequests(response.data);
    } catch (error) {
      console.log("get request:", error.message);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`${API_URL}/api/acceptrequest`, {
        userId: userId,
        requestId: requestId,
      });

      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.from._id !== requestId)
        );
      }
    } catch (error) {
      console.log("Error accepting request:", error.message);
    }
  };

  const uniqueRequests = Array.from(
    new Set(requests.map((item) => item.from._id))
  ).map((id) => requests.find((item) => item.from._id === id));

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity> */}
      {uniqueRequests.length === 0 ? (
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../Onboarding-Screen-2/src/assets/animations/NO_request.json")} // Replace with your animation file path
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.emptyText}>No requests at the moment!</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {uniqueRequests.map((item, index) => (
            <View key={item?.from?._id || index} style={styles.requestItem}>
              <Image
                source={{ uri: item?.from?.images[0] }}
                style={styles.profileImage}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{item?.from?.username}</Text>
              </View>
              <Pressable
                onPress={() => acceptRequest(item?.from?._id)}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  /* Delete action here */
                }}
              >
                <AntDesign name="delete" size={24} color="#FF3B30" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    padding: 15,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: "#0F3460",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: 50,
  },
  lottie: {
    width: 300,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: "#290F4C",
    marginTop: 10,
    fontFamily: "CenturyGothic",
  },
  requestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    color: "#333",
  },
  interestsText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  addButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    borderRadius: 15,
    marginRight: 15,
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "CenturyGothic",
    fontSize: 14,
    textAlign: "center",
  },
});
