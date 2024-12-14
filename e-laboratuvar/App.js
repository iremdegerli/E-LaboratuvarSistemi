import {View, Text, StyleSheet} from 'react-native';

export default () => (
  <View style={styles.myStyle}>
    <Text style={ styles.standartText}> standartText ile biçimlendirilmiş yazı</Text>
    <Text style={[styles.standartText,styles.fancyText]}>
      fancyText fontStyle ve color eklenmiş yazı
    </Text>
  </View>
);

{
  "expo": {
    "name": "w06-01-bmi-button",
    "slug": "snack-2f97f777-e2fc-4d86-b3d2-f3e64f611cdf",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
  }}

const styles = StyleSheet.create({
  myStyle: {
    width:400,
    height:400,
    backgroundColor:'skyblue'
  },
  standartText: {
    fontSize:24,
    color:'#f8f8f8'    
  },
  fancyText: {
    fontStyle:'italic',
    color:'rgb(0,125,255)'
  }
})
  