import React from 'react';
import { View, Text } from 'react-native';
import { AlertStyles } from '../styles/alerts';

export const InlineAlert = ({ message, type = "error" }) => {
  if (!message) return null;

  // Global Logic: Extract string from Django error objects { username: ["error"] }
  const getMessageText = (msg) => {
    if (typeof msg === 'string') return msg;
    if (typeof msg === 'object' && msg !== null) {
      const firstKey = Object.keys(msg)[0];
      const firstError = msg[firstKey];
      return Array.isArray(firstError) ? firstError[0] : String(firstError);
    }
    return "An error occurred";
  };

  return (
    <View style={AlertStyles.errorContainer}>
      <Text style={AlertStyles.errorText}>⚠️ {getMessageText(message)}</Text>
    </View>
  );
};