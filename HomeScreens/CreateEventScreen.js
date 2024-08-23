
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateEventScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [entryFee, setEntryFee] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [description, setDescription] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
        <Text style={styles.uploadText}>Click to upload party poster</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
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
      <Text style={styles.label}>Start Date</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <TextInput
            style={styles.dateTimeInput}
            placeholder="Start Date"
            value={startDate.toDateString()}
            editable={false}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
          <TextInput
            style={styles.dateTimeInput}
            placeholder="Start Time"
            value={startTime.toLocaleTimeString()}
            editable={false}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>End Date</Text>
      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <TextInput
            style={styles.dateTimeInput}
            placeholder="End Date"
            value={endDate.toDateString()}
            editable={false}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
          <TextInput
            style={styles.dateTimeInput}
            placeholder="End Time"
            value={endTime.toLocaleTimeString()}
            editable={false}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.optionalInfo}>Optional Info</Text>
      <Text style={styles.label}>Entry Fee</Text>
      <TextInput
        style={styles.input}
        placeholder="Entry fee"
        value={entryFee}
        onChangeText={setEntryFee}
      />
      <Text style={styles.label}>Ticket Link</Text>
      <TextInput
        style={styles.input}
        placeholder="Ticket Link"
        value={ticketLink}
        onChangeText={setTicketLink}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={() => { /* Handle publish event */ }}>
        <Text style={styles.buttonText}>Publish</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={onStartTimeChange}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={onEndTimeChange}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#BF1013',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    
  },
  uploadText: {
    color: '#000',
    fontWeight: "bold"
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FEF1F1',
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  dateTimeInput: {
    backgroundColor: '#FEF1F1',
    borderRadius: 30,
    padding: 10,
    flex: 0.48,
    paddingRight: 70,
  },
  optionalInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#BF1013',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;