import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { API } from "../utils/api";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Create a new user account
  const register = async () => {
    try {
      if (!username || !firstName || !lastName || !email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      await API.post("register/", {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role: "patient",
      });

      Alert.alert("Success", "Account created!");
      navigation.navigate("Login");
    } catch (err) {
      console.log(err.response?.data);
      Alert.alert("Error", "Registration failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* USERNAME */}
      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* FIRST NAME */}
      <TextInput
        placeholder="First Name"
        onChangeText={setFirstName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* LAST NAME */}
      <TextInput
        placeholder="Last Name"
        onChangeText={setLastName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* PASSWORD */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button title="Register" onPress={register} />
    </View>
  );
}