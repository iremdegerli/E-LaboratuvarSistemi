import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { database } from "../firebaseConfig"; // Firebase yapılandırmanızı buradan içe aktarın
import { collection, doc, setDoc } from "firebase/firestore";

export default function AddGuide() {
  const [guideName, setGuideName] = useState("");
  const [IgG4Values, setIgG4Values] = useState({ maxValue: "", minValue: "", monthsMax: "", monthsMin: "" });

  const handleAddGuide = async () => {
    if (!guideName || !IgG4Values.maxValue || !IgG4Values.minValue || !IgG4Values.monthsMax || !IgG4Values.monthsMin) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      // Kılavuz koleksiyonuna referans
      const guideRef = doc(collection(database, "kılavuz"), guideName);

      // IgG4 verisini oluştur
      const IgG4Data = {
        IgG4: [
          {
            maxValue: IgG4Values.maxValue,
            minValue: IgG4Values.minValue,
            months: {
              max: IgG4Values.monthsMax,
              min: IgG4Values.monthsMin,
            },
          },
        ],
      };

      // Veriyi Firestore'a ekle
      await setDoc(guideRef, IgG4Data);
      Alert.alert("Başarılı", `${guideName} kılavuzu başarıyla oluşturuldu!`);
      setGuideName("");
      setIgG4Values({ maxValue: "", minValue: "", monthsMax: "", monthsMin: "" });
    } catch (error) {
      console.error("Kılavuz ekleme hatası:", error);
      Alert.alert("Hata", "Kılavuz eklenirken bir sorun oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kılavuz Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Kılavuz Adı"
        value={guideName}
        onChangeText={setGuideName}
      />

      <Text style={styles.subtitle}>IgG4 Değerleri</Text>
      <TextInput
        style={styles.input}
        placeholder="Max Ay"
        value={IgG4Values.monthsMax}
        onChangeText={(value) => setIgG4Values({ ...IgG4Values, monthsMax: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Min Ay"
        value={IgG4Values.monthsMin}
        onChangeText={(value) => setIgG4Values({ ...IgG4Values, monthsMin: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Max Değer"
        value={IgG4Values.maxValue}
        onChangeText={(value) => setIgG4Values({ ...IgG4Values, maxValue: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Min Değer"
        value={IgG4Values.minValue}
        onChangeText={(value) => setIgG4Values({ ...IgG4Values, minValue: value })}
      />
      

      <TouchableOpacity style={styles.button} onPress={handleAddGuide}>
        <Text style={styles.buttonText}>Kılavuz Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
