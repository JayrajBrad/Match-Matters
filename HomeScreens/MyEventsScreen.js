import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//import CreateEventScreen from './CreateEventScreen';

const MyEventsScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../assets/4 Sample.png')}  // Update this path as per your project structure
      style={styles.background} 
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Created Events</Text>
      </View>
      <View style={styles.container}>
        <MaterialCommunityIcons name="apple-safari" size={100} color="black" style={styles.icon} />
        <Text style={styles.message}>We couldn't find any event in this section</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateEventScreen')}>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#BF1013',
    paddingTop: 80,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 90,

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BF1013',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyEventsScreen;


