import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons"; // FontAwesome simgelerini kullanıyoruz

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const db = getFirestore();
        const userDoc = await getDocs(
          query(collection(db, "users"), where("uid", "==", currentUser.uid))
        );

        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setUserInfo(userData);
        } else {
          Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
        }
      } else {
        Alert.alert("Hata", "Kullanıcı oturumu bulunamadı.");
      }
    } catch (err) {
      console.error("Kullanıcı bilgileri alınırken hata:", err);
    }
  };

  const fetchPatients = async (tc) => {
    try {
      const db = getFirestore();
      const patientsCollection = collection(db, "hastalar");
      const q = query(patientsCollection, where("tc", "==", tc));
      const patientsSnapshot = await getDocs(q);

      const patientsList = [];
      patientsSnapshot.forEach((doc) => {
        const patientData = doc.data();
        patientsList.push({
          id: doc.id,
          name: patientData.isim || "Bilinmiyor",
          surname: patientData.soyisim || "Bilinmiyor",
          tc: patientData.tc || "Bilinmiyor",
          tahliller: patientData.tahliller || [],
        });
      });

      setPatients(patientsList);
    } catch (err) {
      console.error("Hastalar alınırken hata:", err.message);
      Alert.alert("Hata", "Hastalar bilgisi alınırken bir sorun oluştu.");
    }
  };

  const formatDate = (string) => {
    try {
      if (!string) return "Tarih Bilinmiyor"; // Boş kontrol
      const date = new Date(string);
      if (isNaN(date)) return "Geçersiz Tarih"; // Geçersiz tarih kontrolü
      const day = String(date.getDate()).padStart(2, '0'); // Gün
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ay
      const year = date.getFullYear(); // Yıl
      return `${day}.${month}.${year}`; // İstenilen formatta döndürme
    } catch (error) {
      console.error("Tarih formatlama hatası:", error);
      return "Tarih Bilinmiyor";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserData();
        if (userInfo?.tc) {
          await fetchPatients(userInfo.tc);
        }
      } catch (err) {
        console.error("Hata:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo?.tc]);

  // Tahlilleri listelemek için fonksiyon
  const renderTahliller = (tahliller) => {
    // Her değer için en son dolu değeri takip etmek için bir nesne kullanılır
    const lastKnownValues = {};
  
    return tahliller.map((tahlil, index) => {
      const degerler = Object.entries(tahlil.degerler);
      let comparisonResults = [];
  
      degerler.forEach(([key, value]) => {
        const previousValue = lastKnownValues[key]; // Bu değerin en son dolu olan değeri
  
        if (value === undefined || value === null || value === "") {
          comparisonResults.push(
            <Text key={`${index}-${key}`} style={styles.comparisonText}>
              {key}: -
            </Text>
          );
        } else {
          if (previousValue === undefined) {
            comparisonResults.push(
              <Text key={`${index}-${key}`} style={styles.comparisonText}>
                {key}: {value}
              </Text>
            );
          } else {
            // Karşılaştırma yap
            if (value < previousValue) {
              comparisonResults.push(
                <Text key={`${index}-${key}`} style={styles.comparisonText}>
                  {key}: {value} <FontAwesome name="arrow-down" size={20} color="green" />
                </Text>
              );
            } else if (value > previousValue) {
              comparisonResults.push(
                <Text key={`${index}-${key}`} style={styles.comparisonText}>
                  {key}: {value} <FontAwesome name="arrow-up" size={20} color="red" />
                </Text>
              );
            } else {
              comparisonResults.push(
                <Text key={`${index}-${key}`} style={styles.comparisonText}>
                  {key}: {value} <FontAwesome name="arrows-h" size={20} color="blue" />
                </Text>
              );
            }
          }
          // Mevcut değeri en son dolu değer olarak kaydet
          lastKnownValues[key] = value;
        }
      });
  
      return (
        <View key={index} style={styles.tahlilBox}>
          <Text style={styles.tahlilTitle}>Tahlil Tarihi: {formatDate(tahlil.tetkikTarihi)}</Text>
          <View style={styles.tahlilValues}>
            {comparisonResults}
          </View>
        </View>
      );
    });
  };
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00796B" />
      ) : (
        <>
          {userInfo && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.infoText}>Ad: {userInfo.name}</Text>
              <Text style={styles.infoText}>Soyad: {userInfo.surname}</Text>
              <Text style={styles.infoText}>TC: {userInfo.tc}</Text>
            </View>
          )}

          <FlatList
            data={patients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.patientItem}>
                <Text style={styles.infoText}>Tahliller:</Text>
                {renderTahliller(item.tahliller)}
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Eşleşen hasta bilgisi bulunamadı.</Text>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  userInfoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  patientItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  tahlilBox: {
    marginTop: 10,
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tahlilTitle: {
    fontWeight: 'bold',
    color: '#00796B',
  },
  comparisonText: {
    fontSize: 14,
    marginVertical: 3,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
  },
});
