import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

const PatientTestResults = () => {
  const [tc, setTc] = useState("");
  const [seciliHasta, setSeciliHasta] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const db = getFirestore();

  // Test referans değerleri (örnek olarak)
  const referenceRanges = {
    IgA: { min: 70, max: 400 },
    IgM: { min: 40, max: 230 },
    IgG: { min: 700, max: 1600 },
    IgG1: { min: 250, max: 800 },
    IgG2: { min: 100, max: 400 },
    IgG3: { min: 150, max: 600 },
    IgG4: { min: 10, max: 100 },
  };

  const handleTcChange = (text) => {
    if (text.length <= 11) {
      setTc(text);
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
        setTestResults(docSnap.data().tahliller);
      } else {
        Alert.alert("Hasta Bulunamadı", "Bu TC kimlik numarasıyla kayıtlı bir hasta bulunamadı.");
      }
    } catch (error) {
      console.error("Hasta arama hatası:", error);
    }
  };

  // Test sonucu ile referans aralığı karşılaştırması
  const getResultSymbol = (value, testName) => {
    const referenceRange = referenceRanges[testName];
    if (!referenceRange) return null;

    if (value < referenceRange.min) {
      return "❌"; // Değer düşük
    } else if (value > referenceRange.max) {
      return "❌"; // Değer yüksek
    } else {
      return "✅"; // Değer normal
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Hasta Test Sonuçları</Text>
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
          <Text style={styles.header}>Tahliller</Text>

          <View style={styles.tahlilList}>
            {testResults.length > 0 ? (
              testResults.map((tahlil, index) => (
                <View key={index} style={styles.tahlilBox}>
                  <Text style={styles.tahlilTitle}>Tahlil Tarihi: {tahlil.tarih}</Text>
                  <View style={styles.tahlilValues}>
                    {Object.entries(tahlil.degerler).map(([key, value], idx) => {
                      const symbol = getResultSymbol(value, key);
                      return (
                        <Text key={idx} style={styles.tahlilValue}>
                          {key}: {value} {symbol}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>Tahlil verisi bulunmamaktadır.</Text>
            )}
          </View>
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
  noData: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});

export default PatientTestResults;
