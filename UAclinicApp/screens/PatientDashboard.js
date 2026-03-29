import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { API } from "../utils/api";
import AppointmentCard from "../components/AppointmentCard";

export default function PatientDashboard({ route, navigation }) {
  // SAFE DESTRUCTURING: Prevents crash if route.params is undefined
  const { token, user } = route.params || {}; 
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    // If no token, don't even try the API
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // FALLBACK: If user somehow got here without a token
  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Authentication required.</Text>
        <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      </View>
    );
  }

  // LOADING STATE: Show a spinner while fetching data
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.first_name || 'Patient'}!</Text>
        <Text style={styles.subtitle}>Your upcoming appointments</Text>
      </View>

      <Button 
        title="Book New Appointment" 
        onPress={() => navigation.navigate("CreateAppointment", { token })} 
      />

      <View style={styles.listContainer}>
        {appointments.length > 0 ? (
          appointments.map((app) => (
            <AppointmentCard
              key={app.id}
              appointment={app}
              token={token}
              refresh={fetchAppointments}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No appointments scheduled.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 20 },
  welcome: { fontSize: 24, fontWeight: "bold", color: "#1E293B" },
  subtitle: { fontSize: 16, color: "#64748B" },
  listContainer: { marginTop: 20 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#94A3B8", fontSize: 16 },
  errorText: { color: "#B91C1C", marginBottom: 10 }
});