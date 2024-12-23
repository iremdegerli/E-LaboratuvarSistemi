import React, { Text, View, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { firebase } from "./firebaseConfig";
import RegisterScreen from "./components/RegisterScreen";
//import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
//import ProfileScreen from "./components/ProfileScreen";
//import EditProfileScreen from "./components/EditProfileScreen";

<<<<<<< Updated upstream
const Tab = createBottomTabNavigator();
=======


const Stack = createStackNavigator();

function App() {
  return (
    <View>
      <Text>E-Laboratuvar Sistemi</Text>
      <Register /> {/* Kayıt bileşenini çağır */}
    </View>
  );
}
export default App;
/*
export default App;
>>>>>>> Stashed changes

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