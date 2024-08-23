
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Video } from 'expo-av';
import icon from "../assets/Match matters logo.png";
// import icon from "../assets/Match matters logo (1).png";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Login({ navigation }) {
  const [showSignInOptions, setShowSignInOptions] = useState(false);
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
   <Video
        source={require('../assets/sv1.mp4')} 
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <View style={styles.logoWrapper}>
          <Image source={icon} style={styles.image} />
          <Text style={styles.tagLine}>(Tagline For match matters)</Text>
        </View>

     

        {!showSignInOptions ? (
          <View style={styles.buttonWrapper}>
               <TouchableOpacity onPress={() => navigation.navigate("LastScreen")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Trial</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SignNumber")}>
              <View style={styles.button1}>
                <Text style={styles.buttonText1}>Create Account</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSignInOptions(true)}>
              <View style={{ ...styles.button, backgroundColor: "#BF1013" }}>
                <Text style={styles.buttonText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => console.log("Sign in with Apple")}>
              <View style={styles.appleButton}>
                <Icon name="apple" size={20} color="#fff" />
                <Text style={styles.buttonText}>Sign in with Apple</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignEmail")}>
              <View style={styles.googleButton}>
                <Icon name="google" size={20} color="#000" />
                <Text style={{ ...styles.buttonText, color: "#000" }}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("Sign in with Facebook")}>
              <View style={styles.button}>
                <Icon name="facebook" size={20} color="#fff" />
                <Text style={styles.buttonText}>Sign in with Facebook</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignNumber")}>
              <View style={styles.phoneButton}>
                <Text style={styles.buttonText}>Sign in with Phone Number</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSignInOptions(false)}>
              <View style={styles.backButton}>
                <Text style={{ ...styles.buttonText, color: "black" }}>Back</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    position: 'absolute',
    top: 90,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 260,
    height: 115,
    resizeMode: "cover",
  },
  tagLine: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: "#BF1013",
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  button1: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  appleButton: {
    flexDirection: 'row',
    backgroundColor: "#1e1e1e",
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    borderColor: '#C0C0C0',
    borderWidth: 1,
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  phoneButton: {
    flexDirection: 'row',
    backgroundColor: "#702963",
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  backButton: {
    backgroundColor: "#fff",
    height: 50,
    marginHorizontal: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
    color: 'white',
    marginLeft: 10,
  },
  buttonText1: {
    fontSize: 20,
    fontWeight: "500",
    color: '#BF1013',
    marginLeft: 10,
  },
});
