import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase kullanıcı oluşturma işlevi
import { auth } from "../firebaseConfig"; // Firebase yapılandırmasını içe aktar

const Register = () => {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Şifre state
  const [error, setError] = useState(""); // Hata mesajı için state

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Kayıt Başarılı: ", userCredential.user);
      Alert.alert("Başarılı", "Kayıt başarılı!"); // Başarı mesajı
    } catch (err) {
      Alert.alert('Kayıt olmadı');
    }
  };

  const validateForm = () => {
    if (tc.length !== 11) {
      Alert.alert('Hata', 'TC Kimlik Numarası 11 haneli olmalıdır!');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Geçersiz E-Mail formatı!');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return false;
    }
    if (!tc || !name || !surname || !email || !birthDate || !password || !confirmPassword || !gender) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Adresi"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <Button title="Kayıt Ol" onPress={handleRegister} />
      {error ? <Text style={styles.error}>{error}</Text> : null} {/* Hata mesajını göster */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#000",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Register;
