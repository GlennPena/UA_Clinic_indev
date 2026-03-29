import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { API, setAuthToken } from "../utils/api"; // 👈 ADD THIS

const EditAppointment = ({ route, navigation }) => {
  const { appointment, token } = route.params;

  // ✅ SET TOKEN WHEN SCREEN LOADS
  useEffect(() => {
    setAuthToken(token);
  }, []);

  const [course, setCourse] = useState(appointment.year_section?.split(" ")[0] || "");
  const [yearSection, setYearSection] = useState(appointment.year_section?.split(" ")[1] || "");
  const [dateTime, setDateTime] = useState(appointment.date_time);
  const [condition, setCondition] = useState(appointment.condition);

  const updateAppointment = async () => {
    try {
      await API.patch(`appointments/${appointment.id}/`, {
        year_section: `${course} ${yearSection}`, // ✅ FIXED FIELD
        date_time: dateTime,
        condition,
      });

      Alert.alert("Success", "Appointment updated!");
      navigation.goBack();
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data);
      Alert.alert("Error", "Update failed");
    }
  };

  return (
    <View>
      <TextInput value={course} onChangeText={setCourse} placeholder="Course" />
      <TextInput value={yearSection} onChangeText={setYearSection} placeholder="Year & Section" />
      <TextInput value={dateTime} onChangeText={setDateTime} placeholder="Date" />
      <TextInput value={condition} onChangeText={setCondition} placeholder="Condition" />

      <Button title="Save Changes" onPress={updateAppointment} />
    </View>
  );
};

export default EditAppointment;