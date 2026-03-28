import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { API } from "../utils/api";
import AppointmentCard from "../components/AppointmentCard";

export default function AdminDashboard({ route }) {
  const { token } = route.params; // Get the token from route params
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

  // Render the appointments in a scrollable view
  return (
    <ScrollView>
      {appointments.map((app) => (
        <AppointmentCard
          key={app.id}
          appointment={app}
          isAdmin
          token={token}
          refresh={fetchAppointments}
        />
      ))}
    </ScrollView>
  );
}