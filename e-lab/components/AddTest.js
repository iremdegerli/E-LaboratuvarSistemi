import React, { useState } from "react"; 
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; // firestore importu

const AddTest = () => {
  const [tc, setTc] = useState("");
  const [patientName, setPatientName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [testDate, setTestDate] = useState(new Date());
  const [testValues, setTestValues] = useState({
    IgA: "",
    IgA1: "",
    IgA2: "",
    IgM: "",
    IgG: "",
    IgG1: "",
    IgG2: "",
    IgG3: "",
    IgG4: "",
  });
  const [isPatientFound, setIsPatientFound] = useState(false);

  const db = getFirestore();

  const handleFetchPatient = async () => {
    try {
      const patientRef = doc(db, "hastalar", tc); // "hastalar" koleksiyonunda TC ile hastayı arıyoruz
      const patientDoc = await getDoc(patientRef);

      if (patientDoc.exists()) {
        const patientData = patientDoc.data();
        const fullName = `${patientData.isim} ${patientData.soyisim}`; // isim ve soyisim birleştirilir
        setPatientName(fullName);
        setIsPatientFound(true);
      } else {
        Alert.alert("Hata", "Hasta bulunamadı.");
        setIsPatientFound(false);
      }
    } catch (error) {
      Alert.alert("Hata", "Hasta bilgileri alınırken bir hata oluştu.");
      console.error(error);
      setIsPatientFound(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTestDate(selectedDate);
    }
  };

  const handleInputChange = (field, value) => {
    setTestValues({ ...testValues, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const patientRef = doc(db, "hastalar", tc);
      const testData = {
        tetkikTarihi: testDate.toISOString(),
        degerler: testValues,
      };

      // Hasta belgesine yeni tahlil ekle
      await updateDoc(patientRef, {
        tahliller: arrayUnion(testData), // arrayUnion kullanarak tahlil ekliyoruz
      });

      Alert.alert("Başarılı", "Tahlil eklendi.");
      
      // Formu sıfırla
      setTestValues({
        IgA: "",
        IgA1: "",
        IgA2: "",
        IgM: "",
        IgG: "",
        IgG1: "",
        IgG2: "",
        IgG3: "",
        IgG4: "",
      });
    } catch (error) {
      Alert.alert("Hata", "Tahlil eklenirken bir hata oluştu.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Tahlil Ekleme</Text>

        {/* TC Girişi */}
        <TextInput
          style={styles.input}
          placeholder="Hasta TC Kimlik No"
          keyboardType="numeric"
          maxLength={11}
          value={tc}
          onChangeText={setTc}
        />
        <Button title="Hasta Ara" onPress={handleFetchPatient} />

        {/* Hasta Adı */}
        {isPatientFound && <Text style={styles.patientName}>Hasta Adı: {patientName}</Text>}

        {/* Eğer hasta bulunduysa diğer bölümler gösterilir */}
        {isPatientFound && (
          <>
            {/* Tetkik Tarihi */}
            <View style={styles.datePicker}>
              <Text style={styles.label}>Tetkik Tarihi:</Text>
              <Button title="Tarih Seç" onPress={() => setShowDatePicker(true)} />
              <Text>{testDate.toLocaleDateString()}</Text>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={testDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Test Değerleri */}
            <Text style={styles.label}>Tahlil Değerleri:</Text>
            {Object.keys(testValues).map((key) => (
              <View style={styles.testRow} key={key}>
                <Text style={styles.testLabel}>{key}:</Text>
                <TextInput
                  style={styles.testInput}
                  placeholder="Değer giriniz"
                  keyboardType="numeric"
                  value={testValues[key]}
                  onChangeText={(value) => handleInputChange(key, value)}
                />
              </View>
            ))}

            {/* Gönder Butonu */}
            <Button title="Gönder" onPress={handleSubmit} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  datePicker: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  testRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  testLabel: {
    flex: 1,
    fontSize: 16,
  },
  testInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});

export default AddTest;
