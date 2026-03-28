import { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { API } from "../utils/api";
import AppointmentCard from "../components/AppointmentCard";

export default function PatientDashboard({ route, navigation }) {
  const { token } = route.params; // Get token from route params
  const [appointments, setAppointments] = useState([]); // State to hold appointments

  // Function to fetch appointments from the API
  const fetchAppointments = async () => {
    const res = await API.get("appointments/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(res.data);
  };

  // Fetch appointments when the component mounts
  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <ScrollView>
      <Button title="Create Appointment" onPress={() => navigation.navigate("CreateAppointment", { token })} />

      {appointments.map((app) => (
        <AppointmentCard key={app.id} appointment={app} />
      ))}
    </ScrollView>
  );
}