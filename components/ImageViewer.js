import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({placeholderImageSource, selectedImage})
{
    //Used to check if there is a "selectedImage," otherwise uses default placeHolder. Applies image style and places uri as source parameter in Image componenet.
    const imageSource = selectedImage  ? { uri: selectedImage } : placeholderImageSource;
    return <Image source = {imageSource} style = {styles.image}/>
}

const styles = StyleSheet.create(
    {
        image : {
            width: 320, 
            height: 440, 
            borderRadius : 18
        }
    }
)