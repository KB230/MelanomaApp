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
    if(theme == "small")
    {
        return (
            <View style={[styles.smallContainer]}>
              <Pressable
                style={[styles.logOutButton]}
                onPress={onPress} 
              >
                <Text style={[styles.logOutButtonLabel]}>{label}</Text>
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

const styles = StyleSheet.create({
  buttonContainer: {
    width: 280,
    height: 57,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#8e7c5f',  // Brown button
  },
  buttonLabel: {
    color: '#FFFFFF',  // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallContainer: {
    width: 100, 
    height: 50, 
    left: 0,
    marginHorizontal: 0, 
    padding: 2
  },
  logOutButton: {
    borderRadius: 0, 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logOutButtonLabel: {
    color: '#2e1c0d', 
    fontSize: 16, 
    fontWeight: 'bold'
  }
});
