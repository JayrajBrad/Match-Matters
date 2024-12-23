

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TicketSales() {
  const ticketPrices = [
    { type: 'Standard', price: '₹999', people: 1 },
    { type: 'VIP', price: '₹1,999', people: 1 },
    { type: 'Premium', price: '₹3,999', people: 2 },
    { type: 'Ultra VIP', price: '₹5,999', people: 2},
  ];

  const eventDetails = {
    date: 'July 06, 2024',
    startTime: '11:00 AM',
    endTime: '5:00 PM',
    venue: 'Saras Baug, Pune',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Details</Text>
      <View style={styles.eventDetailContainer}>
        <Text style={styles.eventDetailText}>Date: {eventDetails.date}</Text>
        <Text style={styles.eventDetailText}>Start Time: {eventDetails.startTime}</Text>
        <Text style={styles.eventDetailText}>End Time: {eventDetails.endTime}</Text>
        <Text style={styles.eventDetailText}>Venue: {eventDetails.venue}</Text>
      </View>
      <Text style={styles.title}>Ticket Prices</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ticketPrices.map((ticket, index) => (
          <View key={index} style={styles.ticketContainer}>
            <Text style={styles.ticketType}>{ticket.type}</Text>
            <Text style={styles.ticketPrice}>{ticket.price}</Text>
            <Text style={styles.ticketPeople}>People per ticket: {ticket.people}</Text>
            
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  eventDetailContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  eventDetailText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  ticketContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  ticketType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BF1013',
  },
  ticketPeople: {
    fontSize: 16,
    color: '#555',
  },
});
