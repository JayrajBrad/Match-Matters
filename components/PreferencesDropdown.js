// import React, { useState, useMemo } from "react";
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

// const preferenceIcons = {
//   Clubbing: "glass-cocktail",
//   Party: "party-popper",
//   Movies: "movie",
//   Travel: "airplane",
//   Music: "music-note",
//   Fitness: "dumbbell",
//   Cooking: "chef-hat",
//   Gaming: "gamepad-variant",
//   Art: "palette",
//   Photography: "camera",
// };

// const PreferencesDropdown = ({
//   preferences,
//   selectedPreferences,
//   onSelect,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [localPreferences, setLocalPreferences] = useState(selectedPreferences);

//   const togglePreference = (preference) => {
//     setLocalPreferences((prev) =>
//       prev.includes(preference)
//         ? prev.filter((item) => item !== preference)
//         : [...prev, preference]
//     );
//   };

//   const handleSave = () => {
//     onSelect(localPreferences);
//     setModalVisible(false);
//   };

//   const handleOutsidePress = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={styles.dropdown}
//         accessibilityLabel="Open preferences dropdown"
//         accessibilityRole="button"
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
//         onRequestClose={handleOutsidePress}
//       >
//         <TouchableWithoutFeedback onPress={handleOutsidePress}>
//           <View style={styles.modalContainer}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <FlatList
//                   data={preferences}
//                   keyExtractor={(item) => item}
//                   contentContainerStyle={{ paddingVertical: 10 }}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       onPress={() => togglePreference(item)}
//                       style={[
//                         styles.option,
//                         localPreferences.includes(item) &&
//                           styles.selectedOption,
//                       ]}
//                       accessibilityLabel={`Toggle ${item} preference`}
//                       accessibilityRole="checkbox"
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
//                   accessibilityLabel="Save selected preferences"
//                   accessibilityRole="button"
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

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
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
  const [fadeAnim] = useState(new Animated.Value(0)); // For background fade
  const [slideAnim] = useState(new Animated.Value(0)); // For bottom sheet slide

  const togglePreference = (preference) => {
    setLocalPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...prev, preference]
    );
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300, // Hide below the screen
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  const handleSave = () => {
    onSelect(localPreferences);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openModal}
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

      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="none">
          <TouchableWithoutFeedback onPress={closeModal}>
            <Animated.View
              style={[
                styles.modalBackdrop,
                { opacity: fadeAnim }, // Background fade effect
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] }, // Slide from bottom
            ]}
          >
            <FlatList
              data={preferences}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingVertical: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => togglePreference(item)}
                  style={[
                    styles.option,
                    localPreferences.includes(item) && styles.selectedOption,
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
          </Animated.View>
        </Modal>
      )}
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
    backgroundColor: "#814C68",
    elevation: 5,
  },
  selectedText: {
    color: "#fff",
    fontFamily: "CenturyGothic",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    fontFamily: "CenturyGothic",
  },
  saveButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#0F3460",
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "CenturyGothicBold",

    fontSize: 16,
  },
});

export default PreferencesDropdown;
