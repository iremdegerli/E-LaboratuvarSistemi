import React from "react";
import { Image } from 'react-native'; 
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./components/RegisterScreen";
import AddGuide from "./components/AddGuide";
import SearchGuide from "./components/SearchGuide";
import HomeScreen from "./components/HomeScreen";
import LoginScreen from "./components/LoginScreen";
import AdminHome from "./components/AdminHome";
import UserHome from "./components/UserHome";
import PatientRegister from "./components/PatientRegister";
import PatientsTests from "./components/PatientsTests";
import AddTest from "./components/AddTest";
import ProfileScreen from "./components/ProfileScreen";
import EditProfileScreen from "./components/EditProfileScreen";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Admin Navigator
function AdminNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AdminHome"
        component={AdminHome}
        options={{ title: "Admin Paneli" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/panel.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
        
      />
      <Tab.Screen
      name="PatientRegister"
      component={PatientRegister}
      options={{ title: "Hasta Sorgulama" ,
        tabBarIcon: ({ color, size }) => (
          <Image
          source={require('./assets/tahlil.png')} // Resmi belirt
          style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
        />
        ),
      }}
    />
    <Tab.Screen
        name="AddTest"
        component={AddTest}
        options={{ title: "Tahlil Ekleme" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/tahlil_ekle.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
      <Tab.Screen
        name="AddGuide"
        component={AddGuide}
        options={{ title: "Kılavuz Ekle" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/k_ekle.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
      <Tab.Screen
        name="SearchGuide"
        component={SearchGuide}
        options={{ title: "Kılavuz Ara" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/k_ara.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// User Navigator
function UserNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="UserHome"
        component={UserHome}
        options={{ title: "Kullanıcı Paneli" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/panel.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
      <Tab.Screen
        name="PatientsTests"
        component={PatientsTests}
        options={{ title: "Tahlillerim" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/tahlil.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: "Profil" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/profil.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
      <Tab.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ title: "Profil Düzenle" ,
          tabBarIcon: ({ color, size }) => (
            <Image
            source={require('./assets/settings.png')} // Resmi belirt
            style={{ width: 30, height: 30 }} // İkon boyutlarını ayarlayın
          />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patient" component={PatientRegister} />
        <Stack.Screen name="AddTest" component={AddTest}/>
        <Stack.Screen name="AdminHome" component={AdminNavigator} />
        <Stack.Screen name="UserHome" component={UserNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
