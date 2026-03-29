import { View, Text, Button } from "react-native";
import { API } from "../utils/api";

// Displays an appointment card with options to approve or reject if the user is an admin or doctor.
export default function AppointmentCard({ appointment, isAdmin, isDoctor, token, refresh }) {

  const approve = async () => {
    await API.patch(
      `appointments/${appointment.id}/`,
      { status: "Approved" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    refresh();
  };

  const reject = async () => {
    await API.patch(
      `appointments/${appointment.id}/`,
      { status: "Rejected" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    refresh();
  };

  const remove = async () => {
    try {
      await API.delete(
        `appointments/${appointment.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refresh();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data);
    }
  };

  const cancel = async () => {
    await API.patch(
      `appointments/${appointment.id}/`,
      { status: "Cancelled" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    refresh();
  };

  const edit = () => {
    navigation.navigate("EditAppointment", { appointment, token });
  };

  return (
    <View style={{ borderWidth: 1, margin: 10, padding: 10 }}>
      <Text>Patient: {appointment.patient_name}</Text>
      <Text>Doctor: {appointment.doctor_name}</Text>
      <Text>Course: {appointment.year_section.split(" ")[0]}</Text>
      <Text>Year & Section: {appointment.year_section.split(" ")[1]}</Text>
      <Text>Status: {appointment.status}</Text>
      <Text>Date: {appointment.date_time}</Text>
      <Text>Condition: {appointment.condition}</Text>

      {/* ADMIN: only delete */}
      {isAdmin && (
        <Button title="Delete" onPress={remove} />
      )}

      {/* DOCTOR actions */}
      {!isAdmin && isDoctor && (
        <>
          {appointment.status === "Pending" && (
            <>
              <Button title="Approve" onPress={approve} />
              <Button title="Reject" onPress={reject} />
            </>
          )}

          {appointment.status === "Approved" && (
            <Button title="Cancel" onPress={cancel} />
          )}

          {["Completed", "Cancelled", "Rejected"].includes(appointment.status) && (
            <Button title="Delete" onPress={remove} />
          )}
        </>
      )}

      {/* PATIENT ACTIONS */}
      {!isAdmin && !isDoctor && (
        <>
          {/* Pending */}
          {appointment.status === "Pending" && (
            <>
              <Button title="Edit" onPress={edit} />
              <Button title="Cancel" onPress={cancel} />
            </>
          )}

          {/* Approved */}
          {appointment.status === "Approved" && (
            <Text style={{ color: "blue", marginTop: 5 }}>
              Scheduled
            </Text>
          )}

          {/* Rejected / Completed / Cancelled */}
          {["Rejected", "Completed", "Cancelled"].includes(appointment.status) && (
            <Button title="Delete" onPress={remove} />
          )}
        </>
      )}
    </View>
  );
}