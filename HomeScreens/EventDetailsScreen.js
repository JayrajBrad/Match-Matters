

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // If you are using expo
import { Ionicons } from '@expo/vector-icons'; // For the back arrow icon
import MapView, { Marker } from 'react-native-maps';

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);

 const images = [
    require('../assets/slider 1st imge.png'),  // Replace with your image paths
     require('../assets/slider 2st imge.jpg'),
    require('../assets/slider 3st imge.png')
  ];

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image source={item} style={styles.eventImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: index === currentIndex ? 1 : 0.3 }
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Event Title, Date, Time */}
        <View style={styles.titleDateContainer}>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <View style={styles.dateTimeContainer}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#BF1013" />
            <Text style={styles.dateText}>09:00 PM</Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>AUG</Text>
              <Text style={styles.dateBadgeNumber}>05</Text>
            </View>
          </View>
        </View>

        {/* Thin Line */}
        <View style={styles.thinLine} />

        {/* Organizer Section */}
        <View>
          
        <View style={styles.organizerContainer}>
        <Text style={styles.organizerText}>Organized by</Text>
          <Text>Joshua Edwards & Sorlin Dior</Text>
        </View>
        </View>

        {/* Event Details Section */}
        <View>
          <Text style={styles.sectionHeader}>Event Details</Text>
          <View style={styles.eventDetailsContainer}>
            <Text style={styles.eventDetailsText}>
              The Monsoon music festival, popularly known as Monsoon Music festival, is an international festival of music held in Mumbai, India. It is organized by Joshua Edwards & Sorlin Dior. There are many exciting things from the artist.
            </Text>
          </View>
        </View>

        {/* Thin Line */}
        <View style={styles.thinLine} />

        {/* Artist Section */}
        {/* <View style={styles.artistContainer}>
          <Text style={styles.sectionHeader}>Musician</Text>
          <Text style={styles.artistName}>Arijit Singh</Text>
        </View>

        <View style={styles.artistContainer}>
          <Text style={styles.sectionHeader}>Singer</Text>
          <Text style={styles.artistName}>Shreya Ghoshal</Text>
        </View> */}
<View style={styles.artistsContainer}>
  <View style={styles.artistRow}>
    <View style={styles.singleArtist}>
      <Image source={require('../assets/Arijit.png')} style={styles.artistImage} />
      <Text style={styles.sectionHeader}>Musician</Text>
      <Text style={styles.artistName}>Arijit Singh</Text>
    </View>

    <View style={styles.singleArtist}>
      <Image source={require('../assets/Shreya.png')} style={styles.artistImage} />
      <Text style={styles.sectionHeader}>Singer</Text>
      <Text style={styles.artistName}>Shreya Ghoshal</Text>
    </View>
  </View>
</View>




        {/* Interested Section */}
        <View style={styles.interestedContainer}>
          <Text style={styles.interestedPrompt}>Click on interested to stay updated about this event</Text>
          <TouchableOpacity style={styles.interestedButton}>
            <Text style={styles.interestedText}>   Interested   </Text>
          </TouchableOpacity>
        </View>

        {/* Address Section */}
        <View style={styles.addressContainer}>
          <Text style={styles.cityText}>Mumbai</Text>
          <Text style={styles.addressText}>The Lalit Building, Naroda, Marol, Andheri (East) Mumbai, Maharashtra 400059, India</Text>
        </View>

        {/* About the Venue and Map */}
        <View style={styles.venueContainer}>
          <View style={styles.venueHeaderContainer}>
            <Text style={styles.venueHeader}>About the Venue</Text>
            <TouchableOpacity>
              <Text style={styles.getDestinationText}>Get Destination</Text>
            </TouchableOpacity>
          </View>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 19.119677,
              longitude: 72.847183,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{ latitude: 19.119677, longitude: 72.847183 }}
              title="Event Location"
            />
          </MapView>
        </View>

        {/* Distance from Home */}
        <Text style={styles.distanceText}>18 km distance from your home</Text>

        {/* Thin Line */}
        <View style={styles.thinLine} />

        {/* Invite and Book Event Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={styles.buttonText}>Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.buttonText}>Book Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    paddingTop: 70, // Adjust for status bar height
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    paddingRight: 110,
    paddingLeft: 100,
  },
  sliderContainer: {
    width: '100%',
    height: 200,
    marginTop: 1, // Adjusted to accommodate the header
  },
  eventImage: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: '#BF1013',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  contentContainer: {
    padding: 20,
  },
  titleDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#BF1013',
    marginLeft: 10,
  },
  dateBadge: {
    backgroundColor: '#BF1013',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
  },
  dateBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateBadgeNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thinLine: {
    height: 1,
    backgroundColor: '#D3D3D3',
    marginVertical: 10,
  },
  organizerContainer: {
    backgroundColor: '#FFE6E6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    paddingTop : 10,
  },
  organizerText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
   
  },
  eventDetailsContainer: {
    backgroundColor: '#BF1013',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
    //marginTop: 10,
  },
  eventDetailsText: {
    fontSize: 16,
    color: '#fff',
  },
  // artistContainer: {
  //   marginBottom: 20,
  // },
  // artistName: {
  //   fontSize: 18,
  //   color: '#333',
  // },
  artistsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 20,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  singleArtist: {
    alignItems: 'center',
    marginHorizontal: 40, 
  },
  artistImage: {
    width: 70,  
    height: 70,
    borderRadius: 35,  
    borderWidth: 2,  
    borderColor: '#BF1013',  
    marginRight: 10,
    
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'left',
  },
  artistName: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  interestedContainer: {
    marginBottom: 20,
    padding: 15,
    borderColor: '#BF1013',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFE6E6",
    marginTop: 10,
  },
  interestedPrompt: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  interestedButton: {
    backgroundColor: '#bf1013',
    paddingVertical: 5,
   // alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'flex-end',
    //borderBottomColor : "#BF1013",
  },
  interestedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'condensed',
  },
  addressContainer: {
    // marginBottom: 20,
    marginBottom: 20,
    padding: 15,
    borderColor: '#BF1013',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor : "#BF1013",
  },
  cityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addressText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  venueContainer: {
    marginBottom: 20,
  },
  venueHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  getDestinationText: {
    fontSize: 16,
    color: '#E84A5F',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  distanceText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inviteButton: {
    backgroundColor: '#BF1013',
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  bookButton: {
    backgroundColor: '#BF1013',
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EventDetailsScreen;
