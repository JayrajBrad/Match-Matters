import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getRegistrationProgress, saveRegistrationProgress } from '../backend/registrationUtils';

export default function AgeScreen({ navigation }) {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        getRegistrationProgress('Age').then(progressData => {
          if(progressData){
            setAge(progressData.age || '');
            setGender(progressData.gender || '');
          }
        })
      });

    const onPressContinue = () => {
        if (age && gender) {
            if(age.trim() !== '' && gender.trim() !== ''){
                saveRegistrationProgress('Age',{age,gender});
            }
            navigation.navigate('ProfilePicScreen');  
        }
    };

    return (
        <SafeAreaView style={styles.area}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={50}
                        behavior='padding'
                        style={styles.containerAvoidingView}
                    >
                        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                            <Text>Back</Text>
                        </TouchableOpacity>

                        <Text style={styles.headTitle}>What's Your Age?</Text>
                        <Text style={styles.headTag}>We only use Email to make sure everyone on Match Matters is real.</Text>
                        
                        <View style={styles.ageContainer}>
                            <Text style={styles.label}>Age</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.inputStyle}
                                    placeholder='Your Age'
                                    keyboardType='numeric'
                                    value={age}
                                    onChangeText={setAge}
                                />
                            </View>
                        </View>

                     
                            <View style={styles.pickerContainer}>
                            <Text style={styles.label}>Gender</Text>
                                <Picker
                                    selectedValue={gender}
                                    style={styles.pickerStyle}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                            </View>
                       

                        <View style={styles.viewBottom}>
                            <TouchableOpacity onPress={onPressContinue} disabled={!age || !gender}>
                                <View style={[styles.btnContinue, (!age || !gender) && styles.btnDisabled]}>
                                    <Text style={styles.textContinue}>Continue</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
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
        marginLeft: 20,
        flex: 1,
        // justifyContent: 'space-between',
        // width: '100%',
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#BF1013',
        marginBottom: 5,
        marginLeft: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        marginRight: 30,
        marginBottom: 20,
        borderBottomWidth: 1.5,
        borderBottomColor: '#BF1013',
    },
    ageContainer: {
     marginTop:20,
    },
    pickerContainer: {
      marginTop:5,
        marginRight: 30,
        marginBottom: 150,
        // borderBottomWidth: 1.5,
        borderBottomColor: '#244DB7',
    },
    inputStyle: {
        flex: 1,
        height: 50,
        marginLeft: 5,
    },
    pickerStyle: {
        height: 50,
        width: '100%',
    },
    viewBottom: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30,
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
    },
    btnDisabled: {
        backgroundColor: '#cccccc',
    },
});
