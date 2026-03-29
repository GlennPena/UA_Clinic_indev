import { StyleSheet } from "react-native";

export const AlertStyles = StyleSheet.create({
  // Error Variant
  errorContainer: {
    backgroundColor: "#FEE2E2", // Light red
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#991B1B", // Dark red
    fontSize: 14,
    fontWeight: "600",
  },
  
  // Success Variant
  successContainer: {
    backgroundColor: "#DCFCE7", // Light green
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    flexDirection: "row",
    alignItems: "center",
  },
  successText: {
    color: "#166534", // Dark green
    fontSize: 14,
    fontWeight: "600",
  },
});