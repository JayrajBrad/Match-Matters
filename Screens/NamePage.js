import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react';
import { getRegistrationProgress, saveRegistrationProgress } from '../backend/registrationUtils';

export default function NamePage({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // useEffect(() => {
    //     getRegistrationProgress('Name').then(progressData => {
    //       if(progressData){
    //         setFirstName(progressData.firstName || '');
    //         setLastName(progressData.lastName || '' );
    //       }
    //     })
    //   });


        // Use an empty dependency array to ensure this effect runs only once.
        useEffect(() => {
            const fetchProgress = async () => {
                const progressData = await getRegistrationProgress('Name');
                if (progressData) {
                    setFirstName(progressData.firstName || '');
                    setLastName(progressData.lastName || '');
                }
            };
            fetchProgress();
        }, []);

    // const onPressContinue = () => {
    //     if (firstName && lastName) {
    //         if(firstName.trim() !== '' && lastName.trim() !== ''){
    //             saveRegistrationProgress('Name', {firstName,lastName})
    //         }
    //         navigation.navigate('AgeScreen');
    //     }
    // };

    const onPressContinue = async () => {
        if (firstName && lastName) {
            if (firstName.trim() !== '' && lastName.trim() !== '') {
                try {
                    await saveRegistrationProgress('Name', { firstName, lastName });
                    // Clear the input fields
                    // setFirstName('');
                    // setLastName('');
                    // Navigate to the next screen
                    navigation.navigate('AgeScreen');
                } catch (error) {
                    console.error('Error saving registration progress: ', error);
                }
            }
        }
    };



    return (
        <SafeAreaView style={styles.area}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={50}
                        behavior='padding'
                        style={styles.containerAvoidingView}
                    >
                        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                            <Text>Back</Text>
                        </TouchableOpacity>

                        <Text style={styles.headTitle}>Hey X, What's Your Name?</Text>
                        <Text style={styles.headTag}>We only use Email to make sure everyone on Match Matters is real.</Text>

                        <View style={[styles.inputContainer, { borderBottomColor: '#244DB7' }]}>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder='Enter Your First Name'
                                keyboardType='default'
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderBottomColor: '#244DB7' }]}>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder='Enter Your Last Name'
                                keyboardType='default'
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>

                        <View style={styles.viewBottom}>
                            <TouchableOpacity onPress={onPressContinue} disabled={!firstName || !lastName}>
                                <View style={[styles.btnContinue, (!firstName || !lastName) && styles.btnDisabled]}>
                                    <Text style={styles.textContinue}>Continue</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50,
        alignItems: 'center',
    },
    containerAvoidingView: {
        marginLeft: 30,
    },
    headTitle: {
        fontSize: 40,
        fontWeight: '800',
        marginRight: 100,
    },
    headTag: {
        fontSize: 16,
        marginTop: 50,
        marginRight: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        marginRight: 30,
        marginTop: 20,
        marginBottom: 40,
    },
    inputStyle: {
        marginLeft: 5,
        flex: 1,
        height: 50,
        borderBottomWidth: 1.5,
        borderBottomColor: '#BF1013',
    },
    openDialogView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewBottom: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 90,
        alignItems: 'center',
    },
    btnContinue: {
        width: 250,
        height: 50,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BF1013'
    },
    textContinue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    button: {
        marginTop: 100,
        marginHorizontal: 10,
    },
});
