
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';

const connectionsData = [
  { id: '1', name: 'Rizal Khan', mutualConnections: 5, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/4463d451-9312-44b7-b408-3de49a387dac.jpeg' },
  { id: '2', name: 'Graydon Poper', mutualConnections: 10, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/5e9366ad-2b74-4438-812c-8056f1ab176c.jpeg' },
  { id: '3', name: 'Arthur Cooper', mutualConnections: 10, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/ba43d4f8-9382-41a2-8f27-93e28b0df24a.jpeg' },
  { id: '4', name: 'Thomas Dior', mutualConnections: 2, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/320da562-c0af-41f9-a6fc-cc0b11af7e36.jpeg' },
  { id: '5', name: 'Evan Warren', mutualConnections: 2, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/34f84ca4-4e5f-4808-8857-9fe04c4bec60.jpeg' },
  { id: '6', name: 'Danny Smith', mutualConnections: 2, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/5e9366ad-2b74-4438-812c-8056f1ab176c.jpeg' },
  { id: '7', name: 'Aana Taylor', mutualConnections: 2, image: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/4463d451-9312-44b7-b408-3de49a387dac.jpeg' },
  // Add more data as needed
];

const ConnectionsScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const renderConnectionItem = ({ item }) => (
    <View style={styles.connectionItem}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.mutualConnections}>{item.mutualConnections} Mutual connections</Text>
      </View>
      <TouchableOpacity style={styles.connectButton}>
        <Image source={require('../assets/1 Icon.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreOptionsButton}>
        <Image source={require('../assets/Icon.png')} style={styles.moreIcon} />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.backButton}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connections</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'All' && styles.activeTabButton]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={styles.tabButtonText}>               All              </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Mutual' && styles.activeTabButton]}
          onPress={() => setActiveTab('Mutual')}
        >
          <Text style={styles.tabButtonText}>Mutual Connections</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image source={require('../assets/Search.png')} style={styles.searchIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('../assets/3 icon.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderHeader}
      data={connectionsData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))}
      renderItem={renderConnectionItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.connectionsList}
    />
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
    padding: 20,
    paddingVertical: 25,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tabButton: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#BF1013',
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#FEF1F1',
    
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight:'black',
    color: '#111',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#ccc',
  },
  searchButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "#Bf1013",
    borderRadius: 20,
    
  },
  searchIcon: {
    width: 24,
    height: 24,
    color: '#111',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: "#ccc",
    borderRadius: 20,
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  connectionsList: {
    paddingHorizontal: 16,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 17,
    fontWeight: 'bold',
    //color: '#ccc',
    color: '#111',
  },
  mutualConnections: {
    fontSize: 14,
    color: '#111',
  },
  connectButton: {
    padding: 18,
  },
  icon: {
    width: 24,
    height: 24,
  },
  moreOptionsButton: {
    //padding: 8,
    marginLeft: 8,
    
  },
  moreIcon: {
    width: 4,
    height: 4,
    paddingVertical: 10,
    marginVertical: 10,
  },
});

export default ConnectionsScreen;










