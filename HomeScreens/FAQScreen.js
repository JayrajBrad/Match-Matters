
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FaqScreen = ({ navigation }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const renderSection = (title, questions, sectionIndex) => (
    <View style={styles.section} key={sectionIndex}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {questions.map((question, questionIndex) => (
        <View key={questionIndex} style={styles.questionContainer}>
          <TouchableOpacity style={styles.question} onPress={() => toggleQuestion(`${sectionIndex}-${questionIndex}`)}>
            <Text style={styles.questionText}>{question.text}</Text>
            <MaterialCommunityIcons
              name={expandedQuestion === `${sectionIndex}-${questionIndex}` ? "chevron-up" : "chevron-down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          {expandedQuestion === `${sectionIndex}-${questionIndex}` && (
            <View style={styles.answer}>
              <Text style={styles.answerText}>{question.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const faqData = [
    {
      title: "General Questions",
      questions: [
        { text: "What is this app for?", answer: "This app helps you discover, join, and host party events while connecting with new friends. You can browse events, RSVP, and chat with other attendees." },
        { text: "Is the app free to use?", answer: "Yes, the app is free to download and use. Some premium features may require a subscription or a one-time payment." },
        { text: "How do I create an account?", answer: "Tap on the 'Sign Up' button on the home screen, fill in the required details, and follow the instructions to complete the registration process." }
      ]
    },
    {
      title: "Event Discovery and Participation",
      questions: [
        { text: "How do I find events?", answer: "You can find events on the Home screen section and search for upcoming events or ones tailored for you using the search feature to find specific events based on your interests." },
        { text: "Can I see who else is attending an event?", answer: "Yes, you can see the list of attendees for any event you are interested in. Just go to the event details page to view the list." }
      ]
    },
    {
      title: "Event Creation and Management",
      questions: [
        { text: "How do I create an event?", answer: "To create an event, tap on the 'Create Event' button, fill in the required details, and publish your event." },
        { text: "Can I edit or cancel an event after it's created?", answer: "Yes, you can edit or cancel an event by going to your event list, selecting the event you want to change, and choosing the appropriate action." },
        { text: "How do I invite friends to an event?", answer: "After creating an event, you can invite friends by selecting the event and using the 'Invite Friends' option. You can send invitations via email, SMS, or through social media." }
      ]
    },
    {
      title: "Making Friends",
      questions: [
        { text: "How do I connect with other attendees?", answer: "You can connect with other attendees by viewing their profiles in the 'Attendees' section and sending them a friend request or message." },
        { text: "How do I chat with new friends?", answer: "Once you've connected with someone, you can chat with them through the 'Messages' section in the app." }
      ]
    },
    {
      title: "Notifications and Updates",
      questions: [
        { text: "How do I receive event updates and notifications?", answer: "Make sure to enable notifications in your app settings. You will receive updates and reminders about the events you're attending or organizing." },
        { text: "Can I turn off notifications?", answer: "Yes, you can turn off notifications by going to the app settings and disabling notifications." }
      ]
    },
    {
      title: "Safety and Privacy",
      questions: [
        { text: "How do you ensure user safety?", answer: "We have implemented various safety measures, including user verification and moderation of content. Users can also report any suspicious or inappropriate behavior." },
        { text: "How is my personal information protected?", answer: "We take your privacy seriously and use encryption to protect your data. Please refer to our Privacy Policy for more details." }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        { text: "How do I contact customer support?", answer: "You can contact customer support by going to the 'Help & Support' section and choosing the 'Contact Us' option. You can send us a message or reach out via the provided contact information." }
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </View>
      <View style={styles.sections}>
        {faqData.map((section, index) => renderSection(section.title, section.questions, index))}
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#BF1013',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    paddingLeft: 30,
    paddingTop: 50,
  },
  sections: {
    padding: 25,
  },
  section: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#FEF1F1',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionHeader: {
    backgroundColor: '#BF1013',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  questionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  questionText: {
    fontSize: 16,
    color: '#111',
  },
  answer: {
    padding: 15,
    backgroundColor: '#FEF1F1',
  },
  answerText: {
    fontSize: 16,
    color: '#111',
  },
});

export default FaqScreen;