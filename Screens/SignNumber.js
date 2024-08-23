

// country code dropdown picker
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CountryCodeDropdownPicker from 'react-native-dropdown-country-picker';
import { getRegistrationProgress, saveRegistrationProgress } from '../backend/registrationUtils';

export default function SignNumber({ navigation }) {

  let textInput = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [focusInput, setFocusInput] = useState(true);
  const [selected, setSelected] = useState('+91'); 
  const [country, setCountry] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

  const onChangePhone = (number) => {
    setPhoneNumber(number);
    setIsValidPhoneNumber(true);
  };

  useEffect(() => {
    getRegistrationProgress('PhoneNum').then(progressData => {
      if (progressData) {
        setPhoneNumber(progressData.phoneNumber || '');
      }
    });
  }, []);

  // const onPressContinue = () => {
  //   if (phoneNumber.trim() !== '') {
  //     saveRegistrationProgress('PhoneNum', { phoneNumber });
  //   }

  //   if (phoneNumber) {
  //     navigation.navigate('OtpScreen');
  //   }
  // };

  // const onPressContinue = () => {
  //   const fullPhoneNumber = `${selected}${phoneNumber}`;
    
  //   if (phoneNumber.trim() !== '' && phoneNumber.length === 10) {
  //     saveRegistrationProgress('PhoneNum', { phoneNumber: fullPhoneNumber });
  //     navigation.navigate('OtpScreen');
  //   } else {
  //     alert('Please enter a valid 10-digit phone number.');
  //   }
  // };

  const onPressContinue = async () => {
    const fullPhoneNumber = `${selected}${phoneNumber}`;
    
    if (validatePhoneNumber(phoneNumber)) {
        if (phoneNumber.trim() !== '' && phoneNumber.length === 10) {
            try {
                await saveRegistrationProgress('PhoneNum', { phoneNumber: fullPhoneNumber });
                navigation.navigate('SignEmail');
            } catch (error) {
                console.error('Error saving registration progress: ', error);
            }
        }
    } else {
        setIsValidPhoneNumber(false);
    }
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

  const onChangeFocus = () => {
    setFocusInput(true);
  };

  const onChangeBlur = () => {
    setFocusInput(false);
  };

  // useEffect(() => {
  //   textInput.focus();
  // }, []);

  //     useEffect(() => {
  //     if (textInput.current) {
  //         console.log('Focusing text input');
  //         textInput.current.focus();
  //     }
  // }, []);

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior={'padding'}
          style={styles.containerAvoidingView}
        >
          <TouchableOpacity>
            <Text onPress={() => {
              navigation.goBack();
            }}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>Can we get your number?</Text>
          <Text style={styles.headTag}>We only use phone number to make sure everyone on Match Matters is real.</Text>

          <View style={[styles.inputContainer, { borderBottomColor: '#244DB7' }]}>
            <CountryCodeDropdownPicker
              
              selected={selected}
              setSelected={setSelected}
              setCountryDetails={setCountry}
              phone={phoneNumber}
              setPhone={onChangePhone}
              countryCodeTextStyles={{ fontSize: 13 }}
              countryCodeContainerStyles={[styles.countryCode]}
              style={styles.countryPickerStyle}
              searchStyles={[styles.search]}
              dropdownStyles={[styles.dropdown]}
              // placeholder="enter country code"
              
            />
            {/* <TextInput
              ref={textInput}
              style={styles.phoneInputStyle}
              placeholder="Phone Number"
              keyboardType="numeric"
              value={phoneNumber}
              onChangeText={onChangePhone}
              onFocus={onChangeFocus}
              onBlur={onChangeBlur}
              maxLength={10}
            /> */}
          </View>

          {!isValidPhoneNumber && <Text style={styles.errorText}>Please enter a valid 10-digit phone number.</Text>}

          <View style={styles.viewBottom}>
            <TouchableOpacity onPress={onPressContinue}>
              <View style={styles.btnContinue}>
                <Text style={styles.textContinue}>Continue</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 100,
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
    marginTop: 5,
    marginRight: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    marginRight: 30,
    // paddingRight : 5,
    // paddingLeft : 5,
    padding : 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  countryPickerStyle: {
    flex: 1,
  },
  countryCode: {
    height: 40,
  },
  search:{
    height: 40,
  },
  dropdown : {
    height : 178,

  },
  phoneInputStyle: {
    flex: 1,
    height: 50,
    
  },
  viewBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 115,
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
  text: {
    fontSize: 16,
  },
});

