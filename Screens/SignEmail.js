import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../backend/registrationUtils";

export default function SignEmail({ navigation }) {
  let textInput = useRef(null);

  const [emailId, setEmailId] = useState("");
  const [focusInput, setFocusInput] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const onChangeEmail = (email) => {
    setEmailId(email);
    setIsValidEmail(true);
  };

  // useEffect(() => {
  //   getRegistrationProgress('Email').then(progressData => {
  //     if(progressData){
  //       setEmailId(progressData.emailId || '');
  //     }
  //   })
  // });

  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getRegistrationProgress("Email");
      if (progressData) {
        setEmailId(progressData.emailId || "");
      }
    };
    fetchProgress();
  }, []);

  // const onPressContinue = () => {
  //     if (emailId && validateEmail(emailId)) {
  //       if(emailId.trim() !== ''){
  //         saveRegistrationProgress('Email',{emailId});
  //       }

  //         navigation.navigate('EmailOTPScreen');
  //     } else {
  //         setIsValidEmail(false);
  //     }
  // };

  const onPressContinue = async () => {
    if (emailId && validateEmail(emailId)) {
      if (emailId.trim() !== "") {
        try {
          await saveRegistrationProgress("Email", { emailId });
          // Clear the input fields
          // setEmailId('');
          // Navigate to the next screen
          navigation.navigate("SignPassword");
        } catch (error) {
          console.error("Error saving registration progress: ", error);
        }
      }
    } else {
      setIsValidEmail(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChangeFocus = () => {
    setFocusInput(true);
  };

  const onChangeBlur = () => {
    setFocusInput(false);
  };

  useEffect(() => {
    textInput.focus();
  }, []);

  // useEffect(() => {
  //   if (textInput.current) {
  //       textInput.current.focus();
  //   }
  // }, []);

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={50}
          behavior={"padding"}
          style={styles.containerAvoidingView}
        >
          <TouchableOpacity>
            <Text
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <Text style={styles.headTitle}>Can we get your Email?</Text>
          <Text style={styles.headTag}>
            We only use Email to make sure everyone on Match Matters is real.
          </Text>
          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isValidEmail ? "#244DB7" : "red" },
            ]}
          >
            <View style={styles.openDialogView}></View>
            <TextInput
              ref={(input) => (textInput = input)}
              style={styles.emailInputStyle}
              placeholder="Enter Your Email Id"
              keyboardType="email-address"
              value={emailId}
              autoCapitalize="none"
              onChangeText={onChangeEmail}
              secureTextEntry={false}
              onFocus={onChangeFocus}
              onBlur={onChangeBlur}
            />
          </View>
          {!isValidEmail && (
            <Text style={styles.errorText}>
              Please enter a valid email address.
            </Text>
          )}
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
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 100,
    alignItems: "center",
  },
  containerAvoidingView: {
    marginLeft: 30,
  },
  headTitle: {
    fontSize: 40,
    fontWeight: "800",
    marginRight: 100,
  },
  headTag: {
    fontSize: 16,
    marginTop: 5,
    marginRight: 30,
  },
  inputContainer: {
    flexDirection: "row",
    marginRight: 30,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1.5,

    borderColor: "#C0C0C0",
    borderWidth: 1,

    marginTop: 20,
  },
  emailInputStyle: {
    marginLeft: 5,
    flex: 1,
    height: 50,
  },
  openDialogView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 115,
    alignItems: "center",
  },
  btnContinue: {
    width: 250,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BF1013",
  },
  textContinue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    alignItems: "center",
  },
  errorText: { color: "red", marginTop: 10 },
  button: {
    marginTop: 100,
    marginHorizontal: 10,
  },
});
