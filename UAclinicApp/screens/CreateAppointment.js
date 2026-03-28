import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API } from "../utils/api";
import { jwtDecode } from "jwt-decode";

export default function CreateAppointment({ route }) {
  const { token } = route.params; 
  const decoded = jwtDecode(token);

  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    setPatientName(`${decoded.first_name || ""} ${decoded.last_name || ""}`);
  }, []);

  const [condition, setCondition] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState(new Date());

  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("doctors/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(res.data);
    } catch (error) {
      console.log("Error fetching doctors:", error.response?.data);
    }
  };

  // Helper to format date for datetime-local input (local time, not UTC)
  const formatLocalDateTime = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  // Create appointment handler
  const create = async () => {
    try {
      if (!condition || !doctor || !course || !year || !section || !date) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      // Combine course, year, and section into the required format
      const year_section = `${course.toUpperCase()} ${year}${section.toUpperCase()}`;

      await API.post(
        "appointments/",
        {
          condition: condition,
          year_section: year_section,
          doctor: parseInt(doctor),
          date_time: date.toISOString(), 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Appointment Created!");
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert("Error", "Failed to create appointment");
    }
  };

  return (
    <View style={{ padding: 20 }}>

      {/* PATIENT NAME (READONLY) */}
      <Text>Patient</Text>
      <Text style={{ marginBottom: 10 }}>
        {patientName}
      </Text>
      
      {/* CONDITION */}
      <Text>Condition</Text>
      <TextInput
        placeholder="Enter condition"
        value={condition}
        onChangeText={setCondition}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* COURSE */}
      <Text>Course</Text>
      <TextInput
        placeholder="e.g. BSIT"
        value={course}
        onChangeText={setCourse}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* YEAR */}
      <Text>Year</Text>
      <TextInput
        placeholder="e.g. 3"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* SECTION */}
      <Text>Section</Text>
      <TextInput
        placeholder="e.g. A"
        value={section}
        onChangeText={setSection}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* DOCTOR */}
      <Text>Select Doctor</Text>
      <Picker
        selectedValue={doctor}
        onValueChange={(value) => setDoctor(value)}
        style={{ marginBottom: 10 }}
      >
        <Picker.Item label="-- Select Doctor --" value="" />
        {doctors.map((doc) => (
          <Picker.Item
            key={doc.id}
            label={doc.username || doc.name}
            value={doc.id}
          />
        ))}
      </Picker>

      {/* DATE */}
      <Text>Select Date & Time</Text>

      <input
        type="datetime-local"
        value={formatLocalDateTime(date)} // ✅ FIXED
        min={formatLocalDateTime(new Date())} // ✅ FIXED
        onChange={(e) => setDate(new Date(e.target.value))}
        style={{ padding: 10, marginVertical: 10 }}
      />

      {/* SUBMIT */}
      <Button title="Create Appointment" onPress={create} />
    </View>
  );
}