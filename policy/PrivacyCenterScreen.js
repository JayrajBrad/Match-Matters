// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// const PrivacyCenterScreen = ({ navigation }) => {
//   const [expandedSection, setExpandedSection] = useState(null);

//   const toggleSection = (section) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   const renderSection = (title, content, section) => (
//     <View style={styles.section}>
//       <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section)}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//         <MaterialCommunityIcons
//           name={expandedSection === section ? "chevron-up" : "chevron-down"}
//           size={24}
//           color="black"
//         />
//       </TouchableOpacity>
//       {expandedSection === section && (
//         <View style={styles.sectionContent}>
//           {content.map((text, index) => (
//             <Text key={index} style={styles.text}>{text}</Text>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Privacy Center</Text>
//       </View>
//       <View style={styles.sections}>
//         {renderSection("Introduction", [
//           "Welcome to Match Matters. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the 'App'). Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not use the App."
//         ], "introduction")}
//         {renderSection("Information We Collect", [
//           <Text style = {styles.innerHeading}>1. Personal Information</Text>,
//           "When you register or use the App, we may collect personal information, including but not limited to:",
//           "- Name",
//           "- Email address",
//           "- Phone number",
//           "- Profile picture",
//           "- Event preferences",
//           "",
//           <Text style = {styles.innerHeading}>2. Usage Data</Text>,
//           "We may collect information that your device sends whenever you use our App ('Usage Data'). This Usage Data may include information such as:",
//           "- Your device's Internet Protocol address (e.g., IP address)",
//           "- Device type",
//           "- Device unique ID",
//           "- Operating system",
//           "- Browser type",
//           "- App usage information",
//           "- Event attendance and participation details",
//           "",
//           <Text style = {styles.innerHeading}>3. Location Data</Text>,
//           "With your permission, we may collect and process information about your actual location. We use various technologies to determine location, including IP address, GPS, and other sensors that may provide information on nearby devices, Wi-Fi access points, and cell towers."
//         ], "informationWeCollect")}
//         {renderSection("How We Use Your Information", [
//           "We may use the information we collect in the following ways:",
//           "- To provide, operate, and maintain the App",
//           "- To improve, personalize, and expand our App",
//           "- To understand and analyze how you use our App",
//           "- To develop new products, services, features"
//         ], "howWeUseYourInformation")}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     padding: 20,
//     backgroundColor: '#BF1013',
//   },
//   innerHeading :{
//       fontWeight: 'bold',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     marginLeft: 10,
//     paddingLeft: 80,
//     paddingTop: 50,
//   },
//   sections: {
//     padding: 25,
//   },
//   section: {
//     marginBottom: 30,
//     borderRadius: 10,
//     backgroundColor: '#FEF1F1',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 30,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#111',
//   },
//   sectionContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 15,
//   },
//   text: {
//     fontSize: 16,
//     color: '#111',
//     marginBottom: 5,
//   },
// });

// export default PrivacyCenterScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PrivacyCenterScreen = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSection = (title, content, section) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(section)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialCommunityIcons
          name={expandedSection === section ? "chevron-up" : "chevron-down"}
          size={24}
          color="#444"
        />
      </TouchableOpacity>
      {expandedSection === section && (
        <View style={styles.sectionContent}>
          {content.map((text, index) => (
            <Text key={index} style={styles.text}>
              {text}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Center</Text>
      </View> */}
      <View style={styles.sections}>
        {renderSection(
          "Introduction",
          [
            "Welcome to Match Matters. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the 'App'). Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not use the App.",
          ],
          "introduction"
        )}
        {renderSection(
          "Information We Collect",
          [
            <Text style={styles.innerHeading}>1. Personal Information</Text>,
            "When you register or use the App, we may collect personal information, including but not limited to:",
            "- Name",
            "- Email address",
            "- Phone number",
            "- Profile picture",
            "- Event preferences",
            "",
            <Text style={styles.innerHeading}>2. Usage Data</Text>,
            "We may collect information that your device sends whenever you use our App ('Usage Data'). This Usage Data may include information such as:",
            "- Your device's Internet Protocol address (e.g., IP address)",
            "- Device type",
            "- Device unique ID",
            "- Operating system",
            "- Browser type",
            "- App usage information",
            "- Event attendance and participation details",
            "",
            <Text style={styles.innerHeading}>3. Location Data</Text>,
            "With your permission, we may collect and process information about your actual location. We use various technologies to determine location, including IP address, GPS, and other sensors that may provide information on nearby devices, Wi-Fi access points, and cell towers.",
          ],
          "informationWeCollect"
        )}
        {renderSection(
          "How We Use Your Information",
          [
            "We may use the information we collect in the following ways:",
            "- To provide, operate, and maintain the App",
            "- To improve, personalize, and expand our App",
            "- To understand and analyze how you use our App",
            "- To develop new products, services, features",
          ],
          "howWeUseYourInformation"
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#BF1013",
    elevation: 5, // adds shadow to create depth
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
    letterSpacing: 1,
  },
  innerHeading: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    color: "#BF1013",
  },
  sections: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3, // for shadow on Android
    shadowColor: "#000", // for iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#FAF9F9",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  sectionContent: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    backgroundColor: "#f9f9f9",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default PrivacyCenterScreen;
