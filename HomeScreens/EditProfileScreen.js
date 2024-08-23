

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({
    userName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    instagram: '',
    facebook: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://192.168.0.103:4000/getUserProfile", { method: "GET" });
        const result = await response.json();
        setProfileData(result.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const profileImageUri = await AsyncStorage.getItem('profile_image');
        if (profileImageUri) {
          setProfileImage(profileImageUri);
        } else {
          setProfileImage('file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/4463d451-9312-44b7-b408-3de49a387dac.jpeg');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileData();
    fetchProfileImage();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("http://192.168.0.104:4000/updateUserProfile", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      await AsyncStorage.setItem('profile_image', result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>
      <View style={styles.profileImageContainer}>
        {profileImage ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          </TouchableOpacity>
        ) : (
          <Icon name="person" size={80} color="#ddd" />
        )}
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Text style={styles.editIconText}>✏️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter user name"
          value={profileData.userName}
          onChangeText={(text) => setProfileData({ ...profileData, userName: text })}
        />
        <Text style={styles.label}>Email Id</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={profileData.email}
          onChangeText={(text) => setProfileData({ ...profileData, email: text })}
        />
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your 10 digit mobile number"
          value={profileData.mobileNumber}
          onChangeText={(text) => setProfileData({ ...profileData, mobileNumber: text })}
        />
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="DD / MM / YYYY"
          value={profileData.dateOfBirth}
          onChangeText={(text) => setProfileData({ ...profileData, dateOfBirth: text })}
        />
        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          placeholder="Select"
          value={profileData.gender}
          onChangeText={(text) => setProfileData({ ...profileData, gender: text })}
        />
        <View style={styles.linkedAccountsSection}>
          <Text style={styles.linkedAccountsHeader}>Linked Accounts</Text>
          <TouchableOpacity style={styles.linkedAccount}>
            <Text style={styles.linkedAccountText}>Instagram</Text>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkedAccount}>
            <Text style={styles.linkedAccountText}>Facebook</Text>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#BF1013',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
  },
  editIconText: {
    fontSize: 16,
    color: '#BF1013',
  },
  formContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#111',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 28,
    padding: 12,
    backgroundColor: "#FEF1F1",
    marginBottom: 12,
    fontSize: 16,
    padding: 10,
  },
  linkedAccountsSection: {
    marginTop: 16,
  },
  linkedAccountsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  linkedAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  linkedAccountText: {
    fontSize: 16,
    color: '#111',
  },
  addText: {
    fontSize: 16,
    color: '#BF1013',
  },
  saveButton: {
    backgroundColor: '#BF1013',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
