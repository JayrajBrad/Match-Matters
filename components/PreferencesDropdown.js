import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

const PreferencesDropdown = ({
  preferences,
  selectedPreferences,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(selectedPreferences);

  const togglePreference = (preference) => {
    if (localPreferences.includes(preference)) {
      setLocalPreferences(
        localPreferences.filter((item) => item !== preference)
      );
    } else {
      setLocalPreferences([...localPreferences, preference]);
    }
  };

  const handleSave = () => {
    onSelect(localPreferences);
    setModalVisible(false);
  };

  // Handle closing modal when tapping outside of it
  const handleOutsidePress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdown}
      >
        <Text style={styles.selectedText}>
          {localPreferences.length
            ? localPreferences.join(", ")
            : "Select Preferences"}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={preferences}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => togglePreference(item)}
                      style={[
                        styles.option,
                        localPreferences.includes(item) &&
                          styles.selectedOption,
                      ]}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdown: {
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  selectedText: {
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  option: {
    padding: 10,
  },
  selectedOption: {
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#BF1013",
    borderRadius: 4,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PreferencesDropdown;
