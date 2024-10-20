import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({placeholderImageSource, selectedImage})
{
    //Used to check if there is a "selectedImage," otherwise uses default placeHolder. Applies image style and places uri as source parameter in Image componenet.
    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
    return <Image source = {imageSource} style = {styles.image}/>
}

const styles = StyleSheet.create({
    image: {
      width: 256,
      height: 256,
      borderRadius: 2,  // Rounded corners for a modern feel
      borderWidth: 3,
      borderColor: '#000000',  // Border to match button colors
    },
  });
  