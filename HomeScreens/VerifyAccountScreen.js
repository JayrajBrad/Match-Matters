
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerifyAccountScreen = () => {
  const [selfie, setSelfie] = useState(null);

  const takeSelfie = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setSelfie(source);
        // Upload the image or save it to AsyncStorage for verification
        AsyncStorage.setItem('selfie_image', source.uri)
          .then(() => {
            Alert.alert('Success', 'Selfie uploaded successfully!');
          })
          .catch((error) => {
            console.error('Error saving selfie image:', error);
          });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.infoText}>Make sure your face is clearly visible and you are copying the pose exactly as shown in the image.</Text>
      <TouchableOpacity onPress={takeSelfie} style={styles.cameraButton}>
        <Text style={styles.cameraButtonText}>Take a Selfie</Text>
      </TouchableOpacity>
      {selfie && (
        <Image source={selfie} style={styles.selfieImage} />
      )}
      <Text style={styles.verificationText}>We will verify your selfie on our servers. It won't be visible on your profile.</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://www.your_app.com/privacy-policy')}>
        <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 400,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 20,
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#BF1013',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selfieImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
  verificationText: {
    fontSize: 17,
    marginBottom: 10,
  },
  privacyPolicyText: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: "#BF1013",
    borderRadius: 10,
  },
});

export default VerifyAccountScreen;
