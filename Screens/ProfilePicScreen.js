import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getRegistrationProgress, saveRegistrationProgress } from '../backend/registrationUtils';

export default function ProfilePicScreen({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [images, setImages] = useState([null, null, null, null]);

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

   

    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const newImages = [...images];
            newImages[index] = result.assets[0].uri;
            setImages(newImages);
        }
    };


    const takeSelfie = async (index) => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const newImages = [...images];
            const emptyIndex = newImages.findIndex(image => image === null);
            if (emptyIndex !== -1) {
                newImages[emptyIndex] = result.assets[0].uri;
                setImages(newImages);
            }
        }
    };

    if (hasGalleryPermission === false || hasCameraPermission === false) {
        return <Text>No Access To Internal Storage or Camera</Text>;
    }

    useEffect(() => {
        getRegistrationProgress('Photos').then(progressData => {
          if(progressData && progressData.images){
              setImages(progressData.images);
          }
        })
      },[]);
  
      const onPressContinue = () => {
          saveRegistrationProgress('Photos',{images})
          navigation.navigate('PreferenceScreen')
      }

      
    return (
        <SafeAreaView style={styles.area}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={50}
                        behavior='padding'
                        style={styles.containerAvoidingView}
                    >
                        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                            <Text style ={{ marginLeft: 20,}}>Back</Text>
                        </TouchableOpacity>

                        <Text style={styles.headTitle}>Upload Your Pictures</Text>

                        <View style={styles.imageRow}>
                            {[0, 1].map((index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.uploadContainer}
                                    onPress={() => pickImage(index)}
                                >
                                    <Text>Upload Picture {index + 1}</Text>
                                    {images[index] && <Image source={{ uri: images[index] }} style={styles.imageStyle} />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.imageRow}>
                            {[2, 3].map((index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.uploadContainer}
                                    onPress={() => pickImage(index)}
                                >
                                    <Text>Upload Picture {index + 1}</Text>
                                    {images[index] && <Image source={{ uri: images[index] }} style={styles.imageStyle} />}
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.belowButtons}>
                        <TouchableOpacity  onPress={() => takeSelfie()}>
                            <View style ={styles.skipButton}>         
                            <Text style={styles.skipText}>Take Selfie</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressContinue} style={styles.selfieButton}>
                                <Text style={styles.selfieText}>Next</Text>
                        </TouchableOpacity>
                        </View>

                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        alignItems: 'center',
    },
    containerAvoidingView: {
        // marginLeft: 20,
        marginLeft:30,
        marginRight:30,
        flex: 1,
        width: '100%',
        // alignItems: 'center',
    },
    headTitle: {
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 20,
        marginRight: 100,
        marginLeft: 20,
    },
    uploadContainer: {
        width: '45%',
        height: 180,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 10,
        marginTop:20,
        marginBottom :40,
        borderRadius: 10,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    skipButton: {
      width:150,
      height:50,
      marginLeft: 15,
      borderRadius:35,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#BF1013'
    },
    skipText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
        selfieButton: {
        width: 150,
        height: 50,
        marginRight: 15,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BF1013',
    },
    selfieText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    belowButtons : {
        flexDirection: "row",
        justifyContent : "space-between"
    }
});














