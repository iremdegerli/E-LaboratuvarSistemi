import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { database } from "../firebaseConfig"; // Firebase yapılandırmanız
import { collection, getDocs } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";

export default function GuideSearchScreen() {
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("IgA");
  const [userValueText, setUserValueText] = useState(""); // Kullanıcı girdisi (metin)
  const [results, setResults] = useState([]);
  const [ageInMonths, setAgeInMonths] = useState(null);

  const calculateAgeInMonths = (birthDate) => {
    const now = new Date();
    const diff = now.getTime() - birthDate.getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); // Ortalama ay hesaplama
    return months;
  };

  const handleSearch = async () => {
    try {
      if (!birthDate || !selectedDocument || userValueText.trim() === "") {
        Alert.alert("Hata", "Lütfen doğum tarihi, belge ve değer girin.");
        return;
      }

      const userValue = parseFloat(userValueText.replace(",", "."));
      if (isNaN(userValue)) {
        Alert.alert("Hata", "Geçerli bir değer girin.");
        return;
      }

      const months = calculateAgeInMonths(birthDate);
      setAgeInMonths(months);

      const guideCollection = collection(database, "kılavuz");
      const querySnapshot = await getDocs(guideCollection);

      const fetchedResults = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data[selectedDocument]) {
          const relevantValues = data[selectedDocument].filter(
            (entry) =>
              months >= entry.months.min && months <= entry.months.max
          );
          if (relevantValues.length > 0) {
            fetchedResults.push({ guideName: doc.id, values: relevantValues });
          }
        }
      });

      setResults(fetchedResults);
    } catch (error) {
      console.error("Arama hatası:", error);
      Alert.alert("Hata", "Arama sırasında bir sorun oluştu.");
    }
  };

  const renderComparisonIcon = (userValue, minValue, maxValue) => {
    if (userValue < minValue) {
      return <FontAwesome name="arrow-down" size={20} color="green" />;
    } else if (userValue > maxValue) {
      return <FontAwesome name="arrow-up" size={20} color="red" />;
    } else {
      return <FontAwesome name="arrows-h" size={20} color="blue" />;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Kılavuz Arama</Text>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerButtonText}>
            {birthDate
              ? birthDate.toLocaleDateString("tr-TR")
              : "Doğum Tarihi Seç"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            maximumDate={new Date()} // Bugünden sonraki tarihler engellendi
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
            }}
          />
        )}

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
          placeholder="Değer Girin"
          keyboardType="decimal-pad"
          value={userValueText}
          onChangeText={(text) => setUserValueText(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Sorgula</Text>
        </TouchableOpacity>

        {results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>{item.guideName}</Text>
                {item.values.map((value, index) => (
                  <View key={index} style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      Ay: {value.months.min}-{value.months.max} ay, Değer:{" "}
                      {value.minValue} - {value.maxValue}
                    </Text>
                    {renderComparisonIcon(
                      parseFloat(userValueText.replace(",", ".")),
                      value.minValue,
                      value.maxValue
                    )}
                  </View>
                ))}
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

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
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
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
  resultCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    color: "#555",
  },
});
