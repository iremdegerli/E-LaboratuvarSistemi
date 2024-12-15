import { Text, View, StyleSheet, SectionList } from 'react-native';


export default function App() {

    const sections = [
      { title: 'A', data: ['Apple', 'Avocado'] },
      { title: 'B', data: ['Banana', 'Blueberry'] },
      { title: 'C', data: ['Cherry', 'Coconut'] }
    ];

  return (

    <SectionList
      sections = { sections }
      keyExtractor = { (item, index) => item = index }
      renderItem = { ( { item } ) => <Text style = {styles.item}> {item} </Text> }
      renderSectionHeader = {
        ( {section }) => (
          <Text style = {styles.header}> {section.title} </Text>
        )
      }


    />

  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 20,
    backgroundColor: '#f9f9f9'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#efefef',
    padding: 10
  }
});
