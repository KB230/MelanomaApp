import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import ImageViewer from "./components/ImageViewer"; 
import Button from "./components/Button";
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';


const PlaceholderImage = require('./assets/images/background-image.png'); 

//main function. app starts here. 
export default function App() {
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
      }
    } catch (error) {
      alert("Error uploading image: " + error.message) //Gives error if image does not upload
    }
  }
  
  //Displays app on screen. Uses ImageViewer and Button components (in components folder). Sets custom properties which are used in those classes. 
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage}/> 
      </View>
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
    paddingTop: 58, //Container for image
  },
  footerContainer: {
    flex : 1/3, 
    alignItems: 'center', //Container for buttons
  }
});
