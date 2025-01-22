// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from "react-native";

// const GenderDropdown = ({ gender, onSelectGender }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleGenderSelect = (selectedGender) => {
//     onSelectGender(selectedGender);
//     setModalVisible(false);
//   };

//   const handleBackdropPress = () => {
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={styles.dropdown}
//       >
//         <Text style={styles.selectedText}>
//           {gender ? gender : "Select Gender"}
//         </Text>
//       </TouchableOpacity>

//       <Modal
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <TouchableWithoutFeedback onPress={handleBackdropPress}>
//           <View style={styles.modalBackdrop}>
//             <View style={styles.modalContent}>
//               <TouchableOpacity
//                 onPress={() => handleGenderSelect("Male")}
//                 style={styles.option}
//               >
//                 <Text>Male</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => handleGenderSelect("Female")}
//                 style={styles.option}
//               >
//                 <Text>Female</Text>
//               </TouchableOpacity>
//             </View>
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
//     padding: 10,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 4,
//     backgroundColor: "#fff",
//   },
//   selectedText: {
//     color: "#000",
//   },
//   modalBackdrop: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 20,
//   },
//   option: {
//     padding: 10,
//     alignItems: "center",
//   },
// });

// export default GenderDropdown;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

const GenderDropdown = ({ gender, onSelectGender }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade animation value

  const handleGenderSelect = (selectedGender) => {
    onSelectGender(selectedGender);
    closeModal();
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200, // Faster transition (200ms)
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.dropdown}>
        <Text style={styles.selectedText}>
          {gender ? gender : "Select Gender"}
        </Text>
      </TouchableOpacity>

      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="none">
          <TouchableWithoutFeedback onPress={closeModal}>
            <Animated.View
              style={[
                styles.modalBackdrop,
                { opacity: fadeAnim }, // Apply fade animation
              ]}
            >
              <TouchableWithoutFeedback>
                <View style={styles.bottomSheet}>
                  <View style={styles.handle} />
                  <TouchableOpacity
                    onPress={() => handleGenderSelect("Male")}
                    style={styles.option}
                  >
                    <Text style={styles.optionText}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleGenderSelect("Female")}
                    style={styles.option}
                  >
                    <Text style={styles.optionText}>Female</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableWithoutFeedback>
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
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#814C68",
  },
  selectedText: {
    color: "#fff",
    fontFamily: "CenturyGothic",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: "100%",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 2.5,
  },
  option: {
    padding: 15,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "CenturyGothic",
  },
});

export default GenderDropdown;
