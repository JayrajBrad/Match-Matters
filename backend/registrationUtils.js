import AsyncStorage from '@react-native-async-storage/async-storage'

export const saveRegistrationProgress = async (screenName,data) => {

     try {
        const key = `registration_progress_${screenName}`;
        await AsyncStorage.setItem(key,JSON.stringify(data));
        console.log(`Progress saved for the screen : ${screenName}`);
     } catch (error) {
        console.log("Error Saving The Progress", error);
     }
};

export const getRegistrationProgress = async (screenName) => {
    try {
        const key = `registration_progress_${screenName}`;
        const data = await AsyncStorage.getItem(key);
        return data !== null ? JSON.parse(data) : null
        
    } catch (error) {
        console.log("Error retrieving the progress", error);
    }
}






// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const saveRegistrationProgress = async (screenName, data) => {
//   try {
//     const key = `registration_progress_${screenName}`;
//     await AsyncStorage.setItem(key, JSON.stringify(data));
//     console.log(`Progress saved for the screen: ${screenName}`);

//     // If the screenName is the one where the user uploads their profile picture, save it separately
//     if (screenName === 'ProfilePicScreen') {
//       const profileImageUri = data.profileImageUri; // Adjust according to your data structure
//       await AsyncStorage.setItem('profile_image', profileImageUri);
//     }
//   } catch (error) {
//     console.log("Error Saving The Progress", error);
//   }
// };

// export const getRegistrationProgress = async (screenName) => {
//   try {
//     const key = `registration_progress_${screenName}`;
//     const data = await AsyncStorage.getItem(key);
//     return data !== null ? JSON.parse(data) : null;
//   } catch (error) {
//     console.log("Error retrieving the progress", error);
//   }
// };








// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const saveRegistrationProgress = async (screenName, data) => {
//   try {
//     const key = `registration_progress_${screenName}`;
//     await AsyncStorage.setItem(key, JSON.stringify(data));
//     console.log(`Progress saved for the screen: ${screenName}`);

//     // If the screenName is the one where the user uploads their profile picture, save it separately
//     if (screenName === 'Photos') {
//       const profileImageUri = data.images[0]; // Assuming the first image is the profile picture
//       await AsyncStorage.setItem('profile_image', profileImageUri);
//     }
//   } catch (error) {
//     console.log("Error Saving The Progress", error);
//   }
// };

// export const getRegistrationProgress = async (screenName) => {
//   try {
//     const key = `registration_progress_${screenName}`;
//     const data = await AsyncStorage.getItem(key);
//     return data !== null ? JSON.parse(data) : null;
//   } catch (error) {
//     console.log("Error retrieving the progress", error);
//   }
// };
