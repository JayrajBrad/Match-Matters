import React, { useState, useRef } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { getToken, getRefreshToken, saveToken } from "../backend/token";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY } from "@env";
import FormData from "form-data";
import { Picker } from "@react-native-picker/picker";

const CreateEventScreen = ({ navigation }) => {
  const [images, setImages] = useState([null, null, null]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [organizerName, setOrganizerName] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(true);
  const [eventGenre, setEventGenre] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  // New state variables for the additional fields
  const [artistName, setArtistName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

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

  const genreRef = useRef();

  const handleGenreSelect = (genre) => {
    setEventGenre(genre);
    setShowGenreDropdown(false); // Close the dropdown after selection
  };

  const toggleGenreDropdown = () => {
    setShowGenreDropdown((prev) => !prev);
  };

  // const handleOutsideClick = (event) => {
  //   // Check if the clicked target is outside the genre dropdown
  //   if (genreRef.current && !genreRef.current.contains(event.target)) {
  //     setShowGenreDropdown(false);
  //   }
  // };

  // // Attach event listener to close dropdown when clicking outside
  // React.useEffect(() => {
  //   document.addEventListener("mousedown", handleOutsideClick);
  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, []);

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
      } else {
        console.error("Invalid video URL:", uri);
      }
    }
  };

  const onDateTimeChange = (event, selectedValue) => {
    if (isDatePicker) {
      setShowDatePicker(false);
      if (selectedValue) {
        setStartDate(selectedValue);
      }
    } else {
      setShowTimePicker(false);
      if (selectedValue) {
        setStartTime(selectedValue);
      }
    }
  };

  const showDatePickerModal = () => {
    setIsDatePicker(true);
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setIsDatePicker(false);
    setShowTimePicker(true);
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

  const getSignatureForUpload = async (folder) => {
    try {
      const res = await axios.post(`${API_URL}/api/sign-upload`, { folder });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const refreshAuthToken = async (refreshToken) => {
    console.log("Attempting to refresh with token:", refreshToken);
    try {
      const response = await axios.post(`${API_URL}/user/refresh-token`, {
        token: refreshToken,
      });
      return response.data.token; // Return the new token
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error; // Rethrow error to handle it in the calling function
    }
  };

  const handlePublish = async () => {
    try {
      let token = await getToken(); // Get the token initially
      console.log("token from createevent :", token);

      if (!token) {
        console.log("No access token found. Cannot proceed with publish.");
        return; // Prevent proceeding without a valid token
      }
      const formattedDate = startDate ? new Date(startDate).toISOString() : "";
      const formattedTime = startTime
        ? startTime.toTimeString().split(" ")[0]
        : "";

      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          if (image) {
            return await uploadFile(image, "image");
          }
          return null;
        })
      );

      // Filter out null values
      const validImages = uploadedImages.filter(Boolean);

      const uploadedVideo = videoUrl
        ? await uploadFile(videoUrl, "video")
        : null;

      // Prepare the event data
      const eventData = {
        title,
        date: formattedDate,
        time: formattedTime,
        organizer: organizerName,
        eventDetails: description,
        artists: [
          {
            name: artistName,
            role: "Artist",
          },
        ],
        location,
        genre: eventGenre,
        images: validImages.map((url) => ({ url })),
        videoUrl: uploadedVideo,
        ticketPrice: parseFloat(ticketPrice),
      };

      console.log("event data :", eventData);

      // Function to send the publish request
      const publishEvent = async (token) => {
        return await axios.post(
          `${API_URL}/api/events`, // Adjust the URL as needed
          eventData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            timeout: 10000,
          }
        );
      };

      // Attempt to publish the event
      try {
        const response = await publishEvent(token);
        if (response.status === 201) {
          alert("Event successfully published!");
          navigation.goBack();
        } else {
          alert(`Failed to publish event. Status: ${response.status}`);
        }
      } catch (error) {
        // Handle token expiration
        if (error.response && error.response.status === 403) {
          console.log("Token expired, attempting to refresh...");
          // Refresh the token
          try {
            // Use a different way to get refreshToken, if it’s stored in localStorage in your app
            const refreshToken = await getRefreshToken(); // Implement this method based on your storage strategy
            console.log("Using refresh token for request:", refreshToken);
            // Refresh the token

            if (!refreshToken) {
              console.log(
                "No refresh token found. User may need to log in again."
              );
              return; // Prevent proceeding if no refresh token is available
            }

            token = await refreshAuthToken(refreshToken); // Call the function with the correct token

            // Store the new token if necessary
            await saveToken(token); // Optional: save new token to localStorage

            // Retry the publish request with the new token
            const retryResponse = await publishEvent(token);
            if (retryResponse.status === 201) {
              alert("Event successfully published!");
              navigation.goBack();
            } else {
              alert(
                `Failed to publish event on retry. Status: ${retryResponse.status}`
              );
            }
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            alert("Session expired. Please log in again.");
            // Optionally, redirect the user to the login page
            // navigation.navigate("Login"); // Adjust according to your navigation setup
          }
        } else {
          throw error; // Handle other errors
        }
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        alert(
          `Error: ${
            error.response.data.message || "Something went wrong"
          } (Status: ${error.response.status})`
        );
      } else if (error.request) {
        console.error("Request:", error.request);
        alert("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  // const handlePublish = async () => {
  //   try {
  //     const token = await getToken();
  //     console.log("token from createevent :", token);

  //     const formattedDate = startDate ? new Date(startDate).toISOString() : "";
  //     const formattedTime = startTime
  //       ? startTime.toTimeString().split(" ")[0]
  //       : "";

  //     // // Get signature for image upload
  //     // const { timestamp: imgTimestamp, signature: imgSignature } =
  //     //   await getSignatureForUpload("images");

  //     // // Get signature for video upload
  //     // const { timestamp: videoTimestamp, signature: videoSignature } =
  //     //   await getSignatureForUpload("videos");

  //     const uploadedImages = await Promise.all(
  //       images.map(async (image) => {
  //         if (image) {
  //           return await uploadFile(image, "image");
  //         }
  //         return null;
  //       })
  //     );

  //     // Filter out null values
  //     const validImages = uploadedImages.filter(Boolean);

  //     const uploadedVideo = videoUrl
  //       ? await uploadFile(videoUrl, "video")
  //       : null;

  //     // Prepare the event data
  //     const eventData = {
  //       title,
  //       date: formattedDate,
  //       time: formattedTime,
  //       organizer: organizerName,
  //       eventDetails: description,
  //       artists: [
  //         {
  //           name: artistName,
  //           role: "Artist",
  //         },
  //       ],
  //       location,
  //       genre: eventGenre,
  //       images: validImages.map((url) => ({ url })),
  //       videoUrl: uploadedVideo,
  //       ticketPrice: parseFloat(ticketPrice),
  //     };

  //     console.log("event data :", eventData);

  //     // Send the data to the backend
  //     const response = await axios.post(
  //       `${API_URL}/api/events`, // Adjust the URL as needed
  //       eventData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //         // body: data,
  //         timeout: 10000,
  //       }
  //     );

  //     if (response.status === 201) {
  //       alert("Event successfully published!");
  //       navigation.goBack();
  //     } else {
  //       alert(`Failed to publish event. Status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error("Error publishing event:", error);
  //     if (error.response) {
  //       console.error("Response data:", error.response.data);
  //       console.error("Response status:", error.response.status);
  //       console.error("Response headers:", error.response.headers);
  //       alert(
  //         `Error: ${
  //           error.response.data.message || "Something went wrong"
  //         } (Status: ${error.response.status})`
  //       );
  //     } else if (error.request) {
  //       console.error("Request:", error.request);
  //       alert("No response received from the server.");
  //     } else {
  //       console.error("Error message:", error.message);
  //       alert(`Error: ${error.message}`);
  //     }
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={["#FFF72D", "#D6CAF2", "#F9D3A3"]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Create Events</Text> */}

          <Text style={styles.subHeader}>Add Photos</Text>
          <View style={styles.photosContainer}>
            <TouchableOpacity
              style={styles.largeImageUpload}
              onPress={() => pickImage(0)}
            >
              {images[0] ? (
                <Image source={{ uri: images[0] }} style={styles.image} />
              ) : (
                <Ionicons name="camera-outline" size={36} color="black" />
              )}
            </TouchableOpacity>
            <View style={styles.smallImagesContainer}>
              <TouchableOpacity
                style={styles.smallImageUpload}
                onPress={() => pickImage(1)}
              >
                {images[1] ? (
                  <Image source={{ uri: images[1] }} style={styles.image} />
                ) : (
                  <Ionicons name="camera-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallImageUpload}
                onPress={() => pickImage(2)}
              >
                {images[2] ? (
                  <Image source={{ uri: images[2] }} style={styles.image} />
                ) : (
                  <Ionicons name="camera-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Event title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeSection}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                onPress={showDatePickerModal}
                style={styles.dateTimeButton}
              >
                <Text style={styles.dateTimeButtonText}>
                  {startDate ? startDate.toDateString() : "Select Start Date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateTimeChange}
                />
              )}
            </View>

            <View style={styles.dateTimeSection}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity
                onPress={showTimePickerModal}
                style={styles.dateTimeButton}
              >
                <Text style={styles.dateTimeButtonText}>
                  {startTime
                    ? startTime.toTimeString().split(" ")[0]
                    : "Select Start Time"}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={startTime || new Date()}
                  mode="time"
                  display="default"
                  onChange={onDateTimeChange}
                />
              )}
            </View>
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
          <TouchableOpacity style={styles.input} onPress={toggleGenreDropdown}>
            <Text>{eventGenre || "Select Genre"}</Text>
          </TouchableOpacity>

          {showGenreDropdown && (
            <View style={styles.dropdown}>
              {eventGenres.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={styles.dropdownItem}
                  onPress={() => handleGenreSelect(genre)}
                >
                  <Text>{genre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Artist Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Artist name"
            value={artistName}
            onChangeText={setArtistName}
          />

          <Text style={styles.label}>Video URL</Text>

          <TouchableOpacity onPress={pickVideo} style={styles.videoUpload}>
            {videoUrl ? (
              <Text style={styles.videoText}>Video Selected</Text>
            ) : (
              <Ionicons name="videocam-outline" size={36} color="black" />
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Ticket Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Ticket Price"
            keyboardType="numeric"
            value={ticketPrice}
            onChangeText={setTicketPrice}
          />

          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
          >
            <Text style={styles.publishButtonText}>Publish Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backButton: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  photosContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  picker: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  largeImageUpload: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  smallImagesContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  smallImageUpload: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  dropdown: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    position: "absolute",
    backgroundColor: "#fff",
    zIndex: 1,
    width: "100%",
  },
  dropdownItem: {
    padding: 10,
  },
  textArea: {
    height: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateTimeSection: {
    flex: 1,
    marginRight: 8,
  },
  dateTimeButton: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeButtonText: {
    fontSize: 16,
  },
  publishButton: {
    backgroundColor: "#ff6347",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  publishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateEventScreen;
