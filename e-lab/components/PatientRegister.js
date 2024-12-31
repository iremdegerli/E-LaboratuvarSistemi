import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Tarih seçimi için yeni kütüphane
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
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
          <TextInput
            placeholder="İsim"
            value={isim}
            onChangeText={setIsim}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Soyisim"
            value={soyisim}
            onChangeText={setSoyisim}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="TC"
            value={tc}
            onChangeText={handleTcChange}
            style={styles.input}
            keyboardType="numeric"
            maxLength={11}
            placeholderTextColor="#aaa"
          />
          <Text
            onPress={() => setDogumTarihiVisible(true)}
            style={[styles.input, styles.dateText]}
          >
            {formatDate(dogumTarihi)}
          </Text>

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

          <TextInput
            placeholder="Cinsiyet"
            value={cinsiyet}
            onChangeText={setCinsiyet}
            style={styles.input}
          />
          <Button title="Hasta Kaydet" onPress={hastaKaydet} />
        </View>
      )}

      {isSearchPatient && (
        <View>
          <TextInput
            placeholder="TC Kimlik Numarası"
            value={tc}
            onChangeText={handleTcChange}
            style={styles.input}
            keyboardType="numeric"
            maxLength={11}
          />
          <Button title="Hasta Ara" onPress={hastaAra} />

          {seciliHasta && (
            <View>
              <Text style={styles.header}>Hasta Bilgileri</Text>
              <Text>İsim: {seciliHasta.isim}</Text>
              <Text>Soyisim: {seciliHasta.soyisim}</Text>
              <Text>Doğum Tarihi: {formatDate(new Date(seciliHasta.dogumTarihi))}</Text>
              <Text>Cinsiyet: {seciliHasta.cinsiyet}</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  dateText: {
    textAlign: "center",
    textAlignVertical: "center",
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
});

export default PatientRegister;
