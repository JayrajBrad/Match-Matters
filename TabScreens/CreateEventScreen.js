import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
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
import { UserContext } from "../navigation/UserProvider";
import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo

const CreateEventScreen = ({ navigation }) => {
  const { userId, token } = useContext(UserContext);

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

  useEffect(() => {
    // Request media library permissions when the component mounts
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera roll permissions to make this work!"
        );
      }
    })();
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

  const pickImage = async (index) => {
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // <-- Use MediaTypeOptions
        allowsEditing: true,
        quality: 1,
      };
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        if (typeof uri === "string") {
          // Update images array
          const newImages = [...images];
          newImages[index] = uri;
          setImages(newImages);
        }
      }
    } catch (error) {
      console.log("Error opening image picker:", error);
    }
  };

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
        // Optionally generate a thumbnail using expo-av
        const { uri: thumbnailUri } = await Video.createThumbnailAsync(uri, {
          time: 5000,
        });
        setVideoThumbnailUrl(thumbnailUri);
      }
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null; // Remove the image at that index
    setImages(updatedImages);
    setShowDeleteIcon(null);
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

  // const generateUniqueFileName = (originalFileName, type) => {
  //   const timestamp = Date.now();
  //   const randomString = Math.random().toString(36).substring(2, 8);
  //   const extension = type === "image" ? "jpg" : "mp4";
  //   return `${timestamp}-${randomString}.${extension}`;
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

      const generateId = () => Math.random().toString(36).substring(2, 15);
      const requestId = generateId();
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

  // const uploadFileToS3 = async (fileUri, type) => {
  //   try {
  //     const folder = type === "image" ? "mm_images" : "mm_videos";
  //     const fileType = type === "image" ? "image/jpeg" : "video/mp4";
  //     const originalFileName = fileUri.split("/").pop();
  //     const uniqueFileName = generateUniqueFileName(originalFileName, type);

  //     const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
  //       folder,
  //       fileType,
  //       fileName: uniqueFileName,
  //     });

  //     const { uploadUrl, key } = data;
  //     const fileResponse = await fetch(fileUri);
  //     const blob = await fileResponse.blob();

  //     await axios.put(uploadUrl, blob, {
  //       headers: { "Content-Type": fileType },
  //     });

  //     return key;
  //   } catch (error) {
  //     console.error("Error uploading to S3:", error);
  //     throw error;
  //   }
  // };

  function guessMimeType(fileUri) {
    // Extract the extension (e.g. "JPG", "png", "MP4")
    const extension = fileUri.split(".").pop().toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "mp4":
        return "video/mp4";
      case "mov":
        return "video/quicktime";
      default:
        // Fallback if it’s an unrecognized extension
        return "application/octet-stream";
    }
  }

  function generateUniqueFileName(originalFileName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}-${originalFileName}`;
  }

  const uploadFileToS3 = async (fileUri) => {
    try {
      // 1) Guess MIME from extension
      const fileType = guessMimeType(fileUri);

      // 2) Decide folder: if the MIME starts with "video/", use mm_videos; else mm_images
      const folder = fileType.startsWith("video/") ? "mm_videos" : "mm_images";

      // 3) Generate a unique file name
      //    e.g. "1631839453-abc123-myphoto.jpg"
      const originalFileName = fileUri.split("/").pop() || "unknown.file";
      const uniqueFileName = generateUniqueFileName(originalFileName);

      // 4) Request pre-signed URL from your backend
      const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
        folder,
        fileType, // e.g. "image/png" or "video/mp4"
        fileName: uniqueFileName,
      });

      const { uploadUrl, key } = data;

      // 5) Download local file as a blob
      const fileResponse = await fetch(fileUri);
      const blob = await fileResponse.blob();

      console.log("Blob size:", blob.size);

      // 6) Upload (PUT) to S3

      await fetch(uploadUrl, {
        method: "PUT",
        body: blob, // Use blob directly
        headers: {
          "Content-Type": fileType,
          "Content-Length": blob.size, // Make sure MIME type is correct
        },
      });

      return key; // e.g. "mm_images/1631839453-abc123-myphoto.jpg"
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  const handlePublish = async () => {
    try {
      // Step 1: Fetch and decode the token
      // let token = token;
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
      // const formattedDate = startDate ? new Date(startDate).toISOString() : "";
      // const formattedTime = startTime
      //   ? startTime.toTimeString().split(" ")[0]
      //   : "";

      // Step 3: Upload images and video if available
      const uploadedImages = await Promise.all(
        images.map((imgUri) => (imgUri ? uploadFileToS3(imgUri) : null))
      );
      const validImages = uploadedImages.filter(Boolean);

      // 2) Upload video if any
      const uploadedVideo = videoUrl ? await uploadFileToS3(videoUrl) : null;

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

      const formattedDate = startDate ? new Date(startDate).toISOString() : "";
      const formattedTime = startTime
        ? startTime.toTimeString().split(" ")[0]
        : "";

      // Step 5: Assemble event data
      const eventData = {
        userId,
        title,
        date: formattedDate,
        time: formattedTime,
        organizer: organizerName,
        eventDetails: description,
        artists: [{ name: artistName, role: "Artist" }],
        location: locationData,
        genre: eventGenre,
        images: validImages.map((key) => ({ url: key })),
        videoUrl: uploadedVideo,
        ticketPrice: parseFloat(ticketPrice),
      };

      console.log("Event data:", eventData);

      // Step 6: Make the publish request
      const response = await axios.post(`${API_URL}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
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
        {/* <Text style={styles.subHeader}>Add Photos</Text> */}

        {/* Scrollable Container for Images */}

        {/* Rest of your form code goes here */}
        <View />

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Event title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="white"
        />

        {/* <ScrollView
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
        </ScrollView> */}

        {/* Images (all the same size) */}
        <Text style={styles.label}>Event Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScrollContainer}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={`img-${index}`}
              style={styles.imageItem}
              onPress={() => pickImage(index)}
              onLongPress={() => setShowDeleteIcon(index)}
            >
              {image ? (
                <>
                  <Image source={{ uri: image }} style={styles.image} />
                  {showDeleteIcon === index && (
                    <TouchableOpacity
                      style={styles.deleteIconWrapper}
                      onPress={() => handleDeleteImage(index)}
                    >
                      <Ionicons name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Ionicons name="cloud-upload-outline" size={26} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Base Address</Text>
        <TextInput
          style={styles.input}
          value={baseAddress}
          onChangeText={setBaseAddress}
          placeholder="Enter event address"
          placeholderTextColor="white"
        />

        <View style={styles.loccontainer}>
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
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 5 }}
                />
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
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 5 }}
                />
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
          placeholderTextColor="white"
        />

        <Text style={styles.label}>Short Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter event details"
          value={description}
          placeholderTextColor="white"
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
          placeholderTextColor="white"
        />

        <Text style={styles.label}>Video</Text>
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
                {/* <Text style={styles.videoText}>Upload Video</Text> */}
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
          placeholderTextColor="white"
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
    // backgroundColor: "#290F4C", // Light background for a professional look
    backgroundColor: "#fff", // Light background for a professional look
  },
  dropdownContainer: {
    flex: 1, // Each dropdown takes equal space
    marginRight: 10,
  },

  label: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    // marginBottom: 8,
    marginVertical: 8,
    color: "#814C68",
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
    backgroundColor: "#814C68",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,

    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dropdownButton: {
    backgroundColor: "#814C68", // Light background color
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
    color: "#fff", // Dark text color
    fontFamily: "CenturyGothic",
  },
  dropdowngenreContainer: {
    backgroundColor: "#814C68", // White background for dropdown items
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
    backgroundColor: "#814C68",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#814C68",
    fontFamily: "CenturyGothic",
  },
  inputSearchStyle: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#814C68",
    fontFamily: "CenturyGothic",
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
    color: "#fff",
    fontSize: 14,
    fontFamily: "CenturyGothic",
  },
  selectedTextStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "CenturyGothic",
  },
  scrollContainer: {
    // flexGrow: 1,
    // backgroundColor: "#290F4C",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#444", // Darker color for contrast
  },

  photosScrollContainer: {
    marginBottom: 16,
    marginTop: 10,
  },
  imageItem: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#814C68",
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10, // spacing between images
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  deleteIconWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 15,
    padding: 3,
  },
  input: {
    height: 45, // Increased height for better touch response
    borderColor: "#ccc",
    fontFamily: "CenturyGothic",
    borderWidth: 1,
    borderRadius: 15,
    color: "#fff",
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#814C68", // White background for better contrast
    elevation: 1, // Adds slight shadow for depth
  },
  textArea: {
    height: 100,
    fontFamily: "CenturyGothic",

    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 16,
    // textAlignVertical: "top",
    backgroundColor: "#814C68", // White background for better contrast
    elevation: 1, // Adds slight shadow for depth
  },
  videoText: {
    fontFamily: "CenturyGothic",
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

  dateTimeButton: {
    backgroundColor: "#814C68",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    justifyContent: "space-evenly",
    borderColor: "#ced4da",
    alignItems: "center",
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: "#fff",

    fontFamily: "CenturyGothic",
  },
  publishButton: {
    backgroundColor: "#814C68", // Primary color for the button
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 80,
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
  },
});

export default CreateEventScreen;

// CreateEventScreen.js

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   useCallback,
//   useContext,
// } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   ScrollView,
//   Image,
//   Keyboard,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import { Video } from "expo-av";
// import { Dropdown } from "react-native-element-dropdown";
// import { Country, State, City } from "country-state-city";
// import { API_URL, OLA_MAPS_API_KEY } from "@env";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { v4 as uuidv4 } from "uuid";
// import { UserContext } from "../navigation/UserProvider";
// import { MaterialCommunityIcons } from "react-native-vector-icons"; // If you are using expo

// // Helper to guess MIME type from file extension
// function guessMimeType(filePath) {
//   // Extract extension from something like "file:///path/to/image.JPG"
//   // or "/storage/emulated/0/DCIM/Camera/VID_1234.MP4"
//   const ext = filePath.split(".").pop().toLowerCase();
//   if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
//   if (ext === "png") return "image/png";
//   if (ext === "gif") return "image/gif";
//   if (ext === "mp4") return "video/mp4";
//   // Fallback
//   return "application/octet-stream";
// }

// function CreateEventScreen({ navigation }) {
//   const { userId, token } = useContext(UserContext);

//   const [images, setImages] = useState([null, null, null]);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(null);

//   const [title, setTitle] = useState("");
//   const [organizerName, setOrganizerName] = useState("");
//   const [description, setDescription] = useState("");
//   const [eventGenre, setEventGenre] = useState("");
//   const [showGenreDropdown, setShowGenreDropdown] = useState(false);

//   const [baseAddress, setBaseAddress] = useState("");
//   const [countryData, setCountryData] = useState([]);
//   const [stateData, setStateData] = useState([]);
//   const [cityData, setCityData] = useState([]);
//   const [country, setCountry] = useState(null);
//   const [countryName, setCountryName] = useState(null);
//   const [stateVal, setStateVal] = useState(null);
//   const [stateName, setStateName] = useState(null);
//   const [city, setCity] = useState(null);
//   const [cityName, setCityName] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   const [artistName, setArtistName] = useState("");
//   const [ticketPrice, setTicketPrice] = useState("");

//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);

//   useEffect(() => {
//     const loadCountries = () => {
//       const countryArray = Country.getAllCountries().map((c) => ({
//         value: c.isoCode,
//         label: c.name,
//       }));
//       setCountryData(countryArray);
//     };
//     loadCountries();
//   }, []);

//   // Request media library permissions
//   useEffect(() => {
//     (async () => {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission required",
//           "We need camera roll permissions to make this work!"
//         );
//       }
//     })();
//   }, []);

//   const handleState = useCallback((countryCode) => {
//     const states = State.getStatesOfCountry(countryCode).map((s) => ({
//       value: s.isoCode,
//       label: s.name,
//     }));
//     setStateData(states);
//     setStateVal(null);
//     setCity(null);
//     setCityData([]);
//   }, []);

//   const handleCity = useCallback((countryCode, stateCode) => {
//     const cities = City.getCitiesOfState(countryCode, stateCode).map((ct) => ({
//       value: ct.name,
//       label: ct.name,
//     }));
//     setCityData(cities);
//     setCity(null);
//   }, []);

//   const toggleGenreDropdown = () => {
//     setShowGenreDropdown((prev) => !prev);
//   };

//   const handleGenreSelect = (genre) => {
//     setEventGenre(genre);
//     setShowGenreDropdown(false);
//   };

//   const pickImage = async (index) => {
//     try {
//       const options = {
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//       };
//       const result = await ImagePicker.launchImageLibraryAsync(options);
//       if (!result.canceled) {
//         const uri = result.assets[0]?.uri;
//         if (typeof uri === "string") {
//           // Update images array
//           const newImages = [...images];
//           newImages[index] = uri;
//           setImages(newImages);
//         }
//       }
//     } catch (error) {
//       console.log("Error picking image:", error);
//     }
//   };

//   const pickVideo = async () => {
//     try {
//       const options = {
//         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//         allowsEditing: true,
//         quality: 1,
//       };
//       const result = await ImagePicker.launchImageLibraryAsync(options);
//       if (!result.canceled) {
//         const uri = result.assets[0]?.uri;
//         if (typeof uri === "string") {
//           setVideoUrl(uri);
//           // Optionally generate a thumbnail
//           const { uri: thumbnailUri } = await Video.createThumbnailAsync(uri, {
//             time: 5000,
//           });
//           setVideoThumbnailUrl(thumbnailUri);
//         }
//       }
//     } catch (err) {
//       console.error("Error picking video:", err);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = [...images];
//     updatedImages[index] = null;
//     setImages(updatedImages);
//   };

//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);

//   const showTimePicker = () => setTimePickerVisibility(true);
//   const hideTimePicker = () => setTimePickerVisibility(false);

//   const handleConfirmDate = (date) => {
//     setStartDate(date);
//     hideDatePicker();
//   };

//   const handleConfirmTime = (time) => {
//     setStartTime(time);
//     hideTimePicker();
//   };

//   /**
//    * Dynamically determine file type by extension and request a pre-signed URL,
//    * then do a PUT upload to S3.
//    */
//   const uploadFileToS3 = async (fileUri) => {
//     try {
//       // 1) Guess MIME type from file extension
//       const fileType = guessMimeType(fileUri);

//       // 2) Build a unique key name
//       const folder = fileType.startsWith("video/") ? "mm_videos" : "mm_images";
//       const originalFileName = fileUri.split("/").pop() || "unknown.file";
//       const uniqueFileName = `${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)}-${originalFileName}`;

//       // 3) Request a pre-signed URL from your backend
//       const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
//         folder,
//         fileType, // e.g. "image/png" or "video/mp4"
//         fileName: uniqueFileName,
//       });

//       const { uploadUrl, key } = data;

//       // 4) Fetch the file from local URI as a blob
//       const fileResponse = await fetch(fileUri);
//       const blob = await fileResponse.blob();

//       // 5) PUT the blob to the pre-signed S3 URL
//       await axios.put(uploadUrl, blob, {
//         headers: { "Content-Type": fileType },
//       });

//       return key; // e.g. "mm_images/123xyz-foo.jpg"
//     } catch (error) {
//       console.error("Error uploading to S3:", error);
//       throw error;
//     }
//   };

//   /**
//    * Use Olamaps to geocode the location
//    */
//   const fetchLocationCoordinates = async (
//     baseAddress,
//     city,
//     state,
//     country
//   ) => {
//     try {
//       const locationString = `${baseAddress}, ${city}, ${state}, ${country}`;
//       console.log("Location to geocode =>", locationString);

//       const requestId = Math.random().toString(36).substring(2, 15);
//       const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
//         locationString
//       )}&api_key=${OLA_MAPS_API_KEY}`;

//       const response = await axios.get(geocodeUrl, {
//         headers: { "X-Request-Id": requestId },
//       });

//       if (
//         response.data.geocodingResults &&
//         response.data.geocodingResults.length > 0
//       ) {
//         const { lat, lng } =
//           response.data.geocodingResults[0].geometry.location;
//         console.log("Coordinates:", { latitude: lat, longitude: lng });
//         return { latitude: lat, longitude: lng };
//       } else {
//         console.error("No results found for that location.");
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       return null;
//     }
//   };

//   const handlePublish = async () => {
//     try {
//       if (!token) {
//         console.log("No access token found. Cannot proceed.");
//         return;
//       }

//       // (Optional) check token expiration if you want
//       // e.g. decode token, check exp, etc.

//       // 1) Upload images
//       const uploadedImages = await Promise.all(
//         images.map(async (uri) => (uri ? uploadFileToS3(uri) : null))
//       );
//       const validImages = uploadedImages.filter(Boolean);

//       // 2) Upload video if any
//       const uploadedVideo = videoUrl ? await uploadFileToS3(videoUrl) : null;

//       // 3) Geocode location
//       const coords = await fetchLocationCoordinates(
//         baseAddress,
//         cityName,
//         stateName,
//         countryName
//       );
//       if (!coords) {
//         Alert.alert("Location Error", "Failed to fetch location coordinates.");
//         return;
//       }

//       const { latitude, longitude } = coords;
//       const formattedDate = startDate ? new Date(startDate).toISOString() : "";
//       const formattedTime = startTime
//         ? startTime.toTimeString().split(" ")[0]
//         : "";

//       // 4) Build event data
//       const eventData = {
//         userId,
//         title,
//         date: formattedDate,
//         time: formattedTime,
//         organizer: organizerName,
//         eventDetails: description,
//         artists: [{ name: artistName, role: "Artist" }],
//         location: {
//           baseAddress,
//           country: countryName,
//           state: stateName,
//           city: cityName,
//           latitude,
//           longitude,
//         },
//         genre: eventGenre,
//         images: validImages.map((key) => ({ url: key })),
//         videoUrl: uploadedVideo,
//         ticketPrice: parseFloat(ticketPrice),
//       };

//       console.log("Event data =>", eventData);

//       // 5) Send event data to your backend
//       const response = await axios.post(`${API_URL}/api/events`, eventData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: 20000,
//       });

//       if (response.status === 201) {
//         Alert.alert("Success", "Event published!");
//         navigation.goBack();
//       } else {
//         Alert.alert(
//           "Error",
//           `Failed to publish event. Status: ${response.status}`
//         );
//       }
//     } catch (error) {
//       console.error("Error publishing event:", error);
//       Alert.alert("Error", "An error occurred. Please try again.");
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.label}>Title</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Event title"
//           value={title}
//           onChangeText={setTitle}
//           placeholderTextColor="white"
//         />

//         <Text style={styles.label}>Event Photos</Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.photosScrollContainer}
//         >
//           {images.map((image, index) => (
//             <TouchableOpacity
//               key={`img-${index}`}
//               style={styles.imageItem}
//               onPress={() => pickImage(index)}
//               onLongPress={() => handleDeleteImage(index)}
//             >
//               {image ? (
//                 <Image source={{ uri: image }} style={styles.image} />
//               ) : (
//                 <Ionicons name="cloud-upload-outline" size={26} color="#fff" />
//               )}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <Text style={styles.label}>Base Address</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter event address"
//           placeholderTextColor="white"
//           value={baseAddress}
//           onChangeText={setBaseAddress}
//         />

//         {/* Country/State/City pickers */}
//         <View style={styles.loccontainer}>
//           <View style={styles.dropdownContainer}>
//             <Text style={styles.label}>Country</Text>
//             <Dropdown
//               style={styles.dropdown}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={countryData}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Select Country"
//               searchPlaceholder="Search..."
//               value={country}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={(item) => {
//                 setCountry(item.value);
//                 setCountryName(item.label);
//                 handleState(item.value);
//               }}
//             />
//           </View>

//           <View style={styles.dropdownlocationRowContainer}>
//             <View style={styles.dropdownContainer}>
//               <Text style={styles.label}>State</Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 inputSearchStyle={styles.inputSearchStyle}
//                 iconStyle={styles.iconStyle}
//                 data={stateData}
//                 search
//                 maxHeight={300}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select State"
//                 searchPlaceholder="Search..."
//                 value={stateVal}
//                 onFocus={() => setIsFocus(true)}
//                 onBlur={() => setIsFocus(false)}
//                 onChange={(item) => {
//                   setStateVal(item.value);
//                   setStateName(item.label);
//                   handleCity(country, item.value);
//                 }}
//               />
//             </View>

//             <View
//               style={[styles.dropdownContainer, styles.dropdownContainerLast]}
//             >
//               <Text style={styles.label}>City</Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 inputSearchStyle={styles.inputSearchStyle}
//                 iconStyle={styles.iconStyle}
//                 data={cityData}
//                 search
//                 maxHeight={300}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select City"
//                 searchPlaceholder="Search..."
//                 value={city}
//                 onFocus={() => setIsFocus(true)}
//                 onBlur={() => setIsFocus(false)}
//                 onChange={(item) => {
//                   setCity(item.value);
//                   setCityName(item.label);
//                 }}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Start Date/Time */}
//         <View style={styles.dateTimeContainer}>
//           <View style={styles.dateTimeSection}>
//             <Text style={styles.label}>Start Date</Text>
//             <TouchableOpacity
//               onPress={showDatePicker}
//               style={styles.dateTimeButton}
//             >
//               <Text style={styles.dateTimeButtonText}>
//                 {startDate ? startDate.toLocaleDateString() : "Select Date"}
//                 <MaterialCommunityIcons
//                   name="calendar"
//                   size={20}
//                   color="#fff"
//                   style={{ marginLeft: 5 }}
//                 />
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.dateTimeSection}>
//             <Text style={styles.label}>Start Time</Text>
//             <TouchableOpacity
//               onPress={showTimePicker}
//               style={styles.dateTimeButton}
//             >
//               <Text style={styles.dateTimeButtonText}>
//                 {startTime
//                   ? startTime.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })
//                   : "Select Time"}
//                 <MaterialCommunityIcons
//                   name="clock-outline"
//                   size={20}
//                   color="#fff"
//                   style={{ marginLeft: 5 }}
//                 />
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <DateTimePickerModal
//           isVisible={isDatePickerVisible}
//           mode="date"
//           onConfirm={handleConfirmDate}
//           onCancel={hideDatePicker}
//         />
//         <DateTimePickerModal
//           isVisible={isTimePickerVisible}
//           mode="time"
//           onConfirm={handleConfirmTime}
//           onCancel={hideTimePicker}
//         />

//         <Text style={styles.label}>Organizer Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Organizer name"
//           value={organizerName}
//           onChangeText={setOrganizerName}
//           placeholderTextColor="white"
//         />

//         <Text style={styles.label}>Short Description</Text>
//         <TextInput
//           style={styles.textArea}
//           placeholder="Enter event details"
//           value={description}
//           placeholderTextColor="white"
//           onChangeText={setDescription}
//           multiline
//         />

//         <Text style={styles.label}>Select Event Genre</Text>
//         <TouchableOpacity
//           style={styles.dropdownButton}
//           onPress={toggleGenreDropdown}
//         >
//           <Text style={styles.dropdownButtonText}>
//             {eventGenre || "Select Genre"}
//           </Text>
//         </TouchableOpacity>
//         {showGenreDropdown && (
//           <View style={styles.dropdowngenreContainer}>
//             {[
//               "Business Event",
//               "House Party",
//               "Networking Event",
//               "Workshop",
//               "Cultural Event",
//               "Food Festival",
//               "Music Concert",
//               "Game Night",
//               "Outdoor Activity",
//               "Travel Meetup",
//             ].map((genre) => (
//               <TouchableOpacity
//                 key={genre}
//                 style={styles.dropdownItem}
//                 onPress={() => handleGenreSelect(genre)}
//               >
//                 <Text style={styles.dropdownItemText}>{genre}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <Text style={styles.label}>Artist Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter artist name"
//           value={artistName}
//           onChangeText={setArtistName}
//           placeholderTextColor="white"
//         />

//         <Text style={styles.label}>Video</Text>
//         <View style={styles.videoContainer}>
//           <TouchableOpacity onPress={pickVideo} style={styles.videoUpload}>
//             {videoUrl ? (
//               <>
//                 {videoThumbnailUrl ? (
//                   <Image
//                     source={{ uri: videoThumbnailUrl }}
//                     style={styles.videoThumbnail}
//                   />
//                 ) : (
//                   <Ionicons name="videocam-outline" size={36} color="black" />
//                 )}
//                 <Text style={styles.videoText}>Video Selected</Text>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="videocam-outline" size={36} color="black" />
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.label}>Ticket Price</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter ticket price"
//           keyboardType="numeric"
//           value={ticketPrice}
//           onChangeText={setTicketPrice}
//           placeholderTextColor="white"
//         />

//         <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
//           <Text style={styles.publishButtonText}>Publish Event</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </TouchableWithoutFeedback>
//   );
// }

// export default CreateEventScreen;

// // -- STYLES --
// const styles = StyleSheet.create({
//   scrollContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontFamily: "CenturyGothicBold",
//     marginVertical: 8,
//     color: "#814C68",
//   },
//   input: {
//     height: 45,
//     borderColor: "#ccc",
//     fontFamily: "CenturyGothic",
//     borderWidth: 1,
//     borderRadius: 15,
//     color: "#fff",
//     paddingHorizontal: 10,
//     marginBottom: 16,
//     backgroundColor: "#814C68",
//     elevation: 1,
//   },
//   textArea: {
//     height: 100,
//     fontFamily: "CenturyGothic",
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 15,
//     paddingHorizontal: 10,
//     marginBottom: 16,
//     backgroundColor: "#814C68",
//     elevation: 1,
//   },
//   photosScrollContainer: {
//     marginBottom: 16,
//     marginTop: 10,
//   },
//   imageItem: {
//     width: 120,
//     height: 120,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     backgroundColor: "#814C68",
//     elevation: 2,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 10,
//   },
//   // Additional styling for location dropdowns, date/time pickers, etc.
//   loccontainer: {
//     // ...
//   },
//   dropdownContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dropdownlocationRowContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   dropdownContainerLast: {
//     marginRight: 0,
//   },
//   dropdown: {
//     backgroundColor: "#814C68",
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     elevation: 1,
//   },
//   placeholderStyle: {
//     color: "#fff",
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//   },
//   selectedTextStyle: {
//     color: "#fff",
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//   },
//   inputSearchStyle: {
//     fontSize: 16,
//     color: "#fff",
//     backgroundColor: "#814C68",
//     fontFamily: "CenturyGothic",
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   dropdownButton: {
//     backgroundColor: "#814C68",
//     borderColor: "#ced4da",
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   dropdownButtonText: {
//     fontSize: 16,
//     color: "#fff",
//     fontFamily: "CenturyGothic",
//   },
//   dropdowngenreContainer: {
//     backgroundColor: "#814C68",
//     borderColor: "#ced4da",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginTop: 5,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     maxHeight: 400,
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomColor: "#ced4da",
//     borderBottomWidth: 1,
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: "#fff",
//     fontFamily: "CenturyGothic",
//   },
//   dateTimeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   dateTimeSection: {
//     flex: 1,
//     marginRight: 8,
//   },
//   dateTimeButton: {
//     backgroundColor: "#814C68",
//     borderRadius: 15,
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ced4da",
//     alignItems: "center",
//   },
//   dateTimeButtonText: {
//     fontSize: 16,
//     color: "#fff",
//     fontFamily: "CenturyGothic",
//   },
//   videoContainer: {
//     flexDirection: "row",
//     marginBottom: 16,
//   },
//   videoUpload: {
//     width: 120,
//     height: 120,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   videoThumbnail: {
//     width: 100,
//     height: 80,
//     resizeMode: "cover",
//     borderRadius: 8,
//     marginBottom: 5,
//   },
//   videoText: {
//     fontFamily: "CenturyGothic",
//   },
//   publishButton: {
//     backgroundColor: "#814C68",
//     padding: 16,
//     borderRadius: 15,
//     alignItems: "center",
//     marginBottom: 80,
//   },
//   publishButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//   },
// });
