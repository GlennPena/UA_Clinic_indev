import { View, Button } from "react-native";

// Component to render filter buttons for appointment status
export default function Filters({ applyFilter }) {
  return (
    <View>
      <Button title="Pending" onPress={() => applyFilter("Pending")} />
      <Button title="Approved" onPress={() => applyFilter("Approved")} />
      <Button title="Rejected" onPress={() => applyFilter("Rejected")} />
    </View>
  );
}