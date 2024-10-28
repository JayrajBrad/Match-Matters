//////DATE LOGIC FILTER/////////
// import React, { useState, useEffect, useCallback } from "react";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import { Country, State, City } from "country-state-city";
// import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import date picker
// import axios from "axios";
// import { API_URL } from "@env";
// import DateTimePicker from "@react-native-community/datetimepicker";

// const Filter = ({ setFilteredEvents, loadEvents }) => {
//   const [countryData, setCountryData] = useState([]);
//   const [stateData, setStateData] = useState([]);
//   const [cityData, setCityData] = useState([]);
//   const [country, setCountry] = useState(null);
//   const [state, setState] = useState(null);
//   const [city, setCity] = useState(null);
//   const [countryName, setCountryName] = useState(null);
//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   // Date range states
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
// const [isLoading, setLoading] = useState(false);
// const [startDate, setStartDate] = useState(new Date());
// const [endDate, setEndDate] = useState(new Date());
// const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
// const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

//   useEffect(() => {
//     const loadCountries = () => {
//       const countryArray = Country.getAllCountries().map((country) => ({
//         value: country.isoCode,
//         label: country.name,
//       }));
//       setCountryData(countryArray);
//     };
//     loadCountries();
//   }, []);

//   const handleState = useCallback((countryCode) => {
//     const states = State.getStatesOfCountry(countryCode).map((state) => ({
//       value: state.isoCode,
//       label: state.name,
//     }));
//     setStateData(states);
//     setState(null);
//     setCity(null);
//     setCityData([]);
//   }, []);

//   const handleCity = useCallback((countryCode, stateCode) => {
//     const cities = City.getCitiesOfState(countryCode, stateCode).map(
//       (city) => ({
//         value: city.name,
//         label: city.name,
//       })
//     );
//     setCityData(cities);
//     setCity(null);
//   }, []);

//   const handleApplyLocationFilters = async () => {
//     if (!countryName || !stateName || !cityName) return; // Prevent making the request if filters are not set
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/api/events/location`, {
//         params: {
//           cityName: cityName,
//           stateName: stateName,
//           countryName: countryName,
//         },
//       });
//       setFilteredEvents(response.data);
//     } catch (error) {
//       console.error("Error fetching events by location:", error.response.data);
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleApplyDateFilters = async () => {
//   if (!startDate || !endDate) return;
//   setLoading(true);
//   try {
//     const response = await axios.get(`${API_URL}/api/events/filterByDate`, {
//       params: {
//         startDate: startDate.toISOString(),
//         endDate: endDate.toISOString(),
//       },
//     });
//     setFilteredEvents(response.data);
//   } catch (error) {
//     console.error("Error fetching events by date range:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleApplyFilters = async () => {
//     // Reset filtered events
//     setFilteredEvents([]);

//     // Apply location filters if any
//     if (cityName || stateName || countryName) {
//       await handleApplyLocationFilters();
//     }

// // Apply date filters if any
// if (startDate && endDate) {
//   await handleApplyDateFilters();
// }

//     loadEvents(startDate, endDate);
//   };

// // Date picker handlers
// const showStartDatePicker = () => setStartDatePickerVisible(true);
// const hideStartDatePicker = () => setStartDatePickerVisible(false);
// const handleConfirmStartDate = (date) => {
//   setStartDate(date);
//   hideStartDatePicker();
// };

// const showEndDatePicker = () => setEndDatePickerVisible(true);
// const hideEndDatePicker = () => setEndDatePickerVisible(false);
// const handleConfirmEndDate = (date) => {
//   setEndDate(date);
//   hideEndDatePicker();
// };

//   return (
//     <View style={styles.container}>
//       {/* Country Dropdown */}
//       <View style={styles.dropdownContainer}>
//         <Text style={styles.label}>Country</Text>
//         <Dropdown
//           style={styles.dropdown}
//           placeholderStyle={styles.placeholderStyle}
//           selectedTextStyle={styles.selectedTextStyle}
//           inputSearchStyle={styles.inputSearchStyle}
//           iconStyle={styles.iconStyle}
//           data={countryData}
//           search
//           maxHeight={300}
//           labelField="label"
//           valueField="value"
//           placeholder="Select Country"
//           searchPlaceholder="Search..."
//           value={country}
//           onFocus={() => setIsFocus(true)}
//           onBlur={() => setIsFocus(false)}
//           onChange={(item) => {
//             setCountry(item.value);
//             setCountryName(item.label);
//             handleState(item.value);
//           }}
//         />
//       </View>

//       {/* State and City Dropdown */}
//       <View style={styles.dropdownlocationRowContainer}>
//         <View style={styles.dropdownContainer}>
//           <Text style={styles.label}>State</Text>
//           <Dropdown
//             style={styles.dropdown}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={stateData}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select State"
//             searchPlaceholder="Search..."
//             value={state}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={(item) => {
//               setState(item.value);
//               setStateName(item.label);
//               handleCity(country, item.value);
//             }}
//           />
//         </View>

//         <View style={[styles.dropdownContainer, styles.dropdownContainerLast]}>
//           <Text style={styles.label}>City</Text>
//           <Dropdown
//             style={styles.dropdown}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={cityData}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select City"
//             searchPlaceholder="Search..."
//             value={city}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={(item) => {
//               setCity(item.value);
//               setCityName(item.label);
//             }}
//           />
//         </View>
//       </View>

// {/* Date Range Pickers */}
// {/* <View style={styles.datePickerContainer}>
//   <Text style={styles.label}>Start Date</Text>
//   <TouchableOpacity
//     style={styles.dateButton}
//     onPress={showStartDatePicker}
//   >
//     <Text style={styles.dateButtonText}>
//       {startDate ? startDate.toDateString() : "Select Start Date"}
//     </Text>
//   </TouchableOpacity>

//   <DateTimePickerModal
//     isVisible={isStartDatePickerVisible}
//     mode="date"
//     onConfirm={handleConfirmStartDate}
//     onCancel={hideStartDatePicker}
//     textColor="#000"
//   />
// </View>

// <View style={styles.datePickerContainer}>
//   <Text style={styles.label}>End Date</Text>
//   <TouchableOpacity style={styles.dateButton} onPress={showEndDatePicker}>
//     <Text style={styles.dateButtonText}>
//       {endDate ? endDate.toDateString() : "Select End Date"}
//     </Text>
//   </TouchableOpacity>

//   <DateTimePickerModal
//     isVisible={isEndDatePickerVisible}
//     mode="date"
//     onConfirm={handleConfirmEndDate}
//     onCancel={hideEndDatePicker}
//     textColor="#000"
//   />
// </View> */}

// <Text>Select Start Date:</Text>
// <DateTimePicker
//   value={startDate || new Date()}
//   mode="date"
//   display="default"
//   onChange={(event, date) => setStartDate(date || startDate)}
// />
// <Text>Select End Date:</Text>
// <DateTimePicker
//   value={endDate || new Date()}
//   mode="date"
//   display="default"
//   onChange={(event, date) => setEndDate(date || endDate)}
// />

//       <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
//         <Text style={styles.applyButtonText}>Apply Filters</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   dropdownContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginVertical: 8,
//     color: "#333",
//   },
//   dropdownlocationRowContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   dropdownContainerLast: {
//     marginRight: 0,
//   },
//   dropdown: {
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     backgroundColor: "#fff",
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   datePickerContainer: {
//     marginVertical: 10,
//   },
//   dateButton: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 10,
//     backgroundColor: "#fff",
//     elevation: 1,
//   },
//   dateButtonText: {
//     color: "#333",
//     fontSize: 16,
//   },
//   applyButton: {
//     backgroundColor: "#2196F3",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   applyButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 18,
//   },
// });

// export default Filter;
//////DATE LOGIC FILTER/////////

import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { API_URL } from "@env";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import date picker

const eventGenres = [
  "Business Event",
  "House Party",
  "Networking Event",
  "Workshop",
  "Cultural Event",
  "Food Festival",
  "Music Concert",
  "Game Night",
  "Outdoor Activity",
  "Travel Meetup",
];

const Filter = ({ setFilteredEvents, setGenre }) => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null); // Ensure selectedGenre is defined
  const [isFocus, setIsFocus] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  useEffect(() => {
    const loadCountries = () => {
      const countryArray = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
      }));
      setCountryData(countryArray);
    };

    loadCountries();
  }, []);

  const handleState = useCallback((countryCode) => {
    const states = State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateData(states);
    setState(null);
    setCity(null);
    setCityData([]);
  }, []);

  const handleCity = useCallback((countryCode, stateCode) => {
    const cities = City.getCitiesOfState(countryCode, stateCode).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );
    setCityData(cities);
    setCity(null);
  }, []);

  const fetchEventsByLocation = async () => {
    // Construct the endpoint directly with the values
    const endpoint = `${API_URL}/api/events/location/${cityName}/${stateName}/${countryName}`;
    try {
      const response = await axios.get(endpoint);
      return response.data; // Return the fetched events
    } catch (error) {
      console.error("Error fetching events by location:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const fetchEventsByGenre = async () => {
    if (!selectedGenre) return []; // Add check for selectedGenre
    // Construct the endpoint directly with the selected genre
    const endpoint = `${API_URL}/api/events/genre/${selectedGenre}`;
    try {
      const response = await axios.get(endpoint);
      return response.data; // Return the fetched events
    } catch (error) {
      console.error("Error fetching events by genre:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const handleApplyDateFilters = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);

    // Format the start and end dates to YYYY-MM-DD for better URL structure
    const formattedStartDate = startDate.toISOString().split("T")[0]; // Get just the date part
    const formattedEndDate = endDate.toISOString().split("T")[0]; // Get just the date part

    try {
      const endpoint = `${API_URL}/api/events/filterByDate/${formattedStartDate}/${formattedEndDate}`;
      const response = await axios.get(endpoint);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error("Error fetching events by date range:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    // Fetch events based on genre if selected
    if (selectedGenre) {
      const genreEvents = await fetchEventsByGenre();
      setFilteredEvents(genreEvents); // Update filtered events with genre events
      setGenre(selectedGenre); // Update the genre in parent state
    }

    // Fetch events based on location if all location fields are filled
    if (countryName && stateName && cityName) {
      const locationEvents = await fetchEventsByLocation();
      setFilteredEvents(locationEvents); // Update filtered events with location events
      setGenre(null); // Reset genre in parent state since we're filtering by location
    }

    // Apply date filters if any
    if (startDate && endDate) {
      filteredResults = filteredResults.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    // If neither genre nor location is selected, you can optionally clear the events
    if (!selectedGenre && (!countryName || !stateName || !cityName)) {
      setFilteredEvents([]); // Clear events if no filters are applied
    }
  };

  // Date picker handlers
  // const showStartDatePicker = () => setStartDatePickerVisible(true);
  // const hideStartDatePicker = () => setStartDatePickerVisible(false);
  // const handleConfirmStartDate = (date) => {
  //   setStartDate(date);
  //   hideStartDatePicker();
  // };

  // const showEndDatePicker = () => setEndDatePickerVisible(true);
  // const hideEndDatePicker = () => setEndDatePickerVisible(false);
  // const handleConfirmEndDate = (date) => {
  //   if (date < startDate) {
  //     alert("End date cannot be earlier than start date.");
  //     return;
  //   }
  //   setEndDate(date);
  //   hideEndDatePicker();
  // };

  return (
    <View style={styles.container}>
      {/* Country Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Country</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={countryData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Country"
          searchPlaceholder="Search..."
          value={country}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setCountry(item.value);
            setCountryName(item.label);
            handleState(item.value);
          }}
        />
      </View>

      {/* State Dropdown */}
      <View style={styles.dropdownlocationRowContainer}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>State</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={stateData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select State"
            searchPlaceholder="Search..."
            value={state}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setState(item.value);
              setStateName(item.label);
              handleCity(country, item.value);
            }}
          />
        </View>

        {/* City Dropdown */}
        <View style={[styles.dropdownContainer, styles.dropdownContainerLast]}>
          <Text style={styles.label}>City</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={cityData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            searchPlaceholder="Search..."
            value={city}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setCity(item.value);
              setCityName(item.label);
            }}
          />
        </View>
      </View>

      {/* Genre Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Event Genre</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={eventGenres.map((genre) => ({ value: genre, label: genre }))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Genre"
          searchPlaceholder="Search..."
          value={selectedGenre} // Update to use selectedGenre
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedGenre(item.value); // Update the local state
            setGenre(item.value); // Optionally update the parent state if needed
          }}
        />
      </View>

      {/* Date Filters */}
      {/* <TouchableOpacity onPress={showStartDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          Start Date: {startDate.toDateString()}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={hideStartDatePicker}
        textColor="#000"
      />

      <TouchableOpacity onPress={showEndDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          End Date: {endDate.toDateString()}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={hideEndDatePicker}
        textColor="#000"
      /> */}

      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleApplyFilters}
        disabled={isLoading}
      >
        <Text style={styles.applyButtonText}>
          {isLoading ? "Applying..." : "Apply Filters"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dropdownContainer: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#333",
  },
  dropdownlocationRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  dropdownContainerLast: {
    marginRight: 0,
  },
  dateButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButtonText: {
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  applyButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  applyButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default Filter;
