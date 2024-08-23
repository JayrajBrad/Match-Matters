import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MostHappening() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Most Happening Events</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event 1</Text>
          <Text style={styles.cardText}>Details about Event 1</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event 2</Text>
          <Text style={styles.cardText}>Details about Event 2</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event 3</Text>
          <Text style={styles.cardText}>Details about Event 3</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event 4</Text>
          <Text style={styles.cardText}>Details about Event 4</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Event 5</Text>
          <Text style={styles.cardText}>Details about Event 5</Text>
        </View>
        {/* Add more cards as needed */}
      </ScrollView>

      <Text style={styles.sectionTitle}>For You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nearby Events</Text>
          <Text style={styles.cardText}>Discover events happening near you.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Party Meetups</Text>
          <Text style={styles.cardText}>Meet new people while partying.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explore</Text>
          <Text style={styles.cardText}>Meet new people During the Journey!</Text>
        </View>
        {/* Add more cards as needed */}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',

  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 40,
    textAlign: 'left',
    color: '#111',
    
    
  },
//   sectionTitle2: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginVertical: 40,
//     textAlign: 'left',
//     marginTop: 10,
    
//   },
  horizontalScroll: {
    marginBottom: 20,
  },
  card: {
    width: 200,
    height: 150,
    backgroundColor: '#BF1013',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
    
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff'
    
  },
});

