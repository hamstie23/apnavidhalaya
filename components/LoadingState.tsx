import { View, StyleSheet, ActivityIndicator } from "react-native";
import { P } from "@/components/ui/typography";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <P style={styles.message}>{message}</P>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  message: {
    marginTop: 16,
    color: "#6B7280",
  },
});