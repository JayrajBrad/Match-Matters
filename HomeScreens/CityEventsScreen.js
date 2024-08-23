
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const eventsData = {
  Pune: [
    { name: 'Monsoon1 music festival', date: '05 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Night1 beat party', date: '10 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Monsoon2 music festival', date: '05 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Night2 beat party', date: '10 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Monsoon3 music festival', date: '05 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Night3 beat party', date: '10 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Monsoon4 music festival', date: '05 Aug 2024', image: require('../assets/F - Pune.jpg') },
    { name: 'Night4 beat party', date: '10 Aug 2024', image: require('../assets/F - Pune.jpg') },
  ],
  Mumbai: [
    { name: 'Techno party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno1 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend1 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno2 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend2 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno3 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend3 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
  ],
  Bangalore: [
    { name: 'Techno party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno1 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend1 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno2 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend2 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno3 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend3 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
  ],
  Hyderabad: [
    { name: 'Techno party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno1 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend1 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno2 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend2 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Techno3 party', date: '11 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
    { name: 'Weekend3 party', date: '18 Aug 2024', image: require('../assets/F- Mumbai.jpg') },
  ],
};


const CityEventsScreen = ({ route, navigation }) => {
  const { city } = route.params;
  const events = eventsData[city] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{city} Events</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Happening Events</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Past Events</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('EventDetailsScreen', { event: item })}
          >
            <Image source={item.image} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{item.name}</Text>
              <View style={styles.eventDateContainer}>
                <MaterialCommunityIcons name="calendar" size={16} color="#BF1013" />
                <Text style={styles.eventDate}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.scrollView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BF1013',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
    paddingLeft: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#BF1013',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 20,
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFE6E6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  eventDate: {
    marginLeft: 5,
    color: '#BF1013',
  },
});

export default CityEventsScreen;
