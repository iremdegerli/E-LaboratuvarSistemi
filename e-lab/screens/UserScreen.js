import React from "react";
import { View, Text, Button } from "react-native";
import { firebase } from "../firebase";

export default function UserScreen() {
  return (
    <View>
      <Text>Welcome, User!</Text>
      <Button title="Logout" onPress={() => firebase.auth().signOut()} />
    </View>
  );
}