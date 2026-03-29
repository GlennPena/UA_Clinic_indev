import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const AppInput = ({ setError, onChangeText, style, ...props }) => {
  return (
    <TextInput
      {...props}
      style={[styles.defaultInput, style]}
      onChangeText={(text) => {
        if (setError) setError(null); // Global auto-clear logic
        if (onChangeText) onChangeText(text);
      }}
      onFocus={() => setError && setError(null)} // Clear when clicked
    />
  );
};

const styles = StyleSheet.create({
  defaultInput: { 
    backgroundColor: "#FFF", 
    borderWidth: 1, 
    borderColor: "#E2E8F0", 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 12, 
    fontSize: 16 
  },
});