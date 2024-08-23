import { View, Text, StyleSheet, Image,  Animated } from 'react-native';
import icon from "./assets/Match matters logo.png";
import React, { useState, useEffect, useRef } from 'react';

export default function SplashScreenView() {

  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);


  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <View>
        <Image source={icon} style = {styles.image}/>
      </View>
      </Animated.View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'#1e1e1e',
    },
    image:{
        width: 355,
        height:155,
        resizeMode:"cover"
    }
});