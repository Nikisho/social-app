import { StyleSheet } from 'react-native'; 
import colours from './colours';

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },

    shadowButtonStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
        backgroundColor: colours.secondaryColour
    },

    translucidViewStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 16, 

    // Add a slightly greyish, translucent background color
    backgroundColor: 'rgba(229, 231, 235, 0.8)', // light grey with 80% opacity
    }
})

export default styles