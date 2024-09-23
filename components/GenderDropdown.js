import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const GenderDropdown = ({ gender, onSelectGender }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenderSelect = (selectedGender) => {
    onSelectGender(selectedGender);
    setModalVisible(false);
  };

  const handleBackdropPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdown}
      >
        <Text style={styles.selectedText}>
          {gender ? gender : "Select Gender"}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => handleGenderSelect("Male")}
                style={styles.option}
              >
                <Text>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGenderSelect("Female")}
                style={styles.option}
              >
                <Text>Female</Text>
              </TouchableOpacity>
            </View>
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
  modalBackdrop: {
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
    alignItems: "center",
  },
});

export default GenderDropdown;
