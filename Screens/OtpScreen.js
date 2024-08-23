import { View, Text, Image, StyleSheet,TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TextInput, Platform  } from 'react-native'
import React, {useEffect, useRef, useState} from 'react';

export default function OtpScreen({navigation}) {

    let textInput = useRef(null);
    let clockCall = null;
    const lengthInput = 6;
    const defaultCountdown = 30;
    const [internalVal, setInternalVal] = useState(""); 
    const [countdown, setCoundwown] = useState(defaultCountdown);
    const [enableResend, setEnableResend] = useState(false);

    useEffect (() => {
       clockCall = setInterval(() => {
        decrementClock();
       },1000)
       return () => {
        clearInterval(clockCall)
       }
    });

    const decrementClock = () => {
        if(countdown === 0){
            setEnableResend(true)
            setCoundwown(0)
            clearInterval(clockCall)
        } else {
            setCoundwown(countdown -1)
        }
        
    }

  //   const decrementClock = () => {
  //     setCoundwown((prevCountdown) => {
  //         if (prevCountdown === 0) {
  //             setEnableResend(true);
  //             clearInterval(clockCall);
  //             return 0;
  //         } else {
  //             return prevCountdown - 1;
  //         }
  //     });
  // };

    const onChangeText = (val) => {
      setInternalVal(val);
      if(val.length === lengthInput){
        navigation.navigate('NamePage');
      }
    }

  
     const onResendOTP = () => {
        if(enableResend){
            setCoundwown(defaultCountdown)
            setEnableResend(false)
            clearInterval(clockCall)
            clockCall = setInterval(() => {
                decrementClock(0);
            }, 1000)
        }
     }

     const onChangeNumber = () => {
        setInternalVal("")
     }



    // useEffect (() => {
    //     textInput.focus();
    //    },[]);

    useEffect(() => {
      if (textInput.current) {
          console.log('Focusing text input');
          textInput.current.focus();
      }
  }, []);
  
 
    return (
      <SafeAreaView style={styles.area}> 
           <View style={styles.container}>
  
               <KeyboardAvoidingView 
                keyboardVerticalOffset={50}
                // behavior= {'padding'}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style = {styles.containerAvoidingView}
               > 
                     
         <TouchableOpacity>
           <Text    onPress={() => {
            navigation.goBack();
          }}>Back</Text>
         </TouchableOpacity>
                <Text style={styles.headTitle}>Enter The Verification Code</Text>
                <Text style={styles.headTag}>We only use phone number to make sure everyone on Match Matters is real.</Text>
                
                <TextInput 
                //  ref={(input) => textInput = input}
                 ref={textInput}
                 onChangeText={onChangeText}
                 style = {{width:1, height:1, opacity:0}}
                 value = {internalVal}
                 maxLength={lengthInput}
                 returnKeyType= "done"
                 keyboardType='numeric'
                
                />

                <View style = {styles.inputContainer}>
                    {
                        Array(lengthInput).fill().map((_,index) => (
                            <View 
                            key={index} 
                            style = {[
                                styles.cellView,
                                {
                                    borderBottomColor: index === internalVal.length ? '#FB6C6A' : '#234DB7'
                                }
                            ]}>
                            <Text 
                            style = {styles.cellText}
                            onPress={() => textInput.current.focus()} 
                            >
                            {internalVal && internalVal.length > 0 ?  internalVal[index] : " "}

                            </Text>
                       </View>
                        ))
                    }

                

                </View>
               
              <View style = {styles.bottomView}>
                  <TouchableOpacity onPress={onChangeNumber}>
                    <View style = {styles.btnChangeNumber}>
                <Text style= {styles.textChange}>Change Number</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={onResendOTP}>
                    <View style = {styles.btnResend}>
                <Text style= {[
                    styles.textResend,
                    {
                        color: enableResend ? '#234DB7' : 'gray'
                    }   
                    ]}>
                    Resend OTP ({countdown})</Text>
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
      flex:1,
      backgroundColor:'#fff',
      marginTop:100,
      alignItems:'center',
    },
    containerAvoidingView:{
      marginLeft:30,
    },
    headTitle: {
      fontSize: 40,
      fontWeight:'800',
      marginRight: 50,
    },
    headTag:{
      fontSize:16,
     marginTop:5, 
     marginRight:30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellView: {
       paddingVertical:11,
       width: 40,
       margin: 5,
       justifyContent: 'center',
       alignItems: 'center',
       borderBottomWidth: 1.5,

    },
    cellText: {
        textAlign: 'center',
        fontSize: 16,
    },
    bottomView:{
        flexDirection:'row',
        flex:1,
        justifyContent: 'space-around',
        marginBottom: 110,
        alignItems:'flex-end',
    },
    btnChangeNumber: {
    width:150,
    height:50,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    },

    textChange:{
        color: '#234DB7',
        alignItems: 'center',
        fontSize: 15,

    },
    btnResend: {
        width:150,
        height:50,
        borderRadius: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    textResend: {
        alignItems: 'center',
        fontSize: 15,
    },
    
  });