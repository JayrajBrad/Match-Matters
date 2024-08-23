
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker';
import axios from 'axios';

const cities = [
  { name: 'Bangalore', image: require('../assets/F- Bangalore.jpg') },
  { name: 'Mumbai', image: require('../assets/F- Mumbai.jpg') },
  { name: 'Pune', image: require('../assets/F - Pune.jpg') },
  { name: 'Hyderabad', image: require('../assets/F- Mumbai.jpg') },
  // { name: 'Delhi', image: require('../assets/F- Bangalore.jpg') },
  // { name: 'Chennai', image: require('../assets/F - Pune.jpg') },
  // { name: 'Kolkata', image: require('../assets/F- Mumbai.jpg') },
  // { name: 'Ahmedabad', image: require('../assets/F- Bangalore.jpg') },
  // { name: 'Surat', image: require('../assets/F - Pune.jpg') },
  // { name: 'Jaipur', image: require('../assets/F- Mumbai.jpg') },
  // { name: 'Lucknow', image: require('../assets/F- Bangalore.jpg') },
  // { name: 'Kanpur', image: require('../assets/F - Pune.jpgg') },
  // { name: 'Nagpur', image: require('../assets/F- Mumbai.jpg') },
  // { name: 'Indore', image: require('../assets/F- Bangalore.jpg') },
  // { name: 'Bhopal', image: require('../assets/F - Pune.jpg') },
  // { name: 'Patna', image: require('../assets/F- Mumbai.jpg') },
  // { name: 'Ludhiana', image: require('../assets/F- Bangalore.jpg') },
  // { name: 'Agra', image: require('../assets/F - Pune.jpg') },
  // { name: 'Nashik', image: require('../assets/F- Mumbai.jpg') },
  // { name: 'Vadodara', image: require('../assets/F- Bangalore.jpg') },
  // Add more cities as needed
];

const ChooseLocationScreen = ({ navigation }) => {
  const [country, setCountry] = useState('+91');  // Default to India's country code
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryNames = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2,
          dialCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
          flag: country.flags.svg,
        }));
        setCountries(countryNames);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const handleCityPress = (city) => {
    navigation.navigate('CityEventsScreen', { city });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Location</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.pickerContainer}>
          <CountryCodeDropdownPicker
            selected={country}
            setSelected={setCountry}
            countryCodeTextStyles={{ fontSize: 13 }}
            countryCodeContainerStyles={styles.countryCode}
            style={styles.countryPickerStyle}
            searchStyles={styles.search}
            dropdownStyles={styles.dropdown}
          />
        </View>
      </View>
      <FlatList
        data={cities.filter(city => city.name.toLowerCase().includes(search.toLowerCase()))}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cityCard} onPress={() => handleCityPress(item.name)}>
            <Image source={item.image} style={styles.cityImage} />
            <Text style={styles.cityName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        numColumns={2}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  countryPickerStyle: {
    flex: 1,
  },
  countryCode: {
    height: 40,
  },
  search: {
    height: 40,
  },
  dropdown: {
    height: 178,
  },
  scrollView: {
    padding: 20,
  },
  cityCard: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cityImage: {
    width: '100%',
    height: 150,
  },
  cityName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseLocationScreen;
