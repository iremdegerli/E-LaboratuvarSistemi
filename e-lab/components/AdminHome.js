import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddGuide from "./AddGuide";
import SearchGuide from "./SearchGuide";

const Tab = createBottomTabNavigator();

function AdminHome() {
  return (
    <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Admin Paneli</Text>
            <Image source={require('../assets/icon.png')} style={styles.logo} />
          </View>
    
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 2,
    backgroundColor: '#00796B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 3,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
  },
});
export default AdminHome;
