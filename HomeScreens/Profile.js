
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {API_URL} from '@env';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState('Plans');

  useEffect(() => {
    fetch("http://192.168.0.104:4000/getLatestUser", {
      method: "GET",
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("userData from /getUserProfile", data);
      setData(data.data);
    })
    .catch((error) => {
      console.error("Error fetching user profile", error);
      Alert.alert('Error', 'Failed to load profile data. Please try again later.');
    });
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const profileImageUri = await AsyncStorage.getItem('profile_image');
        console.log('Fetched profile image URI:', profileImageUri); // Debug logging
        if (profileImageUri) {
          setProfileImage(profileImageUri);
        }
      } catch (error) {
        console.log('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen');
  };

  const handleVerifyAccount = () => {
    navigation.navigate('VerifyAccountScreen');
  };

  const handleUpgradePlan = () => {
    navigation.navigate('UpgradePlanScreen');
  };

  const openDrawer = () => {
    navigation.toggleDrawer();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openDrawer} style={styles.drawerButton}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Image source={{ uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fmatch-matters-725daa8f-db2f-4314-ab61-477c5f51181d/ImagePicker/4463d451-9312-44b7-b408-3de49a387dac.jpeg' }} style={styles.profileImage} />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {data.firstName ? `${data.firstName} ${data.lastName}, ${data.age}` : "Loading..."}
          </Text>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit your profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.verificationBox}>
        <Text style={styles.verificationText}>
          Verification adds an extra layer of authenticity and trust to your profile.
        </Text>
        <TouchableOpacity onPress={handleVerifyAccount} style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Verify your account now!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab('Plans')}
            style={[styles.tabButton, activeTab === 'Plans' && styles.activeTabButton]}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Plans' && styles.activeTabButtonText]}>Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('Safety')}
            style={[styles.tabButton, activeTab === 'Safety' && styles.activeTabButton]}
          >
            <Text style={[styles.tabButtonText, activeTab === 'Safety' && styles.activeTabButtonText]}>Safety</Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'Plans' ? (
          <View style={styles.planBox}>
            <Text style={styles.planText}>HeartSync Premium</Text>
            <Text style={styles.planTextinside}>Unlock exclusive features and enhance your experience of connecting with friends.</Text>
            <TouchableOpacity onPress={handleUpgradePlan} style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade from just 5$</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.planBox}>
            <Text style={styles.planText}>Learn more about safety measures and tips.</Text>
          </View>
        )}
      </View>
        
      <View style={styles.tableContainer}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableHeader]}>What's Included</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Free</Text>
          <Text style={[styles.tableCell, styles.tableHeader]}>Premium</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Unlimited Likes</Text>
          <Text style={styles.tableCell}><Icon name="check" size={24} color="#BF1013" /></Text>
          <Text style={styles.tableCell}><Icon name="check" size={24} color="#BF1013" /></Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Advanced Filters</Text>
          <Text style={styles.tableCell}><Icon name="check" size={24} color="#BF1013" /></Text>
          <Text style={styles.tableCell}><Icon name="check" size={24} color="#BF1013" /></Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Remove ads</Text>
          <Text style={styles.tableCell}><Icon name="" size={24} color="#BF1013" /></Text>
          <Text style={styles.tableCell}><Icon name="check" size={24} color="#BF1013" /></Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  drawerButton: {
    padding: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editProfileButton: {
    backgroundColor: '#FEF1F1',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#BF1013',
    fontSize: 14,
  },
  verificationBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  verificationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  verifyButton: {
    backgroundColor: '#FEF1F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#BF1013',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#BF1013',
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#BF1013',
  },
  tabButtonText: {
    color: '#111',
    fontSize: 16,
  },
  activeTabButtonText: {
    color: '#fff',
  },
  planBox: {
    backgroundColor: '#BF1013',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  planText: {
    fontSize: 27,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  planTextinside: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: "#FEF1F1",
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    //marginEnd: 10,
  },
  tableHeader: {
    fontWeight: 'bold',
    //color: "#BF1013"
  },
});

export default ProfileScreen;
