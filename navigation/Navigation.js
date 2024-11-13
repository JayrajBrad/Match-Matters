import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Import all screens
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const Navigation = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName="FeedScreen"
        screenOptions={({ route }) => ({
          tabBarShowLabel: true,
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            elevation: 0,
            height: 100,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 10,
            color: "#000",
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
        })}
      >
        <Tab.Screen
          name="FeedScreen"
          component={FeedScreen}
          options={{
            title: "Home",
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../assets/Match matters logo (1).png")}
                  style={{ width: 150, height: 40 }}
                  resizeMode="cover"
                />
              </View>
            ),
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="home"
                size={focused ? 30 : 25}
                color={focused ? "blue" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="LikedYou"
          component={LikedYou}
          options={{
            title: "Liked You",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="heart"
                size={focused ? 30 : 25}
                color={focused ? "blue" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="CreateEventScreen"
          component={CreateEventScreen}
          options={{
            title: "create event",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="heart"
                size={focused ? 30 : 25}
                color={focused ? "blue" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            title: "Chat",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="chat"
                size={focused ? 30 : 25}
                color={focused ? "blue" : "gray"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="account-circle"
                size={focused ? 30 : 25}
                color={focused ? "blue" : "gray"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          drawerStyle: {
            width: 250,
            backgroundColor: "#fff",
          },
        }}
      >
        <Drawer.Screen name="Home" component={TabNavigator} />
        <Drawer.Screen name="AllEvents" component={AllEvents} />
        <Drawer.Screen name="MyBookings" component={MyBookingsScreen} />
        <Drawer.Screen name="Help" component={HelpScreen} />
        <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
        <Drawer.Screen name="FAQ" component={FAQScreen} />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isShowSplash ? (
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreenView}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="StartScreen"
              component={StartScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
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
        <Stack.Screen
          name="HomeScreen"
          component={DrawerNavigator}
          options={{ headerShown: false }}
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
        {/* <Stack.Screen
          name="CityEventsScreen"
          component={CityEventsScreen}
          options={{
            title: "Events in City",
            headerShown: true,
            headerTitleAlign: "center",
          }}
        /> */}
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
          name="EmailLogin"
          component={EmailLogin}
          options={{
            title: "EmailLogin",
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
