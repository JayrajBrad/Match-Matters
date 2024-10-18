import { View, Text, StyleSheet, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Video } from 'expo-av';
import icon from "../assets/Match matters logo (1).png";

export default function Profile({ navigation }) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);


  return (
     <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.banner}>Likes</Text>
        <MaterialCommunityIcons name="view-dashboard-edit" color={"#000000"} size={40}  style={styles.filter} />       
      </View>


      <View style={styles.videoContainer}>
      <MaterialCommunityIcons name="eye" color={"#000000"} size={45} />
        <Text style = {styles.profileName}>You're sure to get noticed soon</Text>
        <Text style ={{fontSize:15,}}>In the meantime,increase your visibility to get you first likes</Text>
        </View>

   
        <View style={styles.premium}>
          <TouchableOpacity > 
            <View>
              <Text style={styles.premiumText}>Boost Your Profile</Text>
            </View>
            </TouchableOpacity>
          </View>
       
          <View style={styles.premium1}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}> 
              <Text style={styles.premiumText1}>Edit Your Profile</Text>
            </TouchableOpacity>
          </View>
        
          
    
     
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'absolute',
    // left: 10,
    top:40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#fff', 
  },
  banner: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  filter: {
    left:220,

  },
  videoContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120, 
    marginBottom: 10,
  },
  video: {
    width: '50%', 
    height: '30%', 
    borderRadius: 500, 
  },
  profileName:{
    marginTop:15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonEdit:{

  },
   premium:{
    marginTop: 40,
    padding: 25,
    left:40,
    paddingHorizontal: 20,
    backgroundColor: '#ffb3ba',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '10%',
   },
   premiumIcon: {
    marginRight: 10,
  },
   premiumText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  premium1:{
    marginTop: 40,
    marginBottom: 20,
    padding: 25,
    left:40,
    paddingHorizontal: 20,
    backgroundColor: '#bae1ff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
    width: '80%',
    height: '10%',
   },
   premiumIcon1: {
    marginRight: 10,
  },
   premiumText1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  
});
