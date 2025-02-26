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
// import { Video } from "expo-av";
// import { Dropdown } from "react-native-element-dropdown";
// import { API_URL, OLA_MAPS_API_KEY } from "@env";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { UserContext } from "../navigation/UserProvider";

// const EditEventScreen = ({ route, navigation }) => {
//   const { eventId } = route.params; // passed from navigation
//   const { userId, token } = useContext(UserContext); // if needed for server requests

//   const [loading, setLoading] = useState(true);
//   const [event, setEvent] = useState(null);

//   // Event detail states
//   const [images, setImages] = useState([null, null, null]);
//   const [title, setTitle] = useState("");
//   const [organizerName, setOrganizerName] = useState("");
//   const [description, setDescription] = useState("");
//   const [eventGenre, setEventGenre] = useState("");
//   const [baseAddress, setBaseAddress] = useState("");
//   const [countryName, setCountryName] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [cityName, setCityName] = useState("");
//   const [artistName, setArtistName] = useState("");
//   const [videoUrl, setVideoUrl] = useState("");
//   const [ticketPrice, setTicketPrice] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [startTime, setStartTime] = useState(null);

//   const [showDeleteIcon, setShowDeleteIcon] = useState(null);

//   // Editing toggles
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

//   // -------------------------------------------------------------
//   // 1) On mount, fetch event details from your server
//   // -------------------------------------------------------------
//   useEffect(() => {
//     const fetchEventDetails = async () => {
//       try {
//         // If you don't need a token, you can remove this check
//         if (!userId) {
//           Alert.alert("Error", "No user ID found. Please log in.");
//           navigation.goBack();
//           return;
//         }

//         // GET from your server
//         const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
//           // If your server needs an Authorization header, you can keep it
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.status === 200) {
//           const eventData = response.data;
//           if (!eventData) {
//             Alert.alert("Error", "Event data is missing.");
//             navigation.goBack();
//             return;
//           }

//           // Fill states
//           setEvent(eventData);
//           setTitle(eventData.title);
//           setOrganizerName(eventData.organizer);
//           setDescription(eventData.eventDetails);
//           setEventGenre(eventData.genre);
//           setBaseAddress(eventData.location.baseAddress);
//           setCountryName(eventData.location.country);
//           setStateName(eventData.location.state);
//           setCityName(eventData.location.city);
//           setArtistName(eventData.artists[0]?.name || "");
//           setVideoUrl(eventData.videoUrl || "");
//           setTicketPrice(eventData.ticketPrice?.toString() || "0");
//           setStartDate(new Date(eventData.date));
//           setStartTime(new Date(`1970-01-01T${eventData.time}Z`));

//           // Images up to 3
//           const initialImages = [null, null, null];
//           eventData.images?.forEach((img, idx) => {
//             if (idx < 3) {
//               initialImages[idx] = img.url;
//             }
//           });
//           setImages(initialImages);
//         } else {
//           Alert.alert(
//             "Error",
//             `Failed to fetch event details (${response.status})`
//           );
//           navigation.goBack();
//         }
//       } catch (error) {
//         console.error("Error fetching event details:", error);
//         Alert.alert("Error", "An error occurred while fetching event details.");
//         navigation.goBack();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEventDetails();
//   }, [eventId, userId, token, navigation]);

//   // -------------------------------------------------------------
//   // 2) S3 upload (like in create event)
//   // -------------------------------------------------------------
//   const guessMimeType = (fileUri) => {
//     const ext = fileUri.split(".").pop().toLowerCase();
//     switch (ext) {
//       case "jpg":
//       case "jpeg":
//         return "image/jpeg";
//       case "png":
//         return "image/png";
//       case "gif":
//         return "image/gif";
//       case "mp4":
//         return "video/mp4";
//       default:
//         return "application/octet-stream";
//     }
//   };

//   const uploadFileToS3 = async (fileUri) => {
//     try {
//       const fileType = guessMimeType(fileUri);
//       const folder = fileType.startsWith("video/") ? "mm_videos" : "mm_images";

//       // Unique name
//       const originalFileName = fileUri.split("/").pop() || "unknown.file";
//       const uniqueFileName = `${Date.now()}-${Math.random()
//         .toString(36)
//         .substring(2, 8)}-${originalFileName}`;

//       // 1) ask server for presigned URL
//       const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
//         folder,
//         fileType,
//         fileName: uniqueFileName,
//       });
//       const { uploadUrl, key } = data;

//       // 2) PUT the file
//       const fileResponse = await fetch(fileUri);
//       const blob = await fileResponse.blob();
//       await fetch(uploadUrl, {
//         method: "PUT",
//         body: blob, // Use blob directly
//         headers: {
//           "Content-Type": fileType,
//           "Content-Length": blob.size, // Make sure MIME type is correct
//         },
//       });

//       return key; // e.g. "mm_images/..."
//     } catch (error) {
//       console.error("Error uploading to S3:", error);
//       return null;
//     }
//   };

//   // -------------------------------------------------------------
//   // 3) Image pickers
//   // -------------------------------------------------------------
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
//           const newImages = [...images];
//           newImages[index] = uri;
//           setImages(newImages);
//         }
//       }
//     } catch (error) {
//       console.error("Error opening image picker:", error);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const newImgs = [...images];
//     newImgs[index] = null;
//     setImages(newImgs);
//     setShowDeleteIcon(null);
//   };

//   // -------------------------------------------------------------
//   // 4) Date & Time pickers
//   // -------------------------------------------------------------
//   const [isEditingDatePicker, setIsEditingDatePicker] = useState(false);
//   const [isEditingTimePicker, setIsEditingTimePicker] = useState(false);

//   const handleConfirmDate = (date) => {
//     setStartDate(date);
//     setIsEditingDatePicker(false);
//   };
//   const handleConfirmTime = (time) => {
//     setStartTime(time);
//     setIsEditingTimePicker(false);
//   };

//   // -------------------------------------------------------------
//   // 5) fetch location coords with OLA
//   // -------------------------------------------------------------
//   const fetchLocationCoordinates = async (addr, city, st, cnt) => {
//     try {
//       const locStr = `${addr}, ${city}, ${st}, ${cnt}`;
//       const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
//         locStr
//       )}&api_key=${OLA_MAPS_API_KEY}`;
//       const response = await axios.get(geocodeUrl);
//       const results = response.data.geocodingResults;
//       if (results && results.length > 0) {
//         const { lat, lng } = results[0].geometry.location;
//         return { latitude: lat, longitude: lng };
//       } else {
//         console.error("No results for location:", locStr);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching location coords:", error);
//       return null;
//     }
//   };

//   // -------------------------------------------------------------
//   // 6) handleUpdate
//   // -------------------------------------------------------------
//   const handleUpdate = async () => {
//     try {
//       // gather updated fields
//       const updatedFields = {
//         title,
//         organizer: organizerName,
//         eventDetails: description,
//         genre: eventGenre,
//         ticketPrice: parseFloat(ticketPrice) || 0,
//         date: startDate ? startDate.toISOString() : undefined,
//         time: startTime
//           ? startTime.toLocaleTimeString("en-GB", { hour12: false })
//           : undefined,
//         artists: artistName ? [{ name: artistName, role: "Artist" }] : [],
//       };

//       // fetch location
//       const coords = await fetchLocationCoordinates(
//         baseAddress,
//         cityName,
//         stateName,
//         countryName
//       );
//       if (!coords) {
//         Alert.alert("Error", "Failed to fetch location coords.");
//         return;
//       }
//       updatedFields.location = {
//         baseAddress: baseAddress,
//         country: countryName,
//         state: stateName,
//         city: cityName,
//         coordinates: [coords.longitude, coords.latitude],
//       };

//       // upload new images
//       const newKeys = await Promise.all(
//         images.map(async (imgUri) => {
//           if (
//             imgUri &&
//             !imgUri.startsWith("mm_images") &&
//             !imgUri.startsWith("mm_videos")
//           ) {
//             return await uploadFileToS3(imgUri);
//           } else {
//             return imgUri;
//           }
//         })
//       );
//       const validKeys = newKeys.filter((k) => k);
//       updatedFields.images = validKeys.map((key) => ({ url: key }));

//       // video is optional, etc.
//       // if you want to handle it similarly with pickVideo -> uploadFileToS3 -> updatedFields.videoUrl

//       // Patch event
//       const response = await axios.patch(
//         `${API_URL}/api/events/updateEvent/${eventId}`,
//         updatedFields,
//         {
//           // if your server requires an Authorization
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (response.status === 200 || response.status === 204) {
//         Alert.alert("Success", "Event updated successfully!");
//         navigation.navigate("MyEvents");
//       } else {
//         Alert.alert("Error", `Failed to update event (${response.status})`);
//       }
//     } catch (error) {
//       console.error("Error updating event:", error);
//       Alert.alert("Error", "An error occurred. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#814C68" />
//         <Text style={styles.loadingText}>Loading your event details...</Text>
//       </View>
//     );
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.label}>Event Photos</Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           style={styles.photosScrollContainer}
//         >
//           {images.map((image, idx) => (
//             <TouchableOpacity
//               key={`edit-img-${idx}`}
//               style={styles.imageItem}
//               onPress={() => pickImage(idx)}
//               onLongPress={() => setShowDeleteIcon(idx)}
//             >
//               {image ? (
//                 <>
//                   <Image source={{ uri: image }} style={styles.image} />
//                   {showDeleteIcon === idx && (
//                     <TouchableOpacity
//                       style={styles.deleteIconWrapper}
//                       onPress={() => handleDeleteImage(idx)}
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

//         {/* Title */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Title</Text>
//           {isEditingTitle ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={title}
//                 onChangeText={setTitle}
//                 placeholder="Event title"
//                 placeholderTextColor="#999"
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

//         {/* Organizer */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Organizer Name</Text>
//           {isEditingOrganizer ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={organizerName}
//                 onChangeText={setOrganizerName}
//                 placeholder="Organizer name"
//                 placeholderTextColor="#999"
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

//         {/* Description */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Description</Text>
//           {isEditingDescription ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.textArea}
//                 value={description}
//                 onChangeText={setDescription}
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

//         {/* Genre */}
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
//                 data={eventGenres.map((g) => ({ label: g, value: g }))}
//                 search
//                 maxHeight={300}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select Genre"
//                 searchPlaceholder="Search..."
//                 value={eventGenre}
//                 onChange={(item) => {
//                   setEventGenre(item.value);
//                 }}
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

//         {/* Base Address */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Base Address</Text>
//           {isEditingAddress ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={baseAddress}
//                 onChangeText={setBaseAddress}
//                 placeholder="Event address"
//                 placeholderTextColor="#999"
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

//         {/* City/State/Country */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Location Details</Text>
//           <View style={styles.inputField}>
//             <Text style={styles.subLabel}>Country:</Text>
//             <TextInput
//               style={styles.textInput}
//               value={countryName}
//               onChangeText={setCountryName}
//             />
//           </View>
//           <View style={styles.inputField}>
//             <Text style={styles.subLabel}>State:</Text>
//             <TextInput
//               style={styles.textInput}
//               value={stateName}
//               onChangeText={setStateName}
//             />
//           </View>
//           <View style={styles.inputField}>
//             <Text style={styles.subLabel}>City:</Text>
//             <TextInput
//               style={styles.textInput}
//               value={cityName}
//               onChangeText={setCityName}
//             />
//           </View>
//         </View>

//         {/* Date & Time */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Date & Time</Text>
//           <View style={styles.dateTimeRow}>
//             {/* Date */}
//             <View style={styles.dateTimeField}>
//               <Text style={styles.subLabel}>Date:</Text>
//               {isEditingDate ? (
//                 // Edit mode
//                 <View style={styles.editableDateTime}>
//                   <TouchableOpacity
//                     onPress={() => {}}
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
//                 // Display mode
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
//                     onPress={() => {}}
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
//           {/* Actual date/time pickers */}
//           <DateTimePickerModal
//             isVisible={isEditingDate}
//             mode="date"
//             onConfirm={(d) => {
//               setStartDate(d);
//               setIsEditingDate(false);
//             }}
//             onCancel={() => setIsEditingDate(false)}
//           />
//           <DateTimePickerModal
//             isVisible={isEditingTime}
//             mode="time"
//             onConfirm={(t) => {
//               setStartTime(t);
//               setIsEditingTime(false);
//             }}
//             onCancel={() => setIsEditingTime(false)}
//           />
//         </View>

//         {/* Artist Name */}
//         <View style={styles.fieldContainer}>
//           <Text style={styles.label}>Artist Name</Text>
//           {isEditingArtist ? (
//             <View style={styles.editableField}>
//               <TextInput
//                 style={styles.input}
//                 value={artistName}
//                 onChangeText={setArtistName}
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

//         {/* Ticket Price */}
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
//               />
//               <TouchableOpacity onPress={() => setIsEditingTicketPrice(false)}>
//                 <Ionicons name="checkmark-circle" size={24} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.displayField}>
//               <Text style={styles.fieldText}>{ticketPrice}</Text>
//               <TouchableOpacity onPress={() => setIsEditingTicketPrice(true)}>
//                 <Ionicons name="pencil" size={20} color="#814C68" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* Update Button */}
//         <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
//           <Text style={styles.updateButtonText}>Update Event</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default EditEventScreen;

// /** STYLES **/
// const styles = StyleSheet.create({
//   scrollContainer: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//     paddingBottom: 40,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#290F4C",
//     fontFamily: "CenturyGothic",
//   },
//   label: {
//     fontSize: 16,
//     fontFamily: "CenturyGothicBold",
//     marginVertical: 8,
//     color: "#814C68",
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
//     color: "#000",
//     fontFamily: "CenturyGothic",
//   },
//   textArea: {
//     flex: 1,
//     height: 80,
//     fontFamily: "CenturyGothic",
//     color: "#000",
//     paddingVertical: 10,
//     paddingHorizontal: 10,
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
//   dateTimeButton: {
//     backgroundColor: "#814C68",
//     borderRadius: 15,
//     padding: 10,
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
//   displayDateTime: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   updateButton: {
//     backgroundColor: "#814C68",
//     padding: 16,
//     borderRadius: 15,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   updateButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontFamily: "CenturyGothicBold",
//   },
//   inputField: {
//     marginBottom: 15,
//   },
//   subLabel: {
//     fontSize: 14,
//     fontFamily: "CenturyGothic",
//     color: "#814C68",
//     marginBottom: 4,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: "#814C68",
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 16,
//     color: "#814C68",
//     fontFamily: "CenturyGothic",
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
// });

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
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { API_URL, OLA_MAPS_API_KEY } from "@env";
import { UserContext } from "../navigation/UserProvider";

const EditEventScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { userId, token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  // Two arrays for images
  // imageKeys[] => original S3 keys or null if replaced
  // images[] => the displayed URI (pre-signed GET or local path)
  const [imageKeys, setImageKeys] = useState([null, null, null]);
  const [images, setImages] = useState([null, null, null]);

  // Basic event info
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [description, setDescription] = useState("");
  const [eventGenre, setEventGenre] = useState("");
  const [baseAddress, setBaseAddress] = useState("");
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [showDeleteIcon, setShowDeleteIcon] = useState(null);

  // Edit toggles
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

  // ===== Fetch existing event on mount =====
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }, // if needed
        });

        if (response.status === 200) {
          const eventData = response.data;

          setEvent(eventData);
          setTitle(eventData.title || "");
          setOrganizerName(eventData.organizer || "");
          setDescription(eventData.eventDetails || "");
          setEventGenre(eventData.genre || "");
          setBaseAddress(eventData.location?.baseAddress || "");
          setCountryName(eventData.location?.country || "");
          setStateName(eventData.location?.state || "");
          setCityName(eventData.location?.city || "");
          setArtistName(eventData.artists?.[0]?.name || "");
          setTicketPrice(eventData.ticketPrice?.toString() || "0");
          setStartDate(new Date(eventData.date));
          setStartTime(new Date(`1970-01-01T${eventData.time}Z`));

          // Prepare arrays for images
          const initKeys = [null, null, null];
          const initImages = [null, null, null];

          // Map up to 3 images
          const eventImages = eventData.images || [];
          for (let i = 0; i < 3; i++) {
            if (eventImages[i]) {
              initKeys[i] = eventImages[i].url; // "mm_images/someKey.jpg"
              // We'll fetch a pre-signed GET URL to show the image
              const presigned = await fetchPresignedGetUrl(eventImages[i].url);
              initImages[i] = presigned;
            }
          }
          setImageKeys(initKeys);
          setImages(initImages);
        } else {
          Alert.alert(
            "Error",
            `Failed to fetch event details (${response.status})`
          );
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        Alert.alert("Error", "An error occurred while fetching event details.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, token, navigation]);

  // ===== Helper to GET presigned URL for existing S3 image =====
  const fetchPresignedGetUrl = async (s3Key) => {
    try {
      const response = await fetch(
        `${API_URL}/api/s3-presigned-url?key=${encodeURIComponent(s3Key)}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to get pre-signed URL, status: ${response.status}`
        );
      }
      const data = await response.json();
      return data.preSignedUrl; // short-lived URL to display
    } catch (error) {
      console.error("Error fetching pre-signed URL for key:", s3Key, error);
      return null;
    }
  };

  // ===== S3 upload logic (for newly picked images) =====
  const guessMimeType = (fileUri) => {
    const ext = fileUri.split(".").pop().toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "mp4":
        return "video/mp4";
      default:
        return "application/octet-stream";
    }
  };

  const uploadFileToS3 = async (fileUri) => {
    try {
      const fileType = guessMimeType(fileUri);
      const folder = fileType.startsWith("video/") ? "mm_videos" : "mm_images";

      const originalFileName = fileUri.split("/").pop() || "unknown.file";
      const uniqueFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}-${originalFileName}`;

      const { data } = await axios.post(`${API_URL}/api/s3-presigned-url`, {
        folder,
        fileType,
        fileName: uniqueFileName,
      });
      const { uploadUrl, key } = data;

      const fileResponse = await fetch(fileUri);
      const blob = await fileResponse.blob();
      await fetch(uploadUrl, {
        method: "PUT",
        body: blob, // Use blob directly
        headers: {
          "Content-Type": fileType,
          "Content-Length": blob.size, // Make sure MIME type is correct
        },
      });

      return key; // e.g. "mm_images/...jpg"
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return null;
    }
  };

  // ===== Image picking logic =====
  const pickImage = async (index) => {
    try {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      };
      const result = await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) {
        const uri = result.assets[0]?.uri;
        if (typeof uri === "string") {
          // user picked new image
          const newImages = [...images];
          newImages[index] = uri; // local path
          setImages(newImages);

          const newKeys = [...imageKeys];
          newKeys[index] = null; // We no longer use the old S3 key
          setImageKeys(newKeys);
        }
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
    }
  };

  const handleDeleteImage = (index) => {
    const newImgs = [...images];
    newImgs[index] = null;
    setImages(newImgs);

    const newKeys = [...imageKeys];
    newKeys[index] = null;
    setImageKeys(newKeys);

    setShowDeleteIcon(null);
  };

  // ===== Date/time pickers =====
  const [isEditingDatePicker, setIsEditingDatePicker] = useState(false);
  const [isEditingTimePicker, setIsEditingTimePicker] = useState(false);

  // if user picks date/time, store them
  const handleConfirmDate = (date) => {
    setStartDate(date);
    setIsEditingDatePicker(false);
  };
  const handleConfirmTime = (time) => {
    setStartTime(time);
    setIsEditingTimePicker(false);
  };

  // ===== Location coords =====
  const fetchLocationCoordinates = async (addr, city, st, cnt) => {
    try {
      const locStr = `${addr}, ${city}, ${st}, ${cnt}`;
      const geocodeUrl = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(
        locStr
      )}&api_key=${OLA_MAPS_API_KEY}`;
      const response = await axios.get(geocodeUrl);
      const results = response.data.geocodingResults;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("No results for location:", locStr);
        return null;
      }
    } catch (error) {
      console.error("Error fetching location coords:", error);
      return null;
    }
  };

  // ===== On update, decide whether to reupload or keep old S3 keys =====
  const handleUpdate = async () => {
    try {
      // 1) Build partial update object
      const updatedFields = {
        title,
        organizer: organizerName,
        eventDetails: description,
        genre: eventGenre,
        ticketPrice: parseFloat(ticketPrice) || 0,
        date: startDate ? startDate.toISOString() : undefined,
        time: startTime
          ? startTime.toLocaleTimeString("en-GB", { hour12: false })
          : undefined,
        artists: artistName ? [{ name: artistName, role: "Artist" }] : [],
      };

      // 2) location
      const coords = await fetchLocationCoordinates(
        baseAddress,
        cityName,
        stateName,
        countryName
      );
      if (!coords) {
        Alert.alert("Error", "Failed to fetch location coords.");
        return;
      }
      updatedFields.location = {
        baseAddress,
        country: countryName,
        state: stateName,
        city: cityName,
        coordinates: [coords.longitude, coords.latitude],
      };

      // 3) For each image slot, if local path => upload => store new key
      // if still presigned URL => keep old key from imageKeys
      const finalImageKeys = [];
      for (let i = 0; i < 3; i++) {
        if (!images[i]) {
          // user deleted that image
          // do nothing, skip
        } else if (images[i].startsWith("file:/")) {
          // new local image => upload
          const newKey = await uploadFileToS3(images[i]);
          if (newKey) finalImageKeys.push({ url: newKey });
        } else {
          // existing presigned URL => keep old key
          if (imageKeys[i]) {
            finalImageKeys.push({ url: imageKeys[i] });
          }
        }
      }
      updatedFields.images = finalImageKeys;

      // 4) Patch event
      const response = await axios.patch(
        `${API_URL}/api/events/updateEvent/${eventId}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 204) {
        Alert.alert("Success", "Event updated successfully!");
        navigation.navigate("MyEvents");
      } else {
        Alert.alert("Error", `Failed to update event (${response.status})`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
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
        <Text style={styles.label}>Event Photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photosScrollContainer}
        >
          {images.map((image, idx) => (
            <TouchableOpacity
              key={`edit-img-${idx}`}
              style={styles.imageItem}
              onPress={() => pickImage(idx)}
              onLongPress={() => setShowDeleteIcon(idx)}
            >
              {image ? (
                <>
                  <Image source={{ uri: image }} style={styles.image} />
                  {showDeleteIcon === idx && (
                    <TouchableOpacity
                      style={styles.deleteIconWrapper}
                      onPress={() => handleDeleteImage(idx)}
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

        {/* Title */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          {isEditingTitle ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Event title"
                placeholderTextColor="#999"
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

        {/* Organizer */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Organizer Name</Text>
          {isEditingOrganizer ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={organizerName}
                onChangeText={setOrganizerName}
                placeholder="Organizer name"
                placeholderTextColor="#999"
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

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          {isEditingDescription ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
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

        {/* Genre */}
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
                data={eventGenres.map((g) => ({ label: g, value: g }))}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Genre"
                searchPlaceholder="Search..."
                value={eventGenre}
                onChange={(item) => {
                  setEventGenre(item.value);
                }}
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

        {/* Base Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Base Address</Text>
          {isEditingAddress ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={baseAddress}
                onChangeText={setBaseAddress}
                placeholder="Event address"
                placeholderTextColor="#999"
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

        {/* City/State/Country */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location Details</Text>
          <View style={styles.inputField}>
            <Text style={styles.subLabel}>Country:</Text>
            <TextInput
              style={styles.textInput}
              value={countryName}
              onChangeText={setCountryName}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.subLabel}>State:</Text>
            <TextInput
              style={styles.textInput}
              value={stateName}
              onChangeText={setStateName}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={styles.subLabel}>City:</Text>
            <TextInput
              style={styles.textInput}
              value={cityName}
              onChangeText={setCityName}
            />
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            {/* Date */}
            <View style={styles.dateTimeField}>
              <Text style={styles.subLabel}>Date:</Text>
              {isEditingDate ? (
                <View style={styles.editableDateTime}>
                  <TouchableOpacity
                    onPress={() => {}}
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
                    onPress={() => {}}
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
          {/* Real date/time pickers */}
          <DateTimePickerModal
            isVisible={isEditingDate}
            mode="date"
            onConfirm={(d) => {
              setStartDate(d);
              setIsEditingDate(false);
            }}
            onCancel={() => setIsEditingDate(false)}
          />
          <DateTimePickerModal
            isVisible={isEditingTime}
            mode="time"
            onConfirm={(t) => {
              setStartTime(t);
              setIsEditingTime(false);
            }}
            onCancel={() => setIsEditingTime(false)}
          />
        </View>

        {/* Artist */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Artist Name</Text>
          {isEditingArtist ? (
            <View style={styles.editableField}>
              <TextInput
                style={styles.input}
                value={artistName}
                onChangeText={setArtistName}
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

        {/* Ticket Price */}
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
              />
              <TouchableOpacity onPress={() => setIsEditingTicketPrice(false)}>
                <Ionicons name="checkmark-circle" size={24} color="#814C68" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.displayField}>
              <Text style={styles.fieldText}>{ticketPrice}</Text>
              <TouchableOpacity onPress={() => setIsEditingTicketPrice(true)}>
                <Ionicons name="pencil" size={20} color="#814C68" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Update Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

/** Helper to fetch a pre-signed GET URL for an existing S3 key. */
async function fetchPresignedGetUrl(s3Key) {
  try {
    const res = await fetch(
      `${API_URL}/api/s3-presigned-url?key=${encodeURIComponent(s3Key)}`
    );
    if (!res.ok) {
      throw new Error(`Failed to get pre-signed URL: ${res.status}`);
    }
    const data = await res.json();
    return data.preSignedUrl;
  } catch (error) {
    console.error("Error fetching pre-signed GET URL:", error);
    return null;
  }
}

export default EditEventScreen;

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
    color: "#000",
    fontFamily: "CenturyGothic",
  },
  textArea: {
    flex: 1,
    height: 80,
    fontFamily: "CenturyGothic",
    color: "#000",
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  dateTimeButton: {
    backgroundColor: "#814C68",
    borderRadius: 15,
    padding: 10,
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
  displayDateTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  updateButton: {
    backgroundColor: "#814C68",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "CenturyGothicBold",
  },
  inputField: {
    marginBottom: 15,
  },
  subLabel: {
    fontSize: 14,
    fontFamily: "CenturyGothic",
    color: "#814C68",
    marginBottom: 4,
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
});
