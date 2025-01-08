import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import EditProfileScreen from './EditProfileScreen';

export default function ViewProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı bilgilerini Firebase'den almak için
  const fetchUserProfile = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        console.log("Giriş yapmış kullanıcı:", currentUser.uid);  // Kullanıcı UID'sini kontrol et
        const db = getFirestore();
        const userDoc = await getDocs(
            query(collection(db, "users"), where("uid", "==", currentUser.uid))
        );

        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setUserProfile(userData);
        } else {
          Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
        }
      } else {
        Alert.alert("Hata", "Kullanıcı oturumu bulunamadı.");
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınırken hata:", err);
      Alert.alert("Hata", "Kullanıcı bilgileri alınırken bir sorun oluştu.");
    } finally {
      setLoading(false); // loading state her durumda false yapılmalı
    }
  };

  // useEffect ile component mount olduğunda kullanıcı bilgilerini çekiyoruz
  useEffect(() => {
    fetchUserProfile();
  }, []); // Boş array ile sadece component ilk render olduğunda çalışır

  if (loading) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Üst Bölüm */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil Bilgileriniz</Text>
      </View>

      {/* Profil Bilgileri */}
      {userProfile ? (
        <View style={styles.profileInfo}>
          <Text style={styles.infoText}>TC Kimlik No: {userProfile.tc}</Text>
          <Text style={styles.infoText}>Ad: {userProfile.name}</Text>
          <Text style={styles.infoText}>Soyad: {userProfile.surname}</Text>
          <Text style={styles.infoText}>Cinsiyet: {userProfile.gender}</Text>
          <Text style={styles.infoText}>Doğum Tarihi: {userProfile.birthDate}</Text>
          <Text style={styles.infoText}>E-Mail: {userProfile.email}</Text>
          {/* Şifre burada görünmez olarak gösterilmeli. */}
        </View>
      ) : (
        <Text style={styles.infoText}>Kullanıcı bilgileri bulunamadı.</Text>
      )}

      {/* Profil Düzenleme Butonu */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfileScreen')}
      >
        <Text style={styles.buttonText}>PROFİLİ DÜZENLE</Text>
      </TouchableOpacity>
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
  profileInfo: {
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
  infoText: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
  editButton: {
    backgroundColor: '#00796B',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
