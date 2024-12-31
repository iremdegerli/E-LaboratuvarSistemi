import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./components/RegisterScreen";
import AddGuide from "./components/AddGuide";
import SearchGuide from "./components/SearchGuide";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import AdminHome from "./components/AdminHome";
import PatientRegister from "./components/PatientRegister";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Admin Navigator
function AdminNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ title: "Admin Paneli" }}
      />
      <Tab.Screen
        name="AddGuide"
        component={AddGuide}
        options={{ title: "Kılavuz Ekleme" }}
      />
      <Tab.Screen
        name="SearchGuide"
        component={SearchGuide}
        options={{ title: "Kılavuz Sorgulama" }}
      />
    </Tab.Navigator>
  );
}

// User Navigator
function UserNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ProfileScreen"
        component={RegisterScreen}
        options={{ title: "Profil Yönetimi" }}
      />
      <Tab.Screen
        name="SearchGuide"
        component={SearchGuide}
        options={{ title: "Değer Sorgula" }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Patient" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patient" component={PatientRegister} />

        <Stack.Screen name="AdminHome" component={AdminNavigator} />
        <Stack.Screen name="UserHome" component={UserNavigator} />
        <Stack.Screen name="Login" component={AdminNavigator} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
