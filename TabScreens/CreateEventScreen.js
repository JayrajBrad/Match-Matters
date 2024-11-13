import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Assuming you're using a package like jwt-decode
import { Video } from "expo-av";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { getToken, getRefreshToken, saveToken } from "../backend/token";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY } from "@env";
import FormData from "form-data";
import { getUserId } from "../backend/registrationUtils";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { v4 as uuidv4 } from "uuid";

const CreateEventScreen = ({ navigation }) => {
  const [images, setImages] = useState([null, null, null]);
  const [title, setTitle] = useState("");
  // const [location, setLocation] = useState("");

  const [organizerName, setOrganizerName] = useState("");
  const [description, setDescription] = useState("");
  // const [showDatePicker, setShowDatePicker] = useState(false);
  // const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(true);
  const [eventGenre, setEventGenre] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const [showDeleteIcon, setShowDeleteIcon] = useState(null); // Track which image is being long-pressed

  const [baseAddress, setBaseAddress] = useState("");

  // New state variables for location
  const [latitude, setLatitude] = useState(""); // State for latitude
  const [longitude, setLongitude] = useState(""); // State for longitude

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // New state variables for the additional fields
  const [artistName, setArtistName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  // Show/hide functions

  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(null);

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

  const genreRef = useRef();

  const handleGenreSelect = (genre) => {
    setEventGenre(genre);
    setShowGenreDropdown(false); // Close the dropdown after selection
  };

  const toggleGenreDropdown = () => {
    setShowGenreDropdown((prev) => !prev);
  };

  const pickMedia = async (index, setImageArray, imageArray, type) => {
    let options = {
      mediaTypes: type,
      allowsEditing: true,
      quality: 1,
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (typeof uri === "string") {
        const newImages = [...imageArray];
        newImages[index] = uri;
        setImageArray(newImages);
      } else {
        console.error("Invalid URI:", uri);
      }
    }
  };

  const pickImage = (index) =>
    pickMedia(index, setImages, images, ImagePicker.MediaTypeOptions.Images);

  const pickVideo = async () => {
    let options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (typeof uri === "string") {
        setVideoUrl(uri);
        const { uri: thumbnailUri } = await Video.createThumbnailAsync(uri, {
          time: 5000, // Time in milliseconds (e.g., 5000 for 5 seconds)
        });
        setVideoThumbnailUrl(thumbnailUri); // Store the thumbnail URL
      } else {
        console.error("Invalid video URL:", uri);
      }
    }
  };

  // Show/hide functions
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showTimePicker = () => setTimePickerVisibility(true); // Ensure this is only declared once
  const hideTimePicker = () => setTimePickerVisibility(false);

  const handleConfirmDate = (date) => {
    setStartDate(date);
    hideDatePicker();
  };

  const handleConfirmTime = (time) => {
    setStartTime(time);
    hideTimePicker();
  };

  const uploadFile = async (fileUri, type) => {
    const data = new FormData();
    data.append("file", {
      uri: fileUri,
      type: type === "image" ? "image/jpeg" : "video/mp4",
      name: type === "image" ? "image.jpg" : "video.mp4",
    });
    data.append(
      "upload_preset",
      type === "image" ? "images_preset" : "videos_preset"
    );

    try {
      let cloudName = CLOUDINARY_CLOUD_NAME;
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleDeleteImage = (index) => {
    // Create a copy of the current images array
    const updatedImages = [...images];

    // Remove the image at the specified index
    updatedImages.splice(index, 1);

    // Update the state with the new images array
    setImages(updatedImages);

    // Optionally, you can also hide the delete icon after deleting
    setShowDeleteIcon(null);
  };

  // const refreshAuthToken = async (refreshToken) => {
  //   console.log("Attempting to refresh with token:", refreshToken);
  //   try {
  //     const response = await axios.post(`${API_URL}/user/refresh-token`, {
  //       token: refreshToken,
  //     });
  //     return response.data.token; // Return the new token
  //   } catch (error) {
  //     console.error("Error refreshing token:", error);
  //     throw error; // Rethrow error to handle it in the calling function
  //   }
  // };

  const fetchLocationCoordinates = async (
    baseAddress,
    city,
    state,
    country
  ) => {
    try {
      console.log("ola api : ", OLA_MAPS_API_KEY);
      const locationString = `${baseAddress}, ${city}, ${state}, ${country}`;
      console.log("location FROM FEEDSCREEN :", locationString);

      const requestId = uuidv4();
      console.log("requestId", requestId);

      const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${locationString}&api_key=${OLA_MAPS_API_KEY}`;
      const response = await axios.get(geocodeUrl, {
        headers: { "X-Request-Id": requestId },
      });

      if (
        response.data.geocodingResults &&
        response.data.geocodingResults.length > 0
      ) {
        const { lat, lng } =
          response.data.geocodingResults[0].geometry.location;
        console.log("Coordinates:", { latitude: lat, longitude: lng });
        return { latitude: lat, longitude: lng }; // Return coordinates
      } else {
        console.error("No results found for the provided location.");
        return null; // Return null if no results found
      }
    } catch (error) {
      console.error(
        "Error fetching coordinates:",
        error.response || error.message
      );
      return null; // Return null on error
    }
  };

  const handlePublish = async () => {
    try {
      // Step 1: Fetch and decode the token
      let token = await getToken();
      console.log("Token from CreateEventScreen:", token);

      if (!token) {
        console.log("No access token found. Cannot proceed with publish.");
        return; // Prevent proceeding without a valid token
      }

      const decodedToken = jwtDecode(token);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      console.log("Token expiration time (exp):", decodedToken.exp);
      console.log("Current time in seconds:", currentTimeInSeconds);

      if (decodedToken.exp < currentTimeInSeconds) {
        console.log("Token expired. Please log in again.");
        alert("Session expired. Please log in again.");
        return; // Exit the publish function if the token is expired
      }

      // Step 2: Prepare date and time in the required format
      const formattedDate = startDate ? new Date(startDate).toISOString() : "";
      const formattedTime = startTime
        ? startTime.toTimeString().split(" ")[0]
        : "";

      // Step 3: Upload images and video if available
      const uploadedImages = await Promise.all(
        images.map(async (image) =>
          image ? await uploadFile(image, "image") : null
        )
      );
      const validImages = uploadedImages.filter(Boolean);
      const uploadedVideo = videoUrl
        ? await uploadFile(videoUrl, "video")
        : null;

      // Step 4: Fetch coordinates based on baseAddress
      const locationCoordinates = await fetchLocationCoordinates(
        baseAddress,
        cityName,
        stateName,
        countryName
      );

      if (!locationCoordinates) {
        alert("Failed to fetch location coordinates.");
        return;
      }

      const { latitude, longitude } = locationCoordinates;
      const locationData = {
        baseAddress,
        country: countryName,
        state: stateName,
        city: cityName,
        latitude,
        longitude,
      };

      // Step 5: Assemble event data
      const eventData = {
        userId: await getUserId(),
        title,
        date: formattedDate,
        time: formattedTime,
        organizer: organizerName,
        eventDetails: description,
        artists: [{ name: artistName, role: "Artist" }],
        location: locationData,
        genre: eventGenre,
        images: validImages.map((url) => ({ url })),
        videoUrl: uploadedVideo,
        ticketPrice: parseFloat(ticketPrice),
      };

      console.log("Event data:", eventData);

      // Step 6: Make the publish request
      const response = await axios.post(`${API_URL}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 20000,
      });

      if (response.status === 201) {
        alert("Event successfully published!");
        navigation.goBack();
      } else {
        alert(`Failed to publish event. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error publishing event:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subHeader}>Add Photos</Text>

        {/* Scrollable Container for Images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScrollContainer}
        >
          <TouchableOpacity
            style={styles.largeImageUpload}
            onLongPress={() => setShowDeleteIcon(0)} // Show delete icon on long press
            onPress={() => pickImage(0)} // Allow changing image
          >
            {images[0] ? (
              <>
                <Image source={{ uri: images[0] }} style={styles.image} />
                {showDeleteIcon === 0 && (
                  <TouchableOpacity
                    style={styles.deleteIconWrapper}
                    onPress={() => handleDeleteImage(0)} // Delete image on icon press
                  >
                    <Ionicons name="trash" size={24} color="red" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Ionicons name="camera-outline" size={36} color="black" />
            )}
          </TouchableOpacity>

          <View style={styles.smallImagesContainer}>
            {[1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.smallImageUpload}
                onLongPress={() => setShowDeleteIcon(index)} // Show delete icon on long press
                onPress={() => pickImage(index)} // Allow changing image
              >
                {images[index] ? (
                  <>
                    <Image
                      source={{ uri: images[index] }}
                      style={styles.image}
                    />
                    {showDeleteIcon === index && (
                      <TouchableOpacity
                        style={styles.deleteIconWrapper}
                        onPress={() => handleDeleteImage(index)} // Delete image on icon press
                      >
                        <Ionicons name="trash" size={24} color="red" />
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Ionicons name="camera-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Rest of your form code goes here */}
        <View style={{ marginVertical: 20 }} />

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Base Address</Text>
        <TextInput
          style={styles.input}
          value={baseAddress}
          onChangeText={setBaseAddress}
          placeholder="Enter event address"
        />

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
            {/* State Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>State</Text>
              {/* <Dropdown
                style={styles.dropdown}
                data={stateData}
                labelField="label"
                valueField="value"
                placeholder="Select state"
                value={state}
                onChange={(item) => {
                  setSelectedState(item.value);
                  handleCity(country, item.value); // Fetch cities when state is selected
                }}
                search // Enables search
                searchPlaceholder="Search state"
                containerStyle={styles.dropdownContainerStyle}
                iconStyle={styles.iconStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
              /> */}
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
            <View
              style={[styles.dropdownContainer, styles.dropdownContainerLast]}
            >
              <Text style={styles.label}>City</Text>
              {/* <Dropdown
                style={styles.dropdown}
                data={cityData}
                labelField="label"
                valueField="value"
                placeholder="Select city"
                value={selectedCity}
                onChange={(item) => setSelectedCity(item.value)}
                search // Enables search
                searchPlaceholder="Search city"
                containerStyle={styles.dropdownContainerStyle}
                iconStyle={styles.iconStyle}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
              /> */}
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
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeSection}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.dateTimeButton}
            >
              <Text style={styles.dateTimeButtonText}>
                {startDate ? startDate.toLocaleDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeSection}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              onPress={showTimePicker}
              style={styles.dateTimeButton}
            >
              <Text style={styles.dateTimeButtonText}>
                {startTime
                  ? startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select Time"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            textColor="#000"
            // minimumDate={today}
          />

          {/* Time Picker Modal */}
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
            textColor="#000"
          />
        </View>

        <Text style={styles.label}>Organizer Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Organizer name"
          value={organizerName}
          onChangeText={setOrganizerName}
        />

        <Text style={styles.label}>Event Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter event details"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Select Event Genre</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleGenreDropdown}
        >
          <Text style={styles.dropdownButtonText}>
            {eventGenre || "Select Genre"}
          </Text>
        </TouchableOpacity>

        {showGenreDropdown && (
          <View style={styles.dropdowngenreContainer}>
            {eventGenres.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={styles.dropdownItem}
                onPress={() => handleGenreSelect(genre)}
              >
                <Text style={styles.dropdownItemText}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Artist Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter artist name"
          value={artistName}
          onChangeText={setArtistName}
        />

        <Text style={styles.label}>Video URL</Text>
        <View style={styles.videoContainer}>
          <TouchableOpacity onPress={pickVideo} style={styles.videoUpload}>
            {videoUrl ? (
              <>
                {videoThumbnailUrl ? (
                  <Image
                    source={{ uri: videoThumbnailUrl }}
                    style={styles.videoThumbnail}
                  />
                ) : (
                  <Ionicons name="videocam-outline" size={36} color="black" />
                )}
                <Text style={styles.videoText}>Video Selected</Text>
              </>
            ) : (
              <>
                <Ionicons name="videocam-outline" size={36} color="black" />
                <Text style={styles.videoText}>Upload Video</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Ticket Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ticket price"
          keyboardType="numeric"
          value={ticketPrice}
          onChangeText={setTicketPrice}
        />

        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <Text style={styles.publishButtonText}>Publish Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: "#f9f9f9", // Light background for a professional look
  },
  dropdownContainer: {
    flex: 1, // Each dropdown takes equal space
    marginRight: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 8,
    marginVertical: 8,
    color: "#333",
  },
  dropdownlocationRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Adjust as needed (e.g., 'flex-start', 'space-around')
    alignItems: "center",
    marginVertical: 10, // Space above and below the row
  },
  dropdownContainerLast: {
    marginRight: 0, // Remove margin from the last dropdown
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
  dropdownButton: {
    backgroundColor: "#f8f9fa", // Light background color
    borderColor: "#ced4da", // Light border color
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1, // Add shadow on Android
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4, // Shadow blur
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#212529", // Dark text color
  },
  dropdowngenreContainer: {
    backgroundColor: "#ffffff", // White background for dropdown items
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    elevation: 2, // Add shadow for dropdown
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 400, // Limit dropdown height
    overflow: "scroll", // Ensure scrolling if items exceed max height
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: "#ced4da",
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#212529",
  },
  dropdownContainerStyle: {
    borderRadius: 8,
    padding: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  placeholderStyle: {
    color: "#999",
    fontSize: 14,
  },
  selectedTextStyle: {
    color: "#333",
    fontSize: 16,
  },
  scrollContainer: {
    // flexGrow: 1,
    // justifyContent: "flex-start",
    padding: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#444", // Darker color for contrast
  },
  photosScrollContainer: {
    paddingVertical: 10, // Adds vertical padding
    marginBottom: 16, // Adds space below the image scroll view
    padding: 10,
  },

  photosContainer: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between", // Ensures even spacing
  },
  largeImageUpload: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",

    alignItems: "center",
    backgroundColor: "#fff", // White background for better contrast
    elevation: 2, // Adds shadow for depth
  },
  smallImagesContainer: {
    flex: 1,
    flexDirection: "row", // Align small images in a row
    justifyContent: "space-between",
  },
  smallImageUpload: {
    width: 150, // Match large image container size
    height: 150, // Match large image container size
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // White background for better contrast
    elevation: 2, // Adds shadow for depth
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    height: 45, // Increased height for better touch response
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    // color: "#fff",
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff", // White background for better contrast
    elevation: 1, // Adds slight shadow for depth
  },
  textArea: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff", // White background for better contrast
    elevation: 1, // Adds slight shadow for depth
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  dateTimeSection: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateTimeButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ced4da",
    alignItems: "center",
    justifyContent: "center",
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: "#212529",
  },
  publishButton: {
    backgroundColor: "#007bff", // Primary color for the button
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 100,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateEventScreen;
