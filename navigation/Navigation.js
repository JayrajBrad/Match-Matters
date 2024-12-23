import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Easing,
  searchText,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

// Screen
import SplashScreenView from "../SplashScreenView";
import Login from "../Screens/Login";
import SignNumber from "../Screens/SignNumber";
import OtpScreen from "../Screens/OtpScreen";
import SignEmail from "../Screens/SignEmail";
import NamePage from "../Screens/NamePage";
import AgeScreen from "../Screens/AgeScreen";
import ProfilePicScreen from "../Screens/ProfilePicScreen";
import PreferenceScreen from "../Screens/PreferenceScreen";
import FeedScreen from "../TabScreens/FeedScreen";
import Profile from "../TabScreens/Profile";
import LikedYou from "../TabScreens/LikedYou";
import ChatScreen from "../TabScreens/ChatScreen";
import Chat from "../components/Chat";
import MostHappening from "../HomeScreens/MostHappening";
import ForYou from "../HomeScreens/ForYou";

import OnboardingScreen from "../Onboarding-Screen-2/OnboardingScreen";

import TicketSales from "../HomeScreens/TicketSales";
import EditProfileScreen from "../HomeScreens/EditProfileScreen";
import VerifyAccountScreen from "../HomeScreens/VerifyAccountScreen";
import MyEventsScreen from "../drawer/MyEventsScreen";

import AllEvents from "../drawer/AllEvents";
import MyBookingsScreen from "../drawer/MyBookingsScreen";
import HelpScreen from "../policy/HelpScreen";
import PrivacyCenterScreen from "../policy/PrivacyCenterScreen";
import ContactUsScreen from "../policy/ContactUsScreen";
import FAQScreen from "../policy/FAQScreen";
import CreateEventScreen from "../TabScreens/CreateEventScreen";

import EventDetailsScreen from "../HomeScreens/EventDetailsScreen";
import SignPassword from "../Screens/SignPassword";
import ChatRoom from "../TabScreens/ChatRoom";
import Filter from "../components/FilterComponent";
import EventParticipantsScreen from "../TabScreens/EventParticipants";
import EmailLogin from "../Screens/LoginScreens/EmailLogin";
import RequestScreen from "../TabScreens/RequestScreen";
import { UserContext } from "./UserProvider";
import CustomBottomTab from "../TabScreens/Tabcomponents/CustomBottomTab";
import ForgotPasswordScreen from "../Screens/LoginScreens/ForgotPasswordScreen";
import ResetPasswordScreen from "../Screens/LoginScreens/ResetPasswordScreen";
// import * as Linking from "expo-linking";
import { navigationRef } from "./NavigationService";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// const linking = {
//   prefixes: ["matchmatters://", "exp://192.168.1.38:8081"], // Add your Expo URL here
//   config: {
//     screens: {
//       ResetPasswordScreen: "reset-password/:resetToken", // Define the deep link path
//     },
//   },
// };

// useEffect(() => {
//   const handleDeepLink = (event) => {
//     const { path, queryParams } = Linking.parse(event.url);
//     console.log('Deep link path:', path);
//     console.log('Query parameters:', queryParams);

//     if (path === 'reset-password') {
//       // Handle navigation to the ResetPasswordScreen with the token
//       navigationRef.current?.navigate('ResetPassword', { token: queryParams.token });
//     }
//   };

//   // Add the event listener
//   Linking.addEventListener('url', handleDeepLink);

//   // Clean up the listener on unmount
//   return () => {
//     Linking.removeEventListener('url', handleDeepLink);
//   };
// }, []);

const CustomBottomTabs = (props) => {
  return <CustomBottomTab {...props} />;
};

// const BottomTabs = () => {
//   const navigation = useNavigation();
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [filterVisible, setFilterVisible] = useState(false);
//   const toggleFilterModal = () => setFilterVisible(!filterVisible);

//   return (
//     <Tab.Navigator
//       // initialRouteName="FeedScreen"
//       tabBar={(props) => <CustomBottomTabs {...props} />}
//       // screenOptions={{ headerShown: false }}
//       screenOptions={({ route }) => ({
//         tabBarShowLabel: true,
//         tabBarStyle: { height: 100, position: "absolute", elevation: 0 },
//         tabBarLabelStyle: { fontSize: 12, marginBottom: 10, color: "#000" },
//         tabBarIconStyle: { marginTop: 10 },
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         options={{
//           title: "FeedScreen",
//           headerStyle: {
//             // backgroundColor: "#0067FF", // Header background color
//             height: 120, // Increase the header height
//           },
//           headerTitle: () => (
//             <View style={styles.headerContainer}>
//               <View style={styles.logoContainer}>
//                 <Image
//                   source={require("../assets/Match matters logo (1).png")}
//                   style={styles.logo}
//                 />
//               </View>

//               {/* Search Bar */}
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search Events"
//                 value={searchText}
//                 onChangeText={(text) => setSearchText(text)}
//                 // Add an onChangeText handler here if needed
//               />

//               {/* Filter Icon */}
//               <TouchableOpacity
//                 onPress={toggleFilterModal}
//                 style={styles.filterIcon}
//               >
//                 <MaterialCommunityIcons
//                   name={
//                     filterVisible
//                       ? "calendar-check-outline"
//                       : "calendar-blank-outline"
//                   }
//                   color={filterVisible ? "#252355" : "#000"}
//                   size={30}
//                 />
//               </TouchableOpacity>
//             </View>
//           ),
//         }}
//       >
//         {() => (
//           <FeedScreen
//             // showFilters={showFilters}
//             // setShowFilters={setShowFilters}
//             filterVisible={filterVisible}
//             toggleFilterModal={toggleFilterModal}
//             // setFilteredEvents={setFilteredEvents}
//             // loadEvents={loadEvents}
//           />
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="Vibed"
//         component={LikedYou}
//         options={{
//           title: "Liked You",
//         }}
//       />
//       <Tab.Screen
//         name="Event"
//         component={CreateEventScreen}
//         options={{
//           title: "Create Event",
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={ChatScreen}
//         options={{
//           title: "Chat",
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: "Profile",
//         }}
//       />
//     </Tab.Navigator>
//   );
// };


const BottomTabs = () => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const toggleFilterModal = () => setFilterVisible(!filterVisible);

  return (
    <Tab.Navigator
      // initialRouteName="FeedScreen"
      // tabBar={(props) => <CustomBottomTabs {...props} />}
      // screenOptions={{ headerShown: false }}
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 80,
          position: "absolute",
          elevation: 0,
          backgroundColor: "#290F4C",
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 10, color: "#fff" },
        tabBarIconStyle: { marginTop: 10 },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),

          headerStyle: {
            backgroundColor: "#290F4C", // Header background color
            height: 100, // Increase the header height
          },
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/MM - PNG.png")}
                  style={styles.logo}
                />
              </View>

              {/* Search Bar */}
              {/* <TextInput
                style={styles.searchInput}
                placeholder="Search Events"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                // Add an onChangeText handler here if needed
              /> */}

              {/* Filter Icon */}
              <TouchableOpacity
                onPress={toggleFilterModal}
                style={styles.filterIcon}
              >
                <MaterialCommunityIcons
                  name={
                    filterVisible
                      ? "calendar-check-outline"
                      : "calendar-blank-outline"
                  }
                  color={filterVisible ? "#252355" : "#fff"}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        {() => (
          <FeedScreen
            // showFilters={showFilters}
            // setShowFilters={setShowFilters}
            filterVisible={filterVisible}
            toggleFilterModal={toggleFilterModal}
            // setFilteredEvents={setFilteredEvents}
            // loadEvents={loadEvents}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Vibed"
        component={LikedYou}
        options={{
          title: "Vibed",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Event"
        component={CreateEventScreen}
        options={{
          title: "Event",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};




const AuthStack = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);

  return (
    <Stack.Navigator
      // initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {isShowSplash ? (
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreenView}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* <Stack.Screen
            name="StartScreen"
            component={StartScreen}
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              // gestureEnabled: true,
              // gestureDirection: "horizontal",
              // ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
          <Stack.Screen
            name="EmailLogin"
            component={EmailLogin}
            options={{
              title: "EmailLogin",
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{
              title: "ForgotPasswordScreen",
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
            options={{
              title: "ForgotPasswordScreen",
              headerShown: true,
              headerTitleAlign: "center",
            }}
          />
        </>
      )}
      <Stack.Screen
        name="SignNumber"
        component={SignNumber}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignEmail"
        component={SignEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignPassword"
        component={SignPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NamePage"
        component={NamePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AgeScreen"
        component={AgeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePicScreen"
        component={ProfilePicScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreferenceScreen"
        component={PreferenceScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreferenceScreen"
        component={PreferenceScreen}
        options={{ headerShown: true, headerTitleAlign: "center" }} // Customize as needed
      />
      <Stack.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={{ headerShown: false }} // Customize as needed
      />
      <Stack.Screen
        name="MostHappening"
        component={MostHappening}
        options={{
          title: "MostHappening",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ForYou"
        component={ForYou}
        options={{
          title: "For You",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="TicketSales"
        component={TicketSales}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="VerifyAccountScreen"
        component={VerifyAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{
          title: "Create Event",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AllEvents"
        component={AllEvents}
        options={{
          title: "AllEvents",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="MyBookingsScreen"
        component={MyBookingsScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ContactUsScreen"
        component={ContactUsScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="PrivacyCenterScreen"
        component={PrivacyCenterScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="FAQScreen"
        component={FAQScreen}
        options={{
          title: "Event Details",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Filter"
        component={Filter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventParticipantsScreen"
        component={EventParticipantsScreen}
        options={{
          title: "Event Participants",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: "ChatRoom",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{
          title: "Requests",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

const RootStack = () => {
  const { token } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token === null || token === "" ? (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <Stack.Screen name="AppStack" component={AppStack} />
      )}
    </Stack.Navigator>
  );
};

const Navigation = () => (
  <NavigationContainer
    onReady={() => {
      console.log("Navigator is ready!");
    }}
    // linking={linking}
    // ref={navigationRef}
    // linking={{
    //   prefixes: ["matchmatters://"],
    //   config: {
    //     screens: {
    //       Home: "",
    //       ResetPassword: "reset-password",
    //     },
    //   },
    // }}
  >
    <RootStack />
  </NavigationContainer>
);

export default Navigation;

// Styles for the header components
// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between", // Ensure space between elements
//     // paddingHorizontal: 15, // Adjusted padding
//     // backgroundColor: "#0067FF",
//     height: 60, // Height of the header
//     width: "100%",
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logo: {
//     height: 60,
//     width: 120,
//   },
//   searchInput: {
//     height: 40,
//     flex: 1, // Makes the search bar take the remaining space
//     borderRadius: 10,
//     backgroundColor: "#f0f0f0",
//     paddingHorizontal: 10,
//     marginHorizontal: 20,
//     // marginLeft: 10, // Margin to separate from logo
//   },
//   filterIcon: {
//     marginRight: 10,
//   },
// });



const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensure space between elements
    paddingHorizontal: 5, // Adjusted padding
    // backgroundColor: "#290F4C",

    // height: 60, // Height of the header
    width: "100%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 120,
    color: "#fff",
  },
  searchInput: {
    height: 40,
    flex: 1, // Makes the search bar take the remaining space
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    marginHorizontal: 20,
    // marginLeft: 10, // Margin to separate from logo
  },
  filterIcon: {
    marginRight: 10,
  },
});