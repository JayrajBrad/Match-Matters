// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// const HelpScreen = ({ navigation }) => {
//   const [expandedSection, setExpandedSection] = useState(null);

//   const toggleSection = (section) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   const renderSection = (title, content, section) => (
//     <View style={styles.section}>
//       <TouchableOpacity
//         style={styles.sectionHeader}
//         onPress={() => toggleSection(section)}
//       >
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
//             <Text key={index} style={styles.text}>
//               {text}
//             </Text>
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
//         <Text style={styles.headerTitle}>Get help</Text>
//       </View>
//       <View style={styles.sections}>
//         {renderSection(
//           "1. Account Settings",
//           [
//             "Update Profile Information",
//             "Go to Homepage > Account",
//             "Tap on Profile",
//             "Tap on Edit Profile",
//             "Update your name, email, phone number, and profile picture",
//             "Tap Save to apply changes.",
//           ],
//           "accountSettings"
//         )}
//         {renderSection(
//           "2. Notification Settings",
//           [
//             "Manage Notifications",
//             "Go to Settings > Notifications",
//             "Toggle default notification features for:",
//             "Event Invitations",
//             "Event Updates",
//             "Messages",
//             "App Announcements",
//             "Set Notification Preferences",
//             "Go to Settings > Notifications",
//             "Toggle event notifications for each event you’re attending",
//             "Choose between push notifications, email, or SMS",
//           ],
//           "notificationSettings"
//         )}
//         {renderSection(
//           "3. Privacy Settings",
//           [
//             "Control Privacy Options",
//             "Go to Settings > Privacy",
//             "Manage who can see your profile and event attendance",
//             "- Public",
//             "- Friends only",
//             "- Only Me",
//             "Location Services",
//             "Toggle on/off location service for better event recommendations and navigation",
//             "Go to Settings > Location Services",
//           ],
//           "privacySettings"
//         )}
//         {renderSection(
//           "4. Language Settings",
//           [
//             "Change Language",
//             "Go to Settings > Language",
//             "Select your preferred language from the list.",
//             "The app will update to reflect your language choice.",
//           ],
//           "languageSettings"
//         )}
//         {renderSection(
//           "5. Support",
//           [
//             "Contact Support",
//             "Go to Settings > Support",
//             "Tap on Contact Us to send an email or message to our support team.",
//           ],
//           "support"
//         )}
//         {renderSection(
//           "6. FAQs",
//           [
//             "FAQs",
//             "Access frequently asked questions and troubleshooting tips by going to Settings > Support > FAQs",
//           ],
//           "faqs"
//         )}
//         {renderSection(
//           "7. About",
//           [
//             "App Version and Legal Information",
//             "Go to Settings > About",
//             "View the current app version, terms of service, and privacy policy.",
//             "If you have any further questions or need additional assistance, please contact our support team through the Support section in the app.",
//           ],
//           "about"
//         )}
//         {renderSection(
//           "8. Contact Us",
//           [
//             "Get in Touch",
//             "Go to Settings > Contact Us",
//             "Reach out to our support team for any inquiries or issues.",
//           ],
//           "contactUs"
//         )}
//       </View>
//       {/* <View style={styles.footer}>
//         <Text style={styles.footerText}>Does this information solve your issue?</Text>
//         <View style={styles.footerButtons}>
//           <TouchableOpacity style={styles.footerButtonYes}>
//             <Text style={styles.footerButtonText}>Yes</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.footerButtonNo}>
//             <Text style={styles.footerButtonText}>No</Text>
//           </TouchableOpacity>
//         </View>
//       </View> */}
//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           Does this information solve your issue?
//         </Text>
//         <View style={styles.footerButtons}>
//           <TouchableOpacity style={styles.footerButton}>
//             <Text style={styles.footerButtonText}> Yes </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.footerButton}>
//             <Text style={styles.footerButtonText}> No </Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.footerLinks}>
//           <Text style={styles.footerLinkText}>About Us</Text>
//           <Text style={styles.footerLinkText}>Support</Text>
//           <Text style={styles.footerLinkText}>Contact Us</Text>
//           <Text style={styles.footerLinkText}>FAQs</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     padding: 20,
//     backgroundColor: "#BF1013",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "white",
//     marginLeft: 10,
//     alignContent: "space-evenly",
//     paddingLeft: 100,
//     paddingTop: 50,
//   },
//   sections: {
//     padding: 25,
//   },
//   section: {
//     marginBottom: 30,
//     borderRadius: 10,
//     backgroundColor: "#FEF1F1",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 30,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#111",
//   },
//   sectionContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 15,
//   },
//   text: {
//     fontSize: 16,
//     color: "#111",
//     marginBottom: 5,
//   },
//   // footer: {
//   //   padding: 20,
//   //   borderTopWidth: 1,
//   //   borderTopColor: '#ccc',
//   // },
//   // footerText: {
//   //   fontSize: 18,
//   //   fontWeight: 'bold',
//   //   color: '#111',
//   //   marginBottom: 10,
//   // },
//   // footerButtons: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-between',
//   // },
//   // footerButtonYes: {
//   //   backgroundColor: '#00C853',
//   //   padding: 10,
//   //   borderRadius: 5,
//   // },
//   // footerButtonNo: {
//   //   backgroundColor: '#D50000',
//   //   padding: 10,
//   //   borderRadius: 5,
//   // },
//   // footerButtonText: {
//   //   fontSize: 16,
//   //   color: '#FFFFFF',
//   //   fontWeight: 'bold',
//   // },
//   footer: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//     backgroundColor: "#fff",
//   },
//   footerText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#111",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   footerButtons: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//     padding: 10,
//   },
//   footerButton: {
//     backgroundColor: "#BF1013",
//     padding: 10,
//     borderRadius: 20,
//     marginHorizontal: 10,
//   },
//   footerButtonText: {
//     fontSize: 16,
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   footerLinks: {
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 10,
//   },
//   footerLinkText: {
//     fontSize: 16,
//     color: "#111",
//     textDecorationLine: "underline",
//     padding: 8,
//   },
// });

// export default HelpScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HelpScreen = ({ navigation }) => {
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
          color="#333"
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
        <Text style={styles.headerTitle}>Get Help</Text>
      </View> */}
      <View style={styles.sections}>
        {renderSection(
          "1. Account Settings",
          [
            "Update Profile Information",
            "Go to Homepage > Account",
            "Tap on Profile",
            "Tap on Edit Profile",
            "Update your name, email, phone number, and profile picture",
            "Tap Save to apply changes.",
          ],
          "accountSettings"
        )}
        {renderSection(
          "2. Notification Settings",
          [
            "Manage Notifications",
            "Go to Settings > Notifications",
            "Toggle default notification features for:",
            "Event Invitations",
            "Event Updates",
            "Messages",
            "App Announcements",
            "Set Notification Preferences",
            "Go to Settings > Notifications",
            "Toggle event notifications for each event you’re attending",
            "Choose between push notifications, email, or SMS",
          ],
          "notificationSettings"
        )}
        {renderSection(
          "3. Privacy Settings",
          [
            "Control Privacy Options",
            "Go to Settings > Privacy",
            "Manage who can see your profile and event attendance",
            "- Public",
            "- Friends only",
            "- Only Me",
            "Location Services",
            "Toggle on/off location service for better event recommendations and navigation",
            "Go to Settings > Location Services",
          ],
          "privacySettings"
        )}
        {renderSection(
          "4. Language Settings",
          [
            "Change Language",
            "Go to Settings > Language",
            "Select your preferred language from the list.",
            "The app will update to reflect your language choice.",
          ],
          "languageSettings"
        )}
        {renderSection(
          "5. Support",
          [
            "Contact Support",
            "Go to Settings > Support",
            "Tap on Contact Us to send an email or message to our support team.",
          ],
          "support"
        )}
        {renderSection(
          "6. FAQs",
          [
            "FAQs",
            "Access frequently asked questions and troubleshooting tips by going to Settings > Support > FAQs",
          ],
          "faqs"
        )}
        {renderSection(
          "7. About",
          [
            "App Version and Legal Information",
            "Go to Settings > About",
            "View the current app version, terms of service, and privacy policy.",
            "If you have any further questions or need additional assistance, please contact our support team through the Support section in the app.",
          ],
          "about"
        )}
        {renderSection(
          "8. Contact Us",
          [
            "Get in Touch",
            "Go to Settings > Contact Us",
            "Reach out to our support team for any inquiries or issues.",
          ],
          "contactUs"
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Does this information solve your issue?
        </Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Text style={styles.footerButtonText}>No</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLinkText}>About Us</Text>
          <Text style={styles.footerLinkText}>Support</Text>
          <Text style={styles.footerLinkText}>Contact Us</Text>
          <Text style={styles.footerLinkText}>FAQs</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#BF1013",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
    flex: 1,
    textAlign: "center",
  },
  sections: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
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
    padding: 16,
    backgroundColor: "#f3f3f3",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  footerButton: {
    backgroundColor: "#BF1013",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  footerButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  footerLinkText: {
    fontSize: 14,
    color: "#333",
    textDecorationLine: "underline",
    padding: 8,
  },
});

export default HelpScreen;
