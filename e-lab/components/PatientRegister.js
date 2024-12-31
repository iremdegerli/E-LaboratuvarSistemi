import React, { useState } from "react"; 
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import DatePicker from 'react-native-date-picker';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig"; // firestore importu düzeltildi

const PatientRegister = () => {
  const [isim, setIsim] = useState(""); // İsim
  const [soyisim, setSoyisim] = useState(""); // Soyisim
  const [tc, setTc] = useState(""); // TC
  const [dogumTarihi, setDogumTarihi] = useState(new Date()); // Doğum Tarihi
  const [dogumTarihiVisible, setDogumTarihiVisible] = useState(false); // Doğum tarihi takvim görünür mü
  const [cinsiyet, setCinsiyet] = useState(""); // Cinsiyet
  const [hastalar, setHastalar] = useState([]); // Hasta listesi
  const [seciliHasta, setSeciliHasta] = useState(null); // Seçilen hasta
  const [yeniTahlil, setYeniTahlil] = useState({ tarih: "", degerler: {} }); // Yeni test bilgisi
  const [isAddPatient, setIsAddPatient] = useState(false); // Hangi kısmın görünmesi gerektiğini kontrol eder
  const [isSearchPatient, setIsSearchPatient] = useState(false); // Hasta arama kısmı

  const db = getFirestore(); // Firestore'u alıyoruz

  // TC numarasının geçerliliğini kontrol etme
  const isValidTc = (tc) => {
    const tcPattern = /^[1-9]{1}[0-9]{10}$/; // 11 haneli TC numarası, 1 ile başlamalı
    return tcPattern.test(tc);
  };

  // TC'nin 11 haneli olmasını sağlamak için, 11. karakteri engelleme
  const handleTcChange = (text) => {
    if (text.length <= 11) {
      setTc(text);
    }
  };

  // Hasta kaydını kontrol etme ve ekleme
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
      const hastaRef = doc(db, "hastalar", tc); // Firestore'da hasta belgesi referansı
      const docSnap = await getDoc(hastaRef); // Belgeyi alıyoruz
      
      if (!docSnap.exists()) {
        // Hasta kaydı yoksa, yeni hasta oluştur
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

  // Hasta arama fonksiyonu
  const hastaAra = async () => {
    if (!isim && !soyisim) {
      Alert.alert("Eksik Alan", "İsim veya soyisim girmeniz gerekiyor.");
      return;
    }

    try {
      const q = query(
        collection(db, "hastalar"),
        where("isim", "==", isim), // İsim ile arama
        where("soyisim", "==", soyisim) // Soyisim ile arama
      );
      const snapshot = await getDocs(q); // Veritabanından belgeleri alıyoruz

      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (results.length === 0) {
        Alert.alert("Hasta Bulunamadı", "Bu bilgilere sahip bir hasta kaydı bulunamadı.");
      }
      
      setHastalar(results);
    } catch (error) {
      console.error("Hasta arama hatası:", error);
    }
  };

  // Tahlil ekleme
  const tahlilEkle = async () => {
    if (!seciliHasta) return;

    try {
      const hastaRef = doc(db, "hastalar", seciliHasta.id);
      await updateDoc(hastaRef, {
        tahliller: [...seciliHasta.tahliller, yeniTahlil]
      });
      Alert.alert("Başarı", "Yeni tahlil eklendi!");
    } catch (error) {
      console.error("Tahlil ekleme hatası:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Hastalar</Text>

      {/* İki Buton */}
      <View style={styles.buttonContainer}>
        <Button title="Hasta Ara" onPress={() => { setIsAddPatient(false); setIsSearchPatient(true); }} />
        <Button title="Hasta Ekle" onPress={() => { setIsAddPatient(true); setIsSearchPatient(false); }} />
      </View>

      {/* Eğer Hasta Ekle kısmı görünüyorsa */}
      {isAddPatient && (
        <View>
          {/* Hasta Kaydı */}
          <TextInput
            placeholder="İsim"
            value={isim}
            onChangeText={setIsim}
            style={styles.input}
          />
          <TextInput
            placeholder="Soyisim"
            value={soyisim}
            onChangeText={setSoyisim}
            style={styles.input}
          />
          <TextInput
            placeholder="TC"
            value={tc}
            onChangeText={handleTcChange} // TC numarasının uzunluğunu sınırlıyoruz
            style={styles.input}
            keyboardType="numeric"
          />
          
          {/* Doğum Tarihi Seçici */}
          <Text onPress={() => setDogumTarihiVisible(true)} style={styles.input}>
            {dogumTarihi ? dogumTarihi.toLocaleDateString() : "Doğum Tarihi"}
          </Text>

          {/* Doğum Tarihi Takvimi */}
          {dogumTarihiVisible && (
            <DatePicker
              date={dogumTarihi}
              onDateChange={setDogumTarihi}
              mode="date"
              maximumDate={new Date()} // Bugünden daha büyük tarih seçilemez
              onCancel={() => setDogumTarihiVisible(false)}
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

      {/* Eğer Hasta Arama kısmı görünüyorsa */}
      {isSearchPatient && (
        <View>
          {/* Hasta Arama */}
          <TextInput
            placeholder="İsim ile Ara"
            value={isim}
            onChangeText={setIsim}
            style={styles.input}
          />
          <TextInput
            placeholder="Soyisim ile Ara"
            value={soyisim}
            onChangeText={setSoyisim}
            style={styles.input}
          />
          <Button title="Hasta Ara" onPress={hastaAra} />
          
          {/* Hasta Listesi */}
          <FlatList
            data={hastalar}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text onPress={() => setSeciliHasta(item)} style={styles.patient}>
                {item.isim} {item.soyisim} - {item.tc}
              </Text>
            )}
          />
        </View>
      )}

      {/* Seçilen Hasta Detayları ve Yeni Tahlil Ekleme */}
      {seciliHasta && (
        <View>
          <Text style={styles.header}>{seciliHasta.isim} {seciliHasta.soyisim}</Text>
          <FlatList
            data={seciliHasta.tahliller}
            keyExtractor={(item) => item.tarih}
            renderItem={({ item }) => (
              <View style={styles.result}>
                <Text>{item.tarih}</Text>
                {Object.entries(item.degerler).map(([key, value]) => (
                  <Text key={key}>{key}: {value}</Text>
                ))}
              </View>
            )}
          />
          <TextInput
            placeholder="Tahlil Tarihi"
            value={yeniTahlil.tarih} 
            onChangeText={(text) => setYeniTahlil({ ...yeniTahlil, tarih: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Tahlil Değeri (örneğin IgA)"
            value={yeniTahlil.degerler.IgA || ""}
            onChangeText={(text) => setYeniTahlil({ 
              ...yeniTahlil, degerler: { ...yeniTahlil.degerler, IgA: text } 
            })}
            style={styles.input}
          />
          <Button title="Yeni Tahlil Ekle" onPress={tahlilEkle} />
        </View>
      )}
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
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  patient: { padding: 10, borderBottomWidth: 1 },
  result: { marginBottom: 10 },
});

export default PatientRegister;
