import React, { Text, View, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterScreen from "./components/RegisterScreen";
import { firebase } from "./firebaseConfig";
import AddGuide from "./components/AddGuide";
import SearchGuide from "./components/SearchGuide";
//import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
//import ProfileScreen from "./components/ProfileScreen";
//import EditProfileScreen from "./components/EditProfileScreen";

const Tab = createBottomTabNavigator();

function App() {
  return (
   <NavigationContainer>
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa', tabBarStyle: { display: 'none' } }} />
      <Tab.Screen name="Login1" component={LoginScreen} options={{ title: 'Giriş Yap', tabBarStyle: { display: 'none' } }} />
      <Tab.Screen name="Register1" component={RegisterScreen} options={{ title: 'Kayıt Ol', tabBarStyle: { display: 'none' } }} />
      <Tab.Screen name="Login" component={AddGuide} options={{ title: 'Kılavuz Ekle', tabBarStyle: { display: 'none' } }} />
      <Tab.Screen name="Register" component={SearchGuide} options={{ title: 'Değer Sorgula', tabBarStyle: { display: 'none' } }} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}
export default App;