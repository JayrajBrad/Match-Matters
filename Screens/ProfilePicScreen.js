// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Image,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import * as ImagePicker from "expo-image-picker";
// import {
//   getRegistrationProgress,
//   saveRegistrationProgress,
// } from "../backend/registrationUtils";

// export default function ProfilePicScreen({ navigation }) {
//   const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [images, setImages] = useState([null, null, null, null]);

//   useEffect(() => {
//     (async () => {
//       const galleryStatus =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

//       if (
//         galleryStatus.status !== "granted" ||
//         cameraStatus.status !== "granted"
//       ) {
//         alert(
//           "Permission denied. Please enable access to your gallery and camera."
//         );
//       }

//       setHasGalleryPermission(galleryStatus.status === "granted");
//       setHasCameraPermission(cameraStatus.status === "granted");
//     })();
//   }, []);

//   const pickImage = async (index) => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.mediaTypes,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log("Gallery result: ", result);

//     if (!result.canceled) {
//       const newImages = [...images];
//       newImages[index] = result.assets[0].uri;
//       setImages(newImages);
//     }
//   };

//   const takeSelfie = async (index) => {
//     let result = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     console.log("profile pic : ", result);

//     if (!result.canceled) {
//       const newImages = [...images];
//       const emptyIndex = newImages.findIndex((image) => image === null);
//       if (emptyIndex !== -1) {
//         newImages[emptyIndex] = result.assets[0].uri;
//         setImages(newImages);
//       }
//     }
//   };

//   if (hasGalleryPermission === false || hasCameraPermission === false) {
//     return (
//       <View>
//         <Text>No Access To Internal Storage or Camera</Text>
//       </View>
//     );
//   }

//   useEffect(() => {
//     getRegistrationProgress("Photos").then((progressData) => {
//       if (progressData && progressData.images) {
//         setImages(progressData.images);
//       }
//     });
//   }, []);

//   const onPressContinue = () => {
//     saveRegistrationProgress("Photos", { images });
//     navigation.navigate("PreferenceScreen");
//   };

//   return (
//     <SafeAreaView style={styles.area}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.container}>
//           <KeyboardAvoidingView
//             keyboardVerticalOffset={50}
//             behavior="padding"
//             style={styles.containerAvoidingView}
//           >
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.goBack();
//               }}
//             >
//               <Text style={{ marginLeft: 20 }}>Back</Text>
//             </TouchableOpacity>

//             <Text style={styles.headTitle}>Upload Your Pictures</Text>

//             <View style={styles.imageRow}>
//               {[0, 1].map((index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.uploadContainer}
//                   onPress={() => pickImage(index)}
//                 >
//                   {!images[index] && ( // Only show text if no image is selected
//                     <Text style={styles.uploadText}>
//                       Upload Picture {index + 1}
//                     </Text>
//                   )}
//                   {images[index] && (
//                     <Image
//                       source={{ uri: images[index] }}
//                       style={styles.imageStyle}
//                     />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.imageRow}>
//               {[2, 3].map((index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.uploadContainer}
//                   onPress={() => pickImage(index)}
//                 >
//                   {!images[index] && ( // Only show text if no image is selected
//                     <Text style={styles.uploadText}>
//                       Upload Picture {index + 1}
//                     </Text>
//                   )}
//                   {images[index] && (
//                     <Image
//                       source={{ uri: images[index] }}
//                       style={styles.imageStyle}
//                     />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.belowButtons}>
//               <TouchableOpacity onPress={() => takeSelfie()}>
//                 <View style={styles.skipButton}>
//                   <Text style={styles.skipText}>Take Selfie</Text>
//                 </View>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={onPressContinue}
//                 style={styles.selfieButton}
//               >
//                 <Text style={styles.selfieText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </TouchableWithoutFeedback>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   area: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     marginTop: 50,
//     alignItems: "center",
//   },
//   containerAvoidingView: {
//     // marginLeft: 20,
//     marginLeft: 30,
//     marginRight: 30,
//     flex: 1,
//     width: "100%",
//     // alignItems: 'center',
//   },
//   headTitle: {
//     fontSize: 30,
//     fontWeight: "800",
//     marginBottom: 20,
//     marginRight: 100,
//     marginLeft: 20,
//   },
//   uploadContainer: {
//     width: "45%",
//     height: 180,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     // margin: 10,
//     marginTop: 20,
//     marginBottom: 40,
//     borderRadius: 10,
//   },
//   uploadText: {
//     // paddingBottom: 20,
//   },
//   imageRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: "5%",
//   },
//   imageStyle: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//     borderRadius: 10,
//   },
//   skipButton: {
//     width: 150,
//     height: 50,
//     marginLeft: 15,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#BF1013",
//   },
//   skipText: {
//     fontSize: 20,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   selfieButton: {
//     width: 150,
//     height: 50,
//     marginRight: 15,
//     borderRadius: 35,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#BF1013",
//   },
//   selfieText: {
//     fontSize: 20,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   belowButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function ProfilePicScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          CenturyGothic: require("../assets/fonts/CenturyGothic.ttf"),
          CenturyGothicBold: require("../assets/fonts/GOTHICB0.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [images, setImages] = useState([null, null, null, null]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

      if (
        galleryStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        alert(
          "Permission denied. Please enable access to your gallery and camera."
        );
      }

      setHasGalleryPermission(galleryStatus.status === "granted");
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.mediaTypes,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const takeSelfie = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      const emptyIndex = newImages.findIndex((image) => image === null);
      if (emptyIndex !== -1) {
        newImages[emptyIndex] = result.assets[0].uri;
        setImages(newImages);
      }
    }
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  if (hasGalleryPermission === false || hasCameraPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          No Access To Internal Storage or Camera
        </Text>
      </View>
    );
  }

  useEffect(() => {
    getRegistrationProgress("Photos").then((progressData) => {
      if (progressData && progressData.images) {
        setImages(progressData.images);
      }
    });
  }, []);

  const onPressContinue = () => {
    saveRegistrationProgress("Photos", { images });
    navigation.navigate("PreferenceScreen");
  };

  if (!fontsLoaded) {
    return null; // Render nothing while the splash screen is shown
  }
  return (
    <SafeAreaView style={styles.area}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={50}
            behavior="padding"
            style={styles.containerAvoidingView}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.backButton}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.headTitle}>Upload Your Pictures</Text>
            <Text style={styles.subTitle}>
              Adding photos makes your profile more attractive.
            </Text>

            <View style={styles.imageRow}>
              {[0, 1].map((index) => (
                <View key={index} style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={() => pickImage(index)}
                  >
                    {!images[index] && (
                      <Text style={styles.uploadText}>
                        Upload Picture {index + 1}
                      </Text>
                    )}
                    {images[index] && (
                      <Image
                        source={{ uri: images[index] }}
                        style={styles.imageStyle}
                      />
                    )}
                  </TouchableOpacity>
                  {images[index] && (
                    <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPress={() => deleteImage(index)}
                    >
                      <Text style={styles.deleteIconText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.imageRow}>
              {[2, 3].map((index) => (
                <View key={index} style={styles.imageWrapper}>
                  <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={() => pickImage(index)}
                  >
                    {!images[index] && (
                      <Text style={styles.uploadText}>
                        Upload Picture {index + 1}
                      </Text>
                    )}
                    {images[index] && (
                      <Image
                        source={{ uri: images[index] }}
                        style={styles.imageStyle}
                      />
                    )}
                  </TouchableOpacity>
                  {images[index] && (
                    <TouchableOpacity
                      style={styles.deleteIconContainer}
                      onPress={() => deleteImage(index)}
                    >
                      <Text style={styles.deleteIconText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => takeSelfie()}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Take Selfie</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onPressContinue}
                style={[
                  styles.button,
                  !images.some((image) => image) && styles.buttonDisabled,
                ]}
                disabled={!images.some((image) => image)}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#290F4C",
  },
  container: {
    flex: 1, // Ensure the container takes full height
    paddingHorizontal: 20,
  },
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   paddingVertical: 20,
  // },
  containerAvoidingView: {
    // flex: 1,
    width: "100%",
    // paddingHorizontal: 20,

    justifyContent: "center",
  },
  // backButton: {
  //   position: "absolute",
  //   top: 20,
  //   left: 10,
  //   padding: 10,
  // },
  backText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "CenturyGothicBold",
  },
  headTitle: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 10,
    color: "#FFF",
    fontFamily: "CenturyGothicBold",
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFF",
    marginBottom: 20,
    fontFamily: "CenturyGothic",
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    width: "45%",
    height: 150,
  },
  uploadContainer: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    color: "#0F3460",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "CenturyGothic",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  deleteIconContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "CenturyGothic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#814C68",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "CenturyGothic",
  },
  buttonDisabled: {
    backgroundColor: "#dcdcdc",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    color: "#6b6b6b",
    fontSize: 16,
    fontFamily: "CenturyGothic",
    textAlign: "center",
  },
});
