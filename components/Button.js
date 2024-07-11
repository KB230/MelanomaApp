import {StyleSheet, Pressable, View, Text} from 'react-native'; 
import FontAwesome from "@expo/vector-icons/FontAwesome"; 

//Button Class
//Uses Pressable Component 

/*
  label : what text is displayed on the button
  theme : only value is "primary." Uses if condition to custom style the first button. 
  onPress: action taken when pressed. This uses the either the pickImage or uploadImage function for either button based on parameter in App.js
*/
export default function Button({label, theme, onPress})
{
    if(theme == "primary")
    {
        return (
            <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 }]}>
              <Pressable
                style={[styles.button, { backgroundColor: "#fff" }]}
                onPress={onPress} 
              >
                <FontAwesome
                  name="picture-o"
                  size={18}
                  color="#25292e"
                  style={styles.buttonIcon}
                />
                <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
              </Pressable>
            </View>
          );       
    }


    return(
        <View style = {styles.buttonContainer}>
            <Pressable style = {styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = new StyleSheet.create
(
    {
        buttonContainer: {
            width: 320,
            height: 68,
            marginHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
          },
          button: {
            borderRadius: 10,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          },
          buttonIcon: {
            paddingRight: 8,
          },
          buttonLabel: {
            color: '#2e2b36',
            fontSize: 16,
          },
    }
);