
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';

const FilterScreen = ({ navigation }) => {
  const [featured, setFeatured] = useState(false);
  const [costLowToHigh, setCostLowToHigh] = useState(false);
  const [costHighToLow, setCostHighToLow] = useState(false);
  const [rating, setRating] = useState(false);
  const [distance, setDistance] = useState(10);
  const [profileSwitch, setProfileSwitch] = useState(false);
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [items, setItems] = useState([
    { label: 'English', value: 'english' },
    { label: 'Spanish', value: 'spanish' },
    { label: 'French', value: 'french' },
    { label: 'German', value: 'german' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Japanese', value: 'japanese' },
    { label: 'Hindi', value: 'hindi' },
    { label: 'Arabic', value: 'arabic' },
  ]);

  const clearFilters = () => {
    setFeatured(false);
    setCostLowToHigh(false);
    setCostHighToLow(false);
    setRating(false);
    setDistance(10);
    setProfileSwitch(false);
    setLanguages([]);
  };

  const applyFilters = () => {
    // Handle filter application logic here
    console.log("Filters Applied");
  };

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'sortBy':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sort by</Text>
            <View style={styles.optionRow}>
              <CheckBox
                title="Featured"
                checked={featured}
                onPress={() => setFeatured(!featured)}
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.optionLabel}
              />
            </View>
            <View style={styles.optionRow}>
              <CheckBox
                title="Cost: Low to high"
                checked={costLowToHigh}
                onPress={() => setCostLowToHigh(!costLowToHigh)}
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.optionLabel}
              />
            </View>
            <View style={styles.optionRow}>
              <CheckBox
                title="Cost: High to Low"
                checked={costHighToLow}
                onPress={() => setCostHighToLow(!costHighToLow)}
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.optionLabel}
              />
            </View>
            <View style={styles.optionRow}>
              <CheckBox
                title="Rating"
                checked={rating}
                onPress={() => setRating(!rating)}
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.optionLabel}
              />
            </View>
          </View>
        );
      case 'distance':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <Slider
              minimumValue={10}
              maximumValue={80}
              step={1}
              value={distance}
              onValueChange={setDistance}
              style={styles.slider}
              minimumTrackTintColor="#BF1013"
              maximumTrackTintColor="#000"
              thumbTintColor="#BF1013"
            />
            <Text style={styles.distanceLabel}>{distance} km</Text>
            <View style={styles.optionRow}>
              <Switch value={profileSwitch} onValueChange={setProfileSwitch} />
              <Text style={styles.optionLabel}>Show profiles within a 15-km range when run out of matches</Text>
            </View>
          </View>
        );
      case 'languages':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <DropDownPicker
              open={open}
              value={languages}
              items={items}
              setOpen={setOpen}
              setValue={setLanguages}
              setItems={setItems}
              multiple={true}
              multipleText="Select languages"
              min={0}
              max={10}
              defaultValue={languages}
              containerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              itemStyle={{
                justifyContent: 'flex-start'
              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={item => setLanguages(item)}
            />
            <View style={styles.selectedLanguages}>
              {languages.map((language, index) => (
                <View key={index} style={styles.languageTag}>
                  <Text style={styles.languageText}>{items.find(i => i.value === language)?.label}</Text>
                  <TouchableOpacity onPress={() => setLanguages(languages.filter(l => l !== language))}>
                    <Text style={styles.languageRemove}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      case 'buttons':
        return (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply filters</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const sections = [
    { key: 'sortBy' },
    { key: 'distance' },
    { key: 'languages' },
    { key: 'buttons' },
  ];

  return (
    <FlatList
      data={sections}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  slider: {
    width: '100%',
    marginBottom: 10,
  },
  distanceLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  dropdownContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedLanguages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  languageText: {
    fontSize: 16,
    marginRight: 4,
  },
  languageRemove: {
    fontSize: 16,
    color: '#bf1013',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 150,
  },
  clearButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '48%',
    alignItems: 'center',
    borderRadius: 40,
    borderColor : "#FEF1F1",
    backgroundColor: "#FEF1F1"
  },
  clearButtonText: {
    fontSize: 16,
    color: '#111',
  },
  applyButton: {
    backgroundColor: '#BF1013',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    borderRadius: 40,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default FilterScreen;