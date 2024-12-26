import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase giriş işlevi
import { auth } from "../firebaseConfig"; // Firebase yapılandırmasını içe aktar
import { getFirestore, doc, getDoc } from "firebase/firestore"; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Şifre state

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Giriş Başarılı:", userCredential.user);
      Alert.alert("Başarılı", "Giriş başarılı!");
    } catch (err) {
      console.error("Giriş Hatası:", err.message);
      Alert.alert("Hata", "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Üst Bölüm */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>Giriş Yap</Text>
      </View>

      {/* Giriş Formu */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı / E-Mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>GİRİŞ YAP</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Hesabın yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
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
  form: {
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
  },
  input: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: { 
    backgroundColor: '#00796B',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#00796B', // Text before the link
    marginRight: 5,
  },
  registerLink: {
    fontSize: 14,
    color: '#00796B', // Highlight the link in red
    fontWeight: 'bold',
  },
});
