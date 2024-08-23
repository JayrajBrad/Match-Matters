

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DrawerContent = (props) => {
  const renderDrawerItem = (label, navigateTo, iconName) => (
    <View key={label}>
      <View style={styles.drawerItemContainer}>
        <TouchableOpacity
          style={styles.drawerItemButton}
          onPress={() => props.navigation.navigate(navigateTo)}
        >
          <MaterialCommunityIcons name={iconName} color="white" size={24} />
          <Text style={styles.drawerLabel}>{label}</Text>
        </TouchableOpacity>
        <FontAwesome name="chevron-right" size={16} color="rgba(255, 255, 255, 0.5)" style={styles.chevronIcon} />
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {renderDrawerItem('My Events', 'MyEvents')}
      {renderDrawerItem('Notifications', 'Notifications')}
      {renderDrawerItem('Membership', 'Membership')}
      {renderDrawerItem('My Bookings', 'MyBookings')}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>More info and support</Text>
      </View>
      {renderDrawerItem('Help', 'Help')}
      {renderDrawerItem('Privacy Center', 'PrivacyCenter')}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>About Us</Text>
      </View>
      {renderDrawerItem('Contact Us', 'ContactUs')}
      {renderDrawerItem('FAQs', 'FAQs')}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#BF1013',
    flex: 1,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#BF1013',
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  drawerLabel: {
    color: 'white',
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chevronIcon: {
    position: 'absolute',
    right: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 16,
    marginVertical: 4,
  },
});

export default DrawerContent;

