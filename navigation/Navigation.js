import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Easing,
  Text,
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
import CheckoutPage from "../HomeScreens/CheckoutPage";
import EditEventScreen from "../drawer/EditEventScreen";
import CouponScreen from "../TabScreens/Tabcomponents/CouponScreen";

import { UserContext } from "./UserProvider";
import CustomBottomTab from "../TabScreens/Tabcomponents/CustomBottomTab";
import ForgotPasswordScreen from "../Screens/LoginScreens/ForgotPasswordScreen";
import ResetPasswordScreen from "../Screens/LoginScreens/ResetPasswordScreen";
// import * as Linking from "expo-linking";
import { navigationRef } from "./NavigationService";
import { color } from "react-native-elements/dist/helpers";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          elevation: 0,
          backgroundColor: "#290F4C",
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 10, color: "#fff" },
        tabBarIconStyle: { marginTop: 0 },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: "Home",
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),

          headerTitle: () => (
            <View style={styles.logoContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("MostHappening")}
                style={styles.filterIcon}
              >
                <MaterialCommunityIcons
                  name="fire" // Choose an appropriate icon
                  color="#fff"
                  size={24}
                />
              </TouchableOpacity>

              <Image
                source={require("../assets/MM - PNG.png")}
                style={styles.logo}
              />

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
                  color={filterVisible ? "#fff" : "#fff"}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#290F4C",
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
          headerTitle: () => (
            <Text
              style={{
                fontSize: 28,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Vibed
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#290F4C",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Event"
        component={CreateEventScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 28,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Create event
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
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
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 28,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Chats
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                position: "absolute",
                top: 10, // Adjust top alignment
                left: 5, // Adjust left alignment
                fontSize: 28,
                fontFamily: "CenturyGothicBold",
                color: "#fff",
              }}
            >
              Profile
            </Text>
          ),
          headerStyle: {
            backgroundColor: "#290F4C", // Set background color of the header
            height: 60, // Adjust header height
          },
          // headerTitleStyle: {
          //   fontSize: 28,
          //   fontFamily: "CenturyGothicBold",
          //   color: "#333", // Text color
          // },
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
          {/* <Stack.Screen
            name="OnboardingScreen"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          /> */}

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
            // options={{
            //   title: "EmailLogin",
            //   headerShown: true,
            //   headerTitleAlign: "center",
            // }}
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
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Most Happening
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen name="ForYou" component={ForYou} />
      <Stack.Screen
        name="TicketSales"
        component={TicketSales}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Edit Profile
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
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
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              My events
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="EditEventScreen"
        component={EditEventScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Event Details
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
        }}
      />
      {/* <Stack.Screen
        name="AllEvents"
        component={AllEvents}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="CouponScreen"
        component={CouponScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Your Coupons
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
        }}
      />

      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              See the details
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="CheckoutPage"
        component={CheckoutPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyBookingsScreen"
        component={MyBookingsScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Booked Events
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle-outline"
              color={color}
              size={size}
            />
          ),
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
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Participants
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C", // Header background color
            elevation: 0, // Remove shadow for Android
            shadowOpacity: 0, // Remove shadow for iOS
            borderBottomWidth: 0, // Remove border for all platforms
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: "ChatRoom",
          headerShown: false,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontFamily: "CenturyGothicBold",
                color: "#fff", // Text color
                textAlign: "flex-start", // Center-align the text
                // width: "100%", // Ensure the text takes full width to align centrally
              }}
            >
              Requests
            </Text>
          ),
          headerStyle: {
            height: 60, // Adjust header height
            backgroundColor: "#290F4C",
          },
          headerTintColor: "#fff",
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
  >
    <RootStack />
  </NavigationContainer>
);

export default Navigation;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensure space between elements
    // paddingHorizontal: 5, // Adjusted padding
    backgroundColor: "#290F4C",

    // height: 60, // Height of the header
    width: "100%",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    width: "100%",
  },
  logo: {
    height: 30,
    width: 100,
    color: "#fff",
  },

  filterIcon: {
    marginRight: 10,
  },
});
