import React, { useState } from "react"; 
import { View, Text, TextInput, TouchableOpacity, Button,Alert, ScrollView, StyleSheet, SafeAreaView } from "react-native";
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Tahlil Ekleme</Text>

          {/* TC Girişi */}
          <TextInput
            style={styles.input}
            placeholder="Hasta TC Kimlik No"
            keyboardType="numeric"
            maxLength={11}
            value={tc}
            onChangeText={setTc}
          />
          <TouchableOpacity style={styles.button} onPress={handleFetchPatient}>
            <Text style={styles.buttonText}>Tahlil Ekle</Text>
          </TouchableOpacity>

          {/* Hasta Adı */}
          {isPatientFound && <Text style={styles.subtitle}>Hasta Adı: {patientName}</Text>}

          {/* Eğer hasta bulunduysa diğer bölümler gösterilir */}
          {isPatientFound && (
            <>
              {/* Tetkik Tarihi */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerButtonText}>
                    {testDate
                      ? testDate.toLocaleDateString("tr-TR")
                      : "Tetkik Tarihi Seç"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={testDate}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}

              {/* Test Değerleri */}
              <Text style={styles.subtitle}>Tahlil Değerleri:</Text>
              {Object.keys(testValues).map((key) => (
                <View style={styles.subtitle} key={key}>
                  <Text style={styles.subtitle}>{key}:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Değer giriniz"
                    keyboardType="numeric"
                    value={testValues[key]}
                    onChangeText={(value) => handleInputChange(key, value)}
                  />
                </View>
              ))}
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Gönder</Text>
          </TouchableOpacity>
            </>
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
  datePickerButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#555",
  },
});

export default AddTest;
