import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { FontAwesome } from "@expo/vector-icons"; // FontAwesome simgelerini kullanıyoruz

const PatientRegister = () => {
  const [isim, setIsim] = useState("");
  const [soyisim, setSoyisim] = useState("");
  const [tc, setTc] = useState("");
  const [dogumTarihi, setDogumTarihi] = useState(new Date());
  const [dogumTarihiVisible, setDogumTarihiVisible] = useState(false);
  const [cinsiyet, setCinsiyet] = useState("");
  const [seciliHasta, setSeciliHasta] = useState(null);
  const [isAddPatient, setIsAddPatient] = useState(false);
  const [isSearchPatient, setIsSearchPatient] = useState(false);

  const db = getFirestore();

  const isValidTc = (tc) => {
    const tcPattern = /^[1-9]{1}[0-9]{10}$/;
    return tcPattern.test(tc);
  };

  const handleTcChange = (text) => {
    if (text.length <= 11) {
      setTc(text);
    }
  };

  const hastaKaydet = async () => {
    if (!isim || !soyisim || !tc || !dogumTarihi || !cinsiyet) {
      Alert.alert("Eksik Alan", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (!isValidTc(tc)) {
      Alert.alert("Geçersiz TC", "Lütfen geçerli bir 11 haneli TC kimlik numarası giriniz.");
      return;
    }

    try {
      const hastaRef = doc(db, "hastalar", tc);
      const docSnap = await getDoc(hastaRef);

      if (!docSnap.exists()) {
        await setDoc(hastaRef, {
          tc,
          isim,
          soyisim,
          dogumTarihi,
          cinsiyet,
          tahliller: [],
        });
        Alert.alert("Başarı", "Hasta kaydedildi!");
      } else {
        Alert.alert("Zaten Kayıtlı", "Bu TC kimlik numarasıyla kayıtlı bir hasta zaten var.");
      }
    } catch (error) {
      console.error("Hasta kaydı sırasında hata:", error);
    }
  };

  const hastaAra = async () => {
    if (!tc) {
      Alert.alert("Eksik Alan", "Lütfen bir TC kimlik numarası giriniz.");
      return;
    }

    try {
      const hastaRef = doc(db, "hastalar", tc);
      const docSnap = await getDoc(hastaRef);

      if (docSnap.exists()) {
        setSeciliHasta(docSnap.data());
      } else {
        Alert.alert("Hasta Bulunamadı", "Bu TC kimlik numarasıyla kayıtlı bir hasta bulunamadı.");
      }
    } catch (error) {
      console.error("Hasta arama hatası:", error);
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

  const compareValues = (tahliller) => {
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Hastalar</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { setIsAddPatient(false); setIsSearchPatient(true); }} >
            <Text style={styles.buttonText}>Hasta Ara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { setIsAddPatient(true); setIsSearchPatient(false); }} >
            <Text style={styles.buttonText}>Hasta Ekle</Text>
          </TouchableOpacity>
        </View>

        {isAddPatient && (
          <View>
            <TextInput placeholder="İsim" value={isim} onChangeText={setIsim} style={styles.input} placeholderTextColor="#aaa" />
            <TextInput placeholder="Soyisim" value={soyisim} onChangeText={setSoyisim} style={styles.input} placeholderTextColor="#aaa" />
            <TextInput placeholder="TC" value={tc} onChangeText={handleTcChange} style={styles.input} keyboardType="numeric" maxLength={11} placeholderTextColor="#aaa" />
            
            <TouchableOpacity onPress={() => setDogumTarihiVisible(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerButtonText}>{dogumTarihi ? dogumTarihi.toLocaleDateString("tr-TR")
                : "Doğum Tarihi Seç"}</Text>
            </TouchableOpacity>
            
            {dogumTarihiVisible && (
              <DateTimePicker 
                value={dogumTarihi} 
                mode="date" 
                display="default" 
                onChange={(event, selectedDate) => {
                  setDogumTarihiVisible(false); // Takvim kapat
                  if (selectedDate) setDogumTarihi(selectedDate); // Tarihi güncelle
                }}
                maximumDate={new Date()} // Bugünden sonraki tarihleri engelle
              />
              )}

            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, cinsiyet === "Erkek" && styles.selectedButton]}
                onPress={() => setCinsiyet("Erkek")}
              >
                <Text style={styles.genderText}>Erkek</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, cinsiyet === "Kadın" && styles.selectedButton]}
                onPress={() => setCinsiyet("Kadın")}
              >
                <Text style={styles.genderText}>Kadın</Text>
              </TouchableOpacity>
            </View>  

            <TouchableOpacity style={styles.button} onPress={hastaKaydet}>
              <Text style={styles.buttonText}>Hasta Kaydet</Text>
            </TouchableOpacity>
          </View>
        )}

        {isSearchPatient && (
          <View contentContainerStyle={styles.container}>
            <Text style={styles.title}>Hasta Tahlil Görüntüleme</Text>
            <TextInput placeholder="TC Kimlik Numarası" value={tc} onChangeText={handleTcChange} style={styles.input} keyboardType="numeric" maxLength={11} />
            <TouchableOpacity style={styles.button} onPress={hastaAra}>
              <Text style={styles.buttonText}>Hasta Ara</Text>
            </TouchableOpacity>
            {seciliHasta && (
              <View>
                <Text style={styles.header}>Tahliller</Text>
                <View style={styles.tahlilList}>
                  {seciliHasta.tahliller.length > 0 ? compareValues(seciliHasta.tahliller) : (
                    <Text style={styles.noData}>Tahlil verisi bulunmamaktadır.</Text>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495E", // Koyu mavi tonunda bir başlık rengi
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderColor: "#BDC3C7", // Hafif gri bir kenarlık
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10, // Butonlar arasında boşluk
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Butonları yan yana yerleştir
    marginBottom: 20,
    marginTop: 20, // Üst kısımda boşluk bırak
    paddingHorizontal: 0, // Sayfa kenarlarında boşluk
  },
  
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#BDC3C7", // Hafif gri bir kenarlık
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: "#00796B",
  },
  genderText: {
    color: "#555",
  },
  datePickerButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
    borderColor: "#BDC3C7",
    borderWidth: 1,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#555",
  },
  //***
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tahlilList: {
    marginTop: 20,
  },
  tahlilBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tahlilTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tahlilValues: {
    marginTop: 10,
  },
  tahlilValue: {
    fontSize: 14,
    marginVertical: 5,
  },
  comparisonText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  noData: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

export default PatientRegister;
