import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons"; // Import pencil icon
import { UserContext } from "../navigation/UserProvider";
import Slider from "@react-native-community/slider";

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

const Filter = ({
  setFilteredEvents,
  setStartDate,
  setSelectedDateRange,
  setEndDate,
  loadEvents,
}) => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [showEditCountry, setShowEditCountry] = useState(false);
  const [showEditState, setShowEditState] = useState(false);
  const [showEditCity, setShowEditCity] = useState(false);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false); // Toggle for editing location
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  // const [startDate, setLocalStartDate] = useState(new Date()); // Local state for start date
  // const [endDate, setLocalEndDate] = useState(new Date());
  const [startDate, setLocalStartDate] = useState(null);
  const [endDate, setLocalEndDate] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const [radius, setRadius] = useState(5000);

  const [isFocus, setIsFocus] = useState(false);

  const { user, userId } = useContext(UserContext);

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

  // Load state and city data based on saved country and state
  useEffect(() => {
    if (countryName) {
      const countryCode = Country.getAllCountries().find(
        (country) => country.name === countryName
      )?.isoCode;
      if (countryCode) handleState(countryCode);
    }
  }, [countryName]);

  useEffect(() => {
    if (stateName && countryName) {
      const countryCode = Country.getAllCountries().find(
        (country) => country.name === countryName
      )?.isoCode;
      const stateCode = State.getStatesOfCountry(countryCode).find(
        (state) => state.name === stateName
      )?.isoCode;
      if (stateCode) handleCity(countryCode, stateCode);
    }
  }, [stateName, countryName]);

  const handleState = useCallback((countryCode) => {
    const states = State.getStatesOfCountry(countryCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateData(states);
    // setState(null);
    // setCity(null);
    setCityData([]);
    // setStateName(null);
    // setCityName(null);
  }, []);

  const handleCity = useCallback((countryCode, stateCode) => {
    const cities = City.getCitiesOfState(countryCode, stateCode).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    );
    setCityData(cities);
    // setCity(null);
  }, []);

  const handleCountryChange = (selectedCountry) => {
    setCountryName(selectedCountry.label);
    setShowEditCountry(false);
    // Fetch states for the newly selected country
    handleState(selectedCountry.value);
    setStateName(""); // Reset state and city when country changes
    setCityName("");
  };

  const handleStateChange = (selectedState) => {
    setStateName(selectedState.label);
    setShowEditState(false);
    // Fetch cities for the newly selected state
    const countryCode = Country.getAllCountries().find(
      (country) => country.name === countryName
    )?.isoCode;
    handleCity(countryCode, selectedState.value);
    setCityName(""); // Reset city when state changes
  };

  const handleCityChange = (selectedCity) => {
    setCityName(selectedCity.label);
    setShowEditCity(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // const storedUserId = userId;
        // setUserId(storedUserId);
        const response = await axios.get(`${API_URL}/user/${userId}`);
        // console.log("User Data:", response.data);
        if (response.status === 200) {
          const userData = response.data;

          // Set country, state, and city from userData
          setCountryName(userData.countryName || "");
          setStateName(userData.stateName || "");
          setCityName(userData.cityName || "");
        } else {
          Alert.alert(
            "Error",
            "Failed to load profile data. Please try again later."
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to load profile data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

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

  // const fetchEventsByLocation = async () => {
  //   // Construct the endpoint directly with the values
  //   const endpoint = `${API_URL}/api/events/location/${cityName}/${stateName}/${countryName}`;
  //   try {
  //     const response = await axios.get(endpoint);
  //     console.log("LOG FROM FILTER COMPONENT :", response.data);
  //     return response.data; // Return the fetched events
  //   } catch (error) {
  //     console.error("Error fetching events by location:", error);
  //     return []; // Return an empty array in case of an error
  //   }
  // };

  const fetchEventsByLocation = async () => {
    if (!cityName || !stateName || !countryName) return [];

    // If no date range provided, set a default range (e.g., one month ago)
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1); // Set to one month ago

    const defaultEndDate = new Date();
    const endpoint = `${API_URL}/api/events/locationAndDateRange/${cityName}/${stateName}/${countryName}/${
      defaultStartDate.toISOString().split("T")[0]
    }/${defaultEndDate.toISOString().split("T")[0]}`;

    try {
      const response = await axios.get(endpoint);
      console.log("LOG FROM FILTER COMPONENT:", response.data);
      return response.data; // Return the fetched events
    } catch (error) {
      console.error("Error fetching events by location:", error);
      return []; // Return an empty array in case of an error
    }
  };

  // const fetchEventsByLocationAndDate = async () => {
  //   if (!cityName || !stateName || !countryName || !startDate || !endDate)
  //     return [];

  //   // Construct the endpoint for filtering events by location and date range
  //   const endpoint = `${API_URL}/api/events/locationAndDateRange/${cityName}/${stateName}/${countryName}/${
  //     startDate.toISOString().split("T")[0]
  //   }/${endDate.toISOString().split("T")[0]}`;
  //   try {
  //     const response = await axios.get(endpoint);
  //     console.log("Events fetched by location and date range:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching events by location and date:", error);
  //     return [];
  //   }
  // };

  const fetchEventsByLocationAndDate = async () => {
    if (!cityName || !stateName || !countryName || !startDate || !endDate)
      return [];

    // If `startDate` and `endDate` are not set, use default date range (e.g., one month ago)
    const defaultStartDate =
      startDate || new Date(new Date().setMonth(new Date().getMonth() - 1));
    const defaultEndDate = endDate || new Date();

    const endpoint = `${API_URL}/api/events/locationAndDateRange/${cityName}/${stateName}/${countryName}/${
      defaultStartDate.toISOString().split("T")[0]
    }/${defaultEndDate.toISOString().split("T")[0]}`;

    try {
      const response = await axios.get(endpoint);
      console.log("LOG FROM FILTER COMPONENT:", response.data);
      return response.data; // Return the fetched events
    } catch (error) {
      console.error("Error fetching events by location and date:", error);
      return []; // Return an empty array in case of an error
    }
  };

  const fetchEventsByDateRange = async () => {
    if (!startDate || !endDate) return [];

    // Construct the endpoint for filtering events by date range only
    const endpoint = `${API_URL}/api/events/filterByDate/${
      startDate.toISOString().split("T")[0]
    }/${endDate.toISOString().split("T")[0]}`;
    try {
      const response = await axios.get(endpoint);
      console.log("Events fetched by date range:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching events by date range:", error);
      return [];
    }
  };

  const handleApplyFilters = async () => {
    let filteredResults = [];

    if (selectedGenre) {
      const genreEvents = await fetchEventsByGenre();
      filteredResults = [...filteredResults, ...genreEvents];
    }

    if (cityName && stateName && countryName && startDate && endDate) {
      const locationAndDateEvents = await fetchEventsByLocationAndDate();
      filteredResults = [...filteredResults, ...locationAndDateEvents];
    }

    if (cityName && stateName && countryName && !startDate && !endDate) {
      const locationEvents = await fetchEventsByLocation();
      filteredResults = [...filteredResults, ...locationEvents];
    }

    if (!cityName || !stateName || (!countryName && startDate && endDate)) {
      const dateRangeEvents = await fetchEventsByDateRange();
      filteredResults = [...filteredResults, ...dateRangeEvents];
    }
    const uniqueEvents = Array.from(
      new Set(filteredResults.map((event) => event._id.toString()))
    ).map((id) => filteredResults.find((event) => event._id.toString() === id));

    setFilteredEvents(uniqueEvents);
    setSelectedDateRange({ startDate, endDate });
    console.log("Unique filtered events:", uniqueEvents);
  };

  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);

  const handleConfirmStartDate = (date) => {
    setLocalStartDate(date);
    // setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);
  const handleConfirmEndDate = (date) => {
    if (date < startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }
    setLocalEndDate(date);
    hideEndDatePicker();
  };

  const toggleEditLocation = () => {
    setIsEditingLocation(!isEditingLocation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.locContainer}>
        <Text style={styles.label}>Country</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{countryName}</Text>
          <TouchableOpacity
            onPress={() => setShowEditCountry(!showEditCountry)}
            style={styles.editIconWrapper}
          >
            <Ionicons name="pencil" size={20} color="grey" />
          </TouchableOpacity>
        </View>
        {showEditCountry && (
          <Dropdown
            data={countryData}
            valueField="value"
            labelField="label"
            placeholder="Select Country"
            search
            onChange={handleCountryChange}
            containerStyle={styles.dropdown}
          />
        )}

        {/* State */}
        <Text style={styles.label}>State</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{stateName}</Text>
          <TouchableOpacity
            onPress={() => setShowEditState(!showEditState)}
            style={styles.editIconWrapper}
          >
            <Ionicons name="pencil" size={20} color="grey" />
          </TouchableOpacity>
        </View>
        {showEditState && (
          <Dropdown
            data={stateData}
            valueField="value"
            labelField="label"
            placeholder="Select State"
            search
            onChange={handleStateChange}
            containerStyle={styles.dropdown}
          />
        )}

        {/* City */}
        <Text style={styles.label}>City</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{cityName}</Text>
          <TouchableOpacity
            onPress={() => setShowEditCity(!showEditCity)}
            style={styles.editIconWrapper}
          >
            <Ionicons name="pencil" size={20} color="grey" />
          </TouchableOpacity>
        </View>
        {showEditCity && (
          <Dropdown
            data={cityData}
            valueField="value"
            labelField="label"
            placeholder="Select City"
            search
            onChange={handleCityChange}
            containerStyle={styles.dropdown}
          />
        )}
      </View>

      {/* Genre Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Event Genre</Text>
        <Dropdown
          style={styles.eventdropdown}
          data={eventGenres.map((genre) => ({ value: genre, label: genre }))}
          labelField="label"
          valueField="value"
          placeholder="Select Genre"
          value={selectedGenre}
          onChange={(item) => setSelectedGenre(item.value)}
        />
      </View>

      {/* <View style={styles.DateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartDatePickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            Start Date: {startDate.toDateString()}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setStartDate(date);
            setStartDatePickerVisible(false);
            textColor = "#000";
          }}
          onCancel={() => setStartDatePickerVisible(false)}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndDatePickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            End Date: {endDate.toDateString()}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setEndDate(date);
            setEndDatePickerVisible(false);
          }}
          onCancel={() => setEndDatePickerVisible(false)}
          textColor="#000"
        />
      </View> */}

      <View style={styles.DateContainer}>
        <Text style={styles.label}>Date Range</Text>

        <TouchableOpacity
          onPress={showStartDatePicker}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>
            Start Date:{" "}
            {startDate ? startDate.toDateString() : "Select start date"}
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
            End Date: {endDate ? endDate.toDateString() : "Select end date"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmEndDate}
          onCancel={hideEndDatePicker}
          textColor="#000"
        />
      </View>

      {/* RADIUS  */}
      {/* <View style={styles.radiusContainer}>
        <Text style={styles.label}>Radius (meters)</Text>
        <Slider
          style={styles.slider}
          minimumValue={1000}
          maximumValue={50000}
          step={1000}
          value={radius}
          onValueChange={(value) => setRadius(value)}
        />
        <Text style={styles.radiusText}>{`Radius: ${radius} meters`}</Text>
      </View> */}

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
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
  DateContainer: {
    marginRight: 0,
    paddingTop: 10,
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
    fontStyle: "bold",
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  countryStateCityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoText: {
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    flex: 1,
    marginRight: 10,
  },
  // editIconWrapper: {
  //   padding: 5,
  //   borderRadius: 5,
  //   backgroundColor: "#e0e0e0",
  //   elevation: 2,
  // },
  editIconWrapper: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  eventdropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#aaa",
  },
});

export default Filter;
