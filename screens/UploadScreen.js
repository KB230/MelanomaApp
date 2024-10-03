import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import ImageViewer from "../components/ImageViewer"; 
import Button from "../components/Button";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import PredictionComponent from '../components/PredictionComponent'; 
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { decode } from "base64-arraybuffer";
import * as FileSystem from 'expo-file-system';
//import { nanoid } from "nanoid";

const PlaceholderImage = require('../assets/images/background-image.png'); 

//main function. app starts here. 
export default function UploadScreen() {
  const navigation = useNavigation(); // Get the navigation object
  //Variable: selectedImage - Function: setSelectedImage  
  const [selectedImage, setSelectedImage] = useState(null);  //useState() -- defaults a value to null unless the function is called.

  
  //Pick Image from Library Function -- uses ImagePicker library function. -- Caled through button onPress parameter
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, //allows cropping of image
      quality: 1, //sets quality to max
    });
    if(!result.canceled) //checks if the result is NOT canceled
    {
       /*
       sets the variable to the uri of the image. the result value is a list of properties. 
       Thus you must get the uri property from the first element (a dictionary) from the list
       */
      setSelectedImage(result.assets[0].uri);
      sendToDB(result.assets[0].uri); 
    }
    else
    {
      //Notifies user if image is not selected
      alert('You did not select any image.');
    }
  }
  //Function that uploads image directly from Camera -- Called through button onPress parameter
  const uploadImage = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();  //use different ImagePicker function to get camera permission
      let result = await ImagePicker.launchCameraAsync({ //If permission given launch Camera in app 
        cameraType : ImagePicker.CameraType.back, //Opens to back camera
        allowsEditing: true, //Crops Allowed
        quality: 1 //Max Quality 
      });

      if(!result.canceled)
      {
        await setSelectedImage(result.assets[0].uri); //Calls setSelectedImage Function. 
        sendToDB(result.assets[0].uri); 
      }
    } catch (error) {
      alert("Error uploading image: " + error.message) //Gives error if image does not upload
    }
  }
  const generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  const sendToDB = async (uri) => {
    try {
      // Convert the image file at the URI to base64
      const base64Image = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      
      // Extract the file extension from the URI (e.g., 'jpg' or 'png')
      const fileExt = uri.split('.').pop();
      
      // Remove the 'data:image/jpeg;base64,' prefix if it exists
      const base64Str = base64Image.includes("base64,")
        ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
        : base64Image;
  
      // Convert base64 to ArrayBuffer using 'base64-arraybuffer' library
      const arrayBuffer = decode(base64Str);
  
      // Get the current user ID from Supabase authentication
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
  
      // Check for a valid user ID before proceeding
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
  
      // Generate a unique file name using a custom random string generator
      const fileName = `${generateRandomString()}.${fileExt}`;

  
      // Upload the ArrayBuffer to Supabase storage
      const { data, error } = await supabase.storage
        .from('image_files')  // Make sure this is your correct bucket name
        .upload(`${userId}/${fileName}`, arrayBuffer, {
          contentType: `image/${fileExt}`,
        });
  
      // Handle upload errors or log success
      if (error) {
        console.error("Upload error:", error.message);
      } else {
        console.log("File uploaded successfully:", data);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    console.log("Logged Out");
    navigation.navigate('AuthScreen'); // Navigate back to AuthScreen
    if (error) Alert.alert(error.message);
  }
  

  
  //Displays app on screen. Uses ImageViewer and Button components (in components folder). Sets custom properties which are used in those classes. 
  return (
    <View style={styles.container}>
      <View style={styles.logOutContainer}>
        <Button label = {"Log Out."} onPress={handleLogout}></Button>
      </View>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage}/> 
      </View>
      {selectedImage && <PredictionComponent imageUri={selectedImage} />}   
      <View style={styles.container}>
        <Button theme = {"primary"} label = {"Choose an photo."} onPress={pickImageAsync}></Button> 
        <Button label = {"Take a photo."} onPress={() => uploadImage()}></Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

//StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe9cc', //Background color of app
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 120, //Container for image
  },
  footerContainer: {
    flex : 1/3, 
    alignItems: 'center', //Container for buttons
  }
});