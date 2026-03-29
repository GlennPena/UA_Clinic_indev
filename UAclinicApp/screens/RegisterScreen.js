import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { API } from "../utils/api";
import { AppInput } from "../components/AppInput";
import { InlineAlert } from "../components/InlineAlert";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError(null);

    // Basic Validation
    if (!username || !firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("register/", {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role: "patient",
      });

      // Extract tokens and user data from the Django response
      const { tokens, user } = response.data;

      // Pass the data to the Dashboard
      navigation.replace("PatientDashboard", { 
        token: tokens?.access, 
        user: user 
      });

    } catch (err) {
      // InlineAlert handles if this is a string or a Django error object
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <InlineAlert message={error} />

      <AppInput 
        placeholder="Username" 
        onChangeText={setUsername} 
        setError={setError}
        autoCapitalize="none"
      />
      
      <AppInput 
        placeholder="First Name" 
        onChangeText={setFirstName} 
        setError={setError}
      />

      <AppInput 
        placeholder="Last Name" 
        onChangeText={setLastName} 
        setError={setError}
      />

      <AppInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        setError={setError}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <AppInput 
        placeholder="Password" 
        secureTextEntry 
        onChangeText={setPassword} 
        setError={setError}
      />

      <Pressable 
        onPress={register} 
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F8FAFC" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#2563EB", marginBottom: 32 },
  button: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, marginTop: 10 },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold", fontSize: 18 }
});