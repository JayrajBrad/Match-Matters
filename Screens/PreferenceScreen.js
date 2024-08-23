import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getRegistrationProgress, saveRegistrationProgress } from '../backend/registrationUtils';

const preferences = [
    'Clubbing',
    'Party',
    'Movies',
    'Travel',
    'Music',
    'Fitness',
    'Cooking',
    'Gaming',
    'Art',
    'Photography',
];

export default function PreferenceScreen({ navigation }) {
    const [selectedPreferences, setSelectedPreferences] = useState([]);
   
    const togglePreference = (preference) => {
        if (selectedPreferences.includes(preference)) {
            setSelectedPreferences(selectedPreferences.filter(item => item !== preference));
        } else {
            setSelectedPreferences([...selectedPreferences, preference]);
        }
    };

    const onPressContinue = () => {
        if (selectedPreferences.length >= 2) {
            saveRegistrationProgress('Preference', { selectedPreferences });
            navigation.navigate('LastScreen');
        } else {

            alert("Please select at least 2 preferences.");
        }
    };

    return (
        <SafeAreaView style={styles.area}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                    <Text style={styles.Back}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.headTitle}>So What Do You Like?</Text>
                <Text style={styles.headTag}>What are your preferences?</Text>
                <Text style={styles.headTag}>Select Atleast 2</Text>

                <View style={styles.gridContainer}>
                    {preferences.map((preference, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.preferenceItem,
                                selectedPreferences.includes(preference) && styles.selectedItem
                            ]}
                            onPress={() => togglePreference(preference)}
                        >
                            <Text style={styles.preferenceText}>{preference}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity onPress={onPressContinue}>
                    <View style={styles.skipButton}>
                        <Text style={styles.skipText}>Continue</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Back :{
        alignItems:"center"
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginVertical: 20,
    },
    headTag: {
        fontSize: 16,
        marginBottom: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    preferenceItem: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E0E0E0',
    },
    selectedItem: {
        backgroundColor: '#BF1013',
    },
    preferenceText: {
        fontSize: 16,
        color: '#fff',
    },
    skipButton: {
        width: 150,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BF1013',
        marginVertical: 20,
    },
    skipText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
});
