import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Picker'ı buradan içe aktarın
import { database } from "../firebaseConfig"; // Firebase yapılandırmanızı buradan içe aktarın
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function AddGuideScreen() {
  const [guideName, setGuideName] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("IgA");
  const [values, setValues] = useState({ maxValue: "", minValue: "", monthsMax: "", monthsMin: "" });

  const handleAddDocument = async () => {
    if (!guideName || !selectedDocument || !values.maxValue || !values.minValue || !values.monthsMax || !values.monthsMin) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      // Kılavuz referansı
      const guideRef = doc(database, "kılavuz", guideName);
      const guideDoc = await getDoc(guideRef);

      const newEntry = {
        maxValue: values.maxValue,
        minValue: values.minValue,
        months: {
          max: values.monthsMax,
          min: values.monthsMin,
        },
      };

      if (guideDoc.exists()) {
        // Kılavuz varsa, var olan belgeyi güncelle
        const existingData = guideDoc.data();

        if (existingData[selectedDocument]) {
          // Belge mevcutsa, yeni değeri mevcut değerlere ekle
          const updatedArray = [...existingData[selectedDocument], newEntry];
          await updateDoc(guideRef, { [selectedDocument]: updatedArray });
        } else {
          // Belge yoksa, yeni bir belge oluştur
          await updateDoc(guideRef, { [selectedDocument]: [newEntry] });
        }

        Alert.alert("Başarılı", `${selectedDocument} başarıyla güncellendi!`);
      } else {
        // Kılavuz yoksa yeni kılavuz oluştur ve belgeyi ekle
        await setDoc(guideRef, { [selectedDocument]: [newEntry] });
        Alert.alert("Başarılı", `${guideName} kılavuzu başarıyla oluşturuldu ve ${selectedDocument} eklendi!`);
      }

      setGuideName("");
      setSelectedDocument("IgA");
      setValues({ maxValue: "", minValue: "", monthsMax: "", monthsMin: "" });
    } catch (error) {
      console.error("Belge ekleme hatası:", error);
      Alert.alert("Hata", "Belge eklenirken bir sorun oluştu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kılavuz Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Kılavuz Adı"
        value={guideName}
        onChangeText={setGuideName}
      />

      <Text style={styles.subtitle}>Belge Seç</Text>
      <Picker
        selectedValue={selectedDocument}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDocument(itemValue)}
      >
        <Picker.Item label="IgA" value="IgA" />
        <Picker.Item label="IgA1" value="IgA1" />
        <Picker.Item label="IgA2" value="IgA2" />
        <Picker.Item label="IgM" value="IgM" />
        <Picker.Item label="IgG" value="IgG" />
        <Picker.Item label="IgG1" value="IgG1" />
        <Picker.Item label="IgG2" value="IgG2" />
        <Picker.Item label="IgG3" value="IgG3" />
        <Picker.Item label="IgG4" value="IgG4" />
      </Picker>
      <TextInput
      style={styles.input}
      placeholder="Min Ay"
      value={values.monthsMin}
      onChangeText={(value) => setValues({ ...values, monthsMin: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Ay"
        value={values.monthsMax}
        onChangeText={(value) => setValues({ ...values, monthsMax: value })}
      />
      <Text style={styles.subtitle}>Değerler</Text>
      <TextInput
        style={styles.input}
        placeholder="Min Değer"
        value={values.minValue}
        onChangeText={(value) => setValues({ ...values, minValue: value })}
      />   
      <TextInput
        style={styles.input}
        placeholder="Max Değer"
        value={values.maxValue}
        onChangeText={(value) => setValues({ ...values, maxValue: value })}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleAddDocument}>
        <Text style={styles.buttonText}>Belge Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Pastel bir arka plan rengi
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495E", // Koyu mavi tonunda bir başlık rengi
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 10,
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
  picker: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderColor: "#BDC3C7",
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
});
