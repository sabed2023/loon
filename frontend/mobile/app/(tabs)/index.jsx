import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";

export default function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loons, setLoons] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3030/loons", {
        name,
        description,
      });
      Alert.alert("Success", response.data.message);
      setName("");
      setDescription("");
      fetchLoons(); // Refresh the list after adding a new loon
    } catch (error) {
      console.error("Error submitting loon:", error);
      Alert.alert(
        "Error",
        error.response?.data.message || "Error adding Loon. Please try again."
      );
    }
  };

  const fetchLoons = async () => {
    try {
      const response = await axios.get("http://localhost:3030/loons");
      setLoons(response.data);
    } catch (error) {
      console.error("Error fetching loons:", error);
      Alert.alert("Error", "Error fetching Loons. Please try again.");
    }
  };

  useEffect(() => {
    fetchLoons();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Loon Management</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#007bff" />
          <Button
            title="Reset"
            onPress={() => {
              setName("");
              setDescription("");
            }}
            color="#6c757d"
          />
          <Button title="GET all Loons" onPress={fetchLoons} color="#28a745" />
        </View>
      </View>

      <View style={styles.loonsContainer}>
        <Text style={styles.subHeader}>Fetched Loons:</Text>
        {loons.length > 0 ? (
          loons.map((loon) => (
            <View key={loon.id} style={styles.loonItem}>
              <Text style={styles.loonTitle}>Name: {loon.name}</Text>
              <Text>Description: {loon.description}</Text>
            </View>
          ))
        ) : (
          <Text>No loons found.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
    color: "#495057",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  loonsContainer: {
    marginTop: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  loonItem: {
    backgroundColor: "#e9ecef",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  loonTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
