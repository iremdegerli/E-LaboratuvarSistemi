import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import DatePicker from 'react-native-date-picker';
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

  const compareValues = (tahliller) => {
    // Tahlil değerlerini karşılaştıracak fonksiyon
    return tahliller.map((tahlil, index) => {
      const degerler = Object.entries(tahlil.degerler);
      let comparisonResults = [];

      // Değerleri karşılaştırıyoruz
      for (let i = 0; i < degerler.length - 1; i++) {
        for (let j = i + 1; j < degerler.length; j++) {
          const [key1, value1] = degerler[i];
          const [key2, value2] = degerler[j];
          if (value1 < value2) {
            comparisonResults.push(
              <Text key={`${index}-${key1}-${key2}`} style={styles.comparisonText}>
                {key1} < FontAwesome name="arrow-down" size={20} color="green" /> {key2}
              </Text>
            );
          } else if (value1 > value2) {
            comparisonResults.push(
              <Text key={`${index}-${key1}-${key2}`} style={styles.comparisonText}>
                {key1} < FontAwesome name="arrow-up" size={20} color="red" /> {key2}
              </Text>
            );
          } else {
            comparisonResults.push(
              <Text key={`${index}-${key1}-${key2}`} style={styles.comparisonText}>
                {key1} ve {key2} eşit.
              </Text>
            );
          }
        }
      }

      return (
        <View key={index} style={styles.tahlilBox}>
          <Text style={styles.tahlilTitle}>Tahlil Tarihi: {tahlil.tarih}</Text>
          <View style={styles.tahlilValues}>
            {Object.entries(tahlil.degerler).map(([key, value], idx) => (
              <Text key={idx} style={styles.tahlilValue}>
                {key}: {value}
              </Text>
            ))}
          </View>
          {comparisonResults}
        </View>
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Hastalar</Text>

      <View style={styles.button}>
        <Button title="Hasta Ara" onPress={() => { setIsAddPatient(false); setIsSearchPatient(true); }} />
        <Button title="Hasta Ekle" onPress={() => { setIsAddPatient(true); setIsSearchPatient(false); }} />
      </View>

      {isAddPatient && (
        <View>
          <TextInput placeholder="İsim" value={isim} onChangeText={setIsim} style={styles.input} placeholderTextColor="#aaa" />
          <TextInput placeholder="Soyisim" value={soyisim} onChangeText={setSoyisim} style={styles.input} placeholderTextColor="#aaa" />
          <TextInput placeholder="TC" value={tc} onChangeText={handleTcChange} style={styles.input} keyboardType="numeric" maxLength={11} placeholderTextColor="#aaa" />
          <Text onPress={() => setDogumTarihiVisible(true)} style={styles.input}>
            {dogumTarihi ? dogumTarihi.toLocaleDateString() : "Doğum Tarihi"}
          </Text>

          {dogumTarihiVisible && (
            <DatePicker date={dogumTarihi} onDateChange={setDogumTarihi} mode="date" maximumDate={new Date()} onCancel={() => setDogumTarihiVisible(false)} />
          )}

          <TextInput placeholder="Cinsiyet" value={cinsiyet} onChangeText={setCinsiyet} style={styles.input} />
          <Button title="Hasta Kaydet" onPress={hastaKaydet} />
        </View>
      )}

      {isSearchPatient && (
        <View contentContainerStyle={styles.container}>
          <Text style={styles.title}>Hasta Tahlil Görüntüleme</Text>
          <TextInput placeholder="TC Kimlik Numarası" value={tc} onChangeText={handleTcChange} style={styles.input} keyboardType="numeric" maxLength={11} />
          <Button title="Hasta Ara" onPress={hastaAra} />

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
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
