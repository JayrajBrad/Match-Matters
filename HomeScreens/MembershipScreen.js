// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker';
// import axios from 'axios';

// const cities = [
//   { name: 'Bangalore', image: require('../assets/F- Bangalore.jpg') },
//   { name: 'Mumbai', image: require('../assets/F- Mumbai.jpg') },
//   { name: 'Pune', image: require('../assets/F - Pune.jpg') },
//   { name: 'Hyderabad', image: require('../assets/F- Mumbai.jpg') },
//   // { name: 'Delhi', image: require('../assets/F- Bangalore.jpg') },
//   // { name: 'Chennai', image: require('../assets/F - Pune.jpg') },
//   // { name: 'Kolkata', image: require('../assets/F- Mumbai.jpg') },
//   // { name: 'Ahmedabad', image: require('../assets/F- Bangalore.jpg') },
//   // { name: 'Surat', image: require('../assets/F - Pune.jpg') },
//   // { name: 'Jaipur', image: require('../assets/F- Mumbai.jpg') },
//   // { name: 'Lucknow', image: require('../assets/F- Bangalore.jpg') },
//   // { name: 'Kanpur', image: require('../assets/F - Pune.jpgg') },
//   // { name: 'Nagpur', image: require('../assets/F- Mumbai.jpg') },
//   // { name: 'Indore', image: require('../assets/F- Bangalore.jpg') },
//   // { name: 'Bhopal', image: require('../assets/F - Pune.jpg') },
//   // { name: 'Patna', image: require('../assets/F- Mumbai.jpg') },
//   // { name: 'Ludhiana', image: require('../assets/F- Bangalore.jpg') },
//   // { name: 'Agra', image: require('../assets/F - Pune.jpg') },
//   // { name: 'Nashik', image: require('../assets/F- Mumbai.jpg') },
//   // { name: 'Vadodara', image: require('../assets/F- Bangalore.jpg') },
//   // Add more cities as needed
// ];

// const ChooseLocationScreen = ({ navigation }) => {
//   const [country, setCountry] = useState('+91');  // Default to India's country code
//   const [search, setSearch] = useState('');
//   const [countries, setCountries] = useState([]);

//   useEffect(() => {
//     axios.get('https://restcountries.com/v3.1/all')
//       .then(response => {
//         const countryNames = response.data.map(country => ({
//           name: country.name.common,
//           code: country.cca2,
//           dialCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
//           flag: country.flags.svg,
//         }));
//         setCountries(countryNames);
//       })
//       .catch(error => {
//         console.error('Error fetching countries:', error);
//       });
//   }, []);

//   const handleCityPress = (city) => {
//     navigation.navigate('CityEventsScreen', { city });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Choose Location</Text>
//       </View>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for a city"
//           value={search}
//           onChangeText={setSearch}
//         />
//         <View style={styles.pickerContainer}>
//           <CountryCodeDropdownPicker
//             selected={country}
//             setSelected={setCountry}
//             countryCodeTextStyles={{ fontSize: 13 }}
//             countryCodeContainerStyles={styles.countryCode}
//             style={styles.countryPickerStyle}
//             searchStyles={styles.search}
//             dropdownStyles={styles.dropdown}
//           />
//         </View>
//       </View>
//       <FlatList
//         data={cities.filter(city => city.name.toLowerCase().includes(search.toLowerCase()))}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.cityCard} onPress={() => handleCityPress(item.name)}>
//             <Image source={item.image} style={styles.cityImage} />
//             <Text style={styles.cityName}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.name}
//         numColumns={2}
//         contentContainerStyle={styles.scrollView}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#BF1013',
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     marginLeft: 20,
//     paddingLeft: 60,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//   },
//   searchInput: {
//     flex: 1,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     marginRight: 10,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   countryPickerStyle: {
//     flex: 1,
//   },
//   countryCode: {
//     height: 40,
//   },
//   search: {
//     height: 40,
//   },
//   dropdown: {
//     height: 178,
//   },
//   scrollView: {
//     padding: 20,
//   },
//   cityCard: {
//     flex: 1,
//     margin: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//     alignItems: 'center',
//   },
//   cityImage: {
//     width: '100%',
//     height: 150,
//   },
//   cityName: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ChooseLocationScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   FlatList,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import axios from "axios";
// import { API_URL } from "@env";

// const ChooseLocationScreen = ({ navigation }) => {
//   const [search, setSearch] = useState("");
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${API_URL}/api/all-events`)
//       .then((response) => {
//         console.log("Fetched events:", response.data);
//         setEvents(response.data);
//         setFilteredEvents(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching events:", error);
//       });
//   }, []);

//   useEffect(() => {
//     setFilteredEvents(
//       events.filter((event) =>
//         event.title
//           ? event.title.toLowerCase().includes(search.toLowerCase())
//           : false
//       )
//     );
//   }, [search, events]);

//   const handleEventPress = (event) => {
//     navigation.navigate("EventDetailsScreen", { event });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Choose an Event</Text>
//       </View>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for an event"
//           value={search}
//           onChangeText={setSearch}
//         />
//       </View>
//       <FlatList
//         data={filteredEvents}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.eventCard}
//             onPress={() => handleEventPress(item)}
//           >
//             <Image
//               source={{ uri: item.images || "default-image-url" }} // Handle missing images
//               style={styles.eventImage}
//             />
//             <View style={styles.eventDetails}>
//               <Text style={styles.eventName}>
//                 {item.title || "Unknown Title"}
//               </Text>
//               <Text style={styles.eventDate}>
//                 {item.date || "Unknown Date"}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item._id.toString()} // Ensure proper key extraction
//         numColumns={2}
//         contentContainerStyle={styles.scrollView}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#BF1013",
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "white",
//     marginLeft: 20,
//     paddingLeft: 60,
//   },
//   searchContainer: {
//     padding: 20,
//   },
//   searchInput: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//   },
//   scrollView: {
//     padding: 20,
//   },
//   eventCard: {
//     flex: 1,
//     margin: 10,
//     borderRadius: 10,
//     overflow: "hidden",
//     alignItems: "center",
//   },
//   eventImage: {
//     width: "100%",
//     height: 150,
//   },
//   eventDetails: {
//     padding: 10,
//     alignItems: "center",
//   },
//   eventName: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   eventDate: {
//     color: "#BF1013",
//   },
// });

// export default ChooseLocationScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { getToken } from "../backend/token"; // Function to get the token
import axios from "axios";
import { API_URL } from "@env";
import { LinearGradient } from "expo-linear-gradient";

const ChooseLocationScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/api/all-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setEvents(response.data);
      } else {
        console.error("Failed to fetch events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.eventItem}
        onPress={() =>
          navigation.navigate("EventDetailsScreen", { eventId: item._id })
        }
      >
        <Image
          source={{ uri: item.images[0]?.url }}
          style={styles.eventImage}
        />
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
          <Text style={styles.eventLocation}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#FFF72D", "#D6CAF2", "#F9D3A3"]}
      style={styles.container}
    >
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={renderEventItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  eventItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    padding: 10,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  eventInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 14,
    color: "#555",
  },
  eventLocation: {
    fontSize: 14,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default ChooseLocationScreen;
