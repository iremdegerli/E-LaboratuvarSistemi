import {View, Text, StyleSheet} from 'react-native';

export default () => (
  <View style={styles.myStyle}>
    <Text style={ styles.standartText}> standartText ile biçimlendirilmiş yazı</Text>
    <Text style={[styles.standartText,styles.fancyText]}>
      fancyText fontStyle ve color eklenmiş yazı
    </Text>
  </View>
);

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
  