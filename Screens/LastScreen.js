import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getRegistrationProgress, saveRegistrationProgress } from '../backend/registrationUtils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PreferenceScreen({ navigation }) {
    const [userData,setUserData] = useState();

    useEffect(() => {
       getAllUserData();
    },[]);

   const getAllUserData = async () => {
      try {
        const screens = [
            'PhoneNum',
            'Email',
            'Name',
            'Age',
            'Photos',
            'Preference'

        ];

      let userData = {};

      for(const screenName of screens){
        const screenData = await getRegistrationProgress(screenName);
        if(screenData) {
            userData = {...userData,...screenData};
        }
      };

      setUserData(userData)

      } catch (error) {
        console.log("Error",error);
      }
   
    }

   

 const clearAllScreenData = async () => {
    try {
        const screens = [
            'PhoneNum',
            'Email',
            'Name',
            'Age',
            'Photos',
            'Preference'

        ];

        for(const screenName of screens){
            const key = `registration_progress_${screenName}`;
            await AsyncStorage.removeItem(key);
        }

        console.log("All Screen Data Was Saved And Cleared For New Users....!!!!")
        
    } catch (error) {
        console.log("Error", error);
    }
 } 

    const registerUser = async () => {

        console.log("All The registration Details have been saved in the Async Local Storage for now!!");
        console.log("data",userData);
        sendData();
        clearAllScreenData();
        navigation.navigate('HomeScreen', {userData});
    };

    sendData = () => {
      fetch("http://192.168.0.104:4000/register",{
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      })
      console.log("done !");
    }
;
    // console.log("data outside registeruser :",userData); 


    return (
        <SafeAreaView style={styles.area}>
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                    <Text style={styles.Back}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.headTitle}>Complete Registration</Text>


             

                <TouchableOpacity onPress={registerUser}>
                    <View style={styles.skipButton}>
                        <Text style={styles.skipText}>Register</Text>
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
    Back:{
        alignItems: "center",
        // marginTop : 10,
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
