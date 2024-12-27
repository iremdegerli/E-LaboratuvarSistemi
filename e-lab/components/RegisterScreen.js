import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
        <DateTimePicker value={birthDate} mode="date" display="default" onChange={onChangeDateHandler} />
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
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Giriş Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#00796B",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
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
    borderRadius: 8,
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
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  dateText: {
    color: "#000",
  },
  loginLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#00796B",
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default RegisterScreen;
