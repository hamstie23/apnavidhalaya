import React from "react";
import { View, StyleSheet } from "react-native";
import { H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { router } from "expo-router";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined });
    router.replace("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Icon icon="ph:warning-circle" size={64} color="#EF4444" />
          <H2 style={styles.title}>Something went wrong</H2>
          <P style={styles.message}>
            {this.state.error?.message || "An unexpected error occurred"}
          </P>
          <View style={styles.actions}>
            <Button onPress={this.handleRetry} style={styles.retryButton}>
              <Icon icon="ph:arrow-counter-clockwise" size={20} color="#FFFFFF" />
              <P style={styles.buttonText}>Try Again</P>
            </Button>
            <Button onPress={this.handleGoHome} style={styles.homeButton}>
              <Icon icon="ph:house" size={20} color="#4F46E5" />
              <P style={styles.homeButtonText}>Go Home</P>
            </Button>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    color: "#111827",
  },
  message: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  retryButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  homeButtonText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
});