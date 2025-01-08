import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { collection, addDoc } from "firebase/firestore";
import { auth, database } from "../firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tc, setTc] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await addDoc(collection(database, "users"), {
          uid: user.uid,
          name,
          surname,
          tc,
          email,
          gender,
          birthDate: birthDate.toLocaleDateString(),
          role: "user",
        });

        Alert.alert("Başarılı", "Kayıt başarılı!");
      } catch (err) {
        setError(err.message);
        Alert.alert("Hata", "Kayıt sırasında bir sorun oluştu.");
      }
    }
  };

  const validateForm = () => {
    if (tc.length !== 11) {
      Alert.alert("Hata", "TC Kimlik Numarası 11 haneli olmalıdır!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Hata", "Geçersiz E-Mail formatı!");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor!");
      return false;
    }
    if (!tc || !name || !surname || !birthDate || !email || !password || !confirmPassword || !gender) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun!");
      return false;
    }
    return true;
  };

  const onChangeDateHandler = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  return (
   <ScrollView style={styles.container}>
    {/* Üst Bölüm */}
    <View style={styles.header}>
      <Image 
        source={require('../assets/icon.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Kayıt Ol</Text>
    </View>
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="TC Kimlik No"
        value={tc}
        onChangeText={(text) => setTc(text)}
        keyboardType="numeric"
        maxLength={11}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={name}
        onChangeText={(text) => setName(text)}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Soyad"
        value={surname}
        onChangeText={(text) => setSurname(text)}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>{birthDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={birthDate} mode="date" display="default" onChange={onChangeDateHandler} maximumDate={new Date()}/>
      )}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === "Erkek" && styles.selectedButton]}
          onPress={() => setGender("Erkek")}
        >
          <Text style={styles.genderText}>Erkek</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === "Kadın" && styles.selectedButton]}
          onPress={() => setGender("Kadın")}
        >
          <Text style={styles.genderText}>Kadın</Text>
        </TouchableOpacity>
      </View>
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
      <TextInput
        style={styles.input}
        placeholder="Şifreyi Doğrula"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>KAYIT OL</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Hesabın var mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>

      </View>
    </ScrollView>
  );
};

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

  //*** */
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
    alignItems: "center",
    borderRadius: 25,
  },
  selectedButton: {
    backgroundColor: "#00796B",
  },
  genderText: {
    color: "#000",
  },
  datePicker: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
    color: "#000",
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
    fontSize: 14,
    color: '#00796B', // Highlight the link in red
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#00796B', // Text before the link
    marginRight: 5,
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default RegisterScreen;
