import React from "react";
import { View, Text, Button } from "react-native";
import { firebase } from "../firebase";

export default function AdminScreen() {
  return (
    <View>
      <Text>Welcome, Admin!</Text>
      <Button title="Logout" onPress={() => firebase.auth().signOut()} />
    </View>
  );
}