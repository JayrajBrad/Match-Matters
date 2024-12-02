// import React, { useState, useEffect, useContext } from "react";
// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   Easing,
//   searchText,
// } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import {
//   createNativeStackNavigator,
//   TransitionSpecs,
//   HeaderStyleInterpolators,
//   TransitionPresets,
// } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useNavigation } from "@react-navigation/native";
// import { CardStyleInterpolators } from "@react-navigation/stack";
// import { createSharedElementStackNavigator } from "react-navigation-shared-element";

// // Screen
// import SplashScreenView from "../SplashScreenView";
// import Login from "../Screens/Login";
// import SignNumber from "../Screens/SignNumber";
// import OtpScreen from "../Screens/OtpScreen";
// import SignEmail from "../Screens/SignEmail";
// import NamePage from "../Screens/NamePage";
// import AgeScreen from "../Screens/AgeScreen";
// import ProfilePicScreen from "../Screens/ProfilePicScreen";
// import PreferenceScreen from "../Screens/PreferenceScreen";
// import FeedScreen from "../TabScreens/FeedScreen";
// import Profile from "../TabScreens/Profile";
// import LikedYou from "../TabScreens/LikedYou";
// import ChatScreen from "../TabScreens/ChatScreen";
// import Chat from "../components/Chat";
// import MostHappening from "../HomeScreens/MostHappening";
// import ForYou from "../HomeScreens/ForYou";
// import LastScreen from "../Screens/LastScreen";
// import StartScreen from "../Screens/StartScreen";
// import OnboardingScreen from "../Onboarding-Screen-2/OnboardingScreen";
// import DrawerContent from "../drawer/DrawerContent";
// import TicketSales from "../HomeScreens/TicketSales";
// import EditProfileScreen from "../HomeScreens/EditProfileScreen";
// import VerifyAccountScreen from "../HomeScreens/VerifyAccountScreen";
// import MyEventsScreen from "../drawer/MyEventsScreen";
// import NotificationsScreen from "../HomeScreens/NotificationsScreen";
// import AllEvents from "../drawer/AllEvents";
// import MyBookingsScreen from "../drawer/MyBookingsScreen";
// import HelpScreen from "../policy/HelpScreen";
// import PrivacyCenterScreen from "../policy/PrivacyCenterScreen";
// import ContactUsScreen from "../policy/ContactUsScreen";
// import FAQScreen from "../policy/FAQScreen";
// import CreateEventScreen from "../TabScreens/CreateEventScreen";
// import CityEventsScreen from "../HomeScreens/CityEventsScreen";
// import EventDetailsScreen from "../HomeScreens/EventDetailsScreen";
// import SignPassword from "../Screens/SignPassword";
// import ChatRoom from "../TabScreens/ChatRoom";
// import Filter from "../components/FilterComponent";
// import EventParticipantsScreen from "../TabScreens/EventParticipants";
// import EmailLogin from "../Screens/LoginScreens/EmailLogin";
// import RequestScreen from "../TabScreens/RequestScreen";
// import { UserContext } from "./UserProvider";
// import CustomBottomTab from "../TabScreens/Tabcomponents/CustomBottomTab";

// const Stack = createNativeStackNavigator();
// // const Stack = createSharedElementStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const Navigation = () => {
//   const { token, setToken } = useContext(UserContext);
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   const CustomBottomTabs = (props) => {
//     return <CustomBottomTab {...props} />;
//   };

//   function BottomTabs() {
//     const navigation = useNavigation();
//     const [showFilters, setShowFilters] = useState(false);
//     return (
//       <Tab.Navigator
//         // initialRouteName="FeedScreen"
//         tabBar={(props) => <CustomBottomTabs {...props} />}
//         // screenOptions={{ headerShown: false }}
//         screenOptions={({ route }) => ({
//           tabBarShowLabel: true,
//           tabBarStyle: { height: 100, position: "absolute", elevation: 0 },
//           tabBarLabelStyle: { fontSize: 12, marginBottom: 10, color: "#000" },
//           tabBarIconStyle: { marginTop: 10 },
//         })}
//       >
//         <Tab.Screen
//           name="FeedScreen"
//           options={{
//             title: "FeedScreen",
//             headerTitle: () => (
//               <View style={styles.headerContainer}>
//                 {/* Drawer Icon */}
//                 <TouchableOpacity onPress={() => navigation.openDrawer()}>
//                   <MaterialCommunityIcons
//                     name="menu"
//                     color={"#000"}
//                     size={30}
//                   />
//                 </TouchableOpacity>

//                 {/* Search Bar */}
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search Events"
//                   value={searchText}
//                   // Add an onChangeText handler here if needed
//                 />

//                 {/* Filter Icon */}
//                 <TouchableOpacity
//                   onPress={() => setShowFilters(!showFilters)}
//                   style={styles.filterIcon}
//                 >
//                   <MaterialCommunityIcons
//                     name="account-filter"
//                     color={"#000"}
//                     size={30}
//                   />
//                 </TouchableOpacity>
//               </View>
//             ),
//           }}
//         >
//           {() => (
//             <FeedScreen
//               showFilters={showFilters}
//               setShowFilters={setShowFilters}
//             />
//           )}
//         </Tab.Screen>

//         <Tab.Screen
//           name="Vibed"
//           component={LikedYou}
//           options={{
//             title: "Liked You",
//           }}
//         />
//         <Tab.Screen
//           name="Event"
//           component={CreateEventScreen}
//           options={{
//             title: "Create Event",
//           }}
//         />
//         <Tab.Screen
//           name="Chat"
//           component={ChatScreen}
//           options={{
//             title: "Chat",
//           }}
//         />
//         <Tab.Screen
//           name="Profile"
//           component={Profile}
//           options={{
//             title: "Profile",
//           }}
//         />
//       </Tab.Navigator>
//     );
//   }

//   const DrawerNavigator = () => {
//     return (
//       <Drawer.Navigator
//         drawerContent={(props) => <DrawerContent {...props} />}
//         screenOptions={{ headerShown: false, drawerStyle: { width: 250 } }}
//       >
//         <Drawer.Screen name="HomeTabs" component={BottomTabs} />
//         {/* <Drawer.Screen
//           name="AllEvents"
//           component={AllEvents}
//           options={{
//             title: "AllEvents",
//             headerShown: true,
//             headerTitleAlign: "center",
//             headerBackTitleVisible: false,
//           }}
//         /> */}
//         <Drawer.Screen
//           name="MyBookings"
//           component={MyBookingsScreen}
//           options={{
//             title: "My Bookings",
//             headerShown: true,
//             headerTitleAlign: "center",
//           }}
//         />
//         <Drawer.Screen name="Help" component={HelpScreen} />
//         <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
//         <Drawer.Screen name="FAQ" component={FAQScreen} />
//       </Drawer.Navigator>
//     );
//   };

//   function AuthStack() {
//     return (
//       <Stack.Navigator
//         screenOptions={{
//           headerShown: false,
//           // gestureEnabled: true,
//           // gestureDirection: "horizontal",
//           // cardStyleInterpolator:
//           //   CardStyleInterpolators.forFadeFromBottomAndroid,
//         }}
//       >
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             {/* <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             /> */}
//             <Stack.Screen
//               name="OnboardingScreen"
//               component={OnboardingScreen}
//               options={{ headerShown: false }}
//             />

//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{
//                 headerShown: false,
//                 // gestureEnabled: true,
//                 // gestureDirection: "horizontal",
//                 // ...TransitionPresets.ModalSlideFromBottomIOS,
//               }}
//             />
//             <Stack.Screen
//               name="EmailLogin"
//               component={EmailLogin}
//               options={{
//                 title: "EmailLogin",
//                 headerShown: true,
//                 headerTitleAlign: "center",
//                 // gestureEnabled: true,
//                 // gestureDirection: "horizontal",
//                 // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
//               }}
//             />
//           </>
//         )}
//         <Stack.Screen
//           name="SignNumber"
//           component={SignNumber}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="OtpScreen"
//           component={OtpScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="SignEmail"
//           component={SignEmail}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="SignPassword"
//           component={SignPassword}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="NamePage"
//           component={NamePage}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AgeScreen"
//           component={AgeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ProfilePicScreen"
//           component={ProfilePicScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="PreferenceScreen"
//           component={PreferenceScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     );
//   }

//   function AppStack() {
//     const [isShowSplash, setIsShowSplash] = useState(true);

//     useEffect(() => {
//       setTimeout(() => setIsShowSplash(false), 2000);
//     }, []);

//     return (
//       <Stack.Navigator>
//         {/* <Stack.Screen
//           name="Main"
//           component={BottomTabs}
//           options={{ headerShown: false }}
//         /> */}
//         <Stack.Screen
//           name="MainDrawer"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="PreferenceScreen"
//           component={PreferenceScreen}
//           options={{ headerShown: true, headerTitleAlign: "center" }} // Customize as needed
//         />
//         <Stack.Screen
//           name="FeedScreen"
//           component={FeedScreen}
//           options={{ headerShown: false }} // Customize as needed
//         />
//         <Stack.Screen
//           name="MostHappening"
//           component={MostHappening}
//           options={{
//             title: "MostHappening",
//             headerShown: true,
//             headerTitleAlign: "center",
//             headerBackTitleVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="ForYou"
//           component={ForYou}
//           options={{
//             title: "For You",
//             headerShown: true,
//             headerTitleAlign: "center",
//             headerBackTitleVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="TicketSales"
//           component={TicketSales}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="EditProfileScreen"
//           component={EditProfileScreen}
//           options={{
//             title: "Edit Profile",
//             headerShown: true,
//             headerTitleAlign: "center",
//             headerBackTitleVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="VerifyAccountScreen"
//           component={VerifyAccountScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MyEvents"
//           component={MyEventsScreen}
//           options={{
//             title: "Create Event",
//             headerShown: true,
//             headerTitleAlign: "center",
//             headerBackTitleVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="AllEvents"
//           component={AllEvents}
//           options={{
//             title: "AllEvents",
//             headerShown: true,
//             headerTitleAlign: "center",
//             headerBackTitleVisible: false,
//           }}
//         />
//         <Stack.Screen
//           name="EventDetailsScreen"
//           component={EventDetailsScreen}
//           // sharedElements={(route) => {
//           //   const { eventId } = route.params;
//           //   return [`event.${eventId}.image`];
//           // }}
//           options={{
//             title: "Event Details",
//             headerShown: true,
//             headerTitleAlign: "center",
//           }}
//         />
//         <Stack.Screen
//           name="Filter"
//           component={Filter}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="EventParticipantsScreen"
//           component={EventParticipantsScreen}
//           options={{
//             title: "Event Participants",
//             headerShown: true,
//             headerTitleAlign: "center",
//           }}
//         />

//         <Stack.Screen
//           name="ChatRoom"
//           component={ChatRoom}
//           options={{
//             title: "ChatRoom",
//             headerShown: true,
//             headerTitleAlign: "center",
//           }}
//         />
//         <Stack.Screen
//           name="RequestScreen"
//           component={RequestScreen}
//           options={{
//             title: "Requests",
//             headerShown: true,
//             headerTitleAlign: "center",
//           }}
//         />
//       </Stack.Navigator>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {token === null || token === "" ? <AuthStack /> : <AppStack />}
//     </NavigationContainer>
//   );
// };

// export default Navigation;

// // Styles for the header components
// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     // backgroundColor: "#0067FF",
//   },
//   searchInput: {
//     // flex: 1,
//     height: 40,
//     width: 250,
//     borderRadius: 10,
//     backgroundColor: "#f0f0f0",
//     marginHorizontal: 10,
//     paddingHorizontal: 10,
//   },
//   filterIcon: {
//     marginLeft: 10,
//   },
// });

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
import LastScreen from "../Screens/LastScreen";
import StartScreen from "../Screens/StartScreen";
import OnboardingScreen from "../Onboarding-Screen-2/OnboardingScreen";
import DrawerContent from "../drawer/DrawerContent";
import TicketSales from "../HomeScreens/TicketSales";
import EditProfileScreen from "../HomeScreens/EditProfileScreen";
import VerifyAccountScreen from "../HomeScreens/VerifyAccountScreen";
import MyEventsScreen from "../drawer/MyEventsScreen";
import NotificationsScreen from "../HomeScreens/NotificationsScreen";
import AllEvents from "../drawer/AllEvents";
import MyBookingsScreen from "../drawer/MyBookingsScreen";
import HelpScreen from "../policy/HelpScreen";
import PrivacyCenterScreen from "../policy/PrivacyCenterScreen";
import ContactUsScreen from "../policy/ContactUsScreen";
import FAQScreen from "../policy/FAQScreen";
import CreateEventScreen from "../TabScreens/CreateEventScreen";
import CityEventsScreen from "../HomeScreens/CityEventsScreen";
import EventDetailsScreen from "../HomeScreens/EventDetailsScreen";
import SignPassword from "../Screens/SignPassword";
import ChatRoom from "../TabScreens/ChatRoom";
import Filter from "../components/FilterComponent";
import EventParticipantsScreen from "../TabScreens/EventParticipants";
import EmailLogin from "../Screens/LoginScreens/EmailLogin";
import RequestScreen from "../TabScreens/RequestScreen";
import { UserContext } from "./UserProvider";
import CustomBottomTab from "../TabScreens/Tabcomponents/CustomBottomTab";

const Stack = createNativeStackNavigator();
// const Stack = createSharedElementStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomBottomTabs = (props) => {
  return <CustomBottomTab {...props} />;
};

const BottomTabs = () => {
  const navigation = useNavigation();
  const [showFilters, setShowFilters] = useState(false);
  return (
    <Tab.Navigator
      // initialRouteName="FeedScreen"
      tabBar={(props) => <CustomBottomTabs {...props} />}
      // screenOptions={{ headerShown: false }}
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarStyle: { height: 100, position: "absolute", elevation: 0 },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 10, color: "#000" },
        tabBarIconStyle: { marginTop: 10 },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: "FeedScreen",
          headerTitle: () => (
            <View style={styles.headerContainer}>
              {/* Drawer Icon */}
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <MaterialCommunityIcons name="menu" color={"#000"} size={30} />
              </TouchableOpacity>

              {/* Search Bar */}
              <TextInput
                style={styles.searchInput}
                placeholder="Search Events"
                value={searchText}
                // Add an onChangeText handler here if needed
              />

              {/* Filter Icon */}
              <TouchableOpacity
                onPress={() => setShowFilters(!showFilters)}
                style={styles.filterIcon}
              >
                <MaterialCommunityIcons
                  name="account-filter"
                  color={"#000"}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        {() => (
          <FeedScreen
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Vibed"
        component={LikedYou}
        options={{
          title: "Liked You",
        }}
      />
      <Tab.Screen
        name="Event"
        component={CreateEventScreen}
        options={{
          title: "Create Event",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: "Chat",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 250 } }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
      {/* <Drawer.Screen
        name="AllEvents"
        component={AllEvents}
        options={{
          title: "AllEvents",
          headerShown: true,
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      /> */}
      <Drawer.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          title: "My Bookings",
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
      <Drawer.Screen name="FAQ" component={FAQScreen} />
    </Drawer.Navigator>
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
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // gestureDirection: "horizontal",
        // cardStyleInterpolator:
        //   CardStyleInterpolators.forFadeFromBottomAndroid,
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
              // gestureEnabled: true,
              // gestureDirection: "horizontal",
              // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsShowSplash(false), 2000);
  }, []);

  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="MainDrawer"
        component={DrawerNavigator}
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
        // sharedElements={(route) => {
        //   const { eventId } = route.params;
        //   return [`event.${eventId}.image`];
        // }}
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

const Navigation = () => {
  const { token, setToken } = useContext(UserContext);
  const handleLogin = () => {
    setToken("token"); // Set token upon successful login
    // Any other logic needed on login
  };
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      {token === null || token === "" ? (
        <AuthStack /> // Pass the function to AuthStack
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default Navigation;

// Styles for the header components
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    // backgroundColor: "#0067FF",
  },
  searchInput: {
    // flex: 1,
    height: 40,
    width: 250,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  filterIcon: {
    marginLeft: 10,
  },
});
