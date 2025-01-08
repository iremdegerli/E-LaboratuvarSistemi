import React, { useState, useEffect } from 'react'; 
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, getDoc, doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export default function EditProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState({
    tc: "",
    name: "",
    surname: "",
    gender: "Erkek",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  // Firebase'den mevcut kullanıcı bilgilerini çekmek için
  const fetchUserProfile = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const db = getFirestore();
        const userRef = query(collection(db, "users"), where("uid", "==", currentUser.uid));
  
        // getDocs ile veriyi çekiyoruz
        const querySnapshot = await getDocs(userRef);
  
        if (querySnapshot.empty) {
          Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
        } else {
          const userData = querySnapshot.docs[0].data(); // İlk dokümanı al
          setUserProfile({
            tc: userData.tc,
            name: userData.name,
            surname: userData.surname,
            gender: userData.gender,
            email: userData.email,
            password: "",  // Şifreyi gösterme, sadece güncelleme yapılabilir
            confirmPassword: "",
          });
        }
      } else {
        Alert.alert("Hata", "Kullanıcı oturumu bulunamadı.");
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınırken hata:", err);
      Alert.alert("Hata", "Kullanıcı bilgileri alınırken bir sorun oluştu.");
    } finally {
      setLoading(false); // Her durumda loading state false yapılmalı
    }
  };
  

  // useEffect ile component mount olduğunda kullanıcı bilgilerini çekiyoruz
  useEffect(() => {
    fetchUserProfile();
  }, []); // Boş array ile sadece component ilk render olduğunda çalışır

  const handleSave = async () => {
    if (userProfile.password !== userProfile.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
  
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const db = getFirestore();
        const userRef = doc(db, "users", currentUser.uid);
  
        // Belgeyi almak için getDoc kullanıyoruz
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          // Kullanıcı mevcutsa sadece değişen alanları güncelliyoruz
          await updateDoc(userRef, {
            tc: userProfile.tc,
            name: userProfile.name,
            surname: userProfile.surname,
            gender: userProfile.gender,
            email: userProfile.email,
            password: userProfile.password,
            // Sabit kalanlar (doğum tarihi, rol) güncellenmeyecek
          });
  
          alert("Profil Güncellendi");
          navigation.goBack(); // Profili güncelledikten sonra bir önceki ekrana dön
        } else {
          Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
        }
      } else {
        Alert.alert("Hata", "Kullanıcı oturumu bulunamadı.");
      }
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
      alert("Bir hata oluştu.");
    }
  };
  

  if (loading) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profili Güncelle</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="TC Kimlik No"
          value={userProfile.tc}
          onChangeText={(text) => setUserProfile({ ...userProfile, tc: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ad"
          value={userProfile.name}
          onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          value={userProfile.surname}
          onChangeText={(text) => setUserProfile({ ...userProfile, surname: text })}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.label}>Cinsiyet:</Text>
          <TouchableOpacity
            style={[styles.radioButton, userProfile.gender === 'Erkek' && styles.selectedRadio]}
            onPress={() => setUserProfile({ ...userProfile, gender: 'Erkek' })}
          >
            <Text style={[styles.radioText, userProfile.gender === 'Erkek' && styles.selectedText]}>Erkek</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, userProfile.gender === 'Kadın' && styles.selectedRadio]}
            onPress={() => setUserProfile({ ...userProfile, gender: 'Kadın' })}
          >
            <Text style={[styles.radioText, userProfile.gender === 'Kadın' && styles.selectedText]}>Kadın</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          value={userProfile.email}
          onChangeText={(text) => setUserProfile({ ...userProfile, email: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry={true}
          value={userProfile.password}
          onChangeText={(text) => setUserProfile({ ...userProfile, password: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifreyi Doğrula"
          secureTextEntry={true}
          value={userProfile.confirmPassword}
          onChangeText={(text) => setUserProfile({ ...userProfile, confirmPassword: text })}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>KAYDET</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flex: 1,
    backgroundColor: '#00796B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 5,
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
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  selectedRadio: {
    backgroundColor: '#00796B',
    borderColor: '#00796B',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
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
});
