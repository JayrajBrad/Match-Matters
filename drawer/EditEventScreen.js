// import React, { useState, useEffect, useContext } from "react";
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
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode"; // Corrected import
// import { Video } from "expo-av";
// import { Dropdown } from "react-native-element-dropdown";
// import { Country, State, City } from "country-state-city";
// import {
//   API_URL,
//   OLA_MAPS_API_KEY,
//   CLOUDINARY_CLOUD_NAME,
//   CLOUDINARY_API_KEY,
// } from "@env";
// import FormData from "form-data";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { UserContext } from "../navigation/UserProvider";

// const EditEventScreen = ({ route, navigation }) => {
//   const { eventId } = route.params; // Receive eventId via navigation
//   const { userId, token } = useContext(UserContext);

//   const [loading, setLoading] = useState(true);
//   const [event, setEvent] = useState(null);

//   // State variables for event details
//   const [images, setImages] = useState([null, null, null]);
//   const [title, setTitle] = useState("");
//   const [organizerName, setOrganizerName] = useState("");
//   const [description, setDescription] = useState("");
//   const [eventGenre, setEventGenre] = useState("");
//   const [baseAddress, setBaseAddress] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [showGenreDropdown, setShowGenreDropdown] = useState(false);

//   const [countryName, setCountryName] = useState(null);
//   const [stateName, setStateName] = useState(null);
//   const [cityName, setCityName] = useState(null);
//   const [artistName, setArtistName] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");
//   const [ticketPrice, setTicketPrice] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);

//   const [isFocus, setIsFocus] = useState(false);
//   const [showDeleteIcon, setShowDeleteIcon] = useState(null);

//   // State variables to manage edit mode for each field
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [isEditingOrganizer, setIsEditingOrganizer] = useState(false);
//   const [isEditingDescription, setIsEditingDescription] = useState(false);
//   const [isEditingGenre, setIsEditingGenre] = useState(false);
//   const [isEditingAddress, setIsEditingAddress] = useState(false);
//   const [isEditingArtist, setIsEditingArtist] = useState(false);
//   const [isEditingTicketPrice, setIsEditingTicketPrice] = useState(false);
//   const [isEditingDate, setIsEditingDate] = useState(false);
//   const [isEditingTime, setIsEditingTime] = useState(false);

//   const eventGenres = [
//     "Business Event",
//     "House Party",
//     "Networking Event",
//     "Workshop",
//     "Cultural Event",
//     "Food Festival",
//     "Music Concert",
//     "Game Night",
//     "Outdoor Activity",
//     "Travel Meetup",
//   ];

//   // Fetch event details once component mounts
//   useEffect(() => {
//     const fetchEventDetails = async () => {
//       try {
//         if (!token) {
//           Alert.alert("Error", "No access token found. Please log in.");
//           navigation.goBack();
//           return;
//         }

//         // Decode token to check expiration
//         const decodedToken = jwtDecode(token);
//         const currentTimeInSeconds = Math.floor(Date.now() / 1000);

//         if (decodedToken.exp < currentTimeInSeconds) {
//           Alert.alert("Session Expired", "Please log in again.");
//           navigation.navigate("LoginScreen");
//           return;
//         }

//         const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("API Response:", response.data);

//         if (response.status === 200) {
//           const eventData = response.data;

//           if (!eventData) {
//             Alert.alert("Error", "Event data is missing.");
//             navigation.goBack();
//             return;
//           }

//           // **Ownership Check**
//           if (eventData.userId !== userId) {
//             Alert.alert(
//               "Unauthorized",
//               "You do not have permission to edit this event."
//             );
//             navigation.goBack();
//             return;
//           }

//           setEvent(eventData);
//           setTitle(eventData.title);
//           setOrganizerName(eventData.organizer);
//           setDescription(eventData.eventDetails);
//           setEventGenre(eventData.genre);
//           setBaseAddress(eventData.location.baseAddress);
//           setCountryName(eventData.location.country);
//           setStateName(eventData.location.state);
//           setCityName(eventData.location.city);
//           setLatitude(eventData.location.coordinates[0]);
//           setLongitude(eventData.location.coordinates[1]);
//           setArtistName(eventData.artists[0]?.name || "");
//           setVideoUrl(eventData.videoUrl || "");
//           setTicketPrice(eventData.ticketPrice.toString());
//           setStartDate(new Date(eventData.date));
//           setStartTime(new Date(`1970-01-01T${eventData.time}Z`));

//           // Set images
//           const initialImages = [null, null, null];
//           eventData.images.forEach((img, index) => {
//             if (index < 3) {
//               initialImages[index] = img.url;
//             }
//           });
//           setImages(initialImages);
//         } else {
//           Alert.alert("Error", "Failed to fetch event details.");
//           navigation.goBack();
//         }
//       } catch (error) {
//         console.error("Error fetching event details:", error.message);
//         Alert.alert("Error", "An error occurred while fetching event details.");
//         navigation.goBack();
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Fetch event details once component mounts
//     fetchEventDetails();
//   }, [
//     eventId,
//     token,
//     userId,
//     navigation,
//     // Removed countryData, handleState, handleCity from dependencies
//   ]);

//   // Handle genre selection
//   const handleGenreSelect = (genre) => {
//     setEventGenre(genre);
//     setShowGenreDropdown(false); // Close the dropdown after selection
//     setIsEditingGenre(false); // Exit edit mode
//   };

//   const toggleGenreDropdown = () => {
//     setShowGenreDropdown((prev) => !prev);
//   };

//   // Image Picker
//   const pickMedia = async (index, imageArray, type) => {
//     let options = {
//       mediaTypes: type,
//       allowsEditing: true,
//       quality: 1,
//     };
//     const result = await ImagePicker.launchImageLibraryAsync(options);
//     if (!result.canceled) {
//       const uri = result.assets[0]?.uri;
//       if (typeof uri === "string") {
//         // Update images array
//         const newImages = [...imageArray];
//         newImages[index] = uri;
//         setImages(newImages);
//       } else {
//         console.error("Invalid URI:", uri);
//       }
//     }
//   };

//   const pickImage = (index) =>
//     pickMedia(index, images, ImagePicker.MediaType.Images);

//   // Video Picker (Optional)
//   const pickVideo = async () => {
//     let options = {
//       mediaTypes: ImagePicker.MediaType.Videos,
//       allowsEditing: true,
//       quality: 1,
//     };
//     let result = await ImagePicker.launchImageLibraryAsync(options);
//     if (!result.canceled) {
//       const uri = result.assets[0]?.uri;
//       if (typeof uri === "string") {
//         setVideoUrl(uri);
//         try {
//           const { uri: thumbnailUri } = await Video.createThumbnailAsync(uri, {
//             time: 5000, // Time in milliseconds (e.g., 5000 for 5 seconds)
//           });
//           // setVideoThumbnailUrl(thumbnailUri); // Optionally, handle thumbnail
//         } catch (thumbnailError) {
//           console.error("Error creating video thumbnail:", thumbnailError);
//         }
//       } else {
//         console.error("Invalid video URL:", uri);
//       }
//     }
//   };

//   // Handle deleting an image
//   const handleDeleteImage = (index) => {
//     const updatedImages = [...images];
//     updatedImages[index] = null; // Remove the image at that index
//     setImages(updatedImages);
//     setShowDeleteIcon(null);
//   };

//   // Show/hide date and time pickers
//   const showDatePickerModal = () => setIsEditingDate(true);
//   const hideDatePickerModal = () => setIsEditingDate(false);
//   const showTimePickerModal = () => setIsEditingTime(true);
//   const hideTimePickerModal = () => setIsEditingTime(false);

//   // Confirm date and time
//   const handleConfirmDate = (date) => {
//     setStartDate(date);
//     hideDatePickerModal();
//   };

//   const handleConfirmTime = (time) => {
//     setStartTime(time);
//     hideTimePickerModal();
//   };

//   // Upload files to Cloudinary
//   const uploadFile = async (fileUri, type) => {
//     const data = new FormData();
//     data.append("file", {
//       uri: fileUri,
//       type: type === "image" ? "image/jpeg" : "video/mp4",
//       name: type === "image" ? "image.jpg" : "video.mp4",
//     });
//     data.append(
//       "upload_preset",
//       type === "image" ? "images_preset" : "videos_preset"
//     );

//     try {
//       let cloudName = CLOUDINARY_CLOUD_NAME;
//       let resourceType = type === "image" ? "image" : "video";
//       let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

//       const res = await axios.post(api, data);
//       const { secure_url } = res.data;
//       console.log("Uploaded URL:", secure_url);
//       return secure_url;
//     } catch (error) {
//       console.log("Error uploading file to Cloudinary:", error);
//       return null;
//     }
//   };

//   // Fetch location coordinates using OLA Maps API
//   const fetchLocationCoordinates = async (
//     baseAddress,
//     city,
//     state,
//     country
//   ) => {
//     try {
//       console.log("OLA API Key:", OLA_MAPS_API_KEY);
//       const locationString = `${baseAddress}, ${city}, ${state}, ${country}`;
//       console.log("Location String:", locationString);

//       const generateId = () => Math.random().toString(36).substring(2, 15);
//       const requestId = generateId();
//       console.log("Request ID:", requestId);

//       const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
//         locationString
//       )}&api_key=${OLA_MAPS_API_KEY}`;
//       const response = await axios.get(geocodeUrl, {
//         headers: { "X-Request-Id": requestId },
//       });

//       console.log("Geocode API Response:", response.data);

//       if (
//         response.data.geocodingResults &&
//         response.data.geocodingResults.length > 0
//       ) {
//         const { lat, lng } =
//           response.data.geocodingResults[0].geometry.location;
//         console.log("Coordinates:", { latitude: lat, longitude: lng });
//         return { latitude: lat, longitude: lng }; // Return coordinates
//       } else {
//         console.error("No results found for the provided location.");
//         return null; // Return null if no results found
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching coordinates:",
//         error.response || error.message
//       );
//       return null; // Return null on error
//     }
//   };

//   //   const handleUpdate = async () => {
//   //     try {
//   //       if (!token) {
//   //         Alert.alert("Error", "No access token found. Please log in.");
//   //         return;
//   //       }

//   //       // Decode token to check expiration
//   //       const decodedToken = jwtDecode(token);
//   //       const currentTimeInSeconds = Math.floor(Date.now() / 1000);

//   //       if (decodedToken.exp < currentTimeInSeconds) {
//   //         Alert.alert("Session Expired", "Please log in again.");
//   //         navigation.navigate("LoginScreen");
//   //         return;
//   //       }

//   //       // Prepare partial data
//   //       const updatedFields = {};

//   //       if (isEditingTitle) updatedFields.title = title;
//   //       if (isEditingOrganizer) updatedFields.organizer = organizerName;
//   //       if (isEditingDescription) updatedFields.eventDetails = description;
//   //       if (isEditingGenre) updatedFields.genre = eventGenre;
//   //       //   if (isEditingAddress) updatedFields.location = { baseAddress };
//   //       if (isEditingArtist)
//   //         updatedFields.artists = [{ name: artistName, role: "Artist" }];
//   //       if (isEditingTicketPrice)
//   //         updatedFields.ticketPrice = parseFloat(ticketPrice);
//   //       if (isEditingDate) updatedFields.date = startDate.toISOString();
//   //       if (isEditingTime)
//   //         updatedFields.time = startTime.toLocaleTimeString("en-GB", {
//   //           hour12: false,
//   //         });

//   //       // Add other fields as necessary

//   //       // Handle location coordinates if address-related fields are updated
//   //       if (isEditingAddress) {
//   //         const locationCoordinates = await fetchLocationCoordinates(
//   //           baseAddress,
//   //           cityName,
//   //           stateName,
//   //           countryName
//   //         );

//   //         if (!locationCoordinates) {
//   //           Alert.alert("Error", "Failed to fetch location coordinates.");
//   //           return;
//   //         }

//   //         updatedFields.location = {
//   //           baseAddress,
//   //           country: countryName,
//   //           state: stateName,
//   //           city: cityName,
//   //           coordinates: [
//   //             locationCoordinates.longitude,
//   //             locationCoordinates.latitude,
//   //           ], // [lng, lat]
//   //         };
//   //       }

//   //       // Upload images and video if changed
//   //       const uploadedImages = await Promise.all(
//   //         images.map(async (image) =>
//   //           image ? await uploadFile(image, "image") : null
//   //         )
//   //       );
//   //       const validImages = uploadedImages.filter(Boolean);
//   //       const uploadedVideo = videoUrl
//   //         ? await uploadFile(videoUrl, "video")
//   //         : null;

//   //       if (validImages.length > 0) {
//   //         updatedFields.images = validImages.map((url) => ({ url }));
//   //       }

//   //       if (uploadedVideo) {
//   //         updatedFields.videoUrl = uploadedVideo;
//   //       }

//   //       console.log("Partial Updated Event Data:", updatedFields);

//   //       // Make the PATCH request
//   //       const response = await axios.patch(
//   //         `${API_URL}/api/events/updateEvent/${eventId}`,
//   //         updatedFields,
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //             "Content-Type": "application/json",
//   //           },
//   //           timeout: 20000,
//   //         }
//   //       );

//   //       console.log("Update Event Response:", response.data);

//   //       if (response.status === 200 || response.status === 204) {
//   //         Alert.alert("Success", "Event successfully updated!");
//   //         navigation.navigate("MyEvents");
//   //       } else {
//   //         Alert.alert(
//   //           "Error",
//   //           `Failed to update event. Status: ${response.status}`
//   //         );
//   //       }
//   //     } catch (error) {
//   //       console.error("Error updating event:", error.message);
//   //       Alert.alert("Error", "An error occurred. Please try again.");
//   //     }
//   //   };

//   const handleUpdate = async () => {
//     try {
//       if (!token) {
//         Alert.alert("Error", "No access token found. Please log in.");
//         return;
//       }

//       // Decode token to check expiration
//       const decodedToken = jwtDecode(token);
//       const currentTimeInSeconds = Math.floor(Date.now() / 1000);

//       if (decodedToken.exp < currentTimeInSeconds) {
//         Alert.alert("Session Expired", "Please log in again.");
//         navigation.navigate("LoginScreen");
//         return;
//       }

//       // Fetch location coordinates if any location field has changed
//       const locationChanged =
//         baseAddress !== event.location.baseAddress ||
//         countryName !== event.location.country ||
//         stateName !== event.location.state ||
//         cityName !== event.location.city;

//       let locationData = event.location; // Default to existing location data

//       if (locationChanged) {
//         const locationCoordinates = await fetchLocationCoordinates(
//           baseAddress,
//           cityName,
//           stateName,
//           countryName
//         );

//         if (!locationCoordinates) {
//           Alert.alert("Error", "Failed to fetch location coordinates.");
//           return;
//         }

//         locationData = {
//           baseAddress,
//           country: countryName,
//           state: stateName,
//           city: cityName,
//           coordinates: [
//             locationCoordinates.longitude,
//             locationCoordinates.latitude,
//           ], // [lng, lat]
//         };
//       }

//       // Upload images and video if changed
//       const uploadedImages = await Promise.all(
//         images.map(async (image) =>
//           image ? await uploadFile(image, "image") : null
//         )
//       );
//       const validImages = uploadedImages.filter(Boolean);
//       const uploadedVideo = videoUrl
//         ? await uploadFile(videoUrl, "video")
//         : null;

//       // Assemble updated event data
//       const updatedEventData = {
//         title, // Always include title
//         organizer: organizerName, // Always include organizer
//         eventDetails: description, // Always include description
//         genre: eventGenre, // Always include genre
//         artists: [{ name: artistName, role: "Artist" }], // Always include artists
//         ticketPrice: parseFloat(ticketPrice), // Always include ticket price
//         date: startDate ? startDate.toISOString() : event.date.toISOString(), // Include updated date or existing date
//         time: startTime
//           ? startTime.toLocaleTimeString("en-GB", { hour12: false })
//           : event.time, // Include updated time or existing time
//         location: locationData, // Include updated or existing location
//         images:
//           validImages.length > 0
//             ? validImages.map((url) => ({ url }))
//             : event.images, // Include updated images or existing images
//         videoUrl: uploadedVideo || event.videoUrl, // Include updated video or existing video
//         eventStatus: event.eventStatus, // Include existing event status
//       };

//       console.log("Updated Event Data:", updatedEventData);

//       // Make the PATCH request
//       const response = await axios.patch(
//         `${API_URL}/api/events/updateEvent/${eventId}`,
//         updatedEventData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           timeout: 20000,
//         }
//       );

//       console.log("Update Event Response:", response.data);

//       if (response.status === 200 || response.status === 204) {
//         Alert.alert("Success", "Event successfully updated!");
//         navigation.navigate("MyEvents");
//       } else {
//         Alert.alert(
//           "Error",
//           `Failed to update event. Status: ${response.status}`
//         );
//       }
//     } catch (error) {
//       console.error("Error updating event:", error.message);
//       Alert.alert("Error", "An error occurred. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#814C68" />
//       </View>
//     );
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Event Photos */}
//         <Text style={styles.label}>Event Photos</Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.photosScrollContainer}
//         >
//           {images.map((image, index) => (
//             <TouchableOpacity
//               key={`edit-img-${index}`}
//               style={styles.imageItem}
//               onPress={() => pickImage(index)}
//               onLongPress={() => setShowDeleteIcon(index)}
//             >
//               {image ? (
//                 <>
//                   <Image source={{ uri: image }} style={styles.image} />
//                   {showDeleteIcon === index && (
//                     <TouchableOpacity
//                       style={styles.deleteIconWrapper}
//                       onPress={() => handleDeleteImage(index)}
//                     >
//                       <Ionicons name="trash" size={24} color="red" />
//                     </TouchableOpacity>
//                   )}
//                 </>
//               ) : (
//                 <Ionicons name="cloud-upload-outline" size={26} color="#fff" />
//               )}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Title Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Title</Text>
//           {isEditingTitle ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={title}
//                 onChangeText={setTitle}
//                 placeholder="Enter event title"
//                 placeholderTextColor="#fff"
//               />
//               <TouchableOpacity onPress={() => setIsEditingTitle(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{title}</Text>
//               <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Organizer Name Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Organizer Name</Text>
//           {isEditingOrganizer ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={organizerName}
//                 onChangeText={setOrganizerName}
//                 placeholder="Enter organizer name"
//                 placeholderTextColor="#000"
//               />
//               <TouchableOpacity onPress={() => setIsEditingOrganizer(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{organizerName}</Text>
//               <TouchableOpacity onPress={() => setIsEditingOrganizer(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Description Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Description</Text>
//           {isEditingDescription ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.textArea}
//                 value={description}
//                 onChangeText={setDescription}
//                 placeholder="Enter event details"
//                 placeholderTextColor="#fff"
//                 multiline
//               />
//               <TouchableOpacity onPress={() => setIsEditingDescription(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{description}</Text>
//               <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Genre Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Genre</Text>
//           {isEditingGenre ? (
//             <View style={styles.editableField}>
//               <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 inputSearchStyle={styles.inputSearchStyle}
//                 iconStyle={styles.iconStyle}
//                 data={eventGenres.map((genre) => ({
//                   label: genre,
//                   value: genre,
//                 }))}
//                 search
//                 maxHeight={300}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select Genre"
//                 searchPlaceholder="Search..."
//                 value={eventGenre}
//                 onFocus={() => {}}
//                 onBlur={() => {}}
//                 onChange={(item) => handleGenreSelect(item.value)}
//               />
//               <TouchableOpacity onPress={() => setIsEditingGenre(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{eventGenre}</Text>
//               <TouchableOpacity onPress={() => setIsEditingGenre(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Base Address Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Base Address</Text>
//           {isEditingAddress ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={baseAddress}
//                 onChangeText={setBaseAddress}
//                 placeholder="Enter event address"
//                 placeholderTextColor="#fff"
//               />
//               <TouchableOpacity onPress={() => setIsEditingAddress(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{baseAddress}</Text>
//               <TouchableOpacity onPress={() => setIsEditingAddress(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Location Input Fields */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Location</Text>
//           <View style={styles.inputContainer}>
//             {/* Country Input */}
//             <View style={styles.inputField}>
//               <Text style={styles.subLabel}>Country:</Text>
//               <TextInput
//                 style={styles.textInput}
//                 value={countryName}
//                 onChangeText={setCountryName}
//                 placeholder="Enter country"
//                 placeholderTextColor="#814C68"
//               />
//             </View>

//             {/* State Input */}
//             <View style={styles.inputField}>
//               <Text style={styles.subLabel}>State:</Text>
//               <TextInput
//                 style={styles.textInput}
//                 value={stateName}
//                 onChangeText={setStateName}
//                 placeholder="Enter state"
//                 placeholderTextColor="#814C68"
//               />
//             </View>

//             {/* City Input */}
//             <View style={styles.inputField}>
//               <Text style={styles.subLabel}>City:</Text>
//               <TextInput
//                 style={styles.textInput}
//                 value={cityName}
//                 onChangeText={setCityName}
//                 placeholder="Enter city"
//                 placeholderTextColor="#814C68"
//               />
//             </View>
//           </View>
//         </View>

//         {/* Date and Time Fields */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Date & Time</Text>
//           <View style={styles.dateTimeRow}>
//             {/* Date */}
//             <View style={styles.dateTimeField}>
//               <Text style={styles.subLabel}>Date:</Text>
//               {isEditingDate ? (
//                 <View style={styles.editableDateTime}>
//                   <TouchableOpacity
//                     onPress={showDatePickerModal}
//                     style={styles.dateTimeButton}
//                   >
//                     <Text style={styles.dateTimeButtonText}>
//                       {startDate
//                         ? startDate.toLocaleDateString()
//                         : "Select Date"}
//                       <MaterialCommunityIcons
//                         name="calendar"
//                         size={20}
//                         color="#fff"
//                         style={{ marginLeft: 5 }}
//                       />
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => setIsEditingDate(false)}
//                     style={styles.checkIcon}
//                   >
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={24}
//                       color="#814C68"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <View style={styles.displayDateTime}>
//                   <Text style={styles.fieldText}>
//                     {startDate ? startDate.toLocaleDateString() : "Not Set"}
//                   </Text>
//                   <TouchableOpacity onPress={() => setIsEditingDate(true)}>
//                     <Ionicons name="pencil" size={20} color="#814C68" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Time */}
//             <View style={styles.dateTimeField}>
//               <Text style={styles.subLabel}>Time:</Text>
//               {isEditingTime ? (
//                 <View style={styles.editableDateTime}>
//                   <TouchableOpacity
//                     onPress={showTimePickerModal}
//                     style={styles.dateTimeButton}
//                   >
//                     <Text style={styles.dateTimeButtonText}>
//                       {startTime
//                         ? startTime.toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })
//                         : "Select Time"}
//                       <MaterialCommunityIcons
//                         name="clock-outline"
//                         size={20}
//                         color="#fff"
//                         style={{ marginLeft: 5 }}
//                       />
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => setIsEditingTime(false)}
//                     style={styles.checkIcon}
//                   >
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={24}
//                       color="#814C68"
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <View style={styles.displayDateTime}>
//                   <Text style={styles.fieldText}>
//                     {startTime
//                       ? startTime.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })
//                       : "Not Set"}
//                   </Text>
//                   <TouchableOpacity onPress={() => setIsEditingTime(true)}>
//                     <Ionicons name="pencil" size={20} color="#814C68" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Date and Time Pickers */}
//           <DateTimePickerModal
//             isVisible={isEditingDate}
//             mode="date"
//             onConfirm={handleConfirmDate}
//             onCancel={hideDatePickerModal}
//             textColor="#000"
//           />

//           <DateTimePickerModal
//             isVisible={isEditingTime}
//             mode="time"
//             onConfirm={handleConfirmTime}
//             onCancel={hideTimePickerModal}
//             textColor="#000"
//           />
//         </View>

//         {/* Artist Name Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Artist Name</Text>
//           {isEditingArtist ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={artistName}
//                 onChangeText={setArtistName}
//                 placeholder="Enter artist name"
//                 placeholderTextColor="#fff"
//               />
//               <TouchableOpacity onPress={() => setIsEditingArtist(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{artistName}</Text>
//               <TouchableOpacity onPress={() => setIsEditingArtist(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Video Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Video</Text>
//           <View style={styles.videoField}>
//             <TouchableOpacity onPress={pickVideo} style={styles.videoUpload}>
//               {videoUrl ? (
//                 <>
//                   <Video
//                     source={{ uri: videoUrl }}
//                     rate={1.0}
//                     volume={1.0}
//                     isMuted={false}
//                     resizeMode="cover"
//                     shouldPlay={false}
//                     isLooping
//                     style={styles.videoThumbnail}
//                   />
//                   <Text style={styles.videoText}>Video Selected</Text>
//                 </>
//               ) : (
//                 <>
//                   <Ionicons name="videocam-outline" size={36} color="#fff" />
//                   <Text style={styles.videoText}>Upload Video</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Ticket Price Field */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Ticket Price</Text>
//           {isEditingTicketPrice ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={ticketPrice}
//                 onChangeText={setTicketPrice}
//                 placeholder="Enter ticket price"
//                 keyboardType="numeric"
//                 placeholderTextColor="#fff"
//               />
//               <TouchableOpacity onPress={() => setIsEditingTicketPrice(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>₹ {ticketPrice}</Text>
//               <TouchableOpacity onPress={() => setIsEditingTicketPrice(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Update Event Button */}
//         <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
//           <Text style={styles.updateButtonText}>Update Event</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 40,
//   },
//   label: {
//     fontSize: 16,
//     fontFamily: "CenturyGothicBold",
//     marginVertical: 8,
//     color: "#814C68",
//   },
//   subLabel: {
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//     color: "#814C68",
//     marginBottom: 4,
//   },
//   fieldContainer: {
//     marginBottom: 20,
//   },
//   editableField: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderColor: "#814C68",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   displayField: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderColor: "#814C68",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//   },
//   fieldText: {
//     fontSize: 16,
//     fontFamily: "CenturyGothic",
//     color: "#000",
//     flex: 1,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     fontFamily: "CenturyGothic",
//     color: "#000",
//   },
//   textArea: {
//     flex: 1,
//     height: 80,
//     fontFamily: "CenturyGothic",
//     color: "#000",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
//   dropdownField: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dropdownContainerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   dropdown: {
//     flex: 1,
//     backgroundColor: "#814C68",
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
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
//     fontFamily: "CenturyGothic",
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
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
//     maxHeight: 200,
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomColor: "#ced4da",
//     borderBottomWidth: 1,
//     backgroundColor: "#814C68",
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: "#fff",
//     fontFamily: "CenturyGothic",
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
//   deleteIconWrapper: {
//     position: "absolute",
//     top: 5,
//     right: 5,
//     backgroundColor: "rgba(255,255,255,0.7)",
//     borderRadius: 15,
//     padding: 3,
//   },
//   videoField: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   videoUpload: {
//     backgroundColor: "#814C68",
//     borderRadius: 10,
//     height: 150,
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     position: "relative",
//   },
//   videoThumbnail: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 10,
//   },
//   videoText: {
//     position: "absolute",
//     bottom: 10,
//     color: "#fff",
//     fontFamily: "CenturyGothicBold",
//     fontSize: 16,
//   },
//   dateTimeRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   dateTimeField: {
//     flex: 1,
//     marginRight: 10,
//   },
//   editableDateTime: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   displayDateTime: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dateTimeButton: {
//     backgroundColor: "#814C68",
//     borderRadius: 15,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ced4da",
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   dateTimeButtonText: {
//     fontSize: 16,
//     color: "#fff",
//     fontFamily: "CenturyGothic",
//     flex: 1,
//   },
//   checkIcon: {
//     marginLeft: 10,
//   },
//   updateButton: {
//     backgroundColor: "#814C68",
//     padding: 16,
//     borderRadius: 15,
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   updateButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   inputContainer: {
//     // New style for input container
//     marginTop: 10,
//   },
//   inputField: {
//     marginBottom: 15,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: "#814C68",
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     color: "#814C68",
//   },
// });

// export default EditEventScreen;

import React, { useState, useEffect, useContext } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import
import { Video } from "expo-av";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import {
  API_URL,
  OLA_MAPS_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
} from "@env";
import FormData from "form-data";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { UserContext } from "../navigation/UserProvider";

const EditEventScreen = ({ route, navigation }) => {
  const { eventId } = route.params; // Receive eventId via navigation
  const { userId, token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  // State variables for event details
  const [images, setImages] = useState([null, null, null]);
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [description, setDescription] = useState("");
  const [eventGenre, setEventGenre] = useState("");
  const [baseAddress, setBaseAddress] = useState("");
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [showDeleteIcon, setShowDeleteIcon] = useState(null);

  // State variables to manage edit mode for each field
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingOrganizer, setIsEditingOrganizer] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingGenre, setIsEditingGenre] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingArtist, setIsEditingArtist] = useState(false);
  const [isEditingTicketPrice, setIsEditingTicketPrice] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);

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

  // Fetch event details once component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!token) {
          Alert.alert("Error", "No access token found. Please log in.");
          navigation.goBack();
          return;
        }

        // Decode token to check expiration
        const decodedToken = jwtDecode(token);
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTimeInSeconds) {
          Alert.alert("Session Expired", "Please log in again.");
          navigation.navigate("LoginScreen");
          return;
        }

        const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("API Response:", response.data);

        if (response.status === 200) {
          const eventData = response.data;

          if (!eventData) {
            Alert.alert("Error", "Event data is missing.");
            navigation.goBack();
            return;
          }

          // **Ownership Check**
          if (eventData.userId !== userId) {
            Alert.alert(
              "Unauthorized",
              "You do not have permission to edit this event."
            );
            navigation.goBack();
            return;
          }

          setEvent(eventData);
          setTitle(eventData.title);
          setOrganizerName(eventData.organizer);
          setDescription(eventData.eventDetails);
          setEventGenre(eventData.genre);
          setBaseAddress(eventData.location.baseAddress);
          setCountryName(eventData.location.country);
          setStateName(eventData.location.state);
          setCityName(eventData.location.city);
          setArtistName(eventData.artists[0]?.name || "");
          setVideoUrl(eventData.videoUrl || "");
          setTicketPrice(eventData.ticketPrice.toString());
          setStartDate(new Date(eventData.date));
          setStartTime(new Date(`1970-01-01T${eventData.time}Z`));

          // Set images
          const initialImages = [null, null, null];
          eventData.images.forEach((img, index) => {
            if (index < 3) {
              initialImages[index] = img.url;
            }
          });
          setImages(initialImages);
        } else {
          Alert.alert("Error", "Failed to fetch event details.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching event details:", error.message);
        Alert.alert("Error", "An error occurred while fetching event details.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    // Fetch event details once component mounts
    fetchEventDetails();
  }, [
    eventId,
    token,
    userId,
    navigation,
    // Removed countryData, handleState, handleCity from dependencies
  ]);

  // Handle genre selection
  const handleGenreSelect = (genre) => {
    setEventGenre(genre);
    setIsEditingGenre(false); // Exit edit mode
  };

  // Image Picker
  const pickMedia = async (index, imageArray, type) => {
    let options = {
      mediaTypes: type,
      allowsEditing: true,
      quality: 1,
    };
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (typeof uri === "string") {
        // Update images array
        const newImages = [...imageArray];
        newImages[index] = uri;
        setImages(newImages);
      } else {
        console.error("Invalid URI:", uri);
      }
    }
  };

  const pickImage = (index) =>
    pickMedia(index, images, ImagePicker.MediaType.Images);

  // Video Picker (Optional)
  const pickVideo = async () => {
    let options = {
      mediaTypes: ImagePicker.MediaType.Videos,
      allowsEditing: true,
      quality: 1,
    };
    let result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (typeof uri === "string") {
        setVideoUrl(uri);
        try {
          const { uri: thumbnailUri } = await Video.createThumbnailAsync(uri, {
            time: 5000, // Time in milliseconds (e.g., 5000 for 5 seconds)
          });
          // setVideoThumbnailUrl(thumbnailUri); // Optionally, handle thumbnail
        } catch (thumbnailError) {
          console.error("Error creating video thumbnail:", thumbnailError);
        }
      } else {
        console.error("Invalid video URL:", uri);
      }
    }
  };

  // Handle deleting an image
  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null; // Remove the image at that index
    setImages(updatedImages);
    setShowDeleteIcon(null);
  };

  // Show/hide date and time pickers
  const showDatePickerModal = () => setIsEditingDate(true);
  const hideDatePickerModal = () => setIsEditingDate(false);
  const showTimePickerModal = () => setIsEditingTime(true);
  const hideTimePickerModal = () => setIsEditingTime(false);

  // Confirm date and time
  const handleConfirmDate = (date) => {
    setStartDate(date);
    hideDatePickerModal();
  };

  const handleConfirmTime = (time) => {
    setStartTime(time);
    hideTimePickerModal();
  };

  // Upload files to Cloudinary
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
      console.log("Uploaded URL:", secure_url);
      return secure_url;
    } catch (error) {
      console.log("Error uploading file to Cloudinary:", error);
      return null;
    }
  };

  // Fetch location coordinates using OLA Maps API
  const fetchLocationCoordinates = async (
    baseAddress,
    city,
    state,
    country
  ) => {
    try {
      console.log("OLA API Key:", OLA_MAPS_API_KEY);
      const locationString = `${baseAddress}, ${city}, ${state}, ${country}`;
      console.log("Location String:", locationString);

      const generateId = () => Math.random().toString(36).substring(2, 15);
      const requestId = generateId();
      console.log("Request ID:", requestId);

      const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
        locationString
      )}&api_key=${OLA_MAPS_API_KEY}`;
      const response = await axios.get(geocodeUrl, {
        headers: { "X-Request-Id": requestId },
      });

      console.log("Geocode API Response:", response.data);

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

  const handleUpdate = async () => {
    try {
      if (!token) {
        Alert.alert("Error", "No access token found. Please log in.");
        return;
      }

      // Decode token to check expiration
      const decodedToken = jwtDecode(token);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTimeInSeconds) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("LoginScreen");
        return;
      }

      // Prepare all fields for update
      const updatedFields = {
        title,
        organizer: organizerName,
        eventDetails: description,
        genre: eventGenre,
        ticketPrice: parseFloat(ticketPrice),
        date: startDate ? startDate.toISOString() : undefined,
        time: startTime
          ? startTime.toLocaleTimeString("en-GB", { hour12: false })
          : undefined,
        artists: artistName
          ? [{ name: artistName, role: "Artist" }]
          : undefined,
        videoUrl: videoUrl || undefined,
      };

      // Handle location updates
      if (baseAddress || cityName || stateName || countryName) {
        const locationCoordinates = await fetchLocationCoordinates(
          baseAddress,
          cityName,
          stateName,
          countryName
        );

        if (!locationCoordinates) {
          Alert.alert("Error", "Failed to fetch location coordinates.");
          return;
        }

        updatedFields.location = {
          baseAddress: baseAddress || event.location.baseAddress,
          country: countryName || event.location.country,
          state: stateName || event.location.state,
          city: cityName || event.location.city,
          coordinates: [
            locationCoordinates.longitude,
            locationCoordinates.latitude,
          ], // [lng, lat]
        };
      }

      // Upload images and videos if changed
      const uploadedImages = await Promise.all(
        images.map(async (image) =>
          image ? await uploadFile(image, "image") : null
        )
      );
      const validImages = uploadedImages.filter(Boolean);

      if (validImages.length > 0) {
        updatedFields.images = validImages.map((url) => ({ url }));
      }

      // Optionally, handle video upload if a new video is selected
      if (videoUrl) {
        updatedFields.videoUrl = videoUrl; // Assuming videoUrl is already the uploaded URL
      }

      // console.log("Partial Updated Event Data:", updatedFields);

      // Make the PATCH request
      const response = await axios.patch(
        `${API_URL}/api/events/updateEvent/${eventId}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );

      // console.log("Update Event Response:", response.data);

      if (response.status === 200 || response.status === 204) {
        Alert.alert("Success", "Event successfully updated!");
        navigation.navigate("MyEvents");
      } else {
        Alert.alert(
          "Error",
          `Failed to update event. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating event:", error.message);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#814C68" />
        <Text style={styles.loadingText}>Loading your event details...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Event Photos */}
        <Text style={styles.label}>Event Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScrollContainer}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={`edit-img-${index}`}
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

        {/* Title Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          {isEditingTitle ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter event title"
                placeholderTextColor="#fff"
              />
              <TouchableOpacity onPress={() => setIsEditingTitle(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{title}</Text>
              <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Organizer Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Organizer Name</Text>
          {isEditingOrganizer ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={organizerName}
                onChangeText={setOrganizerName}
                placeholder="Enter organizer name"
                placeholderTextColor="#000"
              />
              <TouchableOpacity onPress={() => setIsEditingOrganizer(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{organizerName}</Text>
              <TouchableOpacity onPress={() => setIsEditingOrganizer(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          {isEditingDescription ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter event details"
                placeholderTextColor="#fff"
                multiline
              />
              <TouchableOpacity onPress={() => setIsEditingDescription(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{description}</Text>
              <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Genre Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Genre</Text>
          {isEditingGenre ? (
            <View style={styles.editableField}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={eventGenres.map((genre) => ({
                  label: genre,
                  value: genre,
                }))}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Genre"
                searchPlaceholder="Search..."
                value={eventGenre}
                onFocus={() => {}}
                onBlur={() => {}}
                onChange={(item) => handleGenreSelect(item.value)}
              />
              <TouchableOpacity onPress={() => setIsEditingGenre(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{eventGenre}</Text>
              <TouchableOpacity onPress={() => setIsEditingGenre(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Base Address Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Base Address</Text>
          {isEditingAddress ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={baseAddress}
                onChangeText={setBaseAddress}
                placeholder="Enter event address"
                placeholderTextColor="#fff"
              />
              <TouchableOpacity onPress={() => setIsEditingAddress(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{baseAddress}</Text>
              <TouchableOpacity onPress={() => setIsEditingAddress(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Location Input Fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location Details</Text>
          <View style={styles.inputContainer}>
            {/* Country Input */}
            <View style={styles.inputField}>
              <Text style={styles.subLabel}>Country:</Text>
              <TextInput
                style={styles.textInput}
                value={countryName}
                onChangeText={setCountryName}
                placeholder="Enter country"
                placeholderTextColor="#814C68"
              />
            </View>

            {/* State Input */}
            <View style={styles.inputField}>
              <Text style={styles.subLabel}>State:</Text>
              <TextInput
                style={styles.textInput}
                value={stateName}
                onChangeText={setStateName}
                placeholder="Enter state"
                placeholderTextColor="#814C68"
              />
            </View>

            {/* City Input */}
            <View style={styles.inputField}>
              <Text style={styles.subLabel}>City:</Text>
              <TextInput
                style={styles.textInput}
                value={cityName}
                onChangeText={setCityName}
                placeholder="Enter city"
                placeholderTextColor="#814C68"
              />
            </View>
          </View>
        </View>

        {/* Date and Time Fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            {/* Date */}
            <View style={styles.dateTimeField}>
              <Text style={styles.subLabel}>Date:</Text>
              {isEditingDate ? (
                <View style={styles.editableDateTime}>
                  <TouchableOpacity
                    onPress={showDatePickerModal}
                    style={styles.dateTimeButton}
                  >
                    <Text style={styles.dateTimeButtonText}>
                      {startDate
                        ? startDate.toLocaleDateString()
                        : "Select Date"}
                      <MaterialCommunityIcons
                        name="calendar"
                        size={20}
                        color="#fff"
                        style={{ marginLeft: 5 }}
                      />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditingDate(false)}
                    style={styles.checkIcon}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#814C68"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.displayDateTime}>
                  <Text style={styles.fieldText}>
                    {startDate ? startDate.toLocaleDateString() : "Not Set"}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditingDate(true)}>
                    <Ionicons name="pencil" size={20} color="#814C68" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Time */}
            <View style={styles.dateTimeField}>
              <Text style={styles.subLabel}>Time:</Text>
              {isEditingTime ? (
                <View style={styles.editableDateTime}>
                  <TouchableOpacity
                    onPress={showTimePickerModal}
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
                  <TouchableOpacity
                    onPress={() => setIsEditingTime(false)}
                    style={styles.checkIcon}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#814C68"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.displayDateTime}>
                  <Text style={styles.fieldText}>
                    {startTime
                      ? startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Not Set"}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditingTime(true)}>
                    <Ionicons name="pencil" size={20} color="#814C68" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Date and Time Pickers */}
          <DateTimePickerModal
            isVisible={isEditingDate}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePickerModal}
            textColor="#000"
          />

          <DateTimePickerModal
            isVisible={isEditingTime}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePickerModal}
            textColor="#000"
          />
        </View>

        {/* Artist Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Artist Name</Text>
          {isEditingArtist ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={artistName}
                onChangeText={setArtistName}
                placeholder="Enter artist name"
                placeholderTextColor="#fff"
              />
              <TouchableOpacity onPress={() => setIsEditingArtist(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{artistName}</Text>
              <TouchableOpacity onPress={() => setIsEditingArtist(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Video Field */}
        {/* <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video</Text>
          <View style={styles.videoField}>
            <TouchableOpacity onPress={pickVideo} style={styles.videoUpload}>
              {videoUrl ? (
                <>
                  <Video
                    source={{ uri: videoUrl }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping
                    style={styles.videoThumbnail}
                  />
                  <Text style={styles.videoText}>Video Selected</Text>
                </>
              ) : (
                <>
                  <Ionicons name="videocam-outline" size={36} color="#fff" />
                  <Text style={styles.videoText}>Upload Video</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Ticket Price Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ticket Price</Text>
          {isEditingTicketPrice ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={ticketPrice}
                onChangeText={setTicketPrice}
                placeholder="Enter ticket price"
                keyboardType="numeric"
                placeholderTextColor="#fff"
              />
              <TouchableOpacity onPress={() => setIsEditingTicketPrice(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>₹ {ticketPrice}</Text>
              <TouchableOpacity onPress={() => setIsEditingTicketPrice(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Update Event Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#290F4C",
    fontFamily: "CenturyGothic",
  },
  label: {
    fontSize: 16,
    fontFamily: "CenturyGothicBold",
    marginVertical: 8,
    color: "#814C68",
  },
  subLabel: {
    fontSize: 14,
    fontFamily: "CenturyGothic",
    color: "#814C68",
    marginBottom: 4,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  editableField: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#814C68",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  displayField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#814C68",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  fieldText: {
    fontSize: 16,
    fontFamily: "CenturyGothic",
    color: "#000",
    flex: 1,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: "CenturyGothic",
    color: "#000",
  },
  textArea: {
    flex: 1,
    height: 80,
    fontFamily: "CenturyGothic",
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdown: {
    flex: 1,
    backgroundColor: "#814C68",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
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
  inputSearchStyle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "CenturyGothic",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdowngenreContainer: {
    backgroundColor: "#814C68",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
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
    fontFamily: "CenturyGothic",
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
    marginRight: 10,
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
  videoField: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  videoUpload: {
    backgroundColor: "#814C68",
    borderRadius: 10,
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  videoText: {
    position: "absolute",
    bottom: 10,
    color: "#fff",
    fontFamily: "CenturyGothicBold",
    fontSize: 16,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeField: {
    flex: 1,
    marginRight: 10,
  },
  editableDateTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayDateTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeButton: {
    backgroundColor: "#814C68",
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "CenturyGothic",
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: "#814C68",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    // marginBottom: 40,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginTop: 10,
  },
  inputField: {
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#814C68",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#814C68",
    fontFamily: "CenturyGothic",
  },
});

export default EditEventScreen;
