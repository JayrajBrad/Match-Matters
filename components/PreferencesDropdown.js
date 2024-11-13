// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   FlatList,
//   TouchableWithoutFeedback,
// } from "react-native";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// const PreferencesDropdown = ({
//   preferences,
//   selectedPreferences,
//   onSelect,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [localPreferences, setLocalPreferences] = useState(selectedPreferences);

//   const preferenceIcons = {
//     Clubbing: "glass-cocktail",
//     Party: "party-popper",
//     Movies: "movie",
//     Travel: "airplane",
//     Music: "music-note",
//     Fitness: "dumbbell",
//     Cooking: "chef-hat",
//     Gaming: "gamepad-variant",
//     Art: "palette",
//     Photography: "camera",
//   };

//   const togglePreference = (preference) => {
//     if (localPreferences.includes(preference)) {
//       setLocalPreferences(
//         localPreferences.filter((item) => item !== preference)
//       );
//     } else {
//       setLocalPreferences([...localPreferences, preference]);
//     }
//   };

//   const handleSave = () => {
//     onSelect(localPreferences);
//     setModalVisible(false);
//   };

//   // Handle closing modal when tapping outside of it
//   const handleOutsidePress = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={styles.dropdown}
//       >
//         <Text style={styles.selectedText}>
//           {localPreferences.length
//             ? localPreferences.join(", ")
//             : "Select Preferences"}
//         </Text>
//       </TouchableOpacity>

//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <TouchableWithoutFeedback onPress={handleOutsidePress}>
//           <View style={styles.modalContainer}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <FlatList
//                   data={preferences}
//                   keyExtractor={(item) => item}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => togglePreference(item)}
//                       style={[
//                         styles.option,
//                         localPreferences.includes(item) &&
//                           styles.selectedOption,
//                       ]}
//                     >
//                       <View style={styles.iconTextContainer}>
//                         <MaterialCommunityIcons
//                           name={preferenceIcons[item]}
//                           size={20}
//                           color="#555"
//                           style={styles.icon}
//                         />
//                         <Text style={styles.optionText}>{item}</Text>
//                       </View>
//                       {localPreferences.includes(item) && (
//                         <MaterialCommunityIcons
//                           name="check-circle"
//                           size={20}
//                           color="#BF1013"
//                         />
//                       )}
//                     </TouchableOpacity>
//                   )}
//                 />
//                 <TouchableOpacity
//                   onPress={handleSave}
//                   style={styles.saveButton}
//                 >
//                   <Text style={styles.saveButtonText}>Save</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//   },
//   dropdown: {
//     padding: 12,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 8,
//     backgroundColor: "#f9f9f9",
//     // shadowColor: "#000",
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.2,
//     // shadowRadius: 4,
//     elevation: 5,
//   },
//   selectedText: {
//     color: "#333",
//     fontWeight: "500",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     // shadowColor: "#000",
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.3,
//     // shadowRadius: 6,
//     elevation: 10,
//   },
//   option: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   selectedOption: {
//     backgroundColor: "#f0f8ff",
//     borderRadius: 8,
//   },
//   iconTextContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   icon: {
//     marginRight: 10,
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   saveButton: {
//     marginTop: 15,
//     padding: 12,
//     backgroundColor: "#BF1013",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default PreferencesDropdown;

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const preferenceIcons = {
  Clubbing: "glass-cocktail",
  Party: "party-popper",
  Movies: "movie",
  Travel: "airplane",
  Music: "music-note",
  Fitness: "dumbbell",
  Cooking: "chef-hat",
  Gaming: "gamepad-variant",
  Art: "palette",
  Photography: "camera",
};

const PreferencesDropdown = ({
  preferences,
  selectedPreferences,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(selectedPreferences);

  const togglePreference = (preference) => {
    setLocalPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...prev, preference]
    );
  };

  const handleSave = () => {
    onSelect(localPreferences);
    setModalVisible(false);
  };

  const handleOutsidePress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.dropdown}
        accessibilityLabel="Open preferences dropdown"
        accessibilityRole="button"
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
        onRequestClose={handleOutsidePress}
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={preferences}
                  keyExtractor={(item) => item}
                  contentContainerStyle={{ paddingVertical: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => togglePreference(item)}
                      style={[
                        styles.option,
                        localPreferences.includes(item) &&
                          styles.selectedOption,
                      ]}
                      accessibilityLabel={`Toggle ${item} preference`}
                      accessibilityRole="checkbox"
                    >
                      <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons
                          name={preferenceIcons[item]}
                          size={20}
                          color="#555"
                          style={styles.icon}
                        />
                        <Text style={styles.optionText}>{item}</Text>
                      </View>
                      {localPreferences.includes(item) && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#BF1013"
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                  accessibilityLabel="Save selected preferences"
                  accessibilityRole="button"
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
    padding: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 5,
  },
  selectedText: {
    color: "#333",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  selectedOption: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#BF1013",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PreferencesDropdown;
