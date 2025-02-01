import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import ImageViewer from "../components/ImageViewer"; 
import Button from "../components/Button";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import PredictionComponent from '../components/PredictionComponent'; 
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {decode} from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';


const PlaceholderImage = require('../assets/images/cancer_image.png');  // Filepath to default image
const LogoImage = require('../assets/images/logo.png');  // Filepath to logo image

export default function UploadScreen({ setIsAuthenticated }) {
  
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  
  // Pick Image from Library Function
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      sendToDB(result.assets[0].uri); 
    } else {
      alert('You did not select any image.');
    }
  }

  // Function to upload image from Camera
  const uploadImage = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        await setSelectedImage(result.assets[0].uri);
        sendToDB(result.assets[0].uri); 
      }
    } catch (error) {
      alert("Error uploading image: " + error.message);
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
        .from('image_files')  
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


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthScreen' }],
      })
    );
  };
  
  return (
    <View style={styles.container}>
      <Image source={LogoImage} style={styles.logo} />
      <View style={styles.logOutContainer}>
        <Button label={"Log Out"} onPress={handleLogout} theme={"small"} />
      </View>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} /> 
      </View>
      {selectedImage && <PredictionComponent imageUri={selectedImage} />}   
      <View style={styles.buttonContainer}>
        <Button label={"Choose a photo."} onPress={pickImageAsync} />
        <Button label={"Take a photo."} onPress={uploadImage} />
      </View>
      <View style={styles.modelInfoButtonContainer}>
        <Button label={"Model Info"} onPress={() => navigation.navigate('ModelInfo')} theme="small"></Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0efeb', // Main background color
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items at the top
  },
  logo: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 70, // Increased width for the logo
    height: 70, // Increased height for the logo
  },
  imageContainer: {
    flex: 1,
    paddingTop: 10,
    marginTop: 150, // Adjusted margin to separate image from logo
  },
  logOutContainer: {
    position: 'absolute',
    top: 30, // Keeping the log-out button fixed at this position
    left: 300
  },
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 75 // Adjust margin to move buttons closer to the image viewer
  },
  modelInfoButtonContainer: {
    alignItems:'center', 
    bottom:40
  }
});
