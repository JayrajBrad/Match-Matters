// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import 'react-native-gesture-handler';

// import SplashScreenView from './SplashScreenView';
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import ForYou from './HomeScreens/ForYou';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';
// import DrawerContent from './HomeScreens/DrawerContent';  // import custom drawer content

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   const MainStackNavigator = () => (
//     <Stack.Navigator>
//       {isShowSplash ? (
//         <Stack.Screen
//           name="SplashScreen"
//           component={SplashScreenView}
//           options={{ headerShown: false }}
//         />
//       ) : (
//         <>
//           <Stack.Screen
//             name="StartScreen"
//             component={StartScreen}
//             options={{ headerShown: false }}
//           />
//           <Stack.Screen
//             name="Login"
//             component={Login}
//             options={{ headerShown: false }}
//           />
//         </>
//       )}
//       <Stack.Screen
//         name="SignNumber"
//         component={SignNumber}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="OtpScreen"
//         component={OtpScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SignEmail"
//         component={SignEmail}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="NamePage"
//         component={NamePage}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="AgeScreen"
//         component={AgeScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="ProfilePicScreen"
//         component={ProfilePicScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="PreferenceScreen"
//         component={PreferenceScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="LastScreen"
//         component={LastScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="HomeScreen"
//         component={TabNavigator}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );

//   const TabNavigator = () => (
//     <Tab.Navigator
//       initialRouteName='FeedScreen'
//       screenOptions={{
//         tabBarStyle: {
//           height: 90,
//           backgroundColor: 'white',
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "bold"
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//           marginTop: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: 'People',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="home" color={"#4099FF"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="account" color={"#4099FF"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: 'Liked',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="heart" color={"#4099FF"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="chat" color={"#4099FF"} size={40} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: 'ForYou',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star-check" color={"#4099FF"} size={40} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );

//   return (
//     <NavigationContainer>
//       <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="Main">
//         <Drawer.Screen name="Main" component={MainStackNavigator} options={{ headerShown: false }} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// Main Code

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Image } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import SplashScreenView from './SplashScreenView';
// // import OnboardingCarousel from './Screens/OnboardingCarousel ';
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// //import EmailOTPScreen from './Screens/EmailOTPScreen';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import ForYou from './HomeScreens/ForYou';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';
// import 'react-native-gesture-handler';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const App = () => {

//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     },2000);

//   })

//    return (
//     <NavigationContainer>
//        <Stack.Navigator>
//        {isShowSplash ? (
//       <Stack.Screen
//         name="SplashScreen"
//         component={SplashScreenView}
//         options={{ headerShown: false }}
//       />
//     ) : (
//       <>

//          <Stack.Screen
//     name="StartScreen"
//     component={StartScreen}
//     options={{ headerShown: false }}
//   />
//       <Stack.Screen
//         name="Login"
//         component={Login}
//         options={{ headerShown: false }}
//       />

//     </>

//     )}

//       <Stack.Screen
//         name="SignNumber"
//         component={SignNumber}
//         options={{ headerShown: false }}
//       />
//         <Stack.Screen
//         name="OtpScreen"
//         component={OtpScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="SignEmail"
//         component={SignEmail}
//         options={{ headerShown: false }}
//       />
//        {/* <Stack.Screen
//         name="EmailOTPScreen"
//         component={EmailOTPScreen}
//         options={{ headerShown: false }}
//       /> */}
//         <Stack.Screen
//         name="NamePage"
//         component={NamePage}
//         options={{ headerShown: false }}
//       />
//        <Stack.Screen
//         name="AgeScreen"
//         component={AgeScreen}
//         options={{ headerShown: false }}
//       />
//        <Stack.Screen
//         name="ProfilePicScreen"
//         component={ProfilePicScreen}
//         options={{ headerShown: false }}
//       />
//          <Stack.Screen
//         name="PreferenceScreen"
//         component={PreferenceScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//       name='LastScreen'
//       component={LastScreen}
//       options={{ headerShown: false }}
//       />
//       <Stack.Screen
//       name='HomeScreen'
//       component={TabNavigator}
//       options={{ headerShown: false }}
//       />

//        </Stack.Navigator>
//     </NavigationContainer>

//    );

// }

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//     initialRouteName='HomeScreen'
//     screenOptions={{
//       tabBarStyle: {
//         height: 90,
//         backgroundColor: 'white',
//       },
//       tabBarLabelStyle: {
//         fontSize: 12,
//         fontWeight: "bold"
//       },
//       tabBarIconStyle: {
//         marginBottom: 5,
//         marginTop:5,
//       },
//     }}
//     >
//         <Tab.Screen name = "FeedScreen"
//       component={FeedScreen}
//       options={{
//         title: 'People',
//         tabBarIcon: ({focused}) => (
//           <MaterialCommunityIcons name="home" color={"#4099FF"} size={40} />
//         ),
//         headerShown: false,
//       }}
//       />
//       <Tab.Screen name = "Profile"
//       component={Profile}
//       options={{
//         title: 'Profile',
//         tabBarIcon: ({focused}) => (
//           <MaterialCommunityIcons name="account" color={"#4099FF"} size={40} />
//         ),
//         headerShown: false,
//       }}
//       />
//        <Tab.Screen name = "Liked"
//       component={LikedYou}
//       options={{
//         title: 'Liked',
//         tabBarIcon: ({focused}) => (
//           <MaterialCommunityIcons name="heart" color={"#4099FF"} size={40} />
//         ),
//         headerShown: false,
//       }}
//       />
//         <Tab.Screen name = "Chat"
//       component={Chat}
//       options={{
//         title: 'Chat',
//         tabBarIcon: ({focused}) => (
//           <MaterialCommunityIcons name="chat" color={"#4099FF"} size={40} />
//         ),
//       }}
//       />

// <Tab.Screen name = "ForYou"
//       component={ForYou}
//       options={{
//         title: 'ForYou',
//         tabBarIcon: ({focused}) => (
//           <MaterialCommunityIcons name="star-check" color={"#4099FF"} size={40} />
//         ),
//       }}
//       />
//     </Tab.Navigator>
//   )
// }

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// });

// 1st july, 1st changes

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Image } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import SplashScreenView from './SplashScreenView';
// // Importing all the required screens
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// //import EmailOTPScreen from './Screens/EmailOTPScreen';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import ForYou from './HomeScreens/ForYou';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';

// // Create Stack and Tab navigators
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// const App = () => {
//   // State to manage splash screen visibility
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   // Effect to hide splash screen after 2 seconds
//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
//             />
//           </>
//         )}
//         {/* Add other screens to the stack navigator */}
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
//         {/* <Stack.Screen
//           name="EmailOTPScreen"
//           component={EmailOTPScreen}
//           options={{ headerShown: false }}
//         /> */}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={TabNavigator}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// // Tab navigator containing bottom tab navigation
// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName='FeedScreen'
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown:false,
//         tabBarStyle: {
//           position: "relative",
//           height: 95,
//           bottom: 0,
//           right: 0,
//           left: 0,
//           elevation: 0,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,

//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 10,
//           fontWeight: "black",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//           marginTop: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: 'People',

//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,

//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="account" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: 'Liked',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="heart" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="chat" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: 'ForYou',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star-check" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// export default App;

// // Optional styles
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center'
// //   }
// // });

// 1st july, 2nd changes(drawer navigation)

// import React, { useEffect, useState } from 'react';
// import { StyleSheet } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import SplashScreenView from './SplashScreenView';
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import ForYou from './HomeScreens/ForYou';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';

// // Create Stack, Tab, and Drawer navigators
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName='FeedScreen'
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "relative",
//           height: 95,
//           bottom: 0,
//           right: 0,
//           left: 0,
//           elevation: 0,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 10,
//           fontWeight: "black",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//           marginTop: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: 'People',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="account" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: 'Liked',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="heart" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="chat" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: 'ForYou',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star-check" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//       drawerContentOptions={{
//         activeTintColor: '#e91e63',
//         itemStyle: { marginVertical: 5 },
//       }}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//     </Drawer.Navigator>
//   );
// }

// export default App;

// 1st july, 2nd changes(drawer navigation 2nd)

// import React, { useEffect, useState } from 'react';
// import { StyleSheet } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import SplashScreenView from './SplashScreenView';
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import MostHappening from './HomeScreens/MostHappening';
// import ForYou from './HomeScreens/ForYou';
// //import MostHappening1 from './HomeScreens/MostHappening';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';

// // Create Stack, Tab, and Drawer navigators
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MostHappening"
//           component={MostHappening}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName='FeedScreen'
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "relative",
//           height: 95,
//           bottom: 0,
//           right: 0,
//           left: 0,
//           elevation: 0,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 10,
//           fontWeight: "black",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//           marginTop: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: 'People',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="account" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: 'Liked',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="heart" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />

//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="chat" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: 'ForYou',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star-check" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//       drawerContentOptions={{
//         activeTintColor: '#e91e63',
//         itemStyle: { marginVertical: 5 },
//       }}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//     </Drawer.Navigator>
//   );
// }

// export default App;

//1st july, 2nd changes(drawer navigation 3rd)

// import React, { useEffect, useState } from 'react';
// import { StyleSheet } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import SplashScreenView from './SplashScreenView';
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import ForYou from './HomeScreens/ForYou';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';

// // Create Stack, Tab, and Drawer navigators
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName='FeedScreen'
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "relative",
//           height: 95,
//           bottom: 0,
//           right: 0,
//           left: 0,
//           elevation: 0,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 10,
//           fontWeight: "black",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//           marginTop: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: 'People',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="account" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: 'Liked',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="heart" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="chat" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: 'ForYou',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star-check" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//     </Drawer.Navigator>
//   );
// }

// export default App;

// 3rd july chnages

// import React, { useEffect, useState } from 'react';
// import { StyleSheet } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import SplashScreenView from './SplashScreenView';
// import Login from './Screens/Login';
// import SignNumber from './Screens/SignNumber';
// import OtpScreen from './Screens/OtpScreen';
// import SignEmail from './Screens/SignEmail';
// import NamePage from './Screens/NamePage';
// import AgeScreen from './Screens/AgeScreen';
// import ProfilePicScreen from './Screens/ProfilePicScreen';
// import PreferenceScreen from './Screens/PreferenceScreen';
// import FeedScreen from './HomeScreens/FeedScreen';
// import Profile from './HomeScreens/Profile';
// import LikedYou from './HomeScreens/LikedYou';
// import Chat from './HomeScreens/Chat';
// import MostHappening from './HomeScreens/MostHappening';
// import ForYou from './HomeScreens/ForYou';
// import LastScreen from './Screens/LastScreen';
// import StartScreen from './Screens/StartScreen';
// import DrawerContent from './HomeScreens/DrawerContent'; // Import the new DrawerContent file
// //import Radius from './HomeScreens/Radius';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MostHappening"
//           component={MostHappening}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName='FeedScreen'
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "relative",
//           height: 95,
//           bottom: 0,
//           right: 0,
//           left: 0,
//           elevation: 0,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 10,
//           fontWeight: "black",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//           marginTop: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: 'People',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="account" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: 'Liked',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="heart" color={"#BF1013"} size={40} />
//           ),
//           headerShown: false,
//         }}
//       />

//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="chat" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: 'ForYou',
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons name="star-check" color={"#BF1013"} size={40} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//       drawerContent={(props) => <DrawerContent {...props} />}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//     </Drawer.Navigator>
//   );
// }

// export default App;

// 5th july, tan navigation update

// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, Image } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import SplashScreenView from "./SplashScreenView";
// import Login from "./Screens/Login";
// import SignNumber from "./Screens/SignNumber";
// import OtpScreen from "./Screens/OtpScreen";
// import SignEmail from "./Screens/SignEmail";
// import NamePage from "./Screens/NamePage";
// import AgeScreen from "./Screens/AgeScreen";
// import ProfilePicScreen from "./Screens/ProfilePicScreen";
// import PreferenceScreen from "./Screens/PreferenceScreen";
// import FeedScreen from "./HomeScreens/FeedScreen";
// import Profile from "./HomeScreens/Profile";
// import LikedYou from "./HomeScreens/LikedYou";
// import Chat from "./HomeScreens/Chat";
// import MostHappening from "./HomeScreens/MostHappening";
// import ForYou from "./HomeScreens/ForYou";
// import LastScreen from "./Screens/LastScreen";
// import StartScreen from "./Screens/StartScreen";
// import DrawerContent from "./HomeScreens/DrawerContent"; // Import the new DrawerContent file
// import TicketSales from "./HomeScreens/TicketSales";
// import Radius from "./HomeScreens/Radius";



// //import Connection from './assets/Connection.png'

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MostHappening"
//           component={MostHappening}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="TicketSales"
//           component={TicketSales}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Radius"
//           component={Radius}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="FeedScreen"
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "absolute",
//           height: 80,
//           bottom: 10,
//           left: 10,
//           right: 10,
//           elevation: 0,
//           backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent background
//           borderRadius: 20,
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 5,
//           fontWeight: "bold",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: "People",
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons
//               name="star"
//               color={focused ? "#FF5A5F" : "#BF1013"}
//               size={30}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons
//               name="account"
//               color={focused ? "#FF5A5F" : "#BF1013"}
//               size={30}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: "Liked",
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons
//               name="heart"
//               color={focused ? "#FF5A5F" : "#BF1013"}
//               size={30}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: "Chat",
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons
//               name="chat"
//               color={focused ? "#FF5A5F" : "#BF1013"}
//               size={30}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: "For You",
//           tabBarIcon: ({ focused }) => (
//             <MaterialCommunityIcons
//               name="star-check"
//               color={focused ? "#FF5A5F" : "#BF1013"}
//               size={30}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//       drawerContent={(props) => <DrawerContent {...props} />}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//     </Drawer.Navigator>
//   );
// };

// export default App;












//10th of july, tab navigation screen icon






// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, Image } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import SplashScreenView from "./SplashScreenView";
// import Login from "./Screens/Login";
// import SignNumber from "./Screens/SignNumber";
// import OtpScreen from "./Screens/OtpScreen";
// import SignEmail from "./Screens/SignEmail";
// import NamePage from "./Screens/NamePage";
// import AgeScreen from "./Screens/AgeScreen";
// import ProfilePicScreen from "./Screens/ProfilePicScreen";
// import PreferenceScreen from "./Screens/PreferenceScreen";
// import FeedScreen from "./HomeScreens/FeedScreen";
// import Profile from "./HomeScreens/Profile";
// import LikedYou from "./HomeScreens/LikedYou";
// import Chat from "./HomeScreens/Chat";
// import MostHappening from "./HomeScreens/MostHappening";
// import ForYou from "./HomeScreens/ForYou";
// import LastScreen from "./Screens/LastScreen";
// import StartScreen from "./Screens/StartScreen";
// import DrawerContent from "./HomeScreens/DrawerContent"; // Import the new DrawerContent file
// import TicketSales from "./HomeScreens/TicketSales";
// import Radius from "./HomeScreens/Radius";
// import EditProfileScreen from "./HomeScreens/EditProfileScreen";
// //import VerifyAccountScreen from "./HomeScreens/VerifyAccount";
// import MyEventsScreen from "./HomeScreens/MyEventsScreen";

// import VerifyAccountScreen from "./HomeScreens/VerifyAccountScreen";

// // Import custom icons
// import Connection from './assets/Connection.png'
// import Prefrances from './assets/Prefrances.png'
// import schedule from './assets/schedule.png'
// import Connections from './assets/Connections.png'
// import ProfileImage from './assets/ProfileImage.png'
// import homeicon from './assets/homeicon.png'


// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MostHappening"
//           component={MostHappening}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="TicketSales"
//           component={TicketSales}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Radius"
//           component={Radius}
//           options={{ headerShown: false }}
//         />
//          <Stack.Screen
//           name="EditProfileScreen"
//           component={EditProfileScreen}
//           options={{ headerShown: false }}
//         />
//         {/* <Stack.Screen
//           name="VerifyAccountScreen"
//           component={VerifyAccountScreen}
//           options={{ headerShown: false }}
//         /> */}
//         <Stack.Screen
//           name="VerifyAccountScreen"
//           component={VerifyAccountScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MyEventsScreen"
//           component={MyEventsScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="FeedScreen"
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "absolute",
//           height: 80,
//           bottom: 10,
//           left: 10,
//           right: 10,
//           elevation: 0,
//           backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent background
//           borderRadius: 20,
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 5,
//           fontWeight: "bold",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: "People",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={Prefrances}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={schedule}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: "Liked",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={homeicon}
//               style={{ width: 30, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: "Chat",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={Connections}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: "For You",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={ProfileImage}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//       drawerContent={(props) => <DrawerContent {...props} />}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//     </Drawer.Navigator>
//   );
// };

// export default App;









//31st july,2024 -----------------------Drawer items navigation














// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, Image } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import SplashScreenView from "./SplashScreenView";
// import Login from "./Screens/Login";
// import SignNumber from "./Screens/SignNumber";
// import OtpScreen from "./Screens/OtpScreen";
// import SignEmail from "./Screens/SignEmail";
// import NamePage from "./Screens/NamePage";
// import AgeScreen from "./Screens/AgeScreen";
// import ProfilePicScreen from "./Screens/ProfilePicScreen";
// import PreferenceScreen from "./Screens/PreferenceScreen";
// import FeedScreen from "./HomeScreens/FeedScreen";
// import Profile from "./HomeScreens/Profile";
// import LikedYou from "./HomeScreens/LikedYou";
// import Chat from "./HomeScreens/Chat";
// import MostHappening from "./HomeScreens/MostHappening";
// import ForYou from "./HomeScreens/ForYou";
// import LastScreen from "./Screens/LastScreen";
// import StartScreen from "./Screens/StartScreen";
// import DrawerContent from "./HomeScreens/DrawerContent"; // Import the new DrawerContent file
// import TicketSales from "./HomeScreens/TicketSales";
// import Radius from "./HomeScreens/Radius";
// import EditProfileScreen from "./HomeScreens/EditProfileScreen";
// import VerifyAccountScreen from "./HomeScreens/VerifyAccountScreen";
// import MyEventsScreen from "./HomeScreens/MyEventsScreen";
// import NotificationsScreen from "./HomeScreens/NotificationsScreen";
// import MembershipScreen from "./HomeScreens/MembershipScreen";
// import MyBookingsScreen from "./HomeScreens/MyBookingsScreen";
// import HelpScreen from "./HomeScreens/HelpScreen";
// import PrivacyCenterScreen from "./HomeScreens/PrivacyCenterScreen";
// import ContactUsScreen from "./HomeScreens/ContactUsScreen";
// import FAQScreen from "./HomeScreens/FAQScreen";


// // Import custom icons
// import Connection from './assets/Connection.png';
// import Prefrances from './assets/Prefrances.png';
// import schedule from './assets/schedule.png';
// import Connections from './assets/Connections.png';
// import ProfileImage from './assets/ProfileImage.png';
// import homeicon from './assets/homeicon.png';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const App = () => {
//   const [isShowSplash, setIsShowSplash] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsShowSplash(false);
//     }, 2000);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isShowSplash ? (
//           <Stack.Screen
//             name="SplashScreen"
//             component={SplashScreenView}
//             options={{ headerShown: false }}
//           />
//         ) : (
//           <>
//             <Stack.Screen
//               name="StartScreen"
//               component={StartScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="Login"
//               component={Login}
//               options={{ headerShown: false }}
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
//         <Stack.Screen
//           name="LastScreen"
//           component={LastScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="HomeScreen"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MostHappening"
//           component={MostHappening}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="TicketSales"
//           component={TicketSales}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Radius"
//           component={Radius}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="EditProfileScreen"
//           component={EditProfileScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="VerifyAccountScreen"
//           component={VerifyAccountScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MyEventsScreen"
//           component={MyEventsScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       initialRouteName="FeedScreen"
//       screenOptions={{
//         tabBarShowLabel: true,
//         headerShown: false,
//         tabBarStyle: {
//           position: "absolute",
//           height: 80,
//           bottom: 10,
//           left: 10,
//           right: 10,
//           elevation: 0,
//           backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent background
//           borderRadius: 20,
//           borderTopWidth: 0,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 5,
//           fontWeight: "bold",
//         },
//         tabBarIconStyle: {
//           marginBottom: 5,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="FeedScreen"
//         component={FeedScreen}
//         options={{
//           title: "People",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={Prefrances}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={schedule}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Liked"
//         component={LikedYou}
//         options={{
//           title: "Liked",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={homeicon}
//               style={{ width: 30, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           title: "Chat",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={Connections}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ForYou"
//         component={ForYou}
//         options={{
//           title: "For You",
//           tabBarIcon: ({ focused }) => (
//             <Image
//               source={ProfileImage}
//               style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Home"
//       drawerPosition="right"
//       screenOptions={{ headerShown: false }}
//       drawerContent={(props) => <DrawerContent {...props} />}
//     >
//       <Drawer.Screen name="Home" component={TabNavigator} />
//       <Drawer.Screen name="Profile" component={Profile} />
//       <Drawer.Screen name="LikedYou" component={LikedYou} />
//       <Drawer.Screen name="Chat" component={Chat} />
//       <Drawer.Screen name="ForYou" component={ForYou} />
//       <Drawer.Screen name="MyEvents" component={MyEventsScreen} />
//       <Drawer.Screen name="Notifications" component={NotificationsScreen} />
//       <Drawer.Screen name="Membership" component={MembershipScreen} />
//       <Drawer.Screen name="MyBookings" component={MyBookingsScreen} />
//       <Drawer.Screen name="Help" component={HelpScreen} />
//       <Drawer.Screen name="PrivacyCenter" component={PrivacyCenterScreen} />
//       <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
//       <Drawer.Screen name="FAQs" component={FAQScreen} />
//     </Drawer.Navigator>
//   );
// };

// export default App;








import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreenView from "./SplashScreenView";
import Login from "./Screens/Login";
import SignNumber from "./Screens/SignNumber";
import OtpScreen from "./Screens/OtpScreen";
import SignEmail from "./Screens/SignEmail";
import NamePage from "./Screens/NamePage";
import AgeScreen from "./Screens/AgeScreen";
import ProfilePicScreen from "./Screens/ProfilePicScreen";
import PreferenceScreen from "./Screens/PreferenceScreen";
import FeedScreen from "./HomeScreens/FeedScreen";
import Profile from "./HomeScreens/Profile";
import LikedYou from "./HomeScreens/LikedYou";
import Chat from "./HomeScreens/Chat";
import MostHappening from "./HomeScreens/MostHappening";
import ForYou from "./HomeScreens/ForYou";
import LastScreen from "./Screens/LastScreen";
import StartScreen from "./Screens/StartScreen";
import DrawerContent from "./HomeScreens/DrawerContent"; // Import the new DrawerContent file
import TicketSales from "./HomeScreens/TicketSales";
import Radius from "./HomeScreens/Radius";
import EditProfileScreen from "./HomeScreens/EditProfileScreen";
import VerifyAccountScreen from "./HomeScreens/VerifyAccountScreen";
import MyEventsScreen from "./HomeScreens/MyEventsScreen";
import NotificationsScreen from "./HomeScreens/NotificationsScreen";
import MembershipScreen from "./HomeScreens/MembershipScreen";
import MyBookingsScreen from "./HomeScreens/MyBookingsScreen";
import HelpScreen from "./HomeScreens/HelpScreen";
import PrivacyCenterScreen from "./HomeScreens/PrivacyCenterScreen";
import ContactUsScreen from "./HomeScreens/ContactUsScreen";
import FAQScreen from "./HomeScreens/FAQScreen";
import CreateEventScreen from "./HomeScreens/CreateEventScreen";
import CityEventsScreen from "./HomeScreens/CityEventsScreen";
import EventDetailsScreen from "./HomeScreens/EventDetailsScreen";

// Import custom icons
import Connection from './assets/Connection.png';
import Prefrances from './assets/Prefrances.png';
import schedule from './assets/schedule.png';
import Connections from './assets/Connections.png';
import ProfileImage from './assets/ProfileImage.png';
import homeicon from './assets/homeicon.png';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);
  }, []);

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
          name="LastScreen"
          component={LastScreen}
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
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TicketSales"
          component={TicketSales}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Radius"
          component={Radius}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyAccountScreen"
          component={VerifyAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyEventsScreen"
          component={MyEventsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateEventScreen"
          component={CreateEventScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CityEventsScreen"
          component={CityEventsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventDetailsScreen"
          component={EventDetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="FeedScreen"
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          height: 80,
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 0,
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent background
          borderRadius: 20,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
          fontWeight: "bold",
        },
        tabBarIconStyle: {
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={{
          title: "People",
          tabBarIcon: ({ focused }) => (
            <Image
              source={Prefrances}
              style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
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
            <Image
              source={schedule}
              style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Liked"
        component={LikedYou}
        options={{
          title: "Liked",
          tabBarIcon: ({ focused }) => (
            <Image
              source={homeicon}
              style={{ width: 30, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <Image
              source={Connections}
              style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ForYou"
        component={ForYou}
        options={{
          title: "For You",
          tabBarIcon: ({ focused }) => (
            <Image
              source={ProfileImage}
              style={{ width: 40, height: 30, tintColor: focused ? "#FF5A5F" : "#BF1013" }}
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
      initialRouteName="Home"
      drawerPosition="right"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="LikedYou" component={LikedYou} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="ForYou" component={ForYou} />
      <Drawer.Screen name="MyEvents" component={MyEventsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Membership" component={MembershipScreen} />
      <Drawer.Screen name="MyBookings" component={MyBookingsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
      <Drawer.Screen name="PrivacyCenter" component={PrivacyCenterScreen} />
      <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
      <Drawer.Screen name="FAQs" component={FAQScreen} />
    </Drawer.Navigator>
  );
};

export default App;
