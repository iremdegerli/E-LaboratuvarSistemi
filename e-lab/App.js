import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "./firebaseConfig";
import Register from "./components/Register";


const Stack = createStackNavigator();

function App() {
  return (
    <div>
      <h1>E-Laboratuvar Sistemi</h1>
      <Register /> {/* Kayıt bileşenini çağır */}
    </div>
  );
}
export default App;
/*
export default App;

export default function App() {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     setUser(user);
  //   });
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          user.email === "admin@example.com" ? (
            <Stack.Screen name="Admin" component={AdminScreen} />
          ) : (
            <Stack.Screen name="Admin" component={UserScreen} />
          )
        ) : (
          <Stack.Screen name="Admin" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/
/*import React, { useEffect, useState } from "react";
import { database } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [kılavuz, setKılavuz] = useState([]);

  useEffect(() => {
    const fetchKılavuz = async () => {
      const kılavuzCollection = collection(database, "kılavuz");
      const snapshot = await getDocs(kılavuzCollection);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setKılavuz(list);
    };

    fetchKılavuz();
  }, []);

  return (
    <div>
      <h1>Kılavuz Verileri</h1>
      <ul>
        {kılavuz.map(item => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
*/