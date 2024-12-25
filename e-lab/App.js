import React, { Text, View, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegisterScreen from "./components/RegisterScreen";
import { firebase } from "./firebaseConfig";
//import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
//import ProfileScreen from "./components/ProfileScreen";
//import EditProfileScreen from "./components/EditProfileScreen";

const Tab = createBottomTabNavigator();

function App() {
  return (
   <NavigationContainer>
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa', tabBarStyle: { display: 'none' } }} />
      <Tab.Screen name="Register" component={RegisterScreen} options={{ title: 'Kayıt Ol', tabBarStyle: { display: 'none' } }} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}
export default App;
/*
export default App;
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa', tabBarStyle: { display: 'none' } }} />
        <Tab.Screen name="Register" component={RegisterScreen} options={{ title: 'Kayıt Ol', tabBarStyle: { display: 'none' } }} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}
*/