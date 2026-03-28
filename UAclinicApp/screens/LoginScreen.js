import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { API } from "../utils/api";
import { jwtDecode } from "jwt-decode";
import { setAuthToken } from "../utils/api";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");

  // Function to handle login
  const login = async () => {
    const res = await API.post("login/", {
      username,
      password,
    });

    const token = res.data.access; // Assuming the token is in the 'access' field of the response
    setAuthToken(token); // Set the auth token for future requests

    const decoded = jwtDecode(token); // Decode the JWT to get the user's role
    const role = decoded.role; // Assuming the role is stored in the 'role' field of the decoded token

    // Navigate to the appropriate dashboard based on the user's role
    if (role === "admin") {
      navigation.navigate("AdminDashboard", { token });
    } else if (role === "doctor") {
      navigation.navigate("DoctorDashboard", { token });
    } else {
      navigation.navigate("PatientDashboard", { token });
    }
  };

  return (
    <View>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={login} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}