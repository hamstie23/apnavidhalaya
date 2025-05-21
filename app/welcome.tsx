import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg" }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>AV</Text>
            </View>
            <H1 style={styles.title}>Apna Vidhayalaya</H1>
            <Muted style={styles.subtitle}>
              Empowering education through seamless communication and management
            </Muted>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              onPress={() => router.push("/sign-up")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </Button>
            <Button
              style={styles.secondaryButton}
              variant="secondary"
              onPress={() => router.push("/sign-in")}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "space-between",
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  title: {
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    maxWidth: "80%",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    height: 56,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    height: 56,
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});