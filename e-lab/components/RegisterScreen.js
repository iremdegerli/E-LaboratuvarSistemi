import React, { useState } from "react";
<<<<<<< HEAD
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert("Kayıt başarılı!");
    } catch (err) {
      setError(err.message);
=======
import { View, Text, TextInput, TouchableOpacity, Button, Alert, Image, StyleSheet, ScrollView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase kullanıcı oluşturma işlevi
import { collection, addDoc } from "firebase/firestore"; 
import { auth, database} from "../firebaseConfig"; // Firebase yapılandırmasını içe aktar
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Şifre state
  const [confirmPassword, setConfirmPassword] = useState(""); // Şifre doğrulama state
  const [tc, setTc] = useState(""); // TC no state
  const [name, setName] = useState(""); // Ad state
  const [surname, setSurname] = useState(""); // Soyad state
  const [birthDate, setBirthDate] = useState(new Date());  // Doğum tarihi state
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePicker gösterimi
  const [gender, setGender] = useState(""); // Cinsiyet state
  const [role] = useState("user"); // Varsayılan role: user
  const [error, setError] = useState(""); // Hata mesajı için state

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        // Firebase Authentication ile kullanıcı kaydı
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        // Firestore'da kullanıcı verilerini kaydetme
        await addDoc(collection(database, "users"), {
          uid: user.uid,
          name: name,
          surname: surname,
          tc: tc,
          email: email,
          gender: gender,
          birthDate: birthDate.toLocaleDateString(), // Tarihi string olarak kaydediyoruz
          role: role,
        });
    
        console.log("Kayıt Başarılı: ", userCredential.user);
        Alert.alert("Başarılı", "Kayıt başarılı!"); // Başarı mesajı
      } catch (err) {
        console.error("Kayıt başarısız:", err.message);
        Alert.alert("Başarısız", "Kayıt olamadı");
      }
>>>>>>> fc2c67b17511895df1e4657843fe1f1973e380ab
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
    if (!tc || !name || !surname || !birthDate || !email || !password || !confirmPassword || !gender) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return false;
    }
    return true;
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onChangeDateHandler = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
  };

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Şifre"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Kayıt Ol" onPress={handleRegister} />
    </View>
=======
    <ScrollView contentContainerStyle={styles.container}>
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
        <TouchableOpacity onPress={showDatePickerHandler} style={styles.datePicker}>
        <Text style={styles.dateText}>
            {birthDate.toLocaleDateString()} {/* Güncel tarihi göster */}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={onChangeDateHandler}
            maximumDate={new Date()} 
          />
        )}
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Erkek' && styles.selectedButton]}
            onPress={() => setGender('Erkek')}
          >
            <Text style={styles.genderText}>Erkek</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === 'Kadın' && styles.selectedButton]}
            onPress={() => setGender('Kadın')}
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
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>KAYIT OL</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Hesabın var mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
>>>>>>> fc2c67b17511895df1e4657843fe1f1973e380ab
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 15,
  },
});

export default RegisterScreen;
=======
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    paddingBottom: 20,
  },
  header: {
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: '#00796B', // Text before the link
    marginRight: 5,
  },
  loginLink: {
    fontSize: 14,
    color: '#00796B', // Highlight the link
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // 'space-between' yerine 'center' kullanarak butonları ortalarız
    marginBottom: 20,
  },
    genderButton: {
      backgroundColor: '#f0f0f0',
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    genderText: {
      fontSize: 16,
      color: '#333',
    },
    selectedButton: {
      backgroundColor: '#00796B',
      borderColor: '#00796B',
    },  
    datePicker: {
      height: 50,
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      paddingHorizontal: 20,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateText: {
      color: '#000',
      fontSize: 16,
      textAlign: 'center',
    },
});

export default Register;
>>>>>>> fc2c67b17511895df1e4657843fe1f1973e380ab
