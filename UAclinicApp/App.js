import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, View } from "react-native";
import { Toaster } from "burnt/web";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import PatientDashboard from "./screens/PatientDashboard";
import AdminDashboard from "./screens/AdminDashboard";
import DoctorDashboard from "./screens/DoctorDashboard";
import CreateAppointment from "./screens/CreateAppointment";
import EditAppointment from "./screens/EditAppointment";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
          <Stack.Screen name="CreateAppointment" component={CreateAppointment} />
          <Stack.Screen name="EditAppointment" component={EditAppointment} />
        </Stack.Navigator>
      </NavigationContainer>

      {Platform.OS === "web" && <Toaster />}
    </View> 
  );
}