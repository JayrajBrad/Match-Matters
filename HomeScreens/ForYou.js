import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ForYou() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
  },
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

